"use strict";

import { Usuario, IUsuario } from "./usuario.schema";
import { NextFunction } from "express-serve-static-core";
import * as _ from "lodash";
import * as mongoose from "mongoose";
import * as express from "express";
import * as errorHandler from "../utils/error.handler";
import * as jwt from "jsonwebtoken";

import * as appConfig from "../config/environment";
const conf = appConfig.getConfig(process.env);

export interface IUserSession {
  id: string;
  _id: mongoose.Schema.Types.ObjectId;
}

export interface IUserSessionRequest extends express.Request {
  user: IUserSession;
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

    const payload: IUserSession = { id: user.id, _id: user._id };
    const token = jwt.sign(payload, conf.jwtSecret);
    res.json({ token: token });
  });
}

/**
 * Signin
 */
export function signin(req: express.Request, res: express.Response, next: NextFunction) {
  Usuario.findOne({ login: req.body.login },
    function (err: any, user: IUsuario) {
      if (err || !user) {
        return res.status(errorHandler.ERROR_BAD_REQUEST).send("Invalid username.");
      }

      if (!user.authenticate(req.body.password)) {
        return res.status(errorHandler.ERROR_BAD_REQUEST).send("Invalid password.");
      }

      const payload: IUserSession = { id: user.id, _id: user._id };
      const token = jwt.sign(payload, conf.jwtSecret);
      res.json({ token: token });
    }
  );
}

/**
 * Signout
 */
export function signout(req: IUserSessionRequest, res: express.Response) {
  res.redirect("/");
}

/**
 * Get current user
 */
export function currentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  Usuario.findById(req.user.id, function (err: any, user: IUsuario) {
    if (err || !user) {
      return res.status(errorHandler.ERROR_NOT_FOUND).send({
        message: "El usuario no se encuentra"
      });
    }
    return res.json({
      id: user.id,
      nombre: user.nombre,
      login: user.login,
      rol: user.rol
    });
  });
}


/**
 * Cambiar contraseña
 */
export function cambiarPassword(req: IUserSessionRequest, res: express.Response) {
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
