/**
  Concatenate javascript files.
 	placeholder for a concatenation task prepared by jsDepends

 */
module.exports = function(grunt) {
	var extBase = 'src/ext/';
	grunt.config.set('concat', {
		options: {
			separator: ';\n\n',
		},
		ext: {
			src: [
				extBase + 'jquery.js',
				extBase + 'underscore.js',
				extBase + 'backbone.js',
				extBase + 'backbone.linear.js',
				extBase + 'jqxcore.js',
				extBase + 'jqxdata.js',
				extBase + 'jqxbuttons.js',
				extBase + 'jqxdatatable.js',
				extBase + 'jqxexpander.js',
				extBase + 'jqxscrollbar.js',
				extBase + 'jqxcalendar.js',
				extBase + 'jqxdatetimeinput.js',
				extBase + 'jqxtooltip.js',
				extBase + 'jqxnotification.js',
				extBase + 'jqxwindow.js',
				extBase + 'jquery.mask.js'
			],
			dest: '.tmp/ext.js'
		},
		bundle: {
			src: [
				'.tmp/ext.js',
				'.tmp/bundle.js'
			],
			dest: 'js/<%= grunt.ici.packageInfo.name %>.js'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};