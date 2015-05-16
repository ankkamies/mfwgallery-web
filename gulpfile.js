var browserify = require('browserify'),
    browserSync = require('browser-sync'),
    chalk = require('chalk'),
    CSSmin = require('gulp-minify-css'),
    ecstatic = require('ecstatic'),
    filter = require('gulp-filter'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    jade = require('gulp-jade'),
    path = require('path'),
    prefix = require('gulp-autoprefixer'),
    prettyTime = require('pretty-hrtime'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    streamify = require('gulp-streamify'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify'),
    production = process.env.NODE_ENV === 'production';

config = {
  scripts: {
    source: './src/js/app.js',
    extensions: ['.js'],
    destination: './public/js/',
    filename: 'bundle.js'
  },
  templates: {
    source: './src/jade/**/*.jade',
    watch: './src/jade/**/*.jade',
    destination: './public/'
  },
  styles: {
    source: './src/stylus/style.styl',
    watch: './src/stylus/*.styl',
    destination: './public/css/'
  },
  assets: {
    source: './src/assets/**/*.*',
    watch: './src/assets/**/*.*',
    destination: './public/'
  }
};

handleError = function(err) {
  gutil.log(err);
  gutil.beep();
  return this.emit('end');
};

gulp.task('scripts', function() {
  var build, bundle;
  bundle = browserify({
    entries: [config.scripts.source],
    extensions: config.scripts.extensions,
    debug: !production
  });
  build = bundle.bundle().on('error', handleError).pipe(source(config.scripts.filename));
  if (production) {
    build.pipe(streamify(uglify()));
  }
  return build.pipe(gulp.dest(config.scripts.destination));
});

gulp.task('templates', function() {
  var pipeline;
  pipeline = gulp.src(config.templates.source).pipe(jade({
    pretty: !production
  })).on('error', handleError).pipe(gulp.dest(config.templates.destination));
  if (!production) {
    pipeline = pipeline.pipe(browserSync.reload({
      stream: true
    }));
  }
  return pipeline;
});

gulp.task('styles', function() {
  var styles;
  styles = gulp.src(config.styles.source);
  if (!production) {
    styles = styles.pipe(sourcemaps.init());
  }
  styles = styles.pipe(stylus({
    'include css': true
  })).on('error', handleError).pipe(prefix('last 2 versions', 'Chrome 34', 'Firefox 28', 'iOS 7'));
  if (production) {
    styles = styles.pipe(CSSmin());
  }
  if (!production) {
    styles = styles.pipe(sourcemaps.write('.'));
  }
  styles = styles.pipe(gulp.dest(config.styles.destination));
  if (!production) {
    styles = styles.pipe(filter('**/*.css')).pipe(browserSync.reload({
      stream: true
    }));
  }
  return styles;
});

gulp.task('assets', function() {
  return gulp.src([config.assets.source, 'bower_components/bootstrap/dist/fonts*/*', 'bower_components/bootstrap/dist/css*/*.map']).pipe(gulp.dest(config.assets.destination));
});

gulp.task('server', function() {
  return browserSync({
    port: 9001,
    server: {
      baseDir: './public'
    }
  });
});

gulp.task('watch', function() {
  var bundle;
  gulp.watch(config.templates.watch, ['templates']);
  gulp.watch(config.styles.watch, ['styles']);
  gulp.watch(config.assets.watch, ['assets']);
  bundle = watchify(browserify({
    entries: [config.scripts.source],
    extensions: config.scripts.extensions,
    debug: !production,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));
  return bundle.on('update', function() {
    var build, start;
    gutil.log("Starting '" + (chalk.cyan('rebundle')) + "'...");
    start = process.hrtime();
    build = bundle.bundle().on('error', handleError).pipe(source(config.scripts.filename));
    build.pipe(gulp.dest(config.scripts.destination)).pipe(browserSync.reload({
      stream: true
    }));
    return gutil.log("Finished '" + (chalk.cyan('rebundle')) + "' after " + (chalk.magenta(prettyTime(process.hrtime(start)))));
  }).emit('update');
});

gulp.task('no-js', ['templates', 'styles', 'assets']);
gulp.task('build', ['scripts', 'no-js']);
gulp.task('default', ['watch', 'no-js', 'server']);