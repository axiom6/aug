
import Build from '../../ikw/cube/Build.js';

class NavMuse

  constructor:( @stream,  @batch, @comp ) ->
    @build   =  new Build( @batch, @comp )
    @$router =  null
    @level   =  'Prac' # Prac Disp Tab
    @prac    =  'None'
    @disp    =  'None'
    @page    =  'Conn'
    @pages   = ['Conn','Prac','Data','Enli','Icon']  # Set by the active view component
    @queue   =   null # Last published obj created before route call request by new component
    @queued  =   false
    @compass =   ""
    @subscribe()

  subscribe:() ->
    @stream.subscribe( 'Page',  'NavMuse', (page) => console.log('NavMuse.sub()',page); @page = page )

  # Publish twice because Tocs needs to update comp before any Nav view updates
  pub:( obj ) ->
    # console.log('Nav.pub()', obj )
    @stream.publish( 'Nav',  obj )
    return

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    # console.log('Nav.set()', obj, @page )
    return

  tap:() =>
    console.log( 'Nav.tap()' )
    return

  dir:( dr, event=null ) =>
    console.log('Nav.dir()', dr )
    if event is null then {}
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

  dirTabs:( dir ) ->
    if @pages.length > 0 and @page isnt 'None'
      idx = @pages.indexOf(@page)
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

  route:( level, comp, page, obj ) ->
    if @$router?
       @$router.push( { name:comp     } ) if level isnt 'Tabs'
       @$router.push( { name:comp+page } )
       # console.log(   'Nav.router()', { name:comp+page } )
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

export default NavMuse