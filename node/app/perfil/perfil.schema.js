'use strict';

/**
 * Dependencias
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Esquema del Perfil
 */
var PerfilSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		trim: true,
		required: 'Nombre es requerido'
	},
	telefono: {
		type: String,
		default: '',
		trim: true,
	},
	email: {
		type: String,
		default: '',
		trim: true,
		required: 'Email es requerido'
	},
	direccion: {
		type: String,
		default: '',
		trim: true
	},
	imagen: {
		type: String,
		default: '',
		trim: true
	},
	habilitado: {
		type: Boolean,
		default: true
	},
	provincia: {
		type: Schema.ObjectId,
		ref: 'Provincia'
	},
	usuario: {
		type: Schema.ObjectId,
		ref: 'Usuario',
		required: 'Usuario es requerido'
	}
});

mongoose.model('Perfil', PerfilSchema);
