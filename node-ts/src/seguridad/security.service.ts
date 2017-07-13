"use strict";

import { Usuario, IUsuario } from "./usuario.schema";
import { NextFunction } from "express-serve-static-core";
import * as _ from "lodash";
import * as mongoose from "mongoose";
import * as express from "express";
import * as passport from "passport";
import * as errorHandler from "../utils/error.handler";

export interface IFindByIdRequest extends express.Request {
  profile: IUsuario;
}

/**
 * Filtro busca un usario y lo agrega al request
 */
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction, id: string) {
  Usuario.findOne({
    _id: id
  }).exec(function (err: any, user: IUsuario) {
    if (err) return next(err);
    if (!user) return next(new Error("No se encontro el usuario " + id));
    req.profile = user;
    next();
  });
}

/**
 * Verifica que exista un usuario lgueado
 */
export function requiresLogin(req: express.Request, res: express.Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(errorHandler.ERROR_UNATORIZED).send({
      message: "Usuario no logueado"
    });
  }

  next();
}

/**
 * Verifica que se tiene autorizacion para acceder, segun el rol
 */
export function hasAuthorization(roles: string[]) {
  return function (req: express.Request, res: express.Response, next: NextFunction) {
    requiresLogin(req, res, function () {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.status(errorHandler.ERROR_UNAUTORIZED_METHOD).send({
          message: "Usuario no autorizado"
        });
      }
    });
  };
}


/**
 * Signup
 */
export function signup(req: express.Request, res: express.Response) {
  const user = <IUsuario>new Usuario();
  console.log(req.body);
  user.nombre = req.body.nombre;
  user.login = req.body.login;
  user.password = req.body.password;
  user.rol = "user";

  // Then save the user
  user.save(function (err: any) {
    if (err) {
      return errorHandler.handleError(res, err);
    }

    // Esta informacion queda en la sesion, hay que limpiarlo
    user.password = undefined;
    user.salt = undefined;
    user.resetPasswordToken = undefined;

    req.login(user, function (err: any) {
      if (err) {
        return res.status(errorHandler.ERROR_INTERNAL_ERROR).send("Login error : " + err);
      }

      res.json(user);
    });
  });
}

/**
 * Signin
 */
export function signin(req: express.Request, res: express.Response, next: NextFunction) {
  passport.authenticate("local", function (err: any, user: IUsuario, info: any) {
    if (err || !user) {
      return res.status(errorHandler.ERROR_BAD_REQUEST).send(info);
    }

    // Esta informacion queda en la sesion, hay que limpiarlo
    user.password = undefined;
    user.salt = undefined;
    user.resetPasswordToken = undefined;

    req.login(user, function (err: any) {
      if (err) {
        return res.status(errorHandler.ERROR_BAD_REQUEST).send(err);
      } else {
        return res.json(user);
      }
    });
  })(req, res, next);
}

/**
 * Signout
 */
export function signout(req: express.Request, res: express.Response) {
  req.logout();
  res.redirect("/");
}

/**
 * Get current user
 */
export function currentUser(req: express.Request, res: express.Response, next: NextFunction) {
  if (!req.user) {
    return res.status(errorHandler.ERROR_BAD_REQUEST).send("Usuario no logueado");
  }
  return res.json(req.user);
}


/**
 * Cambiar contraseña
 */
export function cambiarPassword(req: express.Request, res: express.Response) {
  const passwordDetails = req.body;

  if (!req.user) {
    res.status(errorHandler.ERROR_BAD_REQUEST).send({
      message: "El usuario no esta logueado"
    });
    return;
  }
  if (!passwordDetails.newPassword) {
    res.status(errorHandler.ERROR_BAD_REQUEST).send({
      message: "Debe proporcionar la contraseña"
    });
    return;
  }

  Usuario.findById(req.user.id, function (err: any, user: IUsuario) {
    if (err || !user) {
      return res.status(errorHandler.ERROR_NOT_FOUND).send({
        message: "El usuario no se encuentra"
      });
    }

    if (!user.authenticate(passwordDetails.currentPassword)) {
      return res.status(errorHandler.ERROR_BAD_REQUEST).send({
        message: "El password actual es incorrecto"
      });
    }

    if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
      return res.status(errorHandler.ERROR_BAD_REQUEST).send({
        message: "Las contraseñas no coinciden"
      });
    }

    user.password = passwordDetails.newPassword;

    user.save(function (err: any) {
      if (err) {
        return errorHandler.handleError(res, err);
      }

      req.login(user, function (err: any) {
        if (err) {
          return res.status(errorHandler.ERROR_INTERNAL_ERROR).send(err);
        }
        return res.send({
          message: "Contraseña cambiada"
        });
      });
    });
  });
}
