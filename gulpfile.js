/// <binding AfterBuild='serve' />
'use strict';

var gulp = require("gulp"),
    rimraf = require("rimraf"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    debug = require('gulp-debug'),
    webserver = require('gulp-webserver'),
    sass = require('gulp-sass'),
    size = require('gulp-size'),
    gulpNgConfig = require('gulp-ng-config'),
    autoprefixer = require("gulp-autoprefixer"),
    plumber = require("gulp-plumber"),
    sourcemaps = require("gulp-sourcemaps"),
    htmlreplace = require('gulp-html-replace'),
    removeLines = require('gulp-remove-lines'),
    rename = require('gulp-rename'),
    //Babel
    babel = require('gulp-babel');

var paths = {
    webroot: "./"
};

paths.approotjs = paths.webroot + "app.js";
paths.approotconfjs = paths.webroot + "app/eruditeconfig.js";
paths.appjs = paths.webroot + "app/**/*.js";
paths.appminJs = paths.webroot + "app/**/*.min.js";
paths.js = paths.webroot + "scripts/**/*.js";
paths.minJs = paths.webroot + "scripts/**/*.min.js";
paths.css = paths.webroot + "css/**/*.css";
paths.minCss = paths.webroot + "css/**/*.min.css";
paths.mockbackendJs = paths.webroot + "mock-backend/**/*.js";

paths.concatJsDest = paths.webroot + "scripts/lib.min.js";
paths.concatappJsDest = paths.webroot + "scripts/site.min.js";
paths.concatCssDest = paths.webroot + "css/site.min.css";
paths.concatMockDest = paths.webroot + "mock-backend/mock.js";

paths.sassSource = paths.webroot + "sass/**/*.scss";
paths.sassDestination = paths.webroot + "css";

paths.kendoUIRoot = paths.webroot + "scripts/kendo-ui/**/*.*";

// Babel Watch task
gulp.task("es6babel", function () {
    return gulp.src("app/**/*.es6.js")
      .pipe(sourcemaps.init())
      .pipe(babel())
      //.pipe(concat("transpiled.babel.js"))
      .pipe(rename(function (path) {
          path.dirname += '/es5';
          path.basename = path.basename.replace('.es6', '.es5');
          path.extname = ".js";
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest("app"));
});

gulp.task("es6babel:watch", function () {
    gulp.watch("app/**/*.es6.js", ['es6babel']);
});

// JS
gulp.task("clean:js", function (cb) {
    rimraf(paths.concatJsDest, cb);
});

gulp.task("min:js", function () {
    return gulp.src([
        "!" + paths.concatappJsDest,
        "!" + paths.concatJsDest, paths.minJs,
        "!./scripts/AngularJS-Toaster/toaster.min.js",
        "!./scripts/angular.treeview.min.js",
        "!./scripts/jquery/dist/jquery.min.js",
        "!" + paths.kendoUIRoot,
        "!./scripts/moment/**/*.min.js",
        "!./scripts/catiline/catiline.min.js",
        "!./scripts/signalr/*",
        "!./scripts/ngDialog/*",
        "!./scripts/angular-ui-calendar/*",
        "!./scripts/angularAMD/*"
    ], { base: "." })
      .pipe(concat(paths.concatJsDest))
    //  .pipe(uglify())
      .pipe(gulp.dest("."));
});

gulp.task("min:devjs", ["config:local"], function () {
    return gulp.src(["!./app/mock-backend.js", paths.appjs, "!" + paths.appminJs, paths.approotjs, "!" + paths.approotconfjs], { base: "." })
      .pipe(removeLines({
          'filters': [
              /[']eruditeApp\.MockBackend[',]/
          ]
      }))
      .pipe(concat(paths.concatappJsDest))
      //.pipe(uglify())
      .pipe(gulp.dest("."));
});

gulp.task("min:mockjs", function () {
    return gulp.src([paths.mockbackendJs, "!" + paths.concatMockDest], { base: "." })
      .pipe(concat(paths.concatMockDest))
      //.pipe(uglify())
      .pipe(gulp.dest("."));
});

// CSS
gulp.task("clean:css", function (cb) {
    rimraf(paths.concatCssDest, cb);
});

gulp.task('sass', function () {
    gulp.src(paths.sassSource)
      .pipe(plumber())
      // .pipe(sourcemaps.init())
      .pipe(sass({
          outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(autoprefixer())
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest('css'));
});

gulp.task('sass:watch', function () {
    gulp.watch(paths.sassSource, ['sass']);
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("min:watch", function () {
    gulp.watch([paths.appjs, "!" + paths.appminJs, paths.approotjs], ["min:devjs"]);
});

gulp.task("min", ["min:js", "min:devjs", "min:mockjs"]);

gulp.task('config:local', function () {
    return gulp.src('eruditeconfig.json')
      .pipe(gulpNgConfig('eruditeApp.Config', {
          environment: 'local',
          wrap: 'define(["angular"], function () {\n return <%= module %> \n});'
      }))
      .pipe(gulp.dest('app/'));
});

gulp.task('config:prod', function () {
    return gulp.src('eruditeconfig.json')
      .pipe(gulpNgConfig('eruditeApp.Config', {
          environment: 'production',
          wrap: 'define(["angular"], function () {\n return <%= module %> \n});'
      }))
      .pipe(gulp.dest('app/'));
});

gulp.task('serve', ["config:local", "min", "sass", "es6babel", "min:watch", "sass:watch"], function () {
    gulp.src('.')
      .pipe(webserver({
          port: 3000,
          //      livereload: true,
          open: true
      }));
});

// gulp.task('style', function() {
//     gulp.src('./assets/sass/**/*.scss')
//       .pipe(plumber())
//       .pipe(sourcemaps.init())
//       .pipe(sass({
//           outputStyle: 'compressed'
//       }).on('error', sass.logError))
//       .pipe(autoprefixer({
//           browsers: ['last 5 versions'],
//           cascade: false
//       }))
//       .pipe(size())
//       .pipe(sourcemaps.write())
//       .pipe(size())
//       .pipe(gulp.dest('assets/css'));
// });

// gulp.task('style:watch', function() {
//     gulp.watch('./assets/sass/**/*.scss', ['style']);
// });

// Deploy Build Task
gulp.task('build:clean', function (cb) {
    rimraf('./build', { force: true }, cb);
});

gulp.task('build:rmock', ['build:copyall'], function () {
    return gulp.src('index.html', { base: '.' })
      .pipe(htmlreplace({
          'mock': 'scripts/site.min.js',
      }))
      .pipe(gulp.dest('build'));
});

gulp.task('build:copyall', ["config:local", "min", "sass", "build:clean"], function () {
    return gulp.src(
      ['./scripts/**/*',
        './app/**/*',
        './css/**/*',
        './sass/**/*',
        './images/**/*',
        './fonts/**/*',
        './favicon.ico',
        './signup.html'
      ], { base: '.' })
      .pipe(gulp.dest('build'));
});

gulp.task('build', ['build:rmock']);

// Mock Tasks

gulp.task("min:devjs-mock", ["config:mock"], function () {
    return gulp.src([paths.appjs, "!" + paths.appminJs, paths.approotjs, paths.approotconfjs], { base: "." })
      .pipe(concat(paths.concatappJsDest))
      //.pipe(uglify())
      .pipe(gulp.dest("."));
});

gulp.task("min-mock:watch-mock", function () {
    gulp.watch([paths.mockbackendJs, "!" + paths.concatMockDest], ["min:mockjs"]);
});

gulp.task("min-mock:watch", function () {
    gulp.watch([paths.appjs, "!" + paths.appminJs, paths.approotjs], ["min:devjs-mock"]);
});

gulp.task("min-mock", ["min:js", "min:devjs-mock", "min:mockjs"]);

gulp.task('config:mock', function () {
    return gulp.src('eruditeconfig.json')
      .pipe(gulpNgConfig('eruditeApp.Config', {
          environment: 'mock'
      }))
      .pipe(gulp.dest('app/'));
});

gulp.task('serve-mock', ["config:mock", "min-mock", "sass", "min-mock:watch", "min-mock:watch-mock", "sass:watch"], function () {
    gulp.src('.')
      .pipe(webserver({
          port: 3000,
          //      livereload: true,
          open: true
      }));
});
