"use strict";
/**
 * Configura e inicializa los contenidos del Modulo
 */
module.exports = function(app) {
  require("./provincia.schema.js");
  require("./provincias.controller.js")(app);
};
