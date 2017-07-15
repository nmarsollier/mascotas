"use strict";

import { NextFunction } from "express-serve-static-core";
import { Provincia, IProvincia } from "./provincia.schema";
import { IUserSession, IUserSessionRequest } from "../seguridad/security.service";

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
  Provincia.find({ enabled: true }).exec(function (err, provincia: IProvincia) {
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
  },
    function (err, provincia: IProvincia) {
      if (err) return errorHandler.handleError(res, err);

      if (!provincia) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo encontrar la provincia " + id);
      }

      req.provincia = provincia;
      next();
    });
}

/**
 * Crea o actualiza una provincia
 */
export interface IUpdateRequest extends IUserSessionRequest {
  mascota: IProvincia;
}
export function validateUpdate(req: IUpdateRequest, res: express.Response, next: NextFunction) {
  if (req.body.nombre) {
    req.check("nombre", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
    req.sanitize("nombre").escape();
  }

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function update(req: IUpdateRequest, res: express.Response) {
  let provincia = <IProvincia>req.mascota;
  if (!provincia) {
    provincia = new Provincia();
  }

  if (req.body.nombre) {
    provincia.nombre = req.body.nombre;
  }

  provincia.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(provincia);
  });
}


/**
 * Elimina una mascota
 */
export interface IRemoveRequest extends IUserSessionRequest {
  provincia: IProvincia;
}
export function remove(req: IRemoveRequest, res: express.Response) {
  const provincia = <IProvincia>req.provincia;

  provincia.enabled = false;
  provincia.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json(provincia);
  });
}