var gulp = require('gulp'),
  eslint = require('gulp-eslint')

var files = {
  js: '*.js'
}

gulp.task('eslint', function() {
  return gulp.src(files.js)
    .pipe(eslint())
    .pipe(eslint.format())
})

gulp.task('lint', ['eslint'])
