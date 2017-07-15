"use strict";

import { NextFunction } from "express-serve-static-core";
import { Perfil, IPerfil } from "./perfil.schema";
import { IProvincia, Provincia } from "../provincias/provincias.schema";
import { IUserSession, IUserSessionRequest } from "../seguridad/security.service";
import { Usuario } from "../seguridad/usuario.schema";
import * as errorHandler from "../utils/error.handler";
import * as mongoose from "mongoose";
import * as escape from "escape-html";
import * as express from "express";
import * as _ from "lodash";

/**
 * Retorna los datos del perfil
 */
export interface IReadRequest extends IUserSessionRequest {
  perfil: IPerfil;
}
export function read(req: IReadRequest, res: express.Response) {
  if (!req.perfil) {
    return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se encuentra el perfil del usuario logueado.");
  }
  res.json(req.perfil);
}



/**
 * Actualiza los datos del perfil
 */
export interface IUpdateRequest extends IUserSessionRequest {
  perfil: IPerfil;
  provincia: mongoose.Schema.Types.ObjectId;
}
export function validateUpdate(req: IUpdateRequest, res: express.Response, next: NextFunction) {
  if (req.body.email) {
    req.check("email", "No es un email.").isEmail();
    req.sanitize("email").escape();
  }
  if (req.body.nombre) {
    req.check("nombre", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });
    req.sanitize("nombre").escape();
  }
  if (req.body.direccion) {
    req.check("direccion", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });
    req.sanitize("direccion").escape();
  }
  if (req.body.telefono) {
    req.check("telefono", "No es válido").isLength({ min: 1, max: 32 });
    req.sanitize("telefono").escape();
  }
  if (req.body.imagen) {
    req.check("imagen", "No parece ser una imagen.").isBase64();
    req.sanitize("imagen").escape();
  }

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function update(req: IUpdateRequest, res: express.Response) {
  let perfil: IPerfil = req.perfil;
  if (!perfil) {
    perfil = new Perfil();
    perfil.usuario = req.user._id;
  }

  if (req.body.email) {
    perfil.email = req.body.email;
  }
  if (req.body.nombre) {
    perfil.nombre = req.body.nombre;
  }
  if (req.body.direccion) {
    perfil.direccion = req.body.direccion;
  }
  if (req.body.telefono) {
    perfil.telefono = req.body.telefono;
  }
  if (req.body.imagen) {
    perfil.imagen = req.body.imagen;
  }
  if (req.provincia) {
    perfil.provincia = req.provincia;
  } else {
    perfil.provincia = undefined;
  }

  perfil.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    if (req.body.nombre) {
      Usuario.findOne({
        _id: req.user.id,
        enabled: true
      }, function (err, usuario) {
        if (err) return errorHandler.handleError(res, err);
        usuario.nombre = req.body.nombre;
        usuario.save(function (err: any) {
          return res.json(perfil);
        });
      });
    } else {
      return res.json(perfil);
    }
  });
}

/**
 * Filtro, busca el perfil del usuario logueado
 */
export interface IFindByCurrentUserRequest extends IUserSessionRequest {
  perfil: IPerfil;
}
export function fillForCurrentUser(req: IFindByCurrentUserRequest, res: express.Response, next: NextFunction) {
  Perfil.findOne({
    usuario: req.user._id,
    enabled: true
  }, function (err, perfil) {
    if (err || !perfil) return next();

    req.perfil = perfil;
    next();
  });
}

/**
 * Filtro, busca una provincia que viene en el parametro del body al guardar el perfil.
 * La provincia es agregada al request.
 */
export interface IFindProvincia extends express.Request {
  provincia: IProvincia;
}
export function fillProvinciaIfPresent(req: IFindProvincia, res: express.Response, next: NextFunction) {
  // Si no viene ninguna provincia definida, no hacemos nada
  if (!req.body.provincia) {
    return next();
  }

  Provincia.findOne({
    _id: escape(req.body.provincia),
    enabled: true
  }, function (err, provincia) {
    if (err) return errorHandler.handleError(res, err);

    if (!provincia) {
      return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se encuentra la provincia " + req.body.provincia);
    }

    req.provincia = provincia;
    next();
  });
}