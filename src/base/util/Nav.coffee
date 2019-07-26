
import Build from '../../pub/ikw/cube/Build.js';

class Nav

  constructor:( @stream, @batch, @plane ) ->
    @build = new Build(  @batch, @plane )
    @level = 'Plane' # Plane Prac Disp Tab
    @prac  = 'None'
    @disp  = 'None'
    @tab   = 'None'
    @tabs  = []  # Set by the active view component

  subscribe:() ->
    # @stream.subscribe( 'Dir', 'Nav', @dir )

  publish:( obj ) ->
    @stream.publish( 'Nav', obj )

  publishAll:() ->
    @stream.publish( 'Nav', { level:@level, plane:@plane, prac:@prac, disp:@disp, tab:@tab, tabs:@tabs } )

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    return

  dir:( dr ) =>
    switch @level
      when 'Plane' then @dirPrac( dr )
      when 'Prac'  then @dirPrac( dr )
      when 'Disp'  then @dirDisp( dr )
      when 'Tab'   then @dirTabs( dr )
      else              @dirNone( dr )
    return

  dirPrac:( dir ) ->
    adj = @adjPrac( dir )
    if adj.name isnt 'None'
      obj = {}
      obj.level = @level
      if adj.plane isnt @plane
         obj.plane = adj.plane
         @plane    = adj.plane
      if adj.name  isnt @prac
         obj.prac  = adj.name
         @prac     = adj.name
      @publish( obj )
    return

  dirDisp:( dir ) ->
    adj = @adjPrac( dir )
    dsp = @getDisp( dir, adj )
    if adj.name isnt 'None'
      obj = {}
      obj.level = @level
      if adj.plane isnt @plane
         obj.plane = adj.plane
         @plane    = adj.plane
      if adj.name  isnt @prac
         obj.prac  = adj.name
         @prac     = adj.name
      if dsp.name  isnt @disp
         obj.disp  = dsp.name
         @disp     = dsp.name
      @publish( obj )
    return

  dirTabs:( dir ) ->
    if @tabs.length > 0 and @tab isnt 'None'
      idx = @tabs.indexOf(@tab)
      tab = @tabs[idx++] if dir is 'east' and idx < @tabs.length-1
      tab = @tabs[idx--] if dir is 'west' and idx > 1
      if tab isnt @tab
         obj = {}
         obj.level = @level
         obj.tab   = tab
         @tab      = tab
         @publish( obj )
    else
      @dirNone(  dr )
    return

  dirNone:( dir ) ->
    console.error( 'Nav.dirNone unknown dir', { dir:dir, level:@level } )
    return

  adjPrac:( dir ) ->
    prc = @pracs(@plane)[@prac]
    adj = @build.adjacentPractice(prc,dir)
    adj

  getDisp:( dir, practice ) ->
    @build.getDir( practice, dir )

  @pracs:( plane ) ->
    @batch[plane].data[plane].pracs

  @disps:( plane, prac ) ->
    @batch[plane].data[plane][prac].disps

  ###
      switch dir
      when 'west'  then @publish( { level:@level, prac:@prac } )
      when 'north' then
      when 'east'  then
      when 'south' then
      when 'next'  then
      when 'prev'  then
      else               @dirNone( dir )
    return
  ###