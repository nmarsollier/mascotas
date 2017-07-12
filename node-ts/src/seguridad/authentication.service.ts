"use strict";

import * as _ from "lodash";
import * as ErrorHandler from "../utils/error.handler";
import * as mongoose from "mongoose";
import * as passport from "passport";
import { Usuario, IUsuario } from "./usuario.schema";
import { NextFunction } from "express-serve-static-core";

/**
 * Signup
 */
export function signup(req: any, res: any) {
  const user = <IUsuario>new Usuario();
  console.log(req.body);
  user.nombre = req.body.nombre;
  user.login = req.body.login;
  user.password = req.body.password;
  user.rol = "user";

  // Then save the user
  user.save(function(err: any) {
    if (err) {
      return res.status(400).send({
        message: ErrorHandler.getErrorMessage(err)
      });
    }

    // Esta informacion queda en la sesion, hay que limpiarlo
    user.password = undefined;
    user.salt = undefined;
    user.resetPasswordToken = undefined;

    req.login(user, function(err: any) {
      if (err) {
        res.status(400).send("Login error : " + err);
      } else {
        res.json(user);
      }
    });
  });
}

/**
 * Signin
 */
export function signin(req: any, res: any, next: NextFunction) {
  passport.authenticate("local", function(err: any, user: IUsuario, info: any) {
    if (err || !user) {
      return res.status(400).send(info);
    }

    // Esta informacion queda en la sesion, hay que limpiarlo
    user.password = undefined;
    user.salt = undefined;
    user.resetPasswordToken = undefined;

    req.login(user, function(err: any) {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.json(user);
      }
    });
  })(req, res, next);
}

/**
 * Signout
 */
export function signout(req: any, res: any) {
  req.logout();
  res.redirect("/");
}

/**
 * Get current user
 */
export function currentUser(req: any, res: any, next: NextFunction) {
  if (!req.user) {
    return res.status(500).send("Usuario no logueado");
  } else {
    return res.json(req.user);
  }
}
