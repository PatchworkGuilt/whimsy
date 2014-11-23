define ['backbone', 'raphael', 'ToolBox'], (Backbone, Raphael, ToolBox) ->
    class CanvasView extends Backbone.View
        initialize: ->
            @paper = Raphael 'viewport', '100%', '100%'
            @paper.width = $("#viewport").width()
            @paper.height = $("#viewport").height()
            @model.setPaper(@paper)
            tools = new ToolBox(@paper, ['circle', 'star', 'rect'], (event, data) =>
                switch event
                    when 'add'
                        console.log("Adding", data)
                        @model.queueNewShape(data)
            )


    return {
        CanvasView: CanvasView
    }

