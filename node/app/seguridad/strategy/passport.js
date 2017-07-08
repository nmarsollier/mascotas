"use strict";

/**
 * Module dependencies.
 */
var passport = require("passport"),
  Usuario = require("mongoose").model("Usuario"),
  path = require("path"),
  config = require("../../../server/" +
    (process.env.NODE_ENV || "config.development"));

/**
 * Module init function.
 */
module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    Usuario.findOne(
      {
        _id: id
      },
      "-salt -password",
      function(err, user) {
        done(err, user);
      }
    );
  });

  // Initialize strategies
  require("./local.js")();
};
