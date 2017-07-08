"use strict";

// Este controller nos devuelve index.html cuando se accede a /
module.exports = function(app) {
  // Root routing
  var core = require("./index.service");
  app.route("/").get(core.index);
};
