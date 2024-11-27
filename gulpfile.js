const gulp = require('gulp');
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint-new');
const webpackConfig = require('./webpack.config.js');
const jest = require('gulp-jest').default;

const jsTask = (done) => {
    webpack(webpackConfig)
        .pipe(gulp.dest('./hosted'));
    
    done();
}
  
const lintTask = (done) => {
    gulp.src('./server/**/*.js')
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
    
    done();
}

const jestTask = (done) => {
    process.env.NODE_ENV = 'test';
    gulp.src('__tests__').pipe(jest({
      "preprocessorIgnorePatterns": [
        "<rootDir>/dist/", "<rootDir>/node_modules/"
      ],
      "automock": false
    }));
};

const build = gulp.parallel(jsTask, lintTask);
const herokuBuild = gulp.parallel(jsTask);

const watch = (done) => {
    gulp.watch(['./client/*.js', './client/*.jsx'], jsTask);
    nodemon({ 
        script: './server/app.js',
        tasks: ['lintTask'],
        watch: ['./server'],
        done: done
    });
}



module.exports = {
    build,
    jsTask,
    lintTask,
    jestTask,
    watch,
    herokuBuild,
};