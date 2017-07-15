"use strict";

import * as mongoose from "mongoose";

/**
 * Definicio del Esquema de Provincia
 */

export interface IProvincia extends mongoose.Document {
  nombre: string;
  enabled: Boolean;
}

export let ProvinciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    default: "",
    trim: true,
    required: "Nombre no puede estar vacio."
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, {collection: "provincias"});

export let Provincia = mongoose.model<IProvincia>("Provincia", ProvinciaSchema);
