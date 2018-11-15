const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith'); // все иконки находятся в одной большой картинке и он вырезает их
const sass = require('gulp-sass');
const rimraf= require('rimraf'); // чистит паку буйлд от ненужного

sass.compiler = require('node-sass');

const pug = require('gulp-pug');

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
          port: 9000,
            baseDir: "build" //
        }
    });

  gulp.watch("build/**/*").on("change", browserSync.reload)//
});

gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest('build')) // Выгружаем результата в папку
});

gulp.task('styles:compile', function () {
  return gulp.src('source/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/css'));
});

gulp.task('sprite', function (cb) {
  var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../images/sprite.png',
    cssName: 'sprite.css'
  }));
  spriteData.img.pipe(gulp.dest("build/images/"));//
  spriteData.img.pipe(gulp.dest("source/styles/global/"));
  cb();
});

gulp.task('clean', function del(cb) {
  return rimraf ("build", cb);//
});

//копирование шрифтов в папку билд
gulp.task("copy:fonts", function () {
  return gulp.src("./source/fonts/**/*.*")
  .pipe(gulp.dest("build/images"));//
});


//копирование картинок в папку билд
gulp.task("copy:images", function () {
  return gulp.src("./source/images/**/*.*")
  .pipe(gulp.dest("build/images"));//
});

gulp.task("copy", gulp.parallel("copy:fonts", "copy:images"));

// ватчер который просматривает изменения в папке соурсе и если есть он заново формирует новый файлы в папке билд
gulp.task('watch', function () {
gulp.watch('source/template/**/*.pug', gulp.series("templates:compile"));
gulp.watch('source/styles/**/*.scss', gulp.series("styles:compile"));
});

gulp.task("default", gulp.series(
  "clean",
  gulp.parallel("templates:compile",  "styles:compile", "sprite", "copy"),
  gulp.parallel("watch", "server")
)
);
