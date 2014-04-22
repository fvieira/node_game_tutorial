module.exports = function(grunt) {

  grunt.initConfig({
    typescript: {
      client: {
        src: ['client/js/*.ts'],
        options: {
          module: 'amd',
          target: 'es5',
          sourceMap: true
        }
      },
      server: {
        src: ['server/*.ts'],
        options: {
          module: 'commonjs',
          target: 'es5',
          sourceMap: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-typescript');

  grunt.registerTask('default', ['typescript']);

};
