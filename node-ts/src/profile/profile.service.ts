"use strict";

import { NextFunction } from "express-serve-static-core";
import { Profile, IProfile } from "./profile.schema";
import { IProvince, Province } from "../provinces/province.schema";
import { IUserSession, IUserSessionRequest } from "../security/security.service";
import { User } from "../security/user.schema";
import * as errorHandler from "../utils/error.handler";
import * as mongoose from "mongoose";
import * as escape from "escape-html";
import * as express from "express";

/**
 * Retorna los datos del perfil
 */
export interface IReadRequest extends IUserSessionRequest {
  profile: IProfile;
}
export function read(req: IReadRequest, res: express.Response) {
  if (!req.profile) {
    return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se encuentra el perfil del usuario logueado.");
  }
  res.json(req.profile);
}



/**
 * Actualiza los datos del perfil
 */
export interface IUpdateRequest extends IUserSessionRequest {
  profile: IProfile;
  province: mongoose.Schema.Types.ObjectId;
}
export function validateUpdate(req: IUpdateRequest, res: express.Response, next: NextFunction) {
  if (req.body.email) {
    req.check("email", "No es un email.").isEmail();
    req.sanitize("email").escape();
  }
  if (req.body.name) {
    req.check("name", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });
    req.sanitize("name").escape();
  }
  if (req.body.address) {
    req.check("address", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });
    req.sanitize("address").escape();
  }
  if (req.body.phone) {
    req.check("phone", "No es válido").isLength({ min: 1, max: 32 });
    req.sanitize("phone").escape();
  }
  if (req.body.picture) {
    req.check("picture", "No parece ser una imagen.").isBase64();
    req.sanitize("picture").escape();
  }

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function update(req: IUpdateRequest, res: express.Response) {
  let profile: IProfile = req.profile;
  if (!profile) {
    profile = new Profile();
    profile.user = req.user._id;
  }

  if (req.body.email) {
    profile.email = req.body.email;
  }
  if (req.body.name) {
    profile.name = req.body.name;
  }
  if (req.body.address) {
    profile.address = req.body.address;
  }
  if (req.body.phone) {
    profile.phone = req.body.phone;
  }
  if (req.body.picture) {
    profile.picture = req.body.picture;
  }
  if (req.province) {
    profile.province = req.province;
  } else {
    profile.province = undefined;
  }

  profile.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    if (req.body.name) {
      User.findOne({
        _id: req.user.id,
        enabled: true
      },
        function (err, usuario) {
          if (err) return errorHandler.handleError(res, err);
          usuario.name = req.body.name;
          usuario.save(function (err: any) {
            return res.json(profile);
          });
        });
    } else {
      return res.json(profile);
    }
  });
}

/**
 * Filtro, busca el perfil del usuario logueado
 */
export interface IFindByCurrentUserRequest extends IUserSessionRequest {
  profile: IProfile;
}
export function fillForCurrentUser(req: IFindByCurrentUserRequest, res: express.Response, next: NextFunction) {
  Profile.findOne({
    user: req.user._id,
    enabled: true
  },
    function (err, profile) {
      if (err || !profile) return next();

      req.profile = profile;
      next();
    });
}

/**
 * Filtro, busca una provincia que viene en el parametro del body al guardar el perfil.
 * La provincia es agregada al request.
 */
export interface IFindProvince extends express.Request {
  province: IProvince;
}
export function fillProvinceIfPresent(req: IFindProvince, res: express.Response, next: NextFunction) {
  // Si no viene ninguna provincia definida, no hacemos nada
  if (!req.body.province) {
    return next();
  }

  Province.findOne({
    _id: escape(req.body.province),
    enabled: true
  },
    function (err, province) {
      if (err) return errorHandler.handleError(res, err);

      if (!province) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "No se encuentra la provincia " + req.body.province);
      }

      req.province = province;
      next();
    });
}