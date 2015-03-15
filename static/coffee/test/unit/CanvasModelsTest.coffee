mockery = require('mockery')
sinon = require('sinon')
chai = require('chai')
expect = chai.expect

describe "CanvasModels", (done)->
    CanvasModels = null
    beforeEach ->
        mockery.enable()
        mockery.registerAllowables [
            'backbone'
            '../models/UserModel'
            '../../models/CanvasModels'
            'underscore'
        ]
        mockery.registerMock '../roomProxy', {
            on: sinon.spy()
            update: sinon.spy()
            }
        CanvasModels = require('../../models/CanvasModels')
    afterEach ->
        mockery.disable()
    describe "CanvasModel", ->
        it "exists", ->
            expect(CanvasModels.CanvasModel).to.exist()
