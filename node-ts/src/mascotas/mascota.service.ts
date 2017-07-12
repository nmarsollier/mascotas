"use strict";

import { NextFunction } from "express-serve-static-core";
import { Mascota, IMascota } from "./mascota.schema";
import * as mongoose from "mongoose";
import * as ErrorHandler from "../utils/error.handler";
import * as _ from "lodash";
import * as express from "express";


/**
 * Retorna los datos de la mascota
 */
export interface IReadRequest extends express.Request {
  mascota: IMascota;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.mascota);
}



/**
 * Actualiza los datos de la mascota
 */
export interface IUpdateRequest extends express.Request {
  mascota: IMascota;
}
export function update(req: IUpdateRequest, res: express.Response) {
  let mascota = <IMascota>req.mascota;
  if (!mascota) {
    mascota = new Mascota();
    mascota.usuario = req.user;
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
      return res.status(400).send({
        message: ErrorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mascota);
    }
  });
}


/**
 * Elimina una mascota
 */
export interface IRemoveRequest extends express.Request {
  mascota: IMascota;
}
export function remove(req: IRemoveRequest, res: express.Response) {
  const mascota = <IMascota>req.mascota;
  mascota.remove(function (err: any) {
    if (err) {
      return res.status(400).send({
        message: ErrorHandler.getErrorMessage(err)
      });
    } else {
      res.json(mascota);
    }
  });
}

/**
 * Filtro, busca las mascotas del usuario logueado
 */
export interface IFindByCurrentUserRequest extends express.Request {
  user: mongoose.Schema.Types.ObjectId;
}
export function findByCurrentUser(req: IFindByCurrentUserRequest, res: express.Response, next: NextFunction) {
  Mascota.find({
    usuario: req.user
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
export interface IValidateOwnerRequest extends express.Request {
  mascota: IMascota;
}
export function validateOwner(req: IValidateOwnerRequest, res: express.Response, next: NextFunction) {
  if (!req.user._id.equals(req.mascota.usuario)) {
    return res.status(403).send({
      message: "User is not authorized"
    });
  }
  next();
}
