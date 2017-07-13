"use strict";

import { Express } from "express";
import { Config } from "./config/environment";
import * as expressApp from "./config/express.factory";
import * as appConfig from "./config/environment";
import * as loggerFactory from "./utils/logger";
import * as mongoose from "mongoose";
import * as chalk from "chalk";

// Variables de entorno
const conf: Config = appConfig.getConfig(process.env);

// Checkear conexion con mongoose
mongoose.connect(conf.db, function(err: string) {
  if (err) {
    console.error(chalk.red("No se pudo conectar a MongoDB!"));
    console.log(chalk.red(err));
    process.exit();
  }
});

const app = expressApp.init(conf);
const logger = loggerFactory.getLogger();

app.listen(conf.port, () => {
  logger.info(`Mascotas Server escuchando en puerto ${conf.port}`);
});

module.exports = app;
