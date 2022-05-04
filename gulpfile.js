const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync");
const rigger = require("gulp-rigger");
const cleanCSS = require("gulp-clean-css");
const rimraf = require("gulp-rimraf");
const plumber = require("gulp-plumber");
const babel = require("gulp-babel");
const webpackStream = require("webpack-stream");

const path = {
  build: {
    html: "build/",
    js: "build/js/",
    css: "build/styles/css/",
    img: "build/assets/",
    fonts: "build/fonts/",
  },
  src: {
    html: "src/*.html",
    js: "src/js/*.js",
    style: "src/styles/*.*",
    img: "src/assets/**/*.*",
    fonts: "src/fonts/**/*.*",
  },
  watch: {
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    css: "src/style/**/*.scss",
    img: "src/assets/**/*.*",
    fonts: "srs/fonts/**/*.*",
  },
  clean: "./build/*",
};

gulp.task("html:build", function () {
  return gulp
    .src(path.src.html) // выбор всех html файлов по указанному пути
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(gulp.dest(path.build.html)); // выкладывание готовых файлов
});
gulp.task("css", function (done) {
  gulp
    .src(["src/styles/*.scss", "!src/styles/index.scss"])
    .pipe(sass())
    .pipe(autoprefixer("last 2 versions", "ie 10", "ie 11"))
    .pipe(gulp.dest("src/styles/css"));

  done();
});
gulp.task("index.css:dev", function (done) {
  gulp
    .src("src/styles/index.scss")
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(sass())
    .pipe(autoprefixer("last 2 versions", "ie 10", "ie 11"))
    .pipe(cleanCSS())
    .pipe(gulp.dest("src/styles/css"));

  done();
});
gulp.task("index.css:build", function (done) {
  gulp
    .src("src/styles/index.scss")
    .pipe(plumber()) // отслеживание ошибок
    .pipe(rigger()) // импорт вложений
    .pipe(sass())
    .pipe(autoprefixer("last 2 versions", "ie 10", "ie 11"))
    .pipe(cleanCSS())
    .pipe(gulp.dest(path.build.css));

  done();
});
gulp.task("css:dev", gulp.series("css", "index.css:dev"));
gulp.task("css:build", gulp.series("css", "index.css:build"));

gulp.task("js:build", function (done) {
  gulp
    .src(path.src.js)
    .pipe(webpackStream(require("./webpack.config.js")))
    // .pipe(plumber()) // отслеживание ошибок
    // .pipe(
    //   babel({
    //     presets: [
    //       [
    //         "@babel/preset-env",
    //         {
    //           targets: ["last 2 versions", "ie >= 9"],
    //         },
    //       ],
    //     ],
    //     plugins: [["@babel/transform-runtime"]],
    //   })
    // )
    // .pipe(uglify())
    .pipe(gulp.dest(path.build.js));

  done();
});

gulp.task("fonts:build", function () {
  return gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts));
});

gulp.task("img:build", function () {
  return gulp.src(path.src.img).pipe(gulp.dest(path.build.img));
});

gulp.task("clean:build", function () {
  return gulp.src(path.clean, { read: false }).pipe(rimraf());
});
// сборка
gulp.task(
  "build",
  gulp.series("clean:build", gulp.parallel("html:build", "css:build", "js:build", "fonts:build", "img:build"))
);

gulp.task("browser-sync", function (done) {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });

  browserSync.watch("src/").on("change", browserSync.reload);

  done();
});

gulp.task(
  "watch",
  gulp.series("css:dev", "browser-sync", function (done) {
    gulp.watch("src/styles/*.scss", gulp.series("css:dev"));

    done();
  })
);

gulp.task("default", gulp.series("watch"));
