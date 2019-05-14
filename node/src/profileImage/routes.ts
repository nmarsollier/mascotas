"use strict";

import * as express from "express";
import * as passport from "passport";
import * as error from "../server/error";
import { ISessionRequest } from "../user/service";
import * as imageService from "../image/service";
import * as profileService from "../profile/service";

/**
 * Modulo de imagenes de perfil
 */
export function initModule(app: express.Express) {
  // Rutas del controlador
  app
    .route("/v1/profile/picture")
    .post(passport.authenticate("jwt", { session: false }), updateProfilePicture);

}

/**
 * @api {post} /v1/profile/picture Guardar Imagen de Perfil
 * @apiName Guardar Imagen de Perfil
 * @apiGroup Perfil
 *
 * @apiDescription Guarda una imagen de perfil en la db y actualiza el perfil
 *
 * @apiExample {json} Body
 *    {
 *      "image" : "Base 64 Image Text"
 *    }
 *
 * @apiSuccessExample {json} Response
 *    {
 *      "id": "id de imagen"
 *    }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function updateProfilePicture(req: ISessionRequest, res: express.Response) {
  try {
    const imageResult = await imageService.create(req.body);
    const profileResult = await profileService.updateProfilePicture(req.user.user_id, imageResult.id);

    res.json({
      id: profileResult.picture
    });
  } catch (err) {
    error.handle(res, err);
  }
}

