"use strict";

import { NextFunction } from "express-serve-static-core";
import { Mascota, IMascota } from "./mascota.schema";
import { IUserSession, IUserSessionRequest } from "../seguridad/security.service";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";
import * as escape from "escape-html";

/**
 * Retorna los datos de la mascota
 */
export interface IReadRequest extends IUserSessionRequest {
  mascota: IMascota;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.mascota);
}



/**
 * Actualiza los datos de la mascota
 */
export interface IUpdateRequest extends IUserSessionRequest {
  mascota: IMascota;
}
export function validateUpdate(req: IUpdateRequest, res: express.Response, next: NextFunction) {
  if (req.body.nombre) {
    req.check("nombre", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
    req.sanitize("nombre").escape();
  }
  if (req.body.descripcion) {
    req.check("descripcion", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });
    req.sanitize("descripcion").escape();
  }
  if (req.body.fechaNacimiento) {
    req.check("fechaNacimiento", "No es v&aacute;lido").isLength({ min: 1 });
    req.sanitize("fechaNacimiento").escape();
  }

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function update(req: IUpdateRequest, res: express.Response) {
  let mascota = <IMascota>req.mascota;
  if (!mascota) {
    mascota = new Mascota();
    mascota.usuario = req.user._id;
  }

  if (req.body.nombre) {
    mascota.nombre = req.body.nombre;
  }
  if (req.body.descripcion) {
    mascota.descripcion = req.body.descripcion;
  }
  if (req.body.fechaNacimiento) {
    mascota.fechaNacimiento = req.body.fechaNacimiento;
  }

  mascota.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(mascota);
  });
}


/**
 * Elimina una mascota
 */
export interface IRemoveRequest extends IUserSessionRequest {
  mascota: IMascota;
}
export function remove(req: IRemoveRequest, res: express.Response) {
  const mascota = <IMascota>req.mascota;

  mascota.enabled = false;
  mascota.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(mascota);
  });
}

export function findByCurrentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  Mascota.find({
    usuario: req.user._id,
    enabled: true
  }).exec(function (err, mascotas) {
    if (err) return next();
    res.json(mascotas);
  });
}

/**
 * Filtro para buscar y popular una mascota por id.
 * El resultado de la busqueda se popula en req.
 */
export interface IFindByIdRequest extends express.Request {
  mascota: IMascota;
}
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction, id: string) {
  Mascota.findOne({
    _id: escape(id),
    enabled: true
  },
    function (err, mascota) {
      if (err) return errorHandler.handleError(res, err);

      if (!mascota) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo cargar la mascota " + id);
      }

      req.mascota = mascota;
      next();
    });
}

/**
 * Autorizacion, el unico que puede modificar el mascota es el dueño
 */
export interface IValidateOwnerRequest extends IUserSessionRequest {
  mascota: IMascota;
}
export function validateOwner(req: IValidateOwnerRequest, res: express.Response, next: NextFunction) {
  if (!((req.mascota.usuario as any).equals(req.user._id))) {
    return errorHandler.sendError(res, errorHandler.ERROR_UNAUTORIZED_METHOD, "User is not authorized");
  }
  next();
}
