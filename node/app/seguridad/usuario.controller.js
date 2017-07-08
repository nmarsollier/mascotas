'use strict';

/**
 * Definicion del controler de seguridad.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var authentication = require('./authentication.service');
	var authorization = require('./authorization.service');
	var password = require('./password.service');

	app.route('/users/password').post(password.cambiarPassword);

	app.route('/auth/signup').put(authentication.signup);
	app.route('/auth/signin').post(authentication.signin);
	app.route('/auth/signout').get(authentication.signout);
	app.route('/auth/currentUser').get(authorization.requiresLogin, authentication.currentUser);

	app.param('userId', authorization.findByID);
};
