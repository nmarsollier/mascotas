"use strict";

import { NextFunction } from "express-serve-static-core";
import { Provincia, IProvincia } from "./provincias.schema";
import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";
import * as escape from "escape-html";

/**
 * Busca una provincia
 */
export interface IReadRequest extends express.Request {
  provincia: IProvincia;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.provincia);
}

/**
 * Lista todas las Provincias
 */
export function list(req: express.Request, res: express.Response) {
  Provincia.find({ enabled: true }).sort("-created").exec(function (err, provincia: IProvincia) {
    if (err) return errorHandler.handleError(res, err);

    return res.json(provincia);
  });
}


/**
 * Filtro para buscar y popular una provincia por id.
 * El resultado de la busqueda se popula en req.
 */
export interface IFindByIdRequest extends express.Request {
  provincia: IProvincia;
}
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction, id: string) {
  Provincia.findOne({
    _id: escape(id),
    enabled: true
  }, function (err, provincia: IProvincia) {
    if (err) return errorHandler.handleError(res, err);

    if (!provincia) {
      return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo encontrar la provincia " + id);
    }

    req.provincia = provincia;
    next();
  });
}

