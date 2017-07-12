"use strict";

import * as mongoose from "mongoose";

/**
 * Definicio del Esquema de Provincia
 */
export let ProvinciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre no puede estar vacio."
  }
});

export let Provincia = mongoose.model("Provincia", ProvinciaSchema);
