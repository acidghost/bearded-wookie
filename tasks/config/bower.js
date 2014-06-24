/**
 * Created by acidghost on 24/06/14.
 */

module.exports = function(grunt) {

  grunt.config.set('bower', {
    dev: {
      dest: './assets/js/dependencies',
      js_dest: './assets/js/dependencies',
      css_dest: './assets/styles/dependencies',
      options: {
        packageSpecific: {
          'bootstrap': {
            dest: './assets/fonts',
            js_dest: './assets/js/dependencies',
            less_dest: './assets/styles/dependencies',
            files: [
              'less/*.less',
              'dist/js/bootstrap.js',
              'dist/fonts/**/*'
            ]
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};
