"use strict";

import * as mongoose from "mongoose";

export interface IMascota extends mongoose.Document {
  nombre: string;
  fechaNacimiento: Date;
  descripcion: string;
  usuario: mongoose.Schema.Types.ObjectId;
  updated: Date;
  created: Date;
  enabled: Boolean;
}

/**
 * Esquema de Mascotas
 */
export let MascotaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre es requerido"
  },
  fechaNacimiento: {
    type: Date,
    default: "",
    trim: true
  },
  descripcion: {
    type: String,
    default: "",
    trim: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
MascotaSchema.pre("save", function (next: Function) {
  this.updated = Date.now;

  next();
});

export let Mascota = mongoose.model<IMascota>("Mascota", MascotaSchema);
