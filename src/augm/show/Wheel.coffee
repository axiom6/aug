
class Wheel

  constructor:( @svgMgr, @onChoice, @mix, @oneLevel ) ->
    @svg                = @svgMgr.svg
    @g                  = @svgMgr.g
    @d3                 = @svgMgr.d3
    @name               = @svgMgr.name
    @width              = @svgMgr.size.w
    @height             = @svgMgr.size.h
    @opacity            = 1.0
    @showAllLeaves      = false
    @scale              = 1.2
    @radiusFactorChoice = 1.3
    @radiusFactorChild  = 1.0
    @nodes              = null
    @callPub            = true
    @ready()

  setChoosen:( d ) =>
    if not d.data?
      console.log( 'Wheel.setChoosen() missing d.data'. d )
    else if @mix.choosen('Flavor',d.data.name)
      # console.log( 'Wheel.setChoosen()', d.data.name, @mix.choosen('Flavor',d.data.name) )
      @callPub = false
      @onEvent({}, d, 'click')
      @callPub = true
    return

  x0:(d) ->  if d.m0? then d.m0 else d.x0
  x1:(d) ->  if d.m1? then d.m1 else d.x1
  y0:(d) ->  if d.n0? then d.n0 else d.y0
  y1:(d) ->  if d.n1? then d.n1 else d.y1
  xc:(d) => (@x0(d)+@x1(d))/2
  yc:(d) => (@y0(d)+@y1(d))/2

  centerText:() ->
    @g.append("text")
      .text("Flavors")
      .attr( 'x', -32 )
      .attr( 'y',  12 )
      .style('stroke', 'wheat' )
      .style("font-size", "3vmin" )

  ready:( ) ->
    @json     = @mix.flavorJson()
    @radius   = Math.min( @width, @height ) * @scale / 2
    @xx       = @d3.scaleLinear().domain([0,1]).range([0,2*Math.PI])
    @yy       = @d3.scalePow().exponent(1.4).domain([0,1]).range([0,@radius])
    @padding  = 0
    @duration = 300
    xc        = @width/2
    yc        = @height/2
    @g = @svg.append("g")
      .attr("transform", """translate(#{xc},#{yc}) scale(1,1)""")
    @centerText()

    @partition = @d3.partition()

    @arc = @d3.arc()
      .startAngle(  (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x0(d) ))))
      .endAngle(    (d) => Math.max( 0, Math.min(2 * Math.PI, @xx( @x1(d) ))))
      .innerRadius( (d) => Math.max( 0, @yy(@y0(d)) ) )
      .outerRadius( (d) => Math.max( 0, @yy(@y1(d)) ) )

    if @oneLevel
      @json.children = @removeBranches( @json.children, ['Rich','Fruit'] )
    @root = @d3.hierarchy(@json)
    @root.sum(  (d) => ( d.chosen = false; d.hide = @isLeaf(d); if @isBranch(d) then 0 else 1 ) )
    @nodes = @partition(@root).descendants()
    @adjustRadius( @root )
    @adjustAngles( @root, @nodes ) if @oneLevel
    @doPaths( @nodes )
    @doTexts( @nodes )
    @d3.select( self.frameElement).style( "height", @height + "px" )
    return

  doPaths:( nodes ) ->
    @g.selectAll("path")
      .data( nodes )
      .enter().append("path")
      .attr( "id", (d, i) -> ( if d? then "path-" + i else "path-" + i ) )
      .attr(  "d", @arc )
      .attr(  "fill-rule", "evenodd")
      .style( "fill",    (d) => @fill(d)  )
      .style( "opacity", @opacity )
      .style( "stroke",       'black' )
      .style( "stroke-width", '2' )
      .style( "display", (d) -> if d.data.hide then "none" else "block" )
      .on( "click",      (e,d) => @onEvent( e, d, 'click'     ) )
      .on( "mouseover",  (e,d) => @onEvent( e, d, 'mouseover' ) )
      .on( "mouseout",   (e,d) => @onEvent( e, d, 'mouseout'  ) )

  removeBranches:( children1, branches ) ->
    return if not  children1?
    children2 = []
    for  child in children1
      if @inChildren( child, branches )
        Array.prototype.push.apply( children2, @removeBranches( child.children, branches ) )
      else
        children2.push( child )
    return children2

  inChildren:( child, branches ) ->
    for  branch in branches
      return true if branch is child.name
    false

  adjustRadius:( d ) =>
    sc = if d['data'].scale? then d['data'].scale
    else if not d.children?  then 0.8
    else                          1.0
    dy   = ( d.y1 - d.y0 ) * sc
    d.y0 = d.parent.y1 if d.parent?
    d.y1 = d.y0 + dy
    if d.children?
       d.children.forEach (child) =>
         @adjustRadius( child )
    return

  adjustAngles:( root, nodes  ) =>
    dx = 1.0 / root.children.length
    x0 = 0.0
    for node in nodes when node.depth is 1
      node.x0 = x0
      node.x1 = x0 + dx
      x0       = x0 + dx
    return

  sameNode:( a, b ) ->
    a?.data.name is b?.data.name

  inBranch:( branch, d ) ->
    return true if  branch?.data.name is d?.data.name
    if branch.children?
      for child in branch?.children
        return true if child?.data.name is d?.data.name
    return false

  isBranch:( d ) ->
    d.children?

  isLeaf:( d ) ->
    not d.children?

  isParentOf:( p, c ) =>
    if p == c
      return true
    if p.children?
      return p.children.some( (d) => @isParentOf( d, c ) )
    false

  fill:(d) =>
    if d.data.fill? and d.children?
      d.data.fill
    else if  d.data.fill? and not d.children? and d.parent?  and d.parent.data.fill?
      d.parent.data.fill
    else if d.children?
      colours = d.children.map(@fill)
      a = @d3.hsl(colours[0])
      b = @d3.hsl(colours[1])
      # L*a*b* might be better here...
      @d3.hsl (a.h + b.h) / 2, a.s * 1.2, a.l / 1.2
    else
      '#666666'

  doTexts:( nodes ) =>
    @text = @g.selectAll('text').data(nodes)
    @textEnter = @text.enter().append('text')
      .data( nodes )
      .on( "click",       (e,d) => @onEvent( e,d, 'click'     ) )
      .on( "mouseover",   (e,d) => @onEvent( e,d, 'mouseover' ) )
      .on( "mouseout",    (e,d) => @onEvent( e,d, 'mouseout'  ) )
      .style("font-size", (t) => @fontSize( t ) )
      .style('font-weight', 900 )
      .style('opacity', 1 )
      #style('fill',       (d) => if @brightness( @d3.rgb( @fill(d.data) ) ) < 125 then '#eee' else '#000' )
      .style('fill', '#000000' )
      .style( "display",   (d) -> if d.data.hide then "none" else "block" )
      .attr('text-anchor', (d) => if @xx( @xc(d) ) > Math.PI then 'end' else 'start' )
      .attr('dy', '.2em')
      .attr('transform', (d) => @textTransform(d) )

    angle = (d) => @xx( @xc(d) ) * 180 / Math.PI
    xem   = (d) -> if angle(d) <= 180 then '1.2em' else '-1.2em'

    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).text( (d) -> if d.depth then d.data.name.split(' ')[0] else '' )
    @textEnter.append('tspan').attr( 'x', (d) -> xem(d) ).attr('dy', '1em')
      .text( (d) -> if d.depth? and d.data.name? then d.data.name.split(' ')[1] or '' else '' )
      .attr(  "d", (d) => @setChoosen(d) )
    return
    
  noData:( d, eventType ) ->
    missing = false
    if not d.data?
      console.error( 'Wheel.onEvent() missing d.data', d )
      missing = true
    else if not d.parent? and eventType is 'click'
      @displayAllLeaves()
    if not d.data['can']
      missing = true
    missing

  # eventType is click mouseover mouseout
  onEvent:( e, d, eventType ) =>
    return if @noData( d, eventType )
    py0    = d.y0
    py1    = d.y0 + (d.y1-d.y0) * @radiusFactorChoice
    resize = @doChoiceResize( d, eventType, d.x0, py0, d.x1, py1 )
    cy0    = if resize then py1 else d.y1
    if d.children?
      if not @oneLevel or e.depth < 2
        @resizeChild( d, resize, cy0 )
    else
      @resizeElem( d, resize, d['x0'], cy0, d['x1'], d['y1'] )
    @reDisplayPaths( d )
    @reDisplayTexts( d )
    return

  resizeChild:( d, resize, cy0 ) ->
    d.children.forEach( (child) =>
      child?.data.hide = resize
      cy1 = cy0 + (child['y1']-child['y0']) * @radiusFactorChild
      @resizeElem( child, resize, child['x0'], cy0, child['x1'], cy1 ) )
    return

  reDisplayPaths:( d ) ->
    @g.selectAll('path').data( @nodes )
      .filter( (f) => @inBranch( d, f ) )
      .transition()
      .duration(@duration)
      .style( "display", (d) -> if d.data.hide then "none" else "block" )
      .attr(  "d", @arc )
    return

  reDisplayTexts:( d ) ->
    @g.selectAll('text').data( @nodes )
      .filter( (f) => @inBranch( d, f ) )
      .transition()
      .duration(@duration)
      .attr( "transform",   (t) => @textTransform(t) )
      .style("font-size",   (t) => @fontSize( t, d ) )
      .style("font-weight", '900' )
      .style( "display",  (d) -> if d.data.hide then "none" else "block" )
    return

  fontSize:( t, d=null ) =>
    if d? and @sameNode( t, d ) and t.m0?
      '1.2rem'
    else
      if t.children? then '1.1rem' else '1.0rem'

  # eventType is click mouseover mouseout
  # This publish function is supplied to the constructor
  # d.chosen is true/false for add/del
  # d.data.name is the flavor
  # @publish( d.chosen, d.data.name )
  doChoiceResize:( d, eventType, x0, y0, x1, y1 ) =>
    resize = true
    if eventType is 'click'
      d.chosen = !d.chosen # @mix.choosen( 'Flavor', d.data.name )
      @resizeElem( d, d.chosen, x0, y0, x1, y1 )
      @onChoice( d.data.name, d.chosen ) if @callPub
      resize = d.chosen
    else if not d.chosen and ( eventType is 'mouseover' or eventType is 'mouseout' )
      resize = eventType is 'mouseover'
      @resizeElem( d, resize, x0, y0, x1, y1 )
    resize

  resizeElem:( d, resize, x0, y0, x1, y1 ) ->
    if not d.data?
      console.error( 'Wheel.resizeElem() missing d.data', d )
    else if resize
      d.m0 = x0
      d.m1 = x1
      d.n0 = y0
      d.n1 = y1
      d.data.hide = false
    else
      d.m0 = undefined
      d.m1 = undefined
      d.n0 = undefined
      d.n1 = undefined
      d.data.hide = if not (d.data.children? or @showAllLeaves) then true else false
    return

  textTransform:( d ) =>
    multiline = (d.data.name or '').split(' ').length > 1
    angle  = @xx( @xc(d) ) * 180 / Math.PI - 90
    rotate = angle + (if multiline then -.5 else 0)
    'rotate(' + rotate + ')translate(' + @yy(@y0(d)) + @padding + ')rotate(' + (if angle > 90 then -180 else 0) + ')'

  displayAllLeaves:() =>
    @showAllLeaves = not @showAllLeaves
    @g.selectAll("path")
      .style( "display", (d) => if @isLeaf(d) and not @showAllLeaves and not d.parent.chosen then "none" else "block" )
    @g.selectAll('text')
      .style( "display", (d) => if @isLeaf(d) and not @showAllLeaves and not d.parent.chosen then "none" else "block" )
    return

export default Wheel