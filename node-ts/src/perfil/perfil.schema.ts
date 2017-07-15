"use strict";

import * as mongoose from "mongoose";


export interface IPerfil extends mongoose.Document {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  imagen: string;
  valid: Boolean;
  provincia: mongoose.Schema.Types.ObjectId;
  usuario: mongoose.Schema.Types.ObjectId;
  updated: Date;
  created: Date;
  enabled: Boolean;
}
/**
 * Esquema del Perfil
 */
export let PerfilSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre es requerido"
  },
  telefono: {
    type: String,
    default: "",
    trim: true
  },
  email: {
    type: String,
    default: "",
    trim: true,
    required: "Email es requerido"
  },
  direccion: {
    type: String,
    default: "",
    trim: true
  },
  imagen: {
    type: String,
    default: "",
    trim: true
  },
  valid: {
    type: Boolean,
    default: true
  },
  provincia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provincia"
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: "Usuario es requerido"
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


/**
 * Hook a pre save method to hash the password
 */
PerfilSchema.pre("save", function (next: Function) {
  this.updated = Date.now;

  next();
});

export let Perfil = mongoose.model<IPerfil>("Perfil", PerfilSchema);
