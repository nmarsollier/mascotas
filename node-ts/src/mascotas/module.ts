"use strict";

import { Express } from "express";
import * as mascota from "./mascota.service";
import * as security from "../seguridad/security.service";

export function init(app: Express) {
  // Routas de acceso a mascotas
  app
    .route("/mascota")
    .get(security.requiresLogin, mascota.findByCurrentUser)
    .put(security.requiresLogin, mascota.update);

  app
    .route("/mascota/:mascotaId")
    .get(mascota.read)
    .post(security.requiresLogin, mascota.validateOwner, mascota.update)
    .delete(
      security.requiresLogin,
      mascota.validateOwner,
      mascota.remove
    );

  // Filtro que agrega la mascota cuando se pasa como parametro el id
  app.param("mascotaId", mascota.findByID);
}
