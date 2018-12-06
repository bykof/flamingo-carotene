const path = require('path')

// const CaroteneModule = require('../flamingo-carotene-module')
const buildHandler = require('./lib/handler/build')

// class CarotenePug extends CaroteneModule {
class CarotenePug {
  constructor (core) {
    // super(core)
    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          config.paths.pug = {
            src: path.join(config.paths.src, 'page'),
            dist: path.join(config.paths.dist, 'template', 'page')
          }

          config.pug = {
            filesPattern: '/{*,.,*/page/*}/{.,*,*/*.partial}/*.pug',
            callback: null,
            breakOnError: false,
            staticAssetPattern: '/*',
          }
        }
      },
      {
        command: 'buildTemplates',
        handler: buildHandler
      },
      {
        command: 'build',
        handler: function (core) {
          const config = core.getConfig()
          config.pug.breakOnError = true
          buildHandler(core)
        }
      },
      {
        command: 'watchPug',
        handler: buildHandler
      }
    ]

    this.watcher = [
      {
        'watchId': 'pug',
        'path': [
          path.join(config.paths.src, '**', '*.pug')
        ],
        'command': 'watchPug',
        'callbackKey': 'pug'
      }
    ]
  }

  getListeners () {
    return this.listeners
  }

  getWatcherForDevServer () {
    return this.watcher
  }
}

module.exports = CarotenePug
