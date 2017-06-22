module.exports = function (grunt) {
	grunt.config.set('concurrent',{
        watchAll: {
        	options: {
            	logConcurrentOutput: true
        	},
        	tasks: ['watch:app', 'watch:scripts', 'watch:server']
        },
	});

	grunt.loadNpmTasks('grunt-concurrent');

};
