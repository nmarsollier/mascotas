'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Usuario = require('mongoose').model('Usuario');

module.exports = function() {
	passport.use(new LocalStrategy({
			usernameField: 'login',
			passwordField: 'password'
		},
		function(username, password, done) {
			Usuario.findOne({
				login: username
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Usuario o contraseña incorrecta.'
					});
				}
				if (!user.authenticate(password)) {
					return done(null, false, {
						message: 'Usuario o contraseña incorrecta'
					});
				}

				return done(null, user);
			});
		}
	));
};
