"use strict";

import { Express } from "express";
import * as mascota from "./mascota.service";
import * as security from "../seguridad/security.service";
import * as passport from "passport";

export function init(app: Express) {
  // Routas de acceso a mascotas
  app
    .route("/mascota")
    .get(passport.authenticate("jwt", { session: false }), mascota.findByCurrentUser)
    .put(passport.authenticate("jwt", { session: false }), mascota.validateUpdate, mascota.update);

  app
    .route("/mascota/:mascotaId")
    .get(mascota.read)
    .post(passport.authenticate("jwt", { session: false }), mascota.validateOwner, mascota.validateUpdate, mascota.update)
    .delete(passport.authenticate("jwt", { session: false }), mascota.validateOwner, mascota.remove);

  // Filtro que agrega la mascota cuando se pasa como parametro el id
  app.param("mascotaId", mascota.findByID);
}
