"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as image from "./image.service";

export function init(app: Express) {
  // Routas de acceso a mascotas
  app
    .route("/image")
    .post(passport.authenticate("jwt", { session: false }), image.validateCreate, image.create);

  app
    .route("/image/:imageId")
    .get(image.read);

  // Filtro que agrega la mascota cuando se pasa como parametro el id
  app.param("imageId", image.findByID);
}
