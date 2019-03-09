module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      watch: {
          options : {
              livereload: true
          },
          source: {
              files: [
                  'src/*/*.js',
                  'Gruntfile.js'
              ],
              tasks: [ 'build:js' ]
          }
      },

      browserify: {
          dist: {
            src: ['src/scripts/community-toolbox.js'],
            dest: 'dist/community-toolbox.js'
          }
      }

      uglify: {  
        options: {  
            compress: true  
        },  
        dist: {  
            src: [  
            'dist/community-toolbox.js'  
            ],  
            dest: 'dist/community-toolbox.min.js'  
        }  
    }

    });

      

    /* Default (development): Watch files and build on change. */
    grunt.registerTask('default', ['watch', 'uglify']);

    grunt.registerTask('build', [
        'browserify:dist'
    ]);

};
