'use strict'

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gfinclude = require('gulp-file-include'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    wait = require('gulp-wait'),
    plumber = require('gulp-plumber'),
    babel = require('gulp-babel'),
    newer = require('gulp-newer'),
    spritesmith = require('gulp.spritesmith'),
    rigger = require('gulp-rigger'),
    iconfont = require('gulp-iconfont'),
    iconfontcss = require('gulp-iconfont-css'),
    compress = require('compression'),
    reload = browserSync.reload
    
    
var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        sprites: 'src/img/',
        spritesCss: 'src/scss/common/',
        iconfont: 'src/fonts/',
        ajax: 'build/ajax/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        scss: 'src/scss/*.scss',
        img: ['src/img/**/*.*', '!src/img/sprites/*.*', '!src/img/iconfont/*.svg'],
        fonts: 'src/fonts/**/*.*',
        sprites: 'src/img/sprites/*.*',
        iconfont: 'src/img/iconfont/*.svg',
        ajax: 'src/ajax/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: ['src/js/**/*.js', 'src/modules/**/*.js'],
        scss: ['src/scss/**/*.**css','src/modules/**/*.**css'],
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        sprites: 'src/img/sprites/*.*',
        iconfont: 'src/img/iconfont/*.svg',
        ajax: 'src/ajax/*.*'       
    },
    clean: './build'
}

var config = {
    server: {
        baseDir: './build'
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: 'build',
    open: false,
    middleware: function (req, res, next) {
        var gzip = compress()
        gzip(req, res, next)
   }
}


gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/modules/',
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}))
})


gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gfinclude({
            prefix: '@@',
            basepath: 'src/js/'
        }))
        .pipe(babel({
            presets: [
                [
                    '@babel/env'
                ]
            ]
        })) 
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
})

gulp.task('scss:build', function () {
    gulp.src(path.src.scss)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(wait(300))
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
})


gulp.task('image:build', function () {
    return gulp.src(path.src.img)
        .pipe(plumber())
        .pipe(newer(path.build.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}))
})

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fonts))
})

gulp.task('sprites:build', function () {
    var spriteData =
        gulp.src(path.src.sprites)
            .pipe(plumber())
            .pipe(spritesmith({
                imgName: 'sprites.png',
                cssName: 'sprites.scss',
                cssFormat: 'css',
                padding: 10
            }))
    spriteData.img.pipe(gulp.dest(path.build.sprites))
    spriteData.css.pipe(gulp.dest(path.build.spritesCss))
})

gulp.task('iconfont:build', function () {
    gulp.src([path.src.iconfont])
        .pipe(plumber())
        .pipe(iconfontcss({
            fontName: 'iconfont',
            targetPath: '../scss/common/_iconfont.scss',
            fontPath: '../fonts/',
            cssClass: 'iconfont',
            formats: ['eot', 'ttf']
        }))
        .pipe(iconfont({
            fontName: 'iconfont',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            fontHeight: 1024,
            normalize: true
        }))
        .pipe(gulp.dest(path.build.iconfont))
})

gulp.task('ajax:build', function() {
    gulp.src(path.src.ajax)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.ajax))
})

gulp.task('build', [
    'html:build',
    'js:build',
    'sprites:build',
    'iconfont:build',
    'image:build',
    'scss:build',
    'fonts:build',
    'ajax:build'
])

gulp.task('watch', function () {
    watch([path.watch.html], function () {
        gulp.start('html:build')
    })
    watch(path.watch.scss, function () {
        gulp.start('scss:build')
    })
    watch(path.watch.js, function () {
        gulp.start('js:build');
    })
    watch([path.watch.img], function () {
        gulp.start('image:build')
    })
    watch([path.watch.fonts], function () {
        gulp.start('fonts:build')
    })
    watch([path.watch.sprites], function () {
        gulp.start('sprites:build')
    })
    watch([path.watch.iconfont], function () {
        gulp.start('iconfont:build')
    })
    watch([path.watch.ajax], function () {
        gulp.start('ajax:build')
    })
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb)
})

gulp.task('webserver', function () {
    browserSync(config)
});
gulp.task('default', ['build', 'webserver', 'watch'])
