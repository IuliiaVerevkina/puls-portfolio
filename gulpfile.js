const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const terser = require('gulp-terser');


gulp.task('server', function () {

	browserSync({
		server: {
			baseDir: "dist"
		}
	});
	gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function () {
	return gulp.src("src/scss/**/*.+(scss|sass)")
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer())
		.pipe(cleanCSS({ compatibility: 'ie8' }))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
});

gulp.task('watch', function () {
	gulp.watch("src/scss/**/*.+(scss|sass|css)", gulp.parallel('styles'));
	gulp.watch("src/*.html").on('change', gulp.parallel("html"));
	gulp.watch("src/js/**/*.js").on('change', gulp.parallel("scripts"));
});

gulp.task("html", function () {
	return gulp.src("src/*.html")
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist/'));
});

gulp.task("scripts", function () {
	return gulp.src("src/js/**/*.js")
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(terser())
		.pipe(concat("index.min.js"))
		.pipe(gulp.dest('dist/js'));
});

gulp.task("icons", function () {
	return gulp.src("src/icons/**/*")
		.pipe(gulp.dest('dist/icons'));
});

gulp.task("mailer", function () {
	return gulp.src("src/mailer/**/*")
		.pipe(gulp.dest('dist/mailer'));
});

gulp.task("images", function () {
	return gulp.src("src/img/**/*")
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', "html", "scripts", "icons", "mailer", "images"));