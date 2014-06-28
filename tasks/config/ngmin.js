/**
 * Created by acidghost on 28/06/14.
 */
module.exports = function(grunt) {

  grunt.config.set('ngmin', {
    all: {
      src: ['.tmp/public/concat/production.js'],
      dest: '.tmp/public/concat/production.js'
    }
  });

  grunt.loadNpmTasks('grunt-ngmin');
};
