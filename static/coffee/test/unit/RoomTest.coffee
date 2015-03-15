Room = require('../../Room')
sinon = require('sinon')
chai = require('chai')
expect = chai.expect

describe "Room", ->
    room = null
    broadcast = null
    mockdb = null

    beforeEach ->
        broadcast = sinon.spy()
        mockdb = {
            getNewId: -> 'newShapeId'
            addShape: sinon.spy()
            updateShape: sinon.spy()
            getAllShapes: sinon.spy()
        }
        room = new Room(broadcast, 'room123', mockdb)

    describe "emit('addBody', ...)", ->
        shape = {
            color: 'red'
            x: 3
            y: 5
        }

        it "calls broadcast with the new body", ->
            room.emit('addBody', shape)
            sinon.assert.calledOnce(broadcast)
            sinon.assert.calledWith(broadcast, 'add', JSON.stringify shape)

        it "adds the body to the db", ->
            room.emit('addBody', shape)
            sinon.assert.calledOnce(mockdb.addShape)
            sinon.assert.calledWith(mockdb.addShape, 'room123', shape)

        it "ignores empty data", ->
            room.emit('addBody')
            expect(broadcast.callCount).to.equal 0
            expect(mockdb.addShape.callCount).to.equal 0

    describe "emit('updateBody', ...)", ->
        updates = {
            _id: 'shape123'
            color: 'blue'
            size: 'small'
        }

        it 'ignores empty data', ->
            room.emit('updateBody')
            expect(broadcast.callCount).to.equal 0
            expect(mockdb.updateShape.callCount).to.equal 0

        it 'ignores data without an _id', ->
            room.emit('updateBody', {'name': 'John'})
            expect(broadcast.callCount).to.equal 0
            expect(mockdb.updateShape.callCount).to.equal 0

        it "calls broadcast with the updates", ->
            room.emit('updateBody', updates)
            sinon.assert.calledOnce(broadcast)
            sinon.assert.calledWith(broadcast, 'update', JSON.stringify updates)

        it "updates the body in the db", ->
            room.emit('updateBody', updates)
            sinon.assert.calledOnce(mockdb.updateShape)
            sinon.assert.calledWith(mockdb.updateShape, 'room123', updates['_id'], updates)

    describe "getBodies", ->
        it "gets all the bodies from the db", ->
            mock = sinon.spy()
            room.getBodies(mock)
            sinon.assert.calledOnce(mockdb.getAllShapes)
            sinon.assert.calledWith(mockdb.getAllShapes, 'room123', mock)








