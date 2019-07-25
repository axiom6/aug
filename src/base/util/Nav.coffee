
import Build from '../../pub/ikw/cube/Build.js';

class Nav

  constructor:( @stream, @batch, @plane ) ->
    @build = new Build(  @batch, @plane )
    @level = 'Plane' # Plane Prac Disp Tab
    @comp  = 'None'
    @prac  = 'None'
    @disp  = 'None'
    @tab   = 'None'
    @tabs  = []  # Set by the active view component

  subscribe:() ->
    @stream.subscribe( 'Dir', 'Nav', @onDir )

  publish:( obj ) ->
    @stream.publish( 'Nav', obj )

  publishAll:() ->
    @stream.publish( 'Nav', { level:@level, comp:@comp, plane:@plane, prac:@prac, disp:@disp, tab:@tab, tabs:@tabs } )

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    return

  onDir:( dir ) =>
    switch @level
      when 'Plane' then @dirPlane( dir )
      when 'Prac'  then @dirPrac(  dir )
      when 'Disp'  then @dirDisp(  dir )
      when 'Tab'   then @dirTab(   dir )
      else              @dirNone(  dir )
    return

  dirPlane:( dir ) ->
    adj = @adjPrac( dir )
    if adj.name isnt 'None'
      @level = 'Plane'
      @plane = adj.plane
      @prac  = adj.name
      @publish( { level:@level, plane:@plane prac:@prac } )
    return

  dirPrac:( dir ) ->
    adj = @adjPrac( dir )
    if  adj.name isnt 'None'
      @prac = adj.name
      @publish( { level:@level, prac:@prac } )
    return

  dirDisp:( dir ) ->
    #dsp = @disps[@disp]
    #adj = @adjPrac( dir )
    #if  adj.name isnt 'None'

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