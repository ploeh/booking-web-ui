// Generated on 2014-01-17 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/unit/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/unit/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically.
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times.
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks.
    grunt.initConfig({

        // Project settings.
        booking: {
            // Configurable paths.
            app: require('./bower.json').appPath || 'app',
            dist: 'dist'
        },

        typescript: {
            base: {
                src: ['<%= booking.app %>/js/{,*/}*.ts'],
                options: {
                    target: 'es5',
                    sourceMap: true
                }
            },
            test: {
                src: ['test/unit/{,*/}*.ts'],
                options: {
                    target: 'es5',
                    sourceMap: true
                }
            }
        },

        // Watches files for changes and runs tasks based on the changed files.
        watch: {
            ts: {
                files: ['<%= booking.app %>/js/{,*/}*.ts'],
                tasks: ['typescript']
            },
            tsTest: {
                files: ['test/unit/{,*/}*.ts'],
                tasks: ['typescript:test']
            },
            js: {
                files: ['<%= booking.app %>/js/{,*/}*.js'],
                //tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/unit/{,*/}*.js'],
                //tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= booking.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= booking.app %>/{,*/}*.html',
                    '.tmp/css/{,*/}*.css',
                    '<%= booking.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings.
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= booking.app %>'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= booking.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= booking.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes.
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= booking.app %>/js/{,*/}*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/unit/{,*/}*.js']
            }
        },

        // Empties folders to start fresh.
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= booking.dist %>/*',
                        '!<%= booking.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles.
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css/',
                    src: '{,*/}*.css',
                    dest: '.tmp/css/'
                }]
            }
        },

        // Automatically inject Bower components into the app.
        'bower-install': {
            app: {
                html: '<%= booking.app %>/index.html',
                ignorePath: '<%= booking.app %>/'
            }
        },

        // Renames files for browser caching purposes.
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= booking.dist %>/js/{,*/}*.js',
                        '<%= booking.dist %>/css/{,*/}*.css',
                        '<%= booking.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= booking.dist %>/css/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them.
        useminPrepare: {
            html: '<%= booking.app %>/index.html',
            options: {
                dest: '<%= booking.dist %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration.
        usemin: {
            html: ['<%= booking.dist %>/{,*/}*.html'],
            css: ['<%= booking.dist %>/css/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= booking.dist %>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder.
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= booking.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= booking.dist %>/img'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= booking.app %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%= booking.dist %>/img'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= booking.dist %>',
                    src: ['*.html', 'partials/{,*/}*.html'],
                    dest: '<%= booking.dist %>'
                }]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references.
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/js',
                    src: '*.js',
                    dest: '.tmp/concat/js'
                }]
            }
        },

        // Replace Google CDN references.
        cdnify: {
            dist: {
                html: ['<%= booking.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use.
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= booking.app %>',
                    dest: '<%= booking.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'partials/{,*/}*.html',
                        'bower_components/**/*',
                        'img/{,*/}*.{webp}',
                        'fonts/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/img',
                    dest: '<%= booking.dist %>/img',
                    src: ['generated/*']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= booking.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process.
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= booking.dist %>/css/main.css': [
        //         '.tmp/css/{,*/}*.css',
        //         '<%= booking.app %>/css/{,*/}*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= booking.dist %>/js/scripts.js': [
        //         '<%= booking.dist %>/js/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },

        replace: {
            development: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('./config/environments/development.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['./config/config.js'],
                    dest: '<%= booking.app %>/js/services/'
                }]
            },
            azure: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('./config/environments/azure.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['./config/config.js'],
                    dest: '<%= booking.app %>/js/services/'
                }]
            }
        },

        // Test settings.
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'bower-install',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'replace:development',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bower-install',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        //'newer:jshint',
        'test',
        'build'
    ]);

    grunt.registerTask('azure', [
        'replace:azure'
    ]);
};