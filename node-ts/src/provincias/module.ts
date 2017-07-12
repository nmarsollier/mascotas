"use strict";

import { Express } from "express";
import * as provincias from "./provincias.service";

/**
 * Configura e inicializa los contenidos del Modulo
 */
export function init(app: Express) {
  // Rutas del controler
  app.route("/provincias").get(provincias.list);

  app.route("/provincias/:provinciaId").get(provincias.read);

  // Filtro automatico para agregar la provincia en el request
  // cuando se recibe como parametro provinciaId
  app.param("provinciaId", provincias.findByID);
}
