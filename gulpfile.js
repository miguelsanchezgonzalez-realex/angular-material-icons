'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    $ = require('gulp-load-plugins')({lazy: true});

const icons = require( './icons.js' );
const minimist = require( 'minimist' );

gulp.task('lint', function() {
    return gulp.src([
        'angular-material-icons.js',
        'demo.js'
    ])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}));
});

gulp.task('minify', function() {

    const args = minimist( process.argv.slice( 2 ) );
    let injectedIcons = Object.assign( {}, icons );

    if ( args.icons ) {
        injectedIcons = args.icons
            .split( ',' )
            .reduce( ( reducedIcons, iconName ) =>
                Object.assign( {}, { [ iconName ]: icons[ iconName ] }, reducedIcons ),
                {}
            );
    }

    return gulp.src( 'angular-material-icons.js' )
        .pipe( $.replace( '/* GULP_SHAPES */', JSON.stringify( injectedIcons ) ) )
        .pipe($.uglify())
        .pipe($.rename('angular-material-icons.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['lint', 'minify']);

module.exports = gulp;
