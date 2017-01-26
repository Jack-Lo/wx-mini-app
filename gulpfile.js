var gulp = require('gulp')
var gutil = require('gulp-util')

var rename = require('gulp-rename')
var swig = require('gulp-swig')
var sass = require('gulp-sass')
var cached = require('gulp-cached')
var remember = require('gulp-remember')
var watch = require('gulp-watch')
var plumber = require('gulp-plumber')
var del = require('del')
var download = require('download-git-repo')
var Processing = require('./build/processing')
var fs = require('fs')

var distDir = 'dist'
var styleExt = '.scss'
var tplExt = '.swig'

gulp.task('js', () => {
  return gulp.src(['app/**/*.js', '!app/common/**/*.js'])
  .pipe(plumber())
  .pipe(cached('js'))
  // .pipe(remember('js'))
  .pipe(gulp.dest(distDir))
})

gulp.task('json', () => {
  return gulp.src(['app/**/*.json', '!app/common/**/*.json'])
  .pipe(plumber())
  .pipe(cached('json'))
  // .pipe(remember('json'))
  .pipe(gulp.dest(distDir))
})

gulp.task('style', () => {
  return gulp.src(['app/**/*' + styleExt, '!app/common/**/*' + styleExt])
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(cached('style'))
  // .pipe(remember('style'))
  .pipe(rename({
    extname: '.wxss'
  }))
  .pipe(gulp.dest(distDir))
})

gulp.task('tpl', () => {
  return gulp.src(['app/**/*' + tplExt, '!app/common/**/*' + tplExt])
  .pipe(plumber())
  .pipe(swig({
    defaults: {
      cache: false,
      varControls: ['{*', '*}']
    }
  }))
  .pipe(cached('tpl'))
  // .pipe(remember('tpl'))
  .pipe(rename({
    extname: '.wxml'
  }))
  .pipe(gulp.dest(distDir))
})

gulp.task('clean', () => {
  return del(['dist/**', '!dist'])
  // .then(() => {})
})

gulp.task('trans:style', () => {
  return gulp.src('dist/**/*.wxss')
  .pipe(rename({
    extname: styleExt
  }))
  .pipe(gulp.dest('dist'))
})

gulp.task('trans:tpl', () => {
  return gulp.src('dist/**/*.wxml')
  .pipe(rename({
    extname: tplExt
  }))
  .pipe(gulp.dest('dist'))
})

gulp.task('trans', ['trans:style', 'trans:tpl'], () => {
  return del(['dist/**/*.wxss', 'dist/**/*.wxml'])
})

gulp.task('init', ['clean'], () => {
  return gulp.start(['js', 'json', 'style', 'tpl'])
})

gulp.task('build', ['clean'], () => {
  return gulp.start(['js', 'json', 'style', 'tpl'])
})

gulp.task('dev', ['init'], () => {
  watch('app/**/*.js', (event) => {
    gulp.start('js')
  })

  watch('app/**/*.json', (event) => {
    gulp.start('json')
  })

  watch('app/**/*.scss', (event) => {
    gulp.start('style')
  })

  watch('app/**/*.swig', (event) => {
    gulp.start('tpl')
  })
})

gulp.task('qs', () => {
  var loading = new Processing('[-] loading quick-start project')

  fs.readdir('./app', function(err, files) {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.mkdirSync('./app')
        files = []
      } else {
        throw err
      }
    }

    if (files.length > 0) {
      console.log('[-] The `app` already exists, please empty or delete this folder and try again.')
    } else {
      loading.start()

      download('jack-Lo/wx-mini-app-quick-start', 'qs_tmp', (err) => {
        if (err) {
          throw err
        }

        loading.stop()
        loading.stream.moveCursor(0, -1)
        console.log('[-] done!')

        gulp.start('qs:clean')
      })
    }
  })
})

gulp.task('qs:copy', () => {
  return gulp.src('qs_tmp/p1/**')
  .pipe(gulp.dest('app'))
})

gulp.task('qs:clean', ['qs:copy'], () => {
  del('qs_tmp')
})

gulp.task('gitRemove', () => {
  return del('.git/**')
})