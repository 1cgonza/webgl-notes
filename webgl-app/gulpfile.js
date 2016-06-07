'use strict';
const gulp = require('gulp');
const sync = require('browser-sync').create();
const webpack = require('webpack-stream');
const Uglify = require('webpack').optimize.UglifyJsPlugin;

var webpackConfig = {
  context: __dirname + '/src',
  devtool: 'source-map',
  entry: {
    javascript: './js/index.js',
    html: './index.html'
  },
  output: {
    filename: 'js/scripts.js',
    path: __dirname + '/build'
  },
  module: {
    loaders: [
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      }
    ],
  },
  glsl: {
    chunkPath: __dirname + '/src/shaders'
  },
  plugins: [
    // Remove comments from next lines to minify js

    // new Uglify({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
};

gulp.task('serve', ['pack'], function() {
  sync.init({
    notify: false,
    server: './build'
  });

  gulp.watch(['./src/**/*.js', './src/shaders/**/*.*', './src/*.html'], ['pack']);
});

gulp.task('pack', function() {
  return gulp.src('src/js/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('build'))
    .pipe(sync.stream());
});

gulp.task('default', ['serve']);
