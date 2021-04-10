
import Util    from '../../base/util/Util.js'
import Vis     from '../../base/draw/Vis.js'
import Convey  from './Convey.js'
import * as d3 from 'd3' # '../../../pub/lib/d3/d3.5.9.0.esm.js';

class Shapes

  constructor: ( @stream ) ->
    @cos30  = 0.86602540378
    #@cos15 = Vis.cos(15)
    @fontText = "Roboto"

  rectGrad:( g, defs, xc, yc, w, h, fill, stroke, text ) ->
    @rectCenter( g, xc, yc, w*1.5, h*1.5, fill, stroke, 0.1 )
    @rectCenter( g, xc, yc, w*1.4, h*1.4, fill, stroke, 0.2 )
    @rectCenter( g, xc, yc, w*1.3, h*1.3, fill, stroke, 0.3 )
    @rectCenter( g, xc, yc, w*1.2, h*1.2, fill, stroke, 0.4 )
    @rectCenter( g, xc, yc, w*1.1, h*1.1, fill, stroke, 0.5 )
    @rectCenter( g, xc, yc,  w,        h,       fill, stroke, 0.6, text )
    return

  rectCenter:( g, xc, yc, w, h, fill, stroke, opacity, text='' ) ->
    @rect( g, xc-w*0.5, yc-h*0.5, w, h, fill, stroke, opacity, text )
    return

  toFill:( studyPrac, darken=false ) ->
    hsv = if studyPrac.hsv?  and studyPrac.hsv.length is 3 then studyPrac.hsv else [50,50,50]
    hsv = if darken then [hsv[0],hsv[1],hsv[2]*0.75] else hsv # [hsv[0],60,30]
    # console.log( 'Shapes.toFill()', studyPrac.hsv, hsv ) if darken
    if studyPrac.hsv?  and studyPrac.hsv.length is 3
      Vis.toRgbHsvStr( hsv )
    else
      console.error( 'Shapes.toFill() unknown fill code', { name:studyPrac.name, fill:studyPrac.fill, spec:studyPrac } )
      '#888888'

  arrange:( prac ) ->
    studies = {}
    for dir in ['north','west','east','south']
      studies[@key(prac,dir)] = @obj(prac,dir)
    studies

  key:( prac, dir ) ->
    for key, study of prac when Util.isChild(key) and study.dir is dir
      return key
    '???'

  obj:( prac, dir ) ->
    for key, study of prac when Util.isChild(key) and study.dir is dir
      return study
    {}

  htmlId:( pracName, contentName ) ->
    Util.getHtmlId( pracName, 'Info', contentName ) # @ui.plane.id

  size:( obj ) ->
    if obj? then Object.keys(obj).length else 0

  isWest:(col) ->
    col is 'Embrace'

  layout:( size, col, ns, ni ) ->
    lay        = {}                                    # Layout ob
    lay.dir    = if( @isWest(col) ) then 1 else -1     # convey direction
    lay.xc     = size.xc                               # x center
    lay.yc     = size.yc                               # y center
    lay.w      = size.w                                # pane width
    lay.h      = size.h                                # pane height
    lay.hk     = lay.h / 8                             # height keyhole rect
    lay.xk     = if( @isWest(col) ) then lay.w else 0  # x keyhole rect
    lay.yk     = lay.yc - lay.hk                       # y keyhole rect
    lay.rs     = lay.yc * 0.85                         # Outer  study section radius
    lay.ro     = lay.rs - lay.hk                       # Inner  study section radius
    lay.ri     = lay.ro - lay.hk / 4                   # Icon   intersction   radius
    lay.yt     = lay.yc + lay.ro + lay.rs * 0.65       # y for practice text
    lay.a1     = if( @isWest(col)) then  60 else  120  # Begin  study section angle
    lay.a2     = if( @isWest(col)) then 300 else -120  # Ending study section angle
    lay.ns     = ns                                    # Number of studies
    lay.da     = (lay.a1-lay.a2) / lay.ns              # Angle of each section
    lay.ds     = lay.da / 12                           # Link angle dif
    lay.li     = lay.ds / 2                            # Link begin inset
    lay.wr     = 8                                     # Width  study rect  24
    lay.hr     = lay.ri / lay.ns                       # Height study rect
    lay.xr     = lay.xc + lay.dir * (lay.rs/2+lay.wr)  # x orgin study rect
    lay.yr     = lay.yc - lay.ri/2                     # r orgin study rect
    lay.dl     = lay.hr / 12                           # link dif on study rect
    lay.xl     = lay.xr + lay.wr                       # x link   on study rect
    lay.yl     = lay.yr + lay.dl / 2                   # y link   on study rect
    lay.ni     = ni                                    # Number of innovative studies
    lay.xi     = 0                                     # x innovative study rects
    lay.yi     = lay.yc - lay.ri / 2                   # y innovative study rects
    lay.wi     = lay.wr                                # w innovative study rects
    lay.hi     = lay.ri / lay.ni                       # h innovative study rects
    lay.thick  = 1                                     # line thickness
    lay.stroke = 'none'                                # line stroke
    # console.log( 'Shapes.layout()', col, size, lay )
    lay

  click:( path, text) ->
    if text is false then {}
    path.style( 'z-index','4') #.style("pointer-events","all").style("visibility", "visible" )
    path.on("click", () =>
      #console.log( 'Shape.click',  text )
      select = {} # UI.toTopic(  text, 'Shapes', UI.SelectStudy )
      @stream.publish( 'Select', select ) )
    return

  wedge:( g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId, fontSize, level ) ->
    arc  = d3.arc().innerRadius(r1).outerRadius(r2).startAngle(@radD3(a1)).endAngle(@radD3(a2))
    #console.log( 'Shape.wedge()', { x0:x0, y0:y0 } )
    g.append("svg:path").attr("d",arc).attr("fill",fill).attr("stroke","none")
      .attr("transform", Vis.translate(x0,y0) )
    @wedgeText( g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId, fontSize, level  )
    return

  wedgeText:( g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId, fontSize, level='None' ) ->
    Util.noop( wedgeId )
    th = 14
    at = (a1+a2)/2
    rt = (r1+r2)/2
    sc = 0.50
    if (210<=at and at<=330) or (-150<=at and at<=-30)
      sc = if level is 'Prac' then 0.30 else 0.25 # level is a hack
      rt = (r1+r2)/2 + th * sc
      as = 270-at
      # console.log( 'Shapes.wedgeText() 1', text, level, sc , rt )
    else
      sc = if level is 'Prac' then 1.25 else 0.50 # level is a hack
      rt = (r1+r2)/2 - th * sc
      as = 90-at
      # console.log( 'Shapes.wedgeText() 2', text, level, sc, rt )
    x  = x0 + rt * @cos(at)
    y  = y0 + rt * @sin(at)
    path = g.append("svg:text").text(text).attr("x",x).attr("y",y).attr("transform", Vis.rotate(as,x,y) )
            .attr("text-anchor","middle").attr("font-size",fontSize)
            .attr("font-family",@fontText).attr("font-weight","bold")
            .attr('fill','#000000' ) # @textFill(fill))
    @click( path, text )
    return

  # "font-family: Arial, Font Awesome\ 5 Free; font-weight: 900;
  icon:( g, x0, y0, name, iconId, color, size, uc ) ->
    path = g.append("svg:text").text(uc).attr("x",x0).attr("y",y0).attr("id",iconId)
            .attr("text-anchor","middle").attr("font-size",size).attr("fill",color)
            .attr("font-family","Arial, Font Awesome\\ 5 Free").attr("font-weight","900")
    @click( path, name )
    return

  text:( g, x0, y0, name, textId, color, size, anchor="middle" ) ->
    path = g.append("svg:text").text(name).attr("x",x0).attr("y",y0).attr("id",textId).attr("fill",color)
             .attr("text-anchor",anchor).attr("font-size", size )
             .attr("font-family",@fontText).attr("font-weight","bold")
    @click( path, name )
    return

  link:( g, a, ra, rb, xc, yc, xd, yd, xe, ye, stroke, thick ) ->
    xa = xc + ra * @cos(a)
    ya = yc + ra * @sin(a)
    xb = xc + rb * @cos(a)
    yb = yc + rb * @sin(a)
    data  = """M#{xa},#{ya} C#{xb},#{yb} #{xd},#{yd} #{xe},#{ye}"""
    @curve( g, data, stroke, thick )
    return

  curve:( g, data, stroke, thick ) ->
    g.append("svg:path").attr("d",data).attr("stroke-linejoin","round")
     .attr("fill","none").attr("stroke",stroke).attr("stroke-width",thick)
    return

  keyHole:( g, xc, yc, xs, ys, ro, ri, fill, stroke='none', thick=0 ) ->
    h      = yc - ys
    a      = Math.asin( h/ro )
    rx     = Math.cos( a ) * ro
    rh     = ri
    osweep = 0 # Negative
    isweep = 1 # Positive
    if xs <  xc
      rx     = -rx
      rh     = -ri
      osweep = 1 # Positive
      isweep = 0 # Negative
    data  = """M#{xs},   #{ys}"""
    data += """L#{xc+rx},#{ys} A#{ro},#{ro} 0, 1,#{osweep} #{xc+rx},#{yc+h}"""
    data += """L#{xs},   #{yc+h} L#{xs},#{ys}"""
    data += """M#{xc+rh},#{yc} A#{ri},#{ri} 0, 1,#{isweep} #{xc+rh},#{yc-0.001}"""  # Donut hole
    #console.log( 'Shapes.keyhole()', { xc:xc, yc:yc, xs:xs, ys:ys, ro:ro, ri:ri, h:h, a:a, rx:rx } )
    @poly( g, data, fill, stroke, thick )
    return

  poly:( g, data, fill ) ->
    g.append("svg:path").attr("d",data).attr("stroke-linejoin","round").attr("fill",fill)
    return

  # svg:rect x="0" y="0" width="0" height="0" rx="0" ry="0"
  rect:( g, x0, y0, w, h, fill, stroke, opacity=1.0, text='', size='2em' ) ->
    g.append("svg:rect").attr("x",x0).attr("y",y0).attr("width",w).attr("height",h)
     .attr("fill",fill).attr("stroke",stroke).style( "opacity", opacity )
    g.style( 'background', '#000000') if opacity < 1.0
    if text isnt ''
      g.append("svg:text").text(text).attr("x",x0+w/2).attr("y",y0+h/2+14).attr('fill','wheat')
       .attr("text-anchor","middle").attr("font-size", size )
       .attr("font-family",@fontText).attr("font-weight","bold")
    return

  round:( g, x0, y0, w, h, rx, ry, fill, stroke ) ->
    g.append("svg:rect").attr("x",x0).attr("y",y0).attr("width",w).attr("height",h)
     .attr("rx",rx).attr("ry",ry)
     .attr("fill",fill).attr("stroke",stroke)
    return

  # svg:ellipse cx="0" cy="0" rx="0" ry="0"
  ellipse:( g, cx, cy, rx, ry, fill, stroke ) ->
    g.append("svg:ellipse").attr("cx",cx).attr("cy",cy).attr("rx",rx).attr("ry",ry)
     .attr("fill",fill).attr("stroke",stroke)
    return

  # svg:ellipse cx="0" cy="0" rx="0" ry="0"
  circle:( g, cx, cy, r, fill, stroke ) ->
    g.append("svg:ellipse").attr("cx",cx).attr("cy",cy).attr("r",r)
     .attr("fill",fill).attr("stroke",stroke)
    return

  nodesLinks:( studies, innovs ) ->
    nodes = []
    nodes.push( { name:key, color:@toFill(study) } ) for own key, study of studies
    nodes.push( { name:key, color:@toFill(innov) } ) for own key, innov of innovs
    links = []
    sK = 0
    for own sKey, study of studies
      iK = 4
      for own iKey, innov of innovs
        links.push( { source:sK, target:iK, value:1 } ) # sourceName:sKey, targetName:iKey,
        iK++
      sK++
    #console.log( 'Shape.nodesLinks', nodes, links )
    { nodes:nodes, links:links }

  conveySankey:( col, defs, g, studies, innovs, x, y, w, h ) ->
    #console.log( { col:col, studies:studies, innovs:innovs, x:x, y:y, w:w, h:h } )
    convey  = new Convey( @, defs, g, x, y, w, h )
    nodesLinks = {}
    if col is "Embrace"
      nodesLinks = @nodesLinks( studies, innovs  )
    else if col is "Encourage"
      nodesLinks = @nodesLinks( innovs,  studies )
    convey.doData( nodesLinks )
    return

  # All flows are colored the north color of yellow [[90,90.90]
  practiceFlow:( g, size, spec ) ->
    return if not spec.row?
    switch spec.row
      when 'Learn'
        @flow( g, size, [90,90,90], 'south' )
      when 'Do'
        @flow( g, size, [90,90,90], 'north' )
        @flow( g, size, [90,90,90], 'south' )
      when 'Share'
        @flow( g, size, [90,90,90], 'sorth' )
      when 'Dim'

      else
        console.error( 'Shapes.practiceFlow() unknown spec row ', spec.name, spec.row )
        @flow( g, size, [90,90,90], 'south' )
    return

  flow:( g, size, hsv, dir, h ) ->
    w    = if size.level is 'Comp' then size.ringSize * 0.75 else size.ringSize * 0.8
    h    = if size.level is 'Comp' then size.ringSize * 0.55 else size.ringSize * 1.3
    x0   = size.xc  -  w * 0.5
    y0   = if dir is 'south' then size.h  - h else 0
    fill = Vis.toRgbHsvStr( hsv )
    @rect( g, x0, y0, w, h, fill, 'none' )
    return

  # Convert degress to radians and make angle counter clockwise
  rad:( deg )    -> (360-deg) * Math.PI / 180.0
  #degSVG:( deg ) -> 360-deg
  radD3:( deg )  -> (450-deg) * Math.PI / 180.0
  #degD3:( rad )  -> -rad * 180.0 / Math.PI
  cos:( deg )    -> Vis.cosSvg(deg)
  sin:( deg )    -> Vis.sinSvg(deg)

  gradientDef:( defs, id, color1, color2, x1='0%', x2='100%', y1='0%', y2='100%' ) ->
    grad = defs.append("svg:linearGradient")
    grad.attr("id", id ).attr("x1",x1).attr("y1",y1).attr("x2",x2).attr("y2",y2)
    grad.append("svg:stop").attr("offset", "10%").attr("stop-color", color1 )
    grad.append("svg:stop").attr("offset", "90%").attr("stop-color", color2 )
    return

  pathPlot:( g, stroke, thick, d )->
    g.append('svg:path').attr( 'd', d ).attr('stroke',stroke).attr('stroke-width',thick)
     .attr('fill','none').attr("stroke-linejoin",'round')
    return

  textFill:( hex, dark='#000000', light='#FFFFFF') ->
    if hex > 0x888888 then dark else light

  saveSvg:( name, id ) ->
    fileName = name+'.svg'
    svgData  = $('#'+id)[0].outerHTML
    svgBlob  = new Blob( [svgData], { type:"image/svg+xml;charset=utf-8" } )
    svgUrl   = window['URL'].createObjectURL(svgBlob)
    downloadLink      = document.createElement("a")
    downloadLink.href = svgUrl;
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    return

export default Shapes