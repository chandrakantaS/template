var util = require('util');

module.exports = function(grunt) {

	var ici = grunt.config.get('ici');
	var jshintConfig = {
		options: {
			reporterOutput: ""
		},
		oe: {
			src: ["src/oe/lib/**/*.js", "!src/oe/lib/shims/**/*.js"]
		},
		f3: {
			src: ["src/f3/lib/*.js"]
		}
	};

	ici.oe.scripts.forEach(function(script){
		var scriptLintSrc = [script.scriptPathAbs+'/**.js', '!'+script.scriptPathAbs+'/node_modules/**.js'];
		jshintConfig.oe.src = jshintConfig.oe.src.concat(scriptLintSrc);
        jshintConfig[script.scriptName] = {
			src: scriptLintSrc
		};
    });
	ici.f3.scripts.forEach(function(script){
		scriptLintSrc = [script.scriptPathAbs+'/**.js', '!'+script.scriptPathAbs+'/node_modules/**.js'];
		jshintConfig.f3.src = jshintConfig.f3.src.concat(scriptLintSrc);
        jshintConfig[script.scriptName] = {
			src: scriptLintSrc
		};
    });

	grunt.config.set('jshint', jshintConfig);

	grunt.loadNpmTasks('grunt-contrib-jshint');	

	// add support for only linting if a file has changed
    grunt.loadNpmTasks('grunt-newer');
    grunt.registerTask('lint', ['newer:jshint']);
    grunt.registerTask('lint:oe', ['newer:jshint:oe']);
    grunt.registerTask('lint:f3', ['newer:jshint:f3']);
	ici.oe.scripts.forEach(function(script){
	    grunt.registerTask('lint:' + script.scriptName, ['newer:jshint:'+script.scriptName]);
    });
	ici.f3.scripts.forEach(function(script){
	    grunt.registerTask('lint:' + script.scriptName, ['newer:jshint:'+script.scriptName]);
    });

    grunt.verbose.writeln('jshintConfig: ' + util.inspect(jshintConfig));

};