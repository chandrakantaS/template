var _ = require('underscore');

module.exports = function (grunt) {

    var ici = grunt.config.get('ici');

    // grunt.registerTask('build:dev', [
    //     'lint:app',
    //     'concat:ext',
    //     'webpack',
    //     'concat:bundle'
    // ]);
    // grunt.registerTask('build:prod', [
    //     'clean:all',
    //     'lint:app',
    //     'concat',
    //     'webpack',
    //     'uglify:app'
    // ]);

    // var scriptDevTasks = [
    //     'lint:scripts',
    // ];

    // ici.oe.scripts.forEach(function(script){
    //     scriptDevTasks.push('webpack:'+script);
    // });

    // grunt.registerTask('scripts', scriptDevTasks);
    // grunt.registerTask('build:scripts', ['build:scripts:dev']);

    // var scriptProdTasks = scriptDevTasks.slice();
    // scriptProdTasks.unshift('clean:tmp');
    // scriptProdTasks.push('uglify:scripts');
    // grunt.registerTask('build:scripts:prod', scriptProdTasks);

    grunt.verbose.writeln('TASK: ' + grunt.ici.srcRelativeTask);
    var srcRelativeTask = grunt.ici.srcRelativeTask;
    if (srcRelativeTask) 
        srcRelativeTask = ':' + srcRelativeTask;
    var devTasks = ['lint','webpack'];
//    var prodTasks = ['clean'].concat(devTasks, 'uglify');
    var prodTasks = devTasks.concat(devTasks, ['uglify']);

    var devTasksRegistered = [];
    _.each(devTasks, function(task) {
        devTasksRegistered.push(task + srcRelativeTask);
    });
    grunt.registerTask('build:dev', devTasksRegistered);
    if (process.env.NODE_ENV == 'development')
        grunt.registerTask('build', devTasksRegistered);

    var prodTasksRegistered = [];
    _.each(prodTasks, function(task) {
        prodTasksRegistered.push(task + srcRelativeTask);
    });
    grunt.registerTask('build:prod', prodTasksRegistered);
    if (process.env.NODE_ENV != 'development')
        grunt.registerTask('build', prodTasksRegistered);

};
