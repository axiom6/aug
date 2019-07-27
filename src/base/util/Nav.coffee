
import Build from '../../ikw/cube/Build.js';

class Nav

  constructor:( @stream,  @batch, @comp ) ->
    @build   = new Build( @batch, @comp )
    @$router = null
    @level   = 'Prac' # Prac Disp Tab
    @prac    = 'None'
    @disp    = 'None'
    @tab     = 'Prac'
    @tabs    = ['Prac','Conn','Data','Enli']  # Set by the active view component
    @queue   = null # Last published obj created before route call request by new component
    @queued  = false
    @compass = ""
    @subscribe()

  subscribe:() ->
    @stream.subscribe( 'Tabs',  'Nav', (tab) => console.log('Nav.sub()',tab); @tab = tab )

  # Publish twice because Tocs needs to update comp before any Nav view updates
  pub:( obj ) ->
    # console.log('Nav.pub()', obj )
    @stream.publish( 'Nav',  obj )
    return

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    # console.log('Nav.set()', obj, @tab )
    return

  dir:( dr ) =>
    # console.log('Nav.dir()', dr )
    @compass = dr if dr isnt 'next' and dr isnt 'prev'
    switch @level
      when 'Prac'  then @dirPrac( dr )
      when 'Disp'  then @dirDisp( dr )
      when 'Tabs'  then @dirTabs( dr )
      else              @dirNone( dr )
    return

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
         @route( @level, @comp, @tab, obj )
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
          @route( @level, @comp, @tab, obj )
       @pub( obj )
    return

  dirTabs:( dir ) ->
    if @tabs.length > 0 and @tab isnt 'None'
      idx = @tabs.indexOf(@tab)
      tab = @tabs[idx++] if dir is 'east' and idx < @tabs.length-1
      tab = @tabs[idx--] if dir is 'west' and idx > 1
      if tab isnt @tab
         obj = {}
         obj.level = @level
         obj.comp  = @comp
         obj.tab   = tab
         @tab      = tab
         @route( @level, @comp, @tab, obj )
    else
      @dirNone(  dr )
    return

  dirNone:( dir ) ->
    console.error( 'Nav.dirNone unknown dir', { dir:dir, level:@level } )
    return

  route:( level, comp, tab, obj ) ->
    if @$router?
       @$router.push( { name:comp     } ) if level isnt 'Tabs'
       @$router.push( { name:comp+tab } )
       # console.log(   'Nav.router()', { name:comp+tab } )
    else
       console.error( 'Nav.router() $router not set' )
    # Oueue up obj for for component to request when mounted
    @queue  = obj
    @queued = true
    return

  que:( source, queued ) ->
    # console.log( 'Nav.que()', { source:source, queued:@queued, queue:@queue } )
    @queued = queued
    @queue

  adjPrac:( dir ) ->
    prc = @pracs(@comp)[@prac]
    adj = @build.adjacentPractice(prc,dir)
    # console.log( 'Nav.adjPrac()', { dor:dir, prc:prc, adj:adj } )
    adj

  getDisp:( dir, practice ) ->
    dis = @build.getDir( practice, dir )
    # console.log( 'Nav.getDisp()', { dir:dir, practice:practice, dis:dis } )
    dis

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

export default Nav