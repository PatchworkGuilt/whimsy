require.config
    baseUrl: '../../build/js'
    nodeRequire: require

require ['third-party/sinon', 'test/unit/RoomTest'], ->
    mocha.run()

