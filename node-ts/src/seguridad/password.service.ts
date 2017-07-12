"use strict";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import { Usuario, IUsuario } from "./usuario.schema";

/**
 * Cambiar contraseña
 */
export function cambiarPassword(req: any, res: any) {
  const passwordDetails = req.body;

  if (!req.user) {
    res.status(400).send({
      message: "El usuario no esta logueado"
    });
    return;
  }
  if (!passwordDetails.newPassword) {
    res.status(400).send({
      message: "Debe proporcionar la contraseña"
    });
    return;
  }

  Usuario.findById(req.user.id, function(err: any, user: IUsuario) {
    if (err || !user) {
      return res.status(400).send({
        message: "El usuario no se encuentra"
      });
    }

    if (!user.authenticate(passwordDetails.currentPassword)) {
      return res.status(400).send({
        message: "El password actual es incorrecto"
      });
    }

    if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
      return res.status(400).send({
        message: "Las contraseñas no coinciden"
      });
    }

    user.password = passwordDetails.newPassword;

    user.save(function(err: any) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function(err: any) {
          if (err) {
            return res.status(400).send(err);
          } else {
            return res.send({
              message: "Contraseña cambiada"
            });
          }
        });
      }
    });
  });
}
