


class Style

  constructor:( elem ) ->
    @elem   = elem
    @width  = elem['clientWidth' ];
    @height = elem['clientHeight'];

  process:( key, graph ) =>

    @width * 0.25 if key is 'Objects'
    style = "width:#{@width}px; height:#{@height}px; background:#000000;"
    graph.setAttribute( 'style', style )

    if graph.tagName is 'CANVAS'
      context = graph.getContext('webgl')
      context.fillStyle = '#000000'

    @elem.appendChild( graph )
    return

export default Style
