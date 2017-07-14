"use strict";

import { NextFunction } from "express-serve-static-core";
import { Perfil, IPerfil } from "./perfil.schema";
import { Provincia, IProvincia } from "../provincias/provincias.schema";
import { IUserSession, IUserSessionRequest } from "../seguridad/security.service";
import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as _ from "lodash";
import * as express from "express";


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
export function update(req: IUpdateRequest, res: express.Response) {
  let perfil: IPerfil = req.perfil;
  if (!perfil) {
    perfil = new Perfil();
    perfil.usuario = req.user._id;
  }

  if (!_.isEmpty(req.body.email)) {
    perfil.email = req.body.email;
  }
  if (!_.isEmpty(req.body.nombre)) {
    perfil.nombre = req.body.nombre;
  }
  if (!_.isUndefined(req.body.direccion)) {
    perfil.direccion = req.body.direccion;
  }
  if (!_.isUndefined(req.body.telefono)) {
    perfil.telefono = req.body.telefono;
  }
  if (!_.isUndefined(req.body.imagen)) {
    perfil.imagen = req.body.imagen;
  }
  if (!_.isUndefined(req.provincia)) {
    perfil.provincia = req.provincia;
  } else {
    perfil.provincia = undefined;
  }

  perfil.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    return res.json(perfil);
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
    usuario: req.user._id
  }).exec(function (err, perfil) {
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

  Provincia.findById(req.body.provincia).exec(function (err, provincia) {
    if (err) return errorHandler.handleError(res, err);

    if (!provincia) {
      return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se encuentra la provincia " + req.body.provincia);
    }

    req.provincia = provincia;
    next();
  });
}