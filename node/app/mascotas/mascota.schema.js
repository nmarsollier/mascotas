"use strict";

/**
 * Dependencias
 */
var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

/**
 * Esquema de Masctoas
 */
var MascotaSchema = new Schema({
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
    type: Schema.ObjectId,
    ref: "User",
    required: "Usuario es requerido"
  }
});

mongoose.model("Mascota", MascotaSchema);
