
import Build from '../../ikw/cube/Build.js';

class NavMuse

  constructor:( @stream,   @batch, @comp ) ->
    @build   =  new Build( @batch )
    @$router =  null
    @level   =  'Comp' # Prac Disp Page
    @prac    =  'None'
    @disp    =  'None'
    @page    =  'Icon'
    @pages   = ['Icon','Dirs','Conn','Summ','Desc']
    @compass =   ""

  pub:(   change ) ->
    @set( change )
    obj = { level:@level, comp:@comp, prac:@prac, disp:@disp, page:@page }
    console.log('Nav.pub()', obj )
    @stream.publish( 'Nav',  obj )
    return

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    return

  setPages:( array ) ->
    @pages = []
    for obj in array
      @pages.push( obj.key )
    return

  tap:() =>
    console.log( 'Nav.tap()' )
    return

  dir:( dr, event=null ) =>
    console.log('Nav.dir()', dr )
    if event is null then {}
    @compass = dr if dr isnt 'next' and dr isnt 'prev'
    switch @level
      when 'Comp'  then @dirComp( dr )
      when 'Prac'  then @dirPrac( dr )
      when 'Disp'  then @dirDisp( dr )
      when 'Page'  then @dirPage( dr )
      else              @dirNone( dr )
    return

  dirComp:( dir ) ->
    @comp = @adjComp( @comp, dir )
    @prac = @build.getPractice( @prac.row, @prac.column, @comp )
    @disp = @getDisp( @prac, @disp.dir )

  dirPrac:( dir ) ->
    adj = @adjPrac( dir )
    # console.log('Nav.adj()', adj )
    if adj.name isnt 'None'
      obj = {}
      obj.level = @level
      obj.comp  = @comp
      if adj.name  isnt @prac
         obj.prac  = adj.name
         @prac     = adj.name
      if adj.plane isnt @comp
         obj.comp  = adj.plane
         @comp     = adj.plane
         @route( @level, @comp, @page, obj )
      @pub( obj )
    return

  dirDisp:( dir ) ->
    prc = @pracs(@comp)[@prac] # Here adj is current practice
    dis = prc[@disp]

    # if current prac.dir is dir or next or prev we will nav to adjacent prac
    if dir is dis.dir or ( dir is 'next' or dir is 'prev')
       adj = @adjPrac(dir)
       dis = @getDisp( @adjDir(@compass), adj )
    else
       adj = prc
       dis = @getDisp( @compass, prc )

    if adj.name isnt 'None'
       obj = {}
       obj.level = @level
       obj.comp  = @comp
       obj.prac  = adj.name
       @prac     = adj.name
       obj.disp  = dis.name
       @disp     = dis.name
       if adj.plane isnt @comp
          obj.comp = adj.plane
          @comp    = adj.plane
          @route( @level, @comp, @page, obj )
       @pub( obj )
    return

  dirPage:( dir ) ->
    if @pages.length > 0 and @page isnt 'None'
      idx  = @pages.indexOf(@page)
      page = @pages[idx++] if dir is 'east' and idx < @pages.length-1
      page = @pages[idx--] if dir is 'west' and idx > 1
      if page isnt @page
         obj = {}
         obj.level = @level
         obj.comp  = @comp
         obj.page   = page
         @page      = page
         @route( @level, @comp, @page, obj )
    else
      @dirNone(  dr )
    return

  dirNone:( dir ) ->
    console.error( 'Nav.dirNone unknown dir', { dir:dir, level:@level } )
    return

  routeLevel:( level ) ->
    if @$router?
       @$router.push( { name:level } )
    else
      console.error( 'Nav.routeLevel() $router not set' )
    return

  route:( comp, page=null ) ->
    name = if page? then comp+page else comp
    if @$router?
       @$router.push( { name:name } )
    else
       console.error( 'Nav.router() $router not set' )
    return

  adjComp:( comp, dir ) ->
    adjDir = switch  dir
      when 'west'  then 'prev'
      when 'north' then 'prev'
      when 'east'  then 'next'
      when 'south' then 'next'
      when 'prev'  then 'prev'
      when 'next'  then 'next'
      else              'next'
    return if adjDir is 'next' then @build.next(comp) else @build.prev(comp)

  adjPrac:( dir ) ->
    prc = @pracs(@comp)[@prac]
    adj = @build.adjacentPractice(prc,dir)
    # console.log( 'Nav.adjPrac()', { dor:dir, prc:prc, adj:adj } )
    adj

  getDisp:( prac, dirDisp ) ->
    disp = @build.getDir( prac, dirDisp )
    # console.log( 'Nav.getDisp()', { dir:dir, prac:prac, disp:disp } )
    disp

  adjDir:( dir ) ->
    switch dir
      when 'west'  then 'east'
      when 'north' then 'south'
      when 'east'  then 'west'
      when 'south' then 'north'
      else              'west'

  pracs:(  comp ) ->
    @batch[comp].data[comp].pracs

  disps:(  comp, prac ) ->
    @batch[comp].data[comp][prac].disps

export default NavMuse