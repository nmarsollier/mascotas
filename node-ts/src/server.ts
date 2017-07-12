"use strict";

import { Express } from "express";
import { Config } from "./server/config";
import * as expressApp from "./server/express.factory";
import * as appConfig from "./server/config";
import * as loggerFactory from "./utils/logger";
import * as mongoose from "mongoose";
import * as chalk from "chalk";
import * as dotenv from "dotenv";

// Variables de entorno
dotenv.config({ path: ".env.example" });
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
