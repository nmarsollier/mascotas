"use strict";

import * as mongoose from "mongoose";

/**
 * Permite almacenar imagenes
 */

export interface IImage extends mongoose.Document {
  image: string;
}

export let ImageSchema = new mongoose.Schema({
 image: {
    type: String,
    required: true,
  }
}, {collection: "images"});

export let Image = mongoose.model<IImage>("Image", ImageSchema);
