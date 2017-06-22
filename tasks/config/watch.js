var util = require('util');

module.exports = function(grunt) {

	var ici = grunt.config.get('ici');
	var watchConfig = {
		oe: {
			files: ["src/oe/lib/**/*.js", "!src/oe/lib/shims/**/*.js"],
			tasks: ['build:dev']
		},
		f3: {
			files: ["src/f3/lib/*.js"],
			tasks: ['build:dev']
		}
	};

	ici.oe.scripts.forEach(function(script){
		var scriptWatchSrc = [
			script.scriptPathAbs + '/**/*.js', 
			'!' + script.scriptPathAbs + '/node_modules/**/*.js'
		];
		watchConfig.oe.files = watchConfig.oe.files.concat(scriptWatchSrc);
    });
	ici.f3.scripts.forEach(function(script){
		scriptWatchSrc = [
			script.scriptPathAbs+'/**/*.js', 
			script.scriptPathAbs + '/**/*.css', 
			'!'+script.scriptPathAbs+'/node_modules/**/*.js'
		];
		watchConfig.f3.files = watchConfig.f3.files.concat(scriptWatchSrc);
    });


	grunt.config.set('watch', watchConfig);

	grunt.loadNpmTasks('grunt-contrib-watch');	

    grunt.verbose.writeln('watchConfig: ' + util.inspect(watchConfig));

};