"use strict";

import * as _ from "lodash";
import * as mongoose from "mongoose";
import { Usuario } from "./usuario.schema";

/**
 * Filtro busca un usario y lo agrega al request
 */
export function findByID(req: any, res: any, next: Function, id: string) {
  Usuario.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("No se encontro el usuario " + id));
    req.profile = user;
    next();
  });
}

/**
 * Verifica que exista un usuario lgueado
 */
export function requiresLogin(req: any, res: any, next: Function) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: "Usuario no logueado"
    });
  }

  next();
}

/**
 * Verifica que se tiene autorizacion para acceder, segun el rol
 */
export function hasAuthorization(roles: string[]) {
  const _this = this;

  return function(req: any, res: any, next: Function) {
    _this.requiresLogin(req, res, function() {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.status(403).send({
          message: "Usuario no autorizado"
        });
      }
    });
  };
}
