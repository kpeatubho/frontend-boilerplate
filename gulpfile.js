'use strict'

// Common settings
const settings = {
    fontsGen: true
}

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    gfinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    browsersync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    rigger = require('gulp-rigger'),
    giconfont = require('gulp-iconfont'),
    giconfontcss = require('gulp-iconfont-css'),
    compress = require('compression'),
    minify = require('gulp-minifier'),
    gulpClean = require('gulp-clean'),
    fontgen = require('gulp-fontgen'),
    globImporter = require('node-sass-glob-importer'),
    fs = require('fs')
    
var path = {
    build: {
        html: 'build/',
        htmlDesktop: 'build/desktop/',
        htmlTablet: 'build/tablet/',
        htmlMobile: 'build/mobile/',
        js: 'build/assets/js/',
        jsDesktop: 'build/assets/desktop/js/',
        jsTablet: 'build/assets/tablet/js/',
        jsMobile: 'build/assets/mobile/js/',
        css: 'build/assets/css/',
        cssDesktop: 'build/assets/desktop/css/',
        cssTablet: 'build/assets/tablet/css/',
        cssMobile: 'build/assets/mobile/css/',
        img: 'build/assets/img/',
        imgDesktop: 'build/assets/desktop/img/',
        imgTablet: 'build/assets/tablet/img/',
        imgMobile: 'build/assets/mobile/img/',
        fontsTTF: 'src/assets/fonts/',
        fonts: 'build/assets/fonts/',
        fontsDesktopTTF: 'src/assets/desktop/fonts/',
        fontsDesktop: 'build/assets/desktop/fonts/',
        fontsTabletTTF: 'src/assets/tablet/fonts/',
        fontsTablet: 'build/assets/tablet/fonts/',
        fontsMobileTTF: 'src/assets/mobile/fonts/',
        fontsMobile: 'build/assets/mobile/fonts/',
        iconfont: 'src/assets/fonts/',
        iconfontDesktop: 'src/assets/desktop/fonts/',
        iconfontTablet: 'src/assets/tablet/fonts/',
        iconfontMobile: 'src/assets/mobile/fonts/',
        ajax: 'build/ajax/',
        common: 'build/'
    },
    src: {
        html: 'src/pages/*.html',
        htmlDesktop: 'src/pages/desktop/*.html',
        htmlTablet: 'src/pages/tablet/*.html',
        htmlMobile: 'src/pages/mobile/*.html',
        js: 'src/assets/js/*.js',
        jsDesktop: 'src/assets/desktop/js/*.js',
        jsTablet: 'src/assets/tablet/js/*.js',
        jsMobile: 'src/assets/mobile/js/*.js',
        scss: 'src/assets/scss/*.scss',
        scssDesktop: 'src/assets/desktop/scss/*.scss',
        scssTablet: 'src/assets/tablet/scss/*.scss',
        scssMobile: 'src/assets/mobile/scss/*.scss',
        img: ['src/assets/img/**/*.*', '!src/assets/img/iconfont/*.svg'],
        imgDesktop: ['src/assets/desktop/img/**/*.*', '!src/assets/desktop/img/iconfont/*.svg'],
        imgTablet: ['src/assets/tablet/img/**/*.*', '!src/assets/tablet/img/iconfont/*.svg'],
        imgMobile: ['src/assets/mobile/img/**/*.*', '!src/assets/desktop/img/iconfont/*.svg'],
        fontsTTF: 'src/assets/fonts/**/*.{ttf,otf}',
        fonts: ['src/assets/fonts/**/*.*', '!src/assets/fonts/**/*.css'],
        fontsDesktopTTF: 'src/assets/desktop/fonts/**/*.{ttf,otf}',
        fontsDesktop: ['src/assets/desktop/fonts/**/*.*', '!src/assets/desktop/fonts/**/*.css'],
        fontsTabletTTF: 'src/assets/tablet/fonts/**/*.{ttf,otf}',
        fontsTablet: ['src/assets/tablet/fonts/**/*.*', '!src/assets/tablet/fonts/**/*.css'],
        fontsMobileTTF: 'src/assets/mobile/fonts/**/*.{ttf,otf}',
        fontsMobile: ['src/assets/mobile/fonts/**/*.*', '!src/assets/mobile/fonts/**/*.css'],
        iconfont: ['src/assets/img/iconfont/*.svg'],
        iconfontDesktop: 'src/assets/desktop/img/iconfont/*.svg',
        iconfontTablet: 'src/assets/tablet/img/iconfont/*.svg',
        iconfontMobile: 'src/assets/mobile/img/iconfont/*.svg',
        ajax: 'src/ajax/*.*',
        common: 'src/common/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: ['src/assets/js/**/*.js', 'src/assets/desktop/js/**/*.js', 'src/assets/tablet/js/**/*.js', 'src/assets/mobile/js/**/*.js', 'src/modules/**/*.js'],
        scss: ['src/assets/scss/**/*.**css', 'src/assets/desktop/scss/**/*.**css', 'src/assets/tablet/scss/**/*.**css', 'src/assets/mobile/scss/**/*.**css', 'src/modules/**/*.**css'],
        img: ['src/assets/img/**/*.*', 'src/assets/desktop/img/**/*.*', 'src/assets/tablet/img/**/*.*', 'src/assets/mobile/img/**/*.*', '!src/assets/img/iconfont/*.svg', '!src/assets/desktop/img/iconfont/*.svg', '!src/assets/tablet/img/iconfont/*.svg', '!src/assets/mobile/img/iconfont/*.svg'],
        fonts: ['src/assets/fonts/*.{ttf,otf}', 'src/assets/desktop/fonts/*.{ttf,otf}', 'src/assets/tablet/fonts/*.{ttf,otf}', 'src/assets/mobile/fonts/*.{ttf,otf}'],
        iconfont: ['src/assets/img/iconfont/*.svg', 'src/assets/desktop/img/iconfont/*.svg', 'src/assets/tablet/img/iconfont/*.svg', 'src/assets/mobile/img/iconfont/*.svg'],
        ajax: 'src/ajax/*.*',
        common: 'src/common/**/*.*'
    },
    clean: [
        'build/'
    ]
}

