const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const rimraf = require('rimraf');
const deleteEmpty = require('delete-empty');

const packages = {
    'x-a': ts.createProject('packages/x-a/tsconfig.json'),
    'x-b': ts.createProject('packages/x-b/tsconfig.json'),
};
const modules = Object.keys(packages);
const source = 'packages';
const distId = process.argv.indexOf('--dist');
const dist = distId < 0 ? source : process.argv[distId + 1];

gulp.task('default', function () {
    modules.forEach(module => {
        gulp.watch([`${source}/${module}/src/**/*.ts`, `${source}/${module}/src/*.ts`], gulp.series(module + ':dev'));
    });
    // done();
});

gulp.task('copy-misc', function () {
    return gulp
        .src(['LICENSE', '.npmignore'])
        .pipe(gulp.dest(`${source}/x-a`))
        .pipe(gulp.dest(`${source}/x-b`));
});

gulp.task('clean:output', function (done) {
    // const dirs = [];
    modules.forEach(module => {
        rimraf.sync(`${source}/${module}/dist`);
        rimraf.sync(`${source}/${module}/coverage`);
    });
    done();

    // return gulp
    //     .src([`${source}/**/*.js`, `${source}/**/*.d.ts`, `${source}/**/*.js.map`], {
    //         read: false,
    //     })
    //     .pipe(clean());
});

gulp.task('clean:dirs', function (done) {
    deleteEmpty.sync(`${source}/`);
    done();
});

gulp.task('clean:bundle', gulp.series('clean:output', 'clean:dirs'));

modules.forEach(module => {
    gulp.task(module, () => {
        return packages[module]
            .src()
            .pipe(packages[module]())
            .pipe(gulp.dest(`packages/${module}/dist`));
        // .pipe(gulp.dest(`${dist}/${module}`));
    });
});

modules.forEach(module => {
    gulp.task(module + ':dev', () => {
        return (
            packages[module]
                .src()
                .pipe(sourcemaps.init())
                .pipe(packages[module]())
                .pipe(sourcemaps.mapSources(sourcePath => './' + sourcePath.split('/').pop()))
                .pipe(sourcemaps.write('.'))
                // .pipe(gulp.dest(`${dist}/${module}`));
                .pipe(gulp.dest(`packages/${module}/dist`))
        );
    });
});

gulp.task('common:dev', gulp.series(modules.map(module => module + ':dev').concat(['default'])));
gulp.task('build', gulp.series(modules));
gulp.task('build:dev', gulp.series('common:dev'));
// gulp.task('watch', gulp.series('default'));
