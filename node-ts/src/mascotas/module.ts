"use strict";

import { Express } from "express";
import * as mascota from "./mascota.service";
import * as authorization from "../seguridad/authorization.service";

export function init(app: Express) {
  // Routas de acceso a mascotas
  app
    .route("/mascota")
    .get(authorization.requiresLogin, mascota.findByCurrentUser)
    .put(authorization.requiresLogin, mascota.update);

  app
    .route("/mascota/:mascotaId")
    .get(mascota.read)
    .post(authorization.requiresLogin, mascota.validateOwner, mascota.update)
    .delete(
      authorization.requiresLogin,
      mascota.validateOwner,
      mascota.remove
    );

  // Filtro que agrega la mascota cuando se pasa como parametro el id
  app.param("mascotaId", mascota.findByID);
}
