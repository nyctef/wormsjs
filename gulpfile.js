var gulp = require('gulp')
var eslint = require('gulp-eslint')
var browserify = require('browserify')
var babelify = require('babelify')
var vss = require('vinyl-source-stream')
var gutil = require('gulp-util')

var files = {
  js: './src/*.js',
  dist: './dist/bundle.js',
}
gulp.task('es6', function() {
  browserify({
    entries: 'src/game.js',
    debug: true,
    extensions: ['.js', '.json', '.es6'],
  })
  .transform(babelify.configure({ presets: [ 'es2015' ] }))
  .on('error',gutil.log)
  .bundle()
  .on('error',gutil.log)
  .pipe(vss(files.dist))
  .pipe(gulp.dest(''))
});
 
gulp.task('watch',function() {
  gulp.watch(files.js,['es6'])
});

gulp.task('lint', function() {
  gulp.src(files.js)
  .pipe(eslint())
  .pipe(eslint.format())
})
 
gulp.task('default', ['watch']);
