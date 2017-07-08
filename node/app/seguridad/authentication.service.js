"use strict";

/**
 * Este modulo maneja la authenticacion de usuarios
 */
var _ = require("lodash"),
  errorHandler = require("../core/errors.service"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  Usuario = mongoose.model("Usuario");

/**
 * Signup
 */
exports.signup = function(req, res) {
  var user = new Usuario();
  console.log(req.body);
  user.nombre = req.body.nombre;
  user.login = req.body.login;
  user.password = req.body.password;
  user.rol = "user";

  // Then save the user
  user.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    // Esta informacion queda en la sesion, hay que limpiarlo
    user.password = undefined;
    user.salt = undefined;
    user.resetPasswordToken = undefined;

    req.login(user, function(err) {
      if (err) {
        res.status(400).send("Login error : " + err);
      } else {
        res.json(user);
      }
    });
  });
};

/**
 * Signin
 */
exports.signin = function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err || !user) {
      return res.status(400).send(info);
    }

    // Esta informacion queda en la sesion, hay que limpiarlo
    user.password = undefined;
    user.salt = undefined;
    user.resetPasswordToken = undefined;

    req.login(user, function(err) {
      if (err) {
        return res.status(400).send(err);
      } else {
        return res.json(user);
      }
    });
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect("/");
};

/**
 * Get current user
 */
exports.currentUser = function(req, res, next) {
  if (!req.user) {
    return res.status(500).send("Usuario no logueado");
  } else {
    return res.json(req.user);
  }
};
