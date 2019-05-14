"use strict";

import * as express from "express";
import * as passport from "passport";
import * as error from "../server/error";
import { ISessionRequest } from "../user/service";
import * as service from "./service";

/**
 * Modulo de perfiles de usuario
 */
export function initModule(app: express.Express) {
  app
    .route("/v1/profile")
    .get(passport.authenticate("jwt", { session: false }), current)
    .post(passport.authenticate("jwt", { session: false }), updateBasicInfo);

}

/**
 * @apiDefine IProfileResponse
 *
 * @apiSuccessExample {json} Perfil
 *    {
 *      "name": "Nombre y Apellido",
 *      "phone": "Teléfono",
 *      "email": "Email",
 *      "address": "Dirección",
 *      "picture": "Id de imagen",
 *      "province": "Id de provincia",
 *    }
 */

/**
 * @api {get} /v1/profile Obtener Perfil
 * @apiName Obtener Perfil
 * @apiGroup Perfil
 *
 * @apiUse IProfileResponse
 *
 * @apiUse AuthHeader
 * @apiUse OtherErrors
 */
async function current(req: ISessionRequest, res: express.Response) {
  try {
    const result = await service.read(req.user.user_id);
    res.json({
      name: result.name,
      phone: result.phone,
      email: result.email,
      address: result.address,
      province: result.province,
      picture: result.picture
    });
  } catch (err) {
    error.handle(res, err);
  }
}

/**
 * @apiDefine IProfileResponse
 *
 * @apiSuccessExample {json} Perfil
 *    {
 *      "name": "Nombre y Apellido",
 *      "phone": "Teléfono",
 *      "email": "Email",
 *      "address": "Dirección",
 *      "picture": "Id de imagen",
 *      "province": "Id de provincia",
 *    }
 */

/**
 * @api {post} /v1/profile Actualizar Perfil
 * @apiName Actualizar Perfil
 * @apiGroup Perfil
 *
 * @apiDescription Actualiza los datos del perfil de usuario.
 *
 * @apiExample {json} Perfil
 *    {
 *      "name": "Nombre y Apellido",
 *      "phone": "Teléfono",
 *      "email": "Email",
 *      "address": "Dirección",
 *      "province": "Id de provincia",
 *    }
 *
 * @apiUse IProfileResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function updateBasicInfo(req: ISessionRequest, res: express.Response) {
  try {
    const result = await service.updateBasicInfo(req.user.user_id, req.body);
    res.json({
      name: result.name,
      phone: result.phone,
      email: result.email,
      address: result.address,
      province: result.province,
    });
  } catch (err) {
    error.handle(res, err);
  }
}