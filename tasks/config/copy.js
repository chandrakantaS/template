/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all js source files to the js directory
 *
 * # prod task config
 * Copies all js files (presumably concat and minified) from the tmpc directory into the js directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function(grunt) {

	grunt.config.set('copy', {
		all: {
			files: [{
				expand: true,
				cwd: './src',
				src: ['**/*.js'],
				dest: 'js'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
