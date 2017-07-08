"use strict";

/**
 * Dependencias.
 */
var _ = require("lodash"),
  mongoose = require("mongoose"),
  Usuario = mongoose.model("Usuario");

/**
 * Filtro busca un usario y lo agrega al request
 */
exports.findByID = function(req, res, next, id) {
  Usuario.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("No se encontro el usuario " + id));
    req.profile = user;
    next();
  });
};

/**
 * Verifica que exista un usuario lgueado
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: "Usuario no logueado"
    });
  }

  next();
};

/**
 * Verifica que se tiene autorizacion para acceder, segun el rol
 */
exports.hasAuthorization = function(roles) {
  var _this = this;

  return function(req, res, next) {
    _this.requiresLogin(req, res, function() {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.status(403).send({
          message: "Usuario no autorizado"
        });
      }
    });
  };
};
