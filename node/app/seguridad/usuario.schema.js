'use strict';

/**
 * Dependencias.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * Validacion para tamaño de contraseña
 */
var validateLocalStrategyPassword = function(password) {
	return password && password.length > 6;
};

/**
 * Esquea de un usuario del sistema
 */
var UsuarioSchema = new Schema({
	nombre: {
		type: String,
		trim: true,
		default: '',
		required: 'El nombre de usuario es requerido'
	},
	login: {
		type: String,
		unique: 'El login ya existe',
		required: 'El login es requerido',
		trim: true
	},
	password: {
		type: String,
		default: '',
		required: 'La contraseña es requerida'
	},
	salt: {
		type: String
	},
	rol: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* Para reseteo de contraseña */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

UsuarioSchema.path('password').validate(function (value) {
	return validateLocalStrategyPassword(value);
}, 'La contraseña debe ser mayor a 6 caracteres');

/**
 * Hook a pre save method to hash the password
 */
UsuarioSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	this.updated = Date.now;

	next();
});

/**
 * Crea un hash del passwrod
 */
UsuarioSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Authentica un usuario
 */
UsuarioSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

mongoose.model('Usuario', UsuarioSchema);
