'use strict'

const gulp    = require('gulp')
const gutil   = require('gulp-util')
const bower   = require('main-bower-files')
const filter  = require('gulp-filter')
const cssmin  = require('gulp-cssnano')
const htmlmin = require('gulp-htmlmin')
const flatten = require('gulp-flatten')
const srcmap  = require('gulp-sourcemaps')
const rename  = require('gulp-rename')
const uglify  = require('gulp-uglify')
const csscat  = require('gulp-concat-css')
const jscat   = require('gulp-concat')
const gulpif  = require('gulp-if')
const clean   = require('del')
const webpack = require('webpack-stream')
const vname   = require('vinyl-named')
const eslint  = require('gulp-eslint')
const annotate = require('gulp-ng-annotate')
const strip = require('gulp-strip-comments')
const sass = require('gulp-sass')
const prefix = require('gulp-autoprefixer')

const opts = {
  src: './src/',    // Source Directory
  dist: './app/',   // Distribution Directory

  // App Context
  package: require('./package.json'),
  webpack: require('./webpack.config')
}

// Lint Source
gulp.task('lint', function (done) {
  return gulp.src(['./src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// Clean All that Shit
gulp.task('clean', function (done) {
  clean([`${opts.dist}**/*.{css,js,map,html}`])
  done()
})

gulp.task('styles', (done) => {
  const minify = !gutil.env.minify ? true : gutil.env.minify
  const sassopts = {
    outputStyle: 'expanded',
    includePaths: require('bourbon').includePaths
  }
  gulp.src('./src/sass/app.scss')
    .pipe(gulpif(minify, srcmap.init()))
    .pipe(sass(sassopts))
    .pipe(prefix())
    .pipe(gulpif(minify, gulp.dest(`${opts.dist}assets/styles`)))
    .pipe(gulpif(minify, cssmin()))
    .pipe(gulpif(minify, rename({extname: '.min.css'})))
    .pipe(gulpif(minify, srcmap.write('.')))
    .pipe(gulp.dest(`${opts.dist}assets/styles`))
  done()
})

// Build Application Frontend
gulp.task('app', function (done) {
  let minify = !gutil.env.minify ? true : gutil.env.minify

  gulp.src(`${opts.src}*.html`)
    .pipe(gulpif(minify, htmlmin()))
    .pipe(flatten())
    .pipe(gulp.dest(opts.dist))

  gulp.src(`${opts.src}app.js`)
    .pipe(vname())
    .pipe(webpack(opts.webpack))
    .pipe(annotate())
    .pipe(strip())
    .pipe(srcmap.init({loadMaps: true}))
    .pipe(gulpif(minify, gulp.dest(`${opts.dist}assets/scripts`)))
    .pipe(gulpif(minify, uglify({mangle: false})))
    .pipe(gulpif(minify, rename({extname: '.min.js'})))
    .pipe(srcmap.write('.'))
    .pipe(gulp.dest(`${opts.dist}assets/scripts`))
  done()
})

gulp.task('bower', function (done) {
  let minify = !gutil.env.minify ? true : gutil.env.minify
  gulp.src(bower(['**/*.js']))
    .pipe(strip())
    .pipe(jscat('app.vendor.js'))
    .pipe(gulpif(minify, gulp.dest(`${opts.dist}assets/scripts`)))
    .pipe(gulpif(minify, uglify({mangle: false})))
    .pipe(gulpif(minify, rename({extname: '.min.js'})))
    .pipe(srcmap.write('.'))
    .pipe(gulp.dest(`${opts.dist}assets/scripts`))
  done()
})

gulp.task('dev', ['app', 'bower', 'styles'], function (done) {
  gulp.watch(`${opts.src}**/*.{html,js,scss,css}`, ['app', 'styles'])
  done()
})

gulp.task('heroku:production', ['bower', 'app', 'styles'])
gulp.task('default', ['clean', 'bower', 'app', 'styles'])
