"use strict";

import { NextFunction } from "express-serve-static-core";
import { Mascota, IMascota } from "./mascota.schema";
import { IUserSession, IUserSessionRequest } from "../seguridad/security.service";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as _ from "lodash";
import * as express from "express";


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
export function update(req: IUpdateRequest, res: express.Response) {
  let mascota = <IMascota>req.mascota;
  if (!mascota) {
    mascota = new Mascota();
    mascota.usuario = req.user._id;
  }

  if (!_.isEmpty(req.body.nombre)) {
    mascota.nombre = req.body.nombre;
  }
  if (!_.isEmpty(req.body.descripcion)) {
    mascota.descripcion = req.body.descripcion;
  }
  if (!_.isEmpty(req.body.fechaNacimiento)) {
    mascota.fechaNacimiento = req.body.fechaNacimiento;
  }

  mascota.save(function (err: any) {
    if (err) {
      return errorHandler.handleError(res, err);
    }
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
  mascota.remove(function (err: any) {
    if (err) {
      return errorHandler.handleError(res, err);
    }
    res.json(mascota);
  });
}

export function findByCurrentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  Mascota.find({
    usuario: req.user._id
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
  Mascota.findById(id).exec(function (err, mascota) {
    if (err) return next(err);
    if (!mascota) return next(new Error("No se pudo cargar la mascota " + id));
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
    return res.status(errorHandler.ERROR_UNAUTORIZED_METHOD).send({
      message: "User is not authorized"
    });
  }
  next();
}
