module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    copy: {
        js: {
            expand: true,
            cwd: './node_modules',
            dest: './public/js/libs/',
            flatten: true,
            filter: 'isFile',
            src: [
                './jquery/dist/js/jquery.min.js',
                './bootstrap/dist/js/bootstrap.min.js',
                './vue/dist/vue.min.js',
                './axios/dist/axios.min.js',
                './axios/dist/axios.min.map',
                './vue-resource/dist/vue-resource.min.js',
            ]
        }
    }
  });

  // Load the plugin that provides the "copy" task.
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['copy']);

};
