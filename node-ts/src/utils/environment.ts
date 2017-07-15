"use strict";

import * as dotenv from "dotenv";
import { ConnectionOptions } from "mongoose";

let config: Config;

/*
Todas las configuraciones del servidor se encuentran aca.
*/
export function getConfig(environment: any): Config {
  if (!config) {
    // El archivo .env es un archivo que si esta presente se leen las propiedades
    // desde ese archivo, sino se toman estas de aca para entorno dev.
    // .env es un archivo que no se deberia subir al repo y cada server deberia tener el suyo
    dotenv.config({ path: ".env" });

    config = {
      port: process.env.SERVER_PORT || "3000",
      logLevel: process.env.LOG_LEVEL || "debug",
      db: process.env.MONGODB || "mongodb://localhost/petdb",
      jwtSecret: process.env.JWT_SECRET || "+b59WQF+kUDr0TGxevzpRV3ixMvyIQuD1O",
      passwordSalt: process.env.PASSWORD_SALT || "DP3whK1fL7kKvhWm6pZomM/y8tZ92mkEBtj29A4M+b8"
    };
  }
  return config;
}

export interface Config {
  port: string;
  logLevel: string; // 'debug' | 'verbose' | 'info' | 'warn' | 'error';
  db: string;
  passwordSalt: string;
  jwtSecret: string;
}
