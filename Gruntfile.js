var fs = require('fs');
var path = require('path');
var util = require('util');

var currentDir = process.env.PWD || process.cwd();

module.exports = function(grunt) {

	// define an object to hold ici config data
	grunt.ici = {};

	// get the package.json into an object and drop any .js from the name
	grunt.ici.packageInfo = grunt.file.readJSON('package.json');
	grunt.ici.packageInfo.name = grunt.ici.packageInfo.name.replace(/\.js$/,'');

	// define a few helpers
	grunt.ici.getScriptDirFromMain = function(scriptMain){
		// give a script Main.js file, get the parent dir
		return path.dirname(scriptMain);
	};
	grunt.ici.getScriptIdFromMain = function(scriptMain){
		// give a script Main.js file, get the ID portion of the parent dir
		var paths = path.dirname(scriptMain).split(/\/\\/);
		var scriptDir = paths[paths.length-1];
		return scriptDir.replace(/-.*$/,'');
	};
	grunt.ici.cloneTask = function(task, clone, loadName) {
		// clone a grunt task
		var tmpTask = 'tmp-'+task;
		if (grunt.task.exists(task)){
			grunt.renameTask(task, tmpTask);
		}
		grunt.loadNpmTasks(loadName);
		grunt.renameTask(task, clone);
		if (grunt.task.exists(tmpTask)){
			grunt.renameTask(tmpTask, task);
		}
	};

	// get current dir (where executed from) and source dir into ici config
	grunt.ici.cwd = path.normalize(currentDir).replace(/^[A-Z]:/,'');
	grunt.ici.srcDir = path.normalize(__dirname + "/src/").replace(/^[A-Z]:/,'');

	if (grunt.ici.cwd.length <= grunt.ici.srcDir.length) {
		// we must not be in a subdir
		grunt.ici.srcRelativeDir = grunt.ici.srcRelativeTask = '';
	} else {
		// in a subdir, so figure out how deep so we can create aggregate tasks at that level
		grunt.ici.srcRelativeDir = grunt.ici.cwd.replace(grunt.ici.srcDir,'');
		grunt.ici.srcRelativeTask = grunt.ici.srcRelativeDir.replace(/-.*$/,'').replace(/[\/\\]/g,':');
	}

	//TODO - seems odd, do we need a grunt.ici and a ici config object??
	var ici = grunt.config.get('ici') || {};

	// find all the OE scripts and add to the ici config
	ici.oe = {};
	ici.oe.scripts = [];
    var oeScriptBase = ici.oe.scriptBase = grunt.ici.srcDir + "/oe/";
    grunt.file.expand({
        cwd: oeScriptBase
    }, "*/Main.js").forEach(function(item) {
    	ici.oe.scripts.push({
    		scriptId: grunt.ici.getScriptIdFromMain(item),
    		scriptName: 'oe-'+grunt.ici.getScriptIdFromMain(item),
    		main: item,
    		base: oeScriptBase,
    		scriptPath: grunt.ici.getScriptDirFromMain(item),
    		scriptPathAbs: path.join(oeScriptBase,grunt.ici.getScriptDirFromMain(item)),
    		mainAbs: path.join(oeScriptBase,item)    	
    	});
	});

	// find all the F3 scripts and add to the ici config
	ici.f3 = {};
	ici.f3.scripts = [];
    var f3ScriptBase = ici.f3.scriptBase = grunt.ici.srcDir + "/f3/";
    grunt.file.expand({
        cwd: f3ScriptBase
    }, "*/Main.js").forEach(function(item) {
    	grunt.verbose.writeln('f3 script: ' + item);
    	ici.f3.scripts.push({
    		scriptId: grunt.ici.getScriptIdFromMain(item),
    		scriptName: 'f3-'+grunt.ici.getScriptDirFromMain(item),
    		main: item,
    		base: f3ScriptBase,
    		scriptPath: grunt.ici.getScriptDirFromMain(item),
    		scriptPathAbs: path.join(f3ScriptBase,grunt.ici.getScriptDirFromMain(item)),
    		mainAbs: path.join(f3ScriptBase,item)    	
    	});
	});

	grunt.config.set('ici', ici);
    grunt.verbose.writeln('ici config: ' + util.inspect(ici,  { depth: null }));

	/**
	 * Loads Grunt configuration modules from the specified
	 * relative path. These modules should export a function
	 * that, when run, should either load/configure or register
	 * a Grunt task.
	 */
	function loadTasks(relPath) {		
		return requireAll(path.resolve(__dirname, relPath), /(.+)\.js$/) || {};
	}

	/**
	 * Invokes the function from a Grunt configuration module with
	 * a single argument - the `grunt` object.
	 */
	function invokeTasks(tasks) {
		for (var taskName in tasks) {
			if (tasks.hasOwnProperty(taskName)) {
				tasks[taskName](grunt);
			}
		}
	}



	// Load task functions
	var taskConfigurations = loadTasks('./tasks/config'),
		registerDefinitions = loadTasks('./tasks/register');

	// (ensure that a default task exists)
	if (!registerDefinitions.default) {
		registerDefinitions.default = function (grunt) { grunt.registerTask('default', []); };
	}

	// Run task functions to configure Grunt.
	invokeTasks(taskConfigurations);
	invokeTasks(registerDefinitions);


	// Returns a list of modules, or false if the directory doesn't exist
	function requireAll(dirname, filter) {
	    var files;
	    var modules = {};

	    // Sane default for `filter` option
	    if (!filter) {
	        filter = /(.*)/;
	    }

	    try {
	        files = fs.readdirSync(dirname);
	    } catch (e) {
			throw new Error('Directory not found: ' + dirname);
	    }

	    // Iterate through files in the current directory
	    files.forEach(function(file) {
	        var filepath = dirname + '/' + file;

	        // For directories, continue to recursively include modules
	        if (fs.statSync(filepath).isDirectory())
	            return;

	        // Key name for module
	        var identity;

	        // Filename filter
	        if (filter) {
	            var match = file.match(filter);
	            if (!match) return;
	            identity = match[1];
	        }

	        // Load module into memory (unless `dontLoad` is true)
	        var resolved = require.resolve(filepath);
	        if (require.cache[resolved])
	            delete require.cache[resolved];

	        modules[identity] = require(filepath);
	    });

	    // Pass map of modules back to app code
	    return modules;

	}

};
