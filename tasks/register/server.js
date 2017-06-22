module.exports = function (grunt) {
	grunt.registerTask('server2', ['build:dev', 'express', 'watch']);
};
