"use strict";

import { NextFunction } from "express-serve-static-core";
import { Provincia, IProvincia } from "./provincias.schema";
import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";

export interface IReadRequest extends express.Request {
  provincia: IProvincia;
}

/**
 * Busca una provincia
 */
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.provincia);
}

/**
 * Lista todas las Provincias
 */
export function list(req: express.Request, res: express.Response) {
  Provincia.find().sort("-created").exec(function (err, provincia) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(provincia);
    }
  });
}

export interface IFindByIdRequest extends express.Request {
  provincia: IProvincia;
}

/**
 * Filtro para buscar y popular una provincia por id.
 * El resultado de la busqueda se popula en req.
 */
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction, id: string) {
  Provincia.findById(id).exec(function (err, provincia) {
    if (err) return next(err);
    if (!provincia)
      return next(new Error("No se pudo cargar la provincia " + id));
    req.provincia = provincia;
    next();
  });
}