/**
 * Minify files with UglifyJS.
 *
 * ---------------------------------------------------------------
 *
 * Minifies client-side javascript `assets`.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function(grunt) {

    var path = require('path');
    var _ = require('underscore');

    var ici = grunt.config.get('ici');

    var tmpDir = path.normalize(__dirname + "/../../.tmp/");

    var uglifyConfig = {};

    ici.oe.scripts.forEach(function(script){
        uglifyConfig[script.scriptName] = {
			options: {
				maxLineLen: 4096
			},
			files: [{
	          expand: true,     // Enable dynamic expansion.
	          cwd: '.tmp/',      // Src matches are relative to this path.
	          src: [script.scriptName + ".js" ], // Actual pattern(s) to match.
	          dest: '.tmp/',   // Destination path prefix.
	          ext: '.min.js',   // Dest filepaths will have this extension.
	          extDot: 'first'   // Extensions in filenames begin after the first dot
	        }]
        };

	});
    grunt.config.set('uglify', uglifyConfig);
	grunt.loadNpmTasks('grunt-contrib-uglify');


    var scriptTasks = [];
    ici.oe.scripts.forEach(function(script){
        scriptTasks.push('uglify:' + script.scriptName);
        grunt.registerTask('uglify:oe:'+script.scriptId, ['uglify:' + script.scriptName]);
	});
    grunt.registerTask('uglify:oe', scriptTasks);

};
