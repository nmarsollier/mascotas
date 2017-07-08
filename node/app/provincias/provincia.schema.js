'use strict';

/**
 * Dependencias.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Definicio del Esquema de Provincia
 */
var ProvinciaSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		trim: true,
		required: 'Nombre no puede estar vacio.'
	}
});

mongoose.model('Provincia', ProvinciaSchema);
