'use strict';

/**
 * Dependencias
 */
var mongoose = require('mongoose'),
	errorHandler = require('../core/errors.service.js'),
	Mascota = mongoose.model('Mascota'),
	_ = require('lodash');

/**
 * Retorna los datos de la mascota
 */
exports.read = function(req, res) {
	res.json(req.mascota);
};

/**
 * Actualiza los datos de la mascota
 */
exports.update = function(req, res) {
	var mascota = req.mascota;
	if(!mascota) {
		mascota = new Mascota();
		mascota.usuario = req.user;
	}

	if(!_.isEmpty(req.body.nombre)) {
		mascota.nombre = req.body.nombre;
	}
	if(!_.isEmpty(req.body.descripcion)) {
		mascota.descripcion = req.body.descripcion;
	}
	if(!_.isEmpty(req.body.fechaNacimiento)) {
		mascota.fechaNacimiento = req.body.fechaNacimiento;
	}

	mascota.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(mascota);
		}
	});
};

/**
 * Elimina una mascota
 */
exports.delete = function(req, res) {
	var mascota = req.mascota;
	mascota.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(mascota);
		}
	});
};


/**
 * Filtro, busca las mascotas del usuario logueado
 */
exports.findByCurrentUser = function(req, res, next) {
	Mascota.find({
		'usuario' : req.user
	})
	.exec(function(err, mascotas) {
			if (err)
				return next();
			res.json(mascotas);
	});
};


/**
 * Filtro para buscar y popular una mascota por id.
 * El resultado de la busqueda se popula en req.
 */
exports.findByID = function(req, res, next, id) {
	Mascota.findById(id)
		.exec(function(err, mascota) {
			if (err) return next(err);
			if (!mascota)
				return next(new Error('No se pudo cargar la mascota ' + id));
			req.mascota = mascota;
			next();
	});
};

/**
 * Autorizacion, el unico que puede modificar el mascota es el dueño
 */
exports.hasAuthorization = function(req, res, next) {
	if (!req.user._id.equals(req.mascota.usuario)) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
