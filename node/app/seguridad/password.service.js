'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../core/errors.service'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Usuario = mongoose.model('Usuario'),
	config = require('../../server/' + (process.env.NODE_ENV || 'config.development')),
	nodemailer = require('nodemailer'),
	async = require('async'),
	crypto = require('crypto');

/**
 * Cambiar contraseña
 */
exports.cambiarPassword = function(req, res) {
	var passwordDetails = req.body;

	if (!req.user) {
		res.status(400).send({
			message: 'El usuario no esta logueado'
		});
		return;
	}
	if (!passwordDetails.newPassword) {
		res.status(400).send({
			message: 'Debe proporcionar la contraseña'
		});
		return;
	}

	Usuario.findById(req.user.id, function(err, user) {
		if(err || !user) {
			return res.status(400).send({
				message: 'El usuario no se encuentra'
			});
		}

		if (!user.authenticate(passwordDetails.currentPassword)) {
			return res.status(400).send({
				message: 'El password actual es incorrecto'
			});
		}

		if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
			return res.status(400).send({
				message: 'Las contraseñas no coinciden'
			});
		}

		user.password = passwordDetails.newPassword;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						return res.status(400).send(err);
					} else {
						return res.send({
							message: 'Contraseña cambiada'
						});
					}
				});
			}
		});
	});
};