const syncConfig = {
    server: {
        baseDir: './build'
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: 'build',
    open: false,
    middleware: function (req, res, next) {
        res.setHeader('Cache-Control', 'max-age=86400');
        var gzip = compress()
        gzip(req, res, next)
    }
}

const projectVariables = {
    browserTitle: 'Boilerplate'
}

var context = {
    sourcemap: process.argv.indexOf('--s') != -1?true:false,
    minify: process.argv.indexOf('--nm') != -1?false:true
}

function browserSync(done) {
    browsersync.init(syncConfig)
    done()
}

function reloadBrowser (done) {
    browsersync.reload()
    done()
}

function htmlAll () {
    return gulp
        .src(path.src.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/modules/',
            context: projectVariables
        }))
        .pipe(gulp.dest(path.build.html))
}

function htmlDesktop () {
    return gulp
        .src(path.src.htmlDesktop)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/modules/',
            context: projectVariables
        }))
        .pipe(gulp.dest(path.build.htmlDesktop))
}

function htmlTablet () {
    return gulp
        .src(path.src.htmlTablet)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/modules/',
            context: projectVariables
        }))
        .pipe(gulp.dest(path.build.htmlTablet))
}

function htmlMobile () {
    return gulp
        .src(path.src.htmlMobile)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/modules/',
            context: projectVariables
        }))
        .pipe(gulp.dest(path.build.htmlMobile))
}

var html = gulp.series(gulp.parallel(htmlAll, htmlDesktop, htmlTablet, htmlMobile), reloadBrowser)

var minifyParamsCSS = {}
if (context.minify) {
    minifyParamsCSS.minify = true
    minifyParamsCSS.minifyCSS = true
}
if (context.sourcemap) {
    minifyParamsCSS.minifyCSS = {
        sourceMap: true
    }
}

function scssAll () {
    return gulp
        .src(path.src.scss)
        .pipe(plumber())
        .pipe(sass({
            importer: globImporter()
        }))
        .pipe(prefixer())
        .pipe(minify(minifyParamsCSS))
        .pipe(gulp.dest(path.build.css))
        .pipe(browsersync.stream())
}

function scssDesktop () {
    return gulp
        .src(path.src.scssDesktop)
        .pipe(plumber())
        .pipe(sass({
            importer: globImporter()
        }))
        .pipe(prefixer())
        .pipe(minify(minifyParamsCSS))
        .pipe(gulp.dest(path.build.cssDesktop))
        .pipe(browsersync.stream())
}

function scssTablet () {
    return gulp
        .src(path.src.scssTablet)
        .pipe(plumber())
        .pipe(sass({
            importer: globImporter()
        }))
        .pipe(prefixer())
        .pipe(minify(minifyParamsCSS))
        .pipe(gulp.dest(path.build.cssTablet))
        .pipe(browsersync.stream())
}

