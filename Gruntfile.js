'use strict';

var request = require('request');
require('dotenv').load();

var ENV = process.env;

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35730, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      dev: {
        cors: 'http://localhost:9000',
        mongoURL: 'mongodb://localhost/test',
        urls: {
          editor: 'http://localhost:9000'
        },
        facebook: {
          clientId: ENV.FACEBOOK_CLIENT_ID,
          clientSecret: ENV.FACEBOOK_CLIENT_SECRET,
          callbackUrl: 'http://localhost:3000/auth/facebook/callback'
        },
        cookieDomain: null // This just defaults to localhost
      },
      dist: {
        cors: 'http://dtu.ninja',
        mongoURL: ENV.MONGO_DB_URL,
        urls: {
          editor: 'http://dtu.ninja/'
        },
        facebook: {
          clientId: ENV.FACEBOOK_CLIENT_ID,
          clientSecret: ENV.FACEBOOK_CLIENT_SECRET,
          callbackUrl: 'http://api.dtu.ninja/auth/facebook/callback'
        },
        cookieDomain: '.dtu.ninja',
        opbeat: {
          organizationId: ENV.OPBEAT_ORGANIZATION_ID,
          appId: ENV.OPBEAT_APP_ID,
          secretToken: ENV.OPBEAT_SECRET_TOKEN
        }
      }
    },
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: [
          'public/css/*.css'
        ],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['views/*.jade'],
        options: {
          livereload: reloadPort
        }
      }
    },
    'file-creator': {
      dev: {
        'tmp/config.js': function(fs, fd, done) {
          fs.writeSync(fd, 'module.exports = ' + JSON.stringify(grunt.config('config.dev')) + ';');
          done();
        }
      },
      dist: {
        'tmp/config.js': function(fs, fd, done) {
          fs.writeSync(fd, 'module.exports = ' + JSON.stringify(grunt.config('config.dist')) + ';');
          done();
        }
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'file-creator:dev',
    'develop',
    'watch'
  ]);
  grunt.registerTask('heroku:production', ['file-creator:dist']);
};
