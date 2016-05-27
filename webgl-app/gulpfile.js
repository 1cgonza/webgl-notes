'use strict';
const gulp = require('gulp');
const sync = require('browser-sync').create();
const webpack = require('webpack-stream');

var wpOptions = {
  output: {
    filename: 'scripts.js'
  },
  module: {
    loaders: [
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader'
      }
    ],
  },
  glsl: {
    chunkPath: __dirname + '/shaders'
  }
};

gulp.task('serve', ['pack'], function() {
  sync.init({
    notify: false,
    server: './server'
  });

  gulp.watch(['./server/scripts.js', './server/shaders/**/*.*'], ['pack']);
  gulp.watch('./server/*.html').on('change', sync.reload);
});

gulp.task('pack', function() {
  return gulp.src('server/scripts.js')
    .pipe(webpack(wpOptions))
    .pipe(gulp.dest('server/packed-js'))
    .pipe(sync.stream());
});

gulp.task('default', ['serve']);
