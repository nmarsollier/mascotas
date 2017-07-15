"use strict";

import * as mongoose from "mongoose";
import * as passport from "passport";
import * as crypto from "crypto";
import * as appConfig from "../utils/environment";
const conf = appConfig.getConfig(process.env);

/*
  Por definicion es el usuario que permite el login.
*/

export interface IUsuario extends mongoose.Document {
  nombre: string;
  login: string;
  password: string;
  rol: string;
  updated: Date;
  created: Date;
  enabled: Boolean;
  authenticate: Function;
}

/**
 * Validacion para tamaño de contraseña
 */
const validateLocalStrategyPassword = function (password: string) {
  return password && password.length > 6;
};

/**
 * Esquea de un usuario del sistema
 */
export let UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    default: "",
    required: "El nombre de usuario es requerido"
  },
  login: {
    type: String,
    unique: "El login ya existe",
    required: "El login es requerido",
    trim: true
  },
  password: {
    type: String,
    default: "",
    required: "La contraseña es requerida"
  },
  rol: {
    type: [
      {
        type: String,
        enum: ["user", "admin"]
      }
    ],
    default: ["user"]
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  enabled: {
    type: Boolean,
    default: true
  }
});

UsuarioSchema.path("password").validate(function (value: string) {
  return validateLocalStrategyPassword(value);
}, "La contraseña debe ser mayor a 6 caracteres");

/**
 * Hook a pre save method to hash the password
 */
UsuarioSchema.pre("save", function (next: Function) {
  if (this.isModified("password") && this.password && this.password.length > 6) {
    this.password = this.hashPassword(this.password);
  }

  this.updated = Date.now;

  next();
});

/**
 * Crea un hash del passwrod
 */
UsuarioSchema.methods.hashPassword = function (password: string) {
  return crypto
    .pbkdf2Sync(password, conf.passwordSalt, 10000, 64, "SHA1")
    .toString("base64");
};

/**
 * Authentica un usuario
 */
UsuarioSchema.methods.authenticate = function (password: string) {
  return this.password && this.password === this.hashPassword(password);
};

export let Usuario = mongoose.model<IUsuario>("Usuario", UsuarioSchema);
