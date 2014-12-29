define ['backbone'], (Backbone) ->
    class UserModel extends Backbone.Model
        initialize: ->
            @set 'id', "UserId" + Math.round (Math.random() * 100)
            console.log @get('id')

    return new UserModel()