function scssMobile () {
    return gulp
        .src(path.src.scssMobile)
        .pipe(plumber())
        .pipe(sass({
            importer: globImporter()
        }))
        .pipe(prefixer())
        .pipe(minify(minifyParamsCSS))
        .pipe(gulp.dest(path.build.cssMobile))
        .pipe(browsersync.stream())
}

var scss = gulp.parallel(scssAll, scssDesktop, scssTablet, scssMobile)

var minifyParamsJS = {}
if (context.minify) {
    minifyParamsJS.minify = true
    minifyParamsJS.minifyJS = true
}
if (context.sourcemap) {
    minifyParamsJS.minifyJS = {
        sourceMap: true
    }
}

function jsAll () {
    return gulp
        .src(path.src.js)
        .pipe(plumber())
        .pipe(rigger({
            cwd: './'
        }))
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/assets/js/'
        }))
        .pipe(minify(minifyParamsJS))
        .pipe(gulp.dest(path.build.js))
        .pipe(browsersync.stream())
}

function jsDesktop () {
    return gulp
        .src(path.src.jsDesktop)
        .pipe(plumber())
        .pipe(rigger({
            cwd: './'
        }))
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/assets/desktop/js/'
        }))
        .pipe(minify(minifyParamsJS))
        .pipe(gulp.dest(path.build.jsDesktop))
        .pipe(browsersync.stream())
}

function jsTablet () {
    return gulp
        .src(path.src.jsTablet)
        .pipe(plumber())
        .pipe(rigger({
            cwd: './'
        }))
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/assets/tablet/js/'
        }))
        .pipe(minify(minifyParamsJS))
        .pipe(gulp.dest(path.build.jsTablet))
        .pipe(browsersync.stream())
}

function jsMobile () {
    return gulp
        .src(path.src.jsMobile)
        .pipe(plumber())
        .pipe(rigger({
            cwd: './'
        }))
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/assets/mobile/js/'
        }))
        .pipe(minify(minifyParamsJS))
        .pipe(gulp.dest(path.build.jsMobile))
        .pipe(browsersync.stream())
}

var js = gulp.parallel(jsAll, jsDesktop, jsTablet, jsMobile)

function imgAll () {
    return gulp
        .src(path.src.img)
        .pipe(plumber())
        .pipe(newer(path.build.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browsersync.stream())
}

function imgDesktop () {
    return gulp
        .src(path.src.imgDesktop)
        .pipe(plumber())
        .pipe(newer(path.build.imgDesktop))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.imgDesktop))
        .pipe(browsersync.stream())
}

function imgTablet () {
    return gulp
        .src(path.src.imgTablet)
        .pipe(plumber())
        .pipe(newer(path.build.imgTablet))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.imgTablet))
        .pipe(browsersync.stream())
}

function imgMobile () {
    return gulp
        .src(path.src.imgMobile)
        .pipe(plumber())
        .pipe(newer(path.build.imgMobile))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.imgMobile))
        .pipe(browsersync.stream())
}

var img = gulp.parallel(imgAll, imgDesktop, imgTablet, imgMobile)

function fontsAll () {
    return gulp
        .src(path.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browsersync.stream())
}

function fontsDesktop () {
    return gulp
        .src(path.src.fontsDesktop)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fontsDesktop))
        .pipe(browsersync.stream())
}

function fontsTablet () {
    return gulp
        .src(path.src.fontsTablet)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fontsTablet))
        .pipe(browsersync.stream())
}

function fontsMobile () {
    return gulp
        .src(path.src.fontsMobile)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fontsMobile))
        .pipe(browsersync.stream())
}

function fontsAllGen () {
    return gulp
        .src(path.src.fontsTTF)
        .pipe(plumber())
        .pipe(fontgen({
            dest: path.build.fontsTTF,
            css_fontpath: '../fonts/',
            collate: true
        }))
}

function fontsDesktopGen () {
    return gulp
        .src(path.src.fontsDesktopTTF)
        .pipe(plumber())
        .pipe(fontgen({
            dest: path.build.fontsDesktopTTF,
            css_fontpath: '../fonts/',
            collate: true
        }))
}

function fontsTabletGen () {
    return gulp
        .src(path.src.fontsTabletTTF)
        .pipe(plumber())
        .pipe(fontgen({
            dest: path.build.fontsTabletTTF,
            css_fontpath: '../fonts/',
            collate: true
        }))
}

function fontsMobileGen () {
    return gulp
        .src(path.src.fontsMobileTTF)
        .pipe(plumber())
        .pipe(fontgen({
            dest: path.build.fontsMobileTTF,
            css_fontpath: '../fonts/',
            collate: true
        }))
}

