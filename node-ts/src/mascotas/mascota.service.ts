"use strict";

import { Mascota, IMascota } from "./mascota.schema";
import * as mongoose from "mongoose";
import * as ErrorHandler from "../utils/error.handler";
import * as _ from "lodash";

/**
 * Retorna los datos de la mascota
 */
export function read(req: any, res: any) {
  res.json(req.mascota);
}

/**
 * Actualiza los datos de la mascota
 */
export function update(req: any, res: any) {
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

  mascota.save(function(err: any) {
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
export function remove(req: any, res: any) {
  const mascota = <IMascota>req.mascota;
  mascota.remove(function(err: any) {
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
export function findByCurrentUser(req: any, res: any, next: Function) {
  Mascota.find({
    usuario: req.user
  }).exec(function(err, mascotas) {
    if (err) return next();
    res.json(mascotas);
  });
}

/**
 * Filtro para buscar y popular una mascota por id.
 * El resultado de la busqueda se popula en req.
 */
export function findByID(req: any, res: any, next: Function, id: string) {
  Mascota.findById(id).exec(function(err, mascota) {
    if (err) return next(err);
    if (!mascota) return next(new Error("No se pudo cargar la mascota " + id));
    req.mascota = mascota;
    next();
  });
}

/**
 * Autorizacion, el unico que puede modificar el mascota es el dueño
 */
export function validateOwner(req: any, res: any, next: Function) {
  if (!req.user._id.equals(req.mascota.usuario)) {
    return res.status(403).send({
      message: "User is not authorized"
    });
  }
  next();
}
