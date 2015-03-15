module.exports = (grunt) =>

    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')
        copy:
            main:
                files: [
                    {
                        expand: true
                        cwd: 'static/'
                        src: 'js/**/*.js'
                        dest: 'static/build/'
                    }
                ]
        clean:
            options:
                no-write: true
            js:
                expand: true
                options:
                    no-write: true
                src: ['static/build/js']

        coffee:
            compile:
                expand: true
                cwd: 'static/coffee/'
                src: '**/*.coffee'
                dest: 'static/build/js/'
                ext: '.js'

        growl:
            completedMessage:
                message: "Whimsy build complete"
                title: "Grunt Watcher"

        watch:
            coffee:
                files: 'static/coffee/**/*.coffee'
                tasks: ['build']

            js:
                files: 'static/js/**/*.js'
                tasks: ['build']

        browserify:
            client:
                src: "static/build/js/client.js"
                dest: "static/build/js/modules/client.js"


    grunt.registerTask('build', ['clean', 'coffee', 'copy', 'browserify', 'growl:completedMessage'])
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks 'grunt-growl'

