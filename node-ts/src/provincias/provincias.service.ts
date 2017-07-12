"use strict";

import { Provincia } from "./provincias.schema";
import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";

/**
 * Busca una provincia
 */
export function read(req: any, res: any) {
  res.json(req.provincia);
}

/**
 * Lista todas las Provincias
 */
export function list(req: any, res: any) {
  Provincia.find().sort("-created").exec(function(err, provincia) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(provincia);
    }
  });
}

/**
 * Filtro para buscar y popular una provincia por id.
 * El resultado de la busqueda se popula en req.
 */
export function findByID(req: any, res: any, next: Function, id: string) {
  Provincia.findById(id).exec(function(err, provincia) {
    if (err) return next(err);
    if (!provincia)
      return next(new Error("No se pudo cargar la provincia " + id));
    req.provincia = provincia;
    next();
  });
}
