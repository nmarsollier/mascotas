"use strict";

import * as express from "express";
import * as passport from "passport";
import { ISessionRequest } from "../user/service";
import * as service from "./service";
import * as error from "../server/error";

/**
 * Modulo de mascotas de usuario
 */
export function initModule(app: express.Express) {
  // Rutas de acceso a mascotas
  app
    .route("/v1/pet")
    .get(passport.authenticate("jwt", { session: false }), findByCurrentUser)
    .post(passport.authenticate("jwt", { session: false }), create);

  app
    .route("/v1/pet/:petId")
    .get(passport.authenticate("jwt", { session: false }), readById)
    .post(passport.authenticate("jwt", { session: false }), updateById)
    .delete(passport.authenticate("jwt", { session: false }), removeById);
}


/**
 * @api {get} /v1/pet Listar Mascota
 * @apiName Listar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Obtiene un listado de las mascotas del usuario actual.
 *
 * @apiSuccessExample {json} Mascota
 *  [
 *    {
 *      "id": "Id de mascota"
 *      "name": "Nombre de la mascota",
 *      "description": "Descripción de la mascota",
 *      "birthDate": date (DD/MM/YYYY),
 *    }, ...
 *  ]
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */
async function findByCurrentUser(req: ISessionRequest, res: express.Response) {
  try {
    const result = await service.findByCurrentUser(req.user.user_id);
    res.json(result.map(u => {
      return {
        id: u.id,
        name: u.name,
        description: u.description,
        birthDate: u.birthDate
      };
    }));
  } catch (err) {
    error.handle(res, err);
  }
}

/**
 * @apiDefine IMascotaResponse
 *
 * @apiSuccessExample {json} Mascota
 *    {
 *      "id": "Id de mascota",
 *      "name": "Nombre de la mascota",
 *      "description": "Descripción de la mascota",
 *      "birthDate": date (DD/MM/YYYY),
 *    }
 */

/**
 * @api {post} /v1/pet Crear Mascota
 * @apiName Crear Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Crea una mascota.
 *
 * @apiExample {json} Mascota
 *    {
 *      "id": "Id mascota"
 *    }
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function create(req: ISessionRequest, res: express.Response) {
  try {
    const result = await service.update(undefined, req.user.user_id, req.body);
    res.json({
      id: result.id
    });
  } catch (err) {
    error.handle(res, err);
  }
}


/**
 * @api {put} /v1/pet/:petId Buscar Mascota
 * @apiName Buscar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Busca una mascota por id.
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function readById(req: ISessionRequest, res: express.Response) {
  try {
    const result = await service.findById(req.user.user_id, req.params.petId);
    res.json({
      id: result.id,
      name: result.name,
      description: result.description,
      birthDate: result.birthDate
    });
  } catch (err) {
    error.handle(res, err);
  }
}

/**
 * @api {post} /v1/pet/:petId Actualizar Mascota
 * @apiName Actualizar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Actualiza los datos de una mascota.
 *
 * @apiExample {json} Mascota
 *    {
 *      "id": "Id de mascota",
 *      "name": "Nombre de la mascota",
 *      "description": "Description de la mascota",
 *      "birthDate": date (DD/MM/YYYY),
 *    }
 *
 * @apiUse IMascotaResponse
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function updateById(req: ISessionRequest, res: express.Response) {
  try {
    const result = await service.update(req.params.petId, req.user.user_id, req.body);
    res.json({
      id: result.id,
      name: result.name,
      description: result.description,
      birthDate: result.birthDate
    });
  } catch (err) {
    error.handle(res, err);
  }
}

/**
 * @api {delete} /v1/pet/:petId Eliminar Mascota
 * @apiName Eliminar Mascota
 * @apiGroup Mascotas
 *
 * @apiDescription Eliminar una mascota.
 *
 * @apiUse AuthHeader
 * @apiUse 200OK
 * @apiUse OtherErrors
 */

async function removeById(req: ISessionRequest, res: express.Response) {
  try {
    const result = await service.remove(req.user.user_id, req.params.petId);
    res.send();
  } catch (err) {
    error.handle(res, err);
  }
}