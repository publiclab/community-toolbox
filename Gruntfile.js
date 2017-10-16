module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-browserify');

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      watch: {
          options : {
              livereload: true
          },
          source: {
              files: [
                  'src/*.js',
                  'src/*/*.js',
                  'Gruntfile.js'
              ],
              tasks: [ 'build:js' ]
          }
      },

      browserify: {
          dist: {
            src: ['src/community-toolbox.js'],
            dest: 'dist/community-toolbox.js'
          }
      }

    });

    /* Default (development): Watch files and build on change. */
    grunt.registerTask('default', ['watch']);

    grunt.registerTask('build', [
        'browserify:dist'
    ]);

};
