var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];
//load all of our dependencies
var gulp          = require('gulp');
var gutil         = require('gulp-util');
var concat        = require('gulp-concat');
var uglify        = require('gulp-uglify');
var minify        = require('gulp-minify');
var sass          = require('gulp-sass');
var sourceMaps    = require('gulp-sourcemaps');
var imagemin      = require('gulp-imagemin');
var sasslint      = require('gulp-sass-lint');
var browserSync   = require('browser-sync');
var autoprefixer  = require('gulp-autoprefixer');
var gulpSequence  = require('gulp-sequence').use(gulp);
var clean         = require('gulp-clean');
var plumber       = require('gulp-plumber');
var fs            = require('fs');
var path          = require('path');
var eslint        = require('gulp-eslint');
var csslint       = require('gulp-csslint');
var filter        = require('gulp-filter');
var handlebars    = require('gulp-compile-handlebars');
var rename        = require('gulp-rename');
var useref        = require('gulp-useref');
var gulpif        = require('gulp-if');
var eol           = require('gulp-eol')
var debug         = require('gulp-debug');
var replace       = require('gulp-replace');
var notify        = require('gulp-notify');
var cleanCSS      = require('gulp-clean-css');
var rimraf        = require('rimraf');
var Stubby        = require('stubby').Stubby;
var package       = require('./package.json');
var Pageres       = require('pageres');
var targetDir     = 'target/';
var srcDir        = 'src/';
var tmpDir        = 'tmp/';

require('gulp-stats')(gulp);

// util functions to retrieve all folders within a folder
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

//browser sync task
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: targetDir
    },
    options: {
      reloadDelay: 250
    },
    notify: false,
    open: false,
    port: 8000
  });
});

//compressing images
gulp.task('img', function() {
  gulp.src([srcDir + 'main/webapp/img/**/*'])
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(targetDir + 'img'));
});

// running eslint in js files
gulp.task('eslint', function() {
  return gulp.src([srcDir + 'main/webapp/js/**/*.js', '!' + srcDir + 'main/webapp/js/**/*vendor*'])
    .pipe(eslint({
      options: {
        useEslintrc: true
      }
    }))
    .pipe(plumber())
    .pipe(eslint.format("table"))
    .pipe(eslint.failAfterError());
});



// running scsslint in scss files
gulp.task('scsslint', function() {
  return gulp.src([srcDir + 'main/webapp/scss/**/*.scss', '!' + srcDir + 'main/webapp/scss/**/*vendor*.scss'])
    .pipe(sasslint({
      configFile: 'scsslint.yaml'
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});



//compiling our SCSS files for deployment
gulp.task('css', function() {
  //the initializer / master SCSS file, which will just be a file that imports everything
  var arrFolders = getDirectories(srcDir + 'main/webapp/scss/')
  for (var i in arrFolders) {
    var f = filter(['!' + srcDir + 'main/webapp/scss/' + arrFolders[i] + '/**/*.css'], {
      restore: true
    });
    gulp.src([srcDir + 'main/webapp/scss/' + arrFolders[i] + '/main.scss', srcDir + 'main/webapp/scss/' + arrFolders[i] + '/**/*.css'])
      .pipe(plumber())
      .pipe(debug({title: 'css:'}))
      //.pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      //.pipe(sourcemaps.write('.'))
      .pipe(f)
      .pipe(autoprefixer({
        browsers: autoPrefixBrowserList,
        cascade: true
      }))
      .pipe(f.restore)
      .pipe(cleanCSS())
      .pipe(concat(arrFolders[i] + '_min.css'))
      .pipe(csslint('.csslintrc'))
      .pipe(gulp.dest(targetDir + 'css'))
      .pipe(browserSync.reload({
        stream: true
      }));
  }

});

//migrating over all HTML files for deployment
gulp.task('handlebars', function() {
  return gulp.src(srcDir + 'main/webapp/html/templates/**/*')
    //.pipe(debug({title: 'Processing html:'}))
    .pipe(plumber())
    .pipe(handlebars({
      description: package.info.description,
      url: package.info.url,
      title: package.info.title,
      image: package.info.image,
      og_twitter_description: package.info.og_twitter_description,
      og_facebook_description: package.info.og_facebook_description,
      keywords: package.info.keywords,
      googleTagManager: package.info.googleTagManager
    }, {
      batch: [srcDir + 'main/webapp/html/partials'],
      helpers: {}
    }))
    .pipe(rename(function(path) {
      if (path.extname === '.handlebars') {
        path.extname = ".html"
      }
    }))
    .pipe(eol())
    .pipe(gulp.dest(tmpDir));

});



gulp.task('useref', ['handlebars'], function() {
  return gulp.src(tmpDir + '**/*')
    .pipe(debug({title: 'useref:'}))
    .pipe(useref({
      searchPath: 'src/main/webapp/'
    }))
    .pipe(gulp.dest(targetDir))
    .pipe(browserSync.reload({
      stream: true
    }));

});

//minify
gulp.task('minify', ['handlebars', 'useref'], function() {
  return gulp.src([targetDir + 'js/**.*', '!' + targetDir + 'js/*vendor*.*'])
    .pipe(debug({title: 'minify:'}))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(gulp.dest(targetDir + 'js/'));

});

// copy fonts
gulp.task('fonts', function() {
  return gulp.src(srcDir + 'main/webapp/fonts/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(targetDir + 'fonts'));
});

// copy root files
gulp.task('rootfiles', function() {
  return gulp.src(srcDir + 'main/webapp/rootfiles/**/*')
    .pipe(plumber())
    .pipe(gulp.dest(targetDir));
});


//cleans our dist directory
gulp.task('cleanupTarget', function() {
  return gulp.src(targetDir, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

//cleans our dist directory
gulp.task('cleanupTmp', function() {
  return gulp.src(tmpDir, {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

//cleans our dist directory
gulp.task('pageres', function() {
  var pageres = new Pageres({delay: 2})
      .src('heregoesurl1.com/', ['480x320', '1024x768', 'iphone 5s'], {crop: true})
      .src('heregoesurl1.com/page.html', ['w3counter'], {crop: true})
      .dest('screenshots/')
      .run()
      .then(() => console.log('done creating screenshots'));
});

gulp.task('mockServer', function() {
  var mockSite = new Stubby();
  mockSite.start({
      data: require('./mock/site.json'),
      mute: false,
      stubs: 8001,
      tls: 8443,
      admin: 8010
  });

});

//master task
gulp.task('default', function(cb) {
  return gulpSequence('mockServer', 'browserSync', ['cleanupTarget', 'cleanupTmp'], ['eslint', 'scsslint', 'css', 'img', 'fonts', 'rootfiles'], 'minify', 'pageres', function() {
      gulp.watch(srcDir + 'main/webapp/js/**/*', ['eslint', 'handlebars', 'useref', 'minify']);
      gulp.watch(srcDir + 'main/webapp/scss/**/*', ['css', 'handlebars', 'useref', 'minify']);
      gulp.watch(srcDir + 'main/webapp/img/**', ['img']);
      gulp.watch(srcDir + 'main/webapp/html/**/*', ['handlebars', 'useref', 'minify']);
      cb();
    }
)});
