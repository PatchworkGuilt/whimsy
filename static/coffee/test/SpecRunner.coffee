require.config
    baseUrl: '../../build/js'
    nodeRequire: require
    paths:
        "jquery": "third-party/jquery-1.11.1.min"
        'backbone': 'third-party/backbone'
        'underscore': 'third-party/underscore'
        'Squire': '../../../node_modules/squirejs/src/Squire'
require ['Squire'], (Squire) ->
    require ['third-party/sinon', 'test/unit/build/allTests'], ->
        mocha.run()

