module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-babel');
    var appDir = '/Users/CharlieMac/Documents/WebAppBuilderForArcGIS/server/apps/8';
    var stemappDir = '/Users/CharlieMac/Documents/WebAppBuilderForArcGIS/client/stemapp';
    grunt.initConfig({
        sync: {
            main: {
                verbose: true,
                files: [
                    {
                        cwd: 'dist/',
                        src: '**',
                        dest: stemappDir
                    },
                    {
                        cwd: 'dist/',
                        src: '**',
                        dest: appDir
                    }
                ]
            }
        },
        babel: {
            'main': {
                'files': [{
                        'expand': true,
                        'cwd': 'widgets/',
                        'src': [
                            '*.js',
                            '**/*.js',
                            '**/**/*.js',
                            '!**/**/nls/*.js'
                        ],
                        'dest': 'dist/widgets/'
                    }]
            }
        },
        watch: {
            'main': {
                'files': ['widgets/**'],
                'tasks': [
                    'clean',
                    'babel',
                    'copy',
                    'sync'
                ],
                'options': {
                    'spawn': false,
                    'atBegin': true
                }
            }
        },
        copy: {
            'main': {
                'cwd': 'widgets/',
                'src': [
                    '**/**.html',
                    '**/**.json',
                    '**/**.css',
                    '**/images/**',
                    '**/nls/**'
                ],
                'dest': 'dist/widgets/',
                'expand': true
            }
        },
        clean: { 'dist': { 'src': 'dist/**' } }
    });
    grunt.registerTask('default', ['watch']);
};