"use strict";
var config = require("./server/" +
    (process.env.NODE_ENV || "config.development")),
  mongoose = require("mongoose"),
  chalk = require("chalk");

// Conexion a mongoose
var db = mongoose.connect(config.db, function(err) {
  if (err) {
    console.error(chalk.red("Could not connect to MongoDB!"));
    console.log(chalk.red(err));
  }
});

// Inicializacion de express
var app = require("./server/express")(db);

// Startup
app.listen(config.port);

exports = module.exports = app;

console.log("Mascotas Backend started on port " + config.port);
