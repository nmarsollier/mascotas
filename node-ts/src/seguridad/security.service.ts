"use strict";

import { Usuario, IUsuario } from "./usuario.schema";
import { Token, IToken } from "./token.schema";
import { NextFunction } from "express-serve-static-core";
import * as _ from "lodash";
import * as mongoose from "mongoose";
import * as express from "express";
import * as errorHandler from "../utils/error.handler";
import * as passport from "./passport";

import * as appConfig from "../config/environment";
const conf = appConfig.getConfig(process.env);

export interface IUserSession {
  id: string;
  _id: mongoose.Schema.Types.ObjectId;
  token_id: string;
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
    if (err) return errorHandler.handleError(res, err);

    createToken(res, user);
  });
}

/**
 * Signin
 */
export function signin(req: express.Request, res: express.Response, next: NextFunction) {
  Usuario.findOne({ login: req.body.login },
    function (err: any, user: IUsuario) {
      if (err) return errorHandler.handleError(res, err);

      if (!user) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "Usuario no encontrado.");
      }

      if (!user.authenticate(req.body.password)) {
        return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "Password incorrecto.");
      }

      createToken(res, user);
    }
  );
}

/**
 * Crea un token de sesion, lo guarda en la base de Tokens, luego inicializa passport
 * con el token, para que se ingrese en el cache y se encripte correctamente
 */
function createToken(res: express.Response, user: IUsuario) {
  const sessionToken = new Token();
  sessionToken.usuario = user._id;
  sessionToken.valid = true;

  sessionToken.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json({ token: passport.createToken(user, sessionToken) });
  });
}

/**
 * Signout, limpia la sesion, e invalida el token.
 */
export function signout(req: IUserSessionRequest, res: express.Response) {
  Token.findById(req.user.token_id, function (err: any, token: IToken) {
    if (err) return errorHandler.handleError(res, err);

    if (!token) {
      return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "Token invalido.");
    }

    token.valid = false;
    token.save(function (err: any) {
      if (err) return errorHandler.handleError(res, err);

      passport.invalidateSessionToken(req.user);
      return res.json({
        result: "Logged out"
      });
    });
  });
}

/**
 * Get current user
 */
export function currentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  Usuario.findById(req.user.id, function (err: any, user: IUsuario) {
    if (err) return errorHandler.handleError(res, err);

    if (!user) {
      return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "El usuario no se encuentra");
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
    return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "El usuario no se encuentra.");
  }

  if (!passwordDetails.newPassword) {
    return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "Debe proporcionar la contraseña nueva.");
  }

  Usuario.findById(req.user.id, function (err: any, user: IUsuario) {
    if (err) return errorHandler.handleError(res, err);

    if (!user) {
      return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "El usuario no se encuentra.");
    }

    if (!user.authenticate(passwordDetails.currentPassword)) {
      return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "El password actual es incorrecto.");
    }

    if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
      return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "Las contraseñas no coinciden.");
    }

    user.password = passwordDetails.newPassword;

    user.save(function (err: any) {
      if (err) return errorHandler.handleError(res, err);

      return res.send({
        message: "Contraseña cambiada"
      });
    });
  });
}
