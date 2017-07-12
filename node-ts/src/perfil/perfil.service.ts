"use strict";

import { Perfil, IPerfil } from "./perfil.schema";
import { Provincia } from "../provincias/provincias.schema";
import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as _ from "lodash";

/**
 * Retorna los datos del perfil
 */
export function read(req: any, res: any) {
  if (!req.perfil) {
    res.status(500).json({
      message: "No se encuentra el perfil del usuario logueado"
    });
  }
  res.json(req.perfil);
}

/**
 * Actualiza los datos del perfil
 */
export function update(req: any, res: any) {
  let perfil = <IPerfil> req.perfil;
  if (!perfil) {
    perfil = new Perfil();
    perfil.usuario = req.user;
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

  perfil.save(function(err: any) {
    if (err) {
      return res.status(400).json({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(perfil);
    }
  });
}

/**
 * Filtro, busca una provincia que viene en el parametro del body.
 * La provincia es agregada al request.
 */
export function findProvincia(req: any, res: any, next: Function) {
  // Si no viene ninguna provincia definida, no hacemos nada
  if (_.isUndefined(req.body.provincia)) {
    return next();
  }
  console.log(req.body);
  Provincia.findById(req.body.provincia).exec(function(err, provincia) {
    if (err) return next(err);
    if (!provincia) {
      return next(
        new Error("No se encuentra la provincia " + req.body.provincia)
      );
    }
    req.provincia = provincia;
    next();
  });
}

/**
 * Filtro, busca el perfil del usuario logueado
 */
export function findByCurrentUser(req: any, res: any, next: Function) {
  Perfil.findOne({
    usuario: req.user
  }).exec(function(err, perfil) {
    if (err || !perfil) return next();
    req.perfil = perfil;
    next();
  });
}
