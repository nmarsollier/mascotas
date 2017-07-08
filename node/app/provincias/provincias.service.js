"use strict";

/**
 * Dependencias
 */
var mongoose = require("mongoose"),
  errorHandler = require("../core/errors.service.js"),
  Provincia = mongoose.model("Provincia");

/**
 * Busca una provincia
 */
exports.read = function(req, res) {
  res.json(req.provincia);
};

/**
 * Lista todas las Provincias
 */
exports.list = function(req, res) {
  Provincia.find().sort("-created").exec(function(err, provincia) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(provincia);
    }
  });
};

/**
 * Filtro para buscar y popular una provincia por id.
 * El resultado de la busqueda se popula en req.
 */
exports.findByID = function(req, res, next, id) {
  Provincia.findById(id).exec(function(err, provincia) {
    if (err) return next(err);
    if (!provincia)
      return next(new Error("No se pudo cargar la provincia " + id));
    req.provincia = provincia;
    next();
  });
};
