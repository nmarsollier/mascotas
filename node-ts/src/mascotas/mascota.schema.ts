"use strict";

import * as mongoose from "mongoose";

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
  }
});

export let Mascota = mongoose.model("Mascota", MascotaSchema);
