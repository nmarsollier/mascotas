"use strict";

/**
 * Dependencias.
 */
var provincias = require("./provincias.service");

module.exports = function(app) {
  // Rutas del controler
  app.route("/provincias").get(provincias.list);

  app.route("/provincias/:provinciaId").get(provincias.read);

  // Filtro automatico para agregar la provincia en el request
  // cuando se recibe como parametro provinciaId
  app.param("provinciaId", provincias.findByID);
};
