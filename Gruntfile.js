module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    markdown: {
      all: {
        src: '*.md',
        dest: './',
        ext: 'html',
        options: {
          gfm: true,
          highlight: 'manual'
        }
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'markdown');

};
