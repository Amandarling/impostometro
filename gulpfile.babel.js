import {
    src,
    dest,
    watch,
    series,
    parallel,
} from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import gulpwebpack from 'webpack-stream';
import webpack from 'webpack';
import uglify from 'gulp-uglify';
import named from 'vinyl-named';
import browserSync from 'browser-sync';

const path = require('path');

const PRODUCTION = yargs.argv.prod;
const server = browserSync.create();

// BrowserSync server
export const serve = (done) => {
    server.init({
        notify: false,
        server: {
            baseDir: './',
        },
    });
    done();
};

// BrowserSync reload
export const reload = (done) => {
    server.reload();
    done();
};

// Clean dist
export const clean = () => del(['dist']);

// Styles
export const styles = () => src(['src/scss/bundle.scss'])
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
    .pipe(gulpif(PRODUCTION, cleanCss({
        compatibility: 'ie8',
    })))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(server.stream());

// Images
export const images = () => src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/images'));

// Copy files
export const copy = () => src(['src/**/*', '!src/{images,scss}', '!src/{images,scss}/**/*'])
    .pipe(dest('dist'));

// Scripts
export const scripts = () => src(['src/js/bundle.js'])
    .pipe(named())
    .pipe(gulpwebpack({
        module: {
            rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            }],
        },
        mode: PRODUCTION ? 'production' : 'development',
        devtool: !PRODUCTION ? 'inline-source-map' : false,
        output: {
            filename: '[name].js',
        },
    }))
    .pipe(gulpif(PRODUCTION, uglify()))
    .pipe(dest('dist/js'));

// Watch
export const watchForChanges = () => {
    watch('src/scss/**/*.scss', styles);
    watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
    watch(['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'], series(copy, reload));
    watch('src/js/**/*.js', series(scripts, reload));
    watch('**/*.html', reload);
};

// Tasks
export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, scripts));
export default dev;
