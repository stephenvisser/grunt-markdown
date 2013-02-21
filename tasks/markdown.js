/*
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var markdown = require('marked');
  var hljs = require('highlight.js');

  function doMarkdown(src, options) {

    var html = null;
    var codeLines = options.codeLines;
    var shouldWrap = codeLines && codeLines.before && codeLines.after;

    function wrapLines(code) {
      var out = [];
      var before = codeLines.before;
      var after = codeLines.after;
      code = code.split('\n');
      code.forEach(function(line) {
        out.push(before+line+after);
      });
      return out.join('\n');
    }

    if(typeof options.highlight === 'string') {
      if(options.highlight === 'auto') {
        options.highlight = function(code) {
          var out = hljs.highlightAuto(code).value;
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };
      } else if (options.highlight === 'manual') {
        options.highlight = function(code, lang) {
          var out = code;
          try {
            out = hljs.highlight(lang, code).value;
          } catch(e) {
            out = hljs.highlightAuto(code).value;
          }
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };
      }

    }

    html = markdown(src, options);

    if (options.template) {
      return grunt.template.process(grunt.file.read(options.template), {data: {content:html}});
    } else {
      return html;
    }
  }

  grunt.registerMultiTask('markdown', 'compiles markdown files into html', function() {

    this.files.forEach(function(fileSet) {
        grunt.file.expand(fileSet.src).forEach(function(file){
        var html = doMarkdown(grunt.file.read(file), this.data.options);
        var ext = path.extname(file);
        var dest = path.join(fileSet.dest, path.basename(file, ext) +'.' + fileSet.ext);
        grunt.file.write(dest, html);
      }, this);
    }, this);

  });

};