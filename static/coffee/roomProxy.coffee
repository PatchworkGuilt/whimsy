Backbone = require('backbone')
socketio = require('./third-party/socket.io.client')

class RoomProxy extends Backbone.Model
    initialize: ->
        @runOnServer()
        @set 'serverURL', if window then window.location.host else undefined
        @set 'room_id', if window then window.location.pathname.split("/room/")[1] else undefined

    runLocally: ->
        room = require('./Room')
        if @proxy?.removeListener
            @proxy.removeListener("render")
        @proxy = new Room(@broadcast)

    broadcast: (command, data) ->
        @trigger 'broadcastReceived', command, data

    runOnServer: ->
        @proxy = @initSocket()

    add: (data) ->
        @proxy.emit('addBody', data)

    update: (data) ->
        @proxy.emit("updateBody", data)

    initSocket: ->
        socket = socketio.connect @get('serverURL')

        socket.on 'broadcast', (data) =>
            @broadcast(data.name, data.data)
        .on 'connect', =>
            console.log("Joined ", @get('room_id'))
            if @get('room_id')
                socket.emit('room', @get('room_id'))
        .on 'disconnect', =>
            console.log("What happen?")
        .on 'reconnecting', =>
            console.log("Come back!")
        .on 'reconnect_failed', =>
            console.log("Fuck.")
        return socket

module.exports = new RoomProxy()
