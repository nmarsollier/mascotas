"use strict";

// Opciones del entorno dev
module.exports = {
  port: process.env.PORT || 3000,
  sessionSecret: "0e199b23b15da57e8eedd482a956c535",
  db: "mongodb://localhost/mascotas"
};
