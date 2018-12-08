'use strict'

const gulp = require('gulp')
const del = require('del')
const uglify = require('gulp-uglify-es').default

const DIST = './dist'
const SRC = './src/**/*.js'

gulp.task('clean', () => {
  return del([`${DIST}/*`])
})

gulp.task('compress', () => {
  return gulp.src(SRC)
    .pipe(uglify())
    .pipe(gulp.dest(DIST))
})

gulp.task('default', gulp.series('clean', 'compress'))
