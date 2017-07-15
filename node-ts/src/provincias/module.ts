"use strict";

import { Express } from "express";
import * as provincias from "./provincia.service";
import * as passport from "passport";
import * as security from "../seguridad/security.service";

/**
 * Configura e inicializa los contenidos del Modulo
 */
export function init(app: Express) {
  // Rutas del controler
  app.route("/provincias")
    .get(provincias.list)
    .post(passport.authenticate("jwt", { session: false }), security.validateAdminRole, provincias.validateUpdate, provincias.update);

  app.route("/provincias/:provinciaId")
    .get(provincias.read)
    .delete(passport.authenticate("jwt", { session: false }), security.validateAdminRole, provincias.validateUpdate, provincias.remove);

  // Filtro automatico para agregar la provincia en el request
  // cuando se recibe como parametro provinciaId
  app.param("provinciaId", provincias.findByID);
}