function generateFontsCss (done) {
    let outputCss = []
    fs.readdirSync(path.build.fontsTTF).forEach(file => {
        let stats = fs.lstatSync([path.build.fontsTTF, file].join(''))
        if (stats.isDirectory()) {
            outputCss.push('@import \'../../fonts/' + file + '/' + file + '\';')
        }
    })
    let outputFile = [fs.realpathSync([path.build.fontsTTF, '../scss/common/'].join('')), '/_fonts.scss'].join('')
    fs.writeFileSync(outputFile, outputCss.join('\n'))
    done()
}

var fonts
if (settings.fontsGen) {
    fonts = gulp.series(gulp.parallel(fontsAllGen, fontsDesktopGen, fontsTabletGen, fontsMobileGen), generateFontsCss, gulp.parallel(fontsAll, fontsDesktop, fontsTablet, fontsMobile))
} else {
    fonts = gulp.parallel(fontsAll, fontsDesktop, fontsTablet, fontsMobile)
}

function iconfontAll () {
    return gulp
        .src(path.src.iconfont)
        .pipe(plumber())
        .pipe(giconfontcss({
            fontName: 'iconfont',
            targetPath: '../scss/common/_iconfont.scss',
            fontPath: '../fonts/',
            cssClass: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
        }))
        .pipe(giconfont({
            fontName: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            fontHeight: 1024,
            normalize: true
        }))
        .pipe(gulp.dest(path.build.iconfont))
        .pipe(browsersync.stream())
}

function iconfontDesktop () {
    return gulp
        .src(path.src.iconfontDesktop)
        .pipe(plumber())
        .pipe(giconfontcss({
            fontName: 'iconfont',
            targetPath: '../scss/common/_iconfont.scss',
            fontPath: '../fonts/',
            cssClass: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
        }))
        .pipe(giconfont({
            fontName: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            fontHeight: 1024,
            normalize: true
        }))
        .pipe(gulp.dest(path.build.iconfontDesktop))
        .pipe(browsersync.stream())
}

function iconfontTablet () {
    return gulp
        .src(path.src.iconfontTablet)
        .pipe(plumber())
        .pipe(giconfontcss({
            fontName: 'iconfont',
            targetPath: '../scss/common/_iconfont.scss',
            fontPath: '../fonts/',
            cssClass: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
        }))
        .pipe(giconfont({
            fontName: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            fontHeight: 1024,
            normalize: true
        }))
        .pipe(gulp.dest(path.build.iconfontTablet))
        .pipe(browsersync.stream())
}

function iconfontMobile () {
    return gulp
        .src(path.src.iconfontMobile)
        .pipe(plumber())
        .pipe(giconfontcss({
            fontName: 'iconfont',
            targetPath: '../scss/common/_iconfont.scss',
            fontPath: '../fonts/',
            cssClass: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
        }))
        .pipe(giconfont({
            fontName: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            fontHeight: 1024,
            normalize: true
        }))
        .pipe(gulp.dest(path.build.iconfontMobile))
        .pipe(browsersync.stream())
}

var iconfont = gulp.parallel(iconfontAll, iconfontDesktop, iconfontTablet, iconfontMobile)

function ajax () {
    return gulp
        .src(path.src.ajax)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.ajax))
        .pipe(browsersync.stream())
}

function common () {
    return gulp
        .src(path.src.common)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.common))
        .pipe(browsersync.stream())
}

function watch () {
    gulp.watch(path.watch.html, html)
    gulp.watch(path.watch.scss, scss)
    gulp.watch(path.watch.js, js)
    gulp.watch(path.watch.img, img)
    gulp.watch(path.watch.fonts, fonts)
    gulp.watch(path.watch.iconfont, iconfont)
    gulp.watch(path.watch.ajax, ajax)
    gulp.watch(path.watch.common, common)
}

function clean () {
    return gulp
        .src(path.clean, {
            read: false,
            allowEmpty: true
        })
        .pipe(gulpClean())
}

const build = gulp.series(clean, gulp.parallel(html, scss, js, img, fonts, iconfont, ajax, common))
const defaultTask = gulp.series(build, gulp.parallel(browserSync, watch))

exports.default = defaultTask
exports.html = html
exports.scss = scss
exports.js = js
exports.img = img
exports.fonts = fonts
exports.iconfont = iconfont
exports.ajax = ajax
exports.build = build
exports.clean = clean
exports.common = common