module.exports = function(grunt) {

    var util = require('util');
    var webpack = require('webpack');
    var scriptLoader = require('script-loader');
    var path = require('path');
    var _ = require('underscore');
    var fs = require('fs');

    var ici = grunt.config.get('ici');

    var f3TmpDir = process.env.F3_OUTPUT || process.env.SCRIPT_OUTPUT || path.normalize(__dirname + "/../../.tmp/");
    grunt.verbose.writeln('f3TmpDir: ' + f3TmpDir);

    var oeTmpDir = process.env.OE_OUTPUT || path.normalize(__dirname + "/../../.tmp/");
    grunt.verbose.writeln('oeTmpDir: ' + oeTmpDir);

    var srcBase = path.normalize(__dirname + "/../../src/");
    grunt.verbose.writeln('srcBase: ' + srcBase);

    // define a config object for the webpack task
    var webpackConfig = {};

    // determine whether we are running oe scripts under emulation mode for testing
    var oeExternals = {};
    var oeEnv = grunt.option('oe_env') || grunt.option('OE_ENV') || process.env.OE_ENV;
    if (['dev', 'devel', 'development', 'emulate'].indexOf(oeEnv) >= 0){
        _.each(['fs','http', 'https', 'util', 'path'], function(nativeModule) {
            oeExternals[nativeModule] = 'commonjs ' + nativeModule;
        });
    }   

    // get the code to inject at the top of each script
    var oeBannerCode = ';this.global = this.global || this;\n' ;

    try {
        var oeInjectFiles = fs.readdirSync(path.resolve(__dirname, './inject-oe'));
        grunt.verbose.writeln('inject-oe files: ' + util.inspect(oeInjectFiles));
        oeInjectFiles.forEach(function(file) {
            if (!/\.js$/.test(file))
                return;
            oeBannerCode += fs.readFileSync(path.resolve(__dirname, './inject-oe/' + file), 'utf8') + '\n';
        });
    } catch (e) {
        // ignore if there is no dir
    }

    oeBannerCode += 'var m="undefined"==typeof module?{exports:{}}:module;m.exports=Main=';

    // add a task for each OE script by name
    var oeScriptBase = srcBase + "oe";
    grunt.verbose.writeln('oeScriptBase: ' + oeScriptBase);
    ici.oe.scripts.forEach(function(script){
        webpackConfig[script.scriptName] = {
            context: script.scriptPathAbs,
            resolve: {
                root: script.scriptPathAbs,
                modulesDirectories: ["lib",'node_modules']
            },
            entry: 'Main.js',
            output: {
                path: oeTmpDir,
                filename: script.scriptName + ".js" 
            },            
            module: {
                loaders: [
                    { test: /\.css$/, loader: 'style!css'},
                    { test: /\.js\$/, loader: 'imports?shim=shims/oe-shims.js&json=shims/json.js'}
                ],
            },
            plugins: [
                new webpack.BannerPlugin(oeBannerCode, {
                    raw: true,
                    entryOnly: true
                }),
            ],
            externals: oeExternals
        };

    });

    // add a task for each F3 script by name
    var f3ScriptBase = srcBase + "f3";
    grunt.verbose.writeln('f3ScriptBase: ' + f3ScriptBase);
    ici.f3.scripts.forEach(function(script){
        webpackConfig[script.scriptName] = {
            context: script.scriptPathAbs,
            resolve: {
                root: script.scriptPathAbs,
                modulesDirectories: ["lib",'node_modules']
            },
            entry: 'Main.js',
            output: {
                path: f3TmpDir,
                filename: script.scriptId + ".js" 
            },            
            module: {
                loaders: [
                    { test: /\.css$/, loader: 'style!css'}
                ],
            },
            plugins: [
            ],
            externals: oeExternals
        };

    });


    grunt.config.set('webpack', webpackConfig);

    grunt.verbose.writeln('webpackConfig: ' + util.inspect(webpackConfig, {depth:null}));

    grunt.loadNpmTasks('grunt-webpack');

    var scriptTasks = [];
    ici.oe.scripts.forEach(function(script){
        grunt.registerTask('webpack:oe:'+script.scriptId, ['webpack:' + script.scriptName]);
        scriptTasks.push('webpack:' + script.scriptName);
    });
    grunt.registerTask('webpack:oe', scriptTasks);

    scriptTasks = [];
    ici.f3.scripts.forEach(function(script){
        grunt.registerTask('webpack:f3:'+script.scriptId, ['webpack:' + script.scriptName]);
        scriptTasks.push('webpack:' + script.scriptName);
    });
    grunt.registerTask('webpack:f3', scriptTasks);

};