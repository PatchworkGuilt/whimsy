Backbone = require('backbone')

class UserModel extends Backbone.Model
    initialize: ->
        @set 'id', "UserId" + Math.round (Math.random() * 100)

module.exports = new UserModel()
