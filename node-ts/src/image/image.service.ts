"use strict";

import { NextFunction } from "express-serve-static-core";
import { Image, IImage } from "./image.schema";
import { IUserSession, IUserSessionRequest } from "../security/security.service";

import * as mongoose from "mongoose";
import * as errorHandler from "../utils/error.handler";
import * as express from "express";
import * as escape from "escape-html";

/**
 * Busca una imagen
 */
export interface IReadRequest extends express.Request {
  image: IImage;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.image);
}

/**
 * Crea una imagen
 */
export function validateCreate(req: express.Request, res: express.Response, next: NextFunction) {
  if (req.body.image) {
    req.check("image", "Debe especificar la imagen.").isLength({ min: 1 });
    req.check("image", "Imagen invalida").contains("data:image/jpeg;base64");
  }

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function create(req: express.Request, res: express.Response) {
  const image = new Image();

  if (req.body.image) {
    image.image = req.body.image;
  }

  image.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json({ id: image.id });
  });
}

export interface IFindByIdRequest extends express.Request {
  image: IImage;
}
export function findByID(req: IFindByIdRequest, res: express.Response, next: NextFunction, id: string) {
  Image.findOne({
    _id: escape(id),
  },
    function (err, image) {
      if (err) return errorHandler.handleError(res, err);

      if (!image) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se pudo cargar la imagen " + id);
      }

      req.image = image;
      next();
    });
}
