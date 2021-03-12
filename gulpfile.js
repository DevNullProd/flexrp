var gulp = require("gulp");
var sass = require("gulp-sass");
var cleanCss = require("gulp-clean-css");

//compile scss into css
function style() {
  return gulp
    .src("scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(cleanCss())
    .pipe(gulp.dest("css"));
}
exports.style = style;

function watch() {
  gulp.watch("scss/**/*.scss", style);
}
exports.watch = watch;

exports.default = watch;
