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
//from gulp-jest package website
const jestTask = (done) => {
    process.env.NODE_ENV = 'test';
    gulp.src('tests').pipe(jest({
      "preprocessorIgnorePatterns": [
        "<rootDir>/dist/", "<rootDir>/node_modules/"
      ],
      "automock": false
    }));
    done();
};

const build = gulp.parallel(jsTask, lintTask, jestTask);
const herokuBuild = gulp.parallel(jsTask);

const watch = (done) => {
    gulp.watch(['./client/*.js', './client/*.jsx'], jsTask);
    nodemon({ 
        script: './server/app.js',
        tasks: ['lintTask', 'jestTask'],
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