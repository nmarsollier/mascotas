'use strict';

/**
 * Dependencias.
 */
var authorization = require('../seguridad/authorization.service'),
	perfil = require('./perfil.service');

module.exports = function(app) {
	app.route('/perfil')
		.get(perfil.findByCurrentUser, perfil.read)
		.post(authorization.requiresLogin,
			perfil.findProvincia, 
			perfil.update);
};
