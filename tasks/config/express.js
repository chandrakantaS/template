module.exports = function(grunt) {

	grunt.config.set('express', {
		options: {
			// Override defaults here
		},
		server: {
			options: {
				script: 'server.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-express-server');
};