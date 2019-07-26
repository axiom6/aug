
import Build from '../../ikw/cube/Build.js';

class Nav

  constructor:( @stream, @batch, @comp ) ->
    @build = new Build(  @batch, @comp )
    @level = 'Comp' # Plane Prac Disp Tab
    @prac  = 'None'
    @disp  = 'None'
    @tab   =  'Prac'
    @tabs  = ['Prac','Conn','Data','Enli']  # Set by the active view component

  # Publish twice because Tocs needs to update comp before any Nav view updates
  pub:( obj ) ->
    console.log('Nav.pub()', obj )
    @stream.publish( 'Toc',  obj )
    @stream.publish( 'Nav',  obj )
    return

  set:( obj ) ->
    for own key,   val of obj
          @[key] = val
    return

  dir:( dr ) =>
    console.log('Nav.dir()', dr )
    switch @level
      when 'Comp'  then @dirPrac( dr )
      when 'Prac'  then @dirPrac( dr )
      when 'Disp'  then @dirDisp( dr )
      when 'Tabs'  then @dirTabs( dr )
      else              @dirNone( dr )
    return

  dirPrac:( dir ) ->
    adj = @adjPrac( dir )
    console.log('Nav.adj()', adj )
    if adj.name isnt 'None'
      obj = {}
      obj.level = @level
      if adj.plane isnt @comp
         obj.comp  = adj.plane
         @comp     = adj.plane
      if adj.name  isnt @prac
         obj.prac  = adj.name
         @prac     = adj.name
      @pub( obj )
    return

  dirDisp:( dir ) ->
    prc = @pracs(@comp)[@prac] # Here adj is current practice
    dis = prc[@disp]

    if dis.dir is dir # if current prac.dir is dir we will nav to adjacent prac
       adj = @adjPrac(dir)
       dis = @getDisp( @adjDir(dir), adj )
    else
       adj = prc
       dis = @getDisp( dir, prc )

    if adj.name isnt 'None'
      obj = {}
      obj.level = @level
      if adj.plane isnt @comp
         obj.comp  = adj.plane
         @comp     = adj.plane
       obj.prac  = adj.name
       @prac     = adj.name
       obj.disp  = dis.name
       @disp     = dis.name
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
         obj.tab   = tab
         @tab      = tab
         @pub( obj )
    else
      @dirNone(  dr )
    return

  dirNone:( dir ) ->
    console.error( 'Nav.dirNone unknown dir', { dir:dir, level:@level } )
    return

  adjPrac:( dir ) ->
    prc = @pracs(@comp)[@prac]
    adj = @build.adjacentPractice(prc,dir)
    console.log( 'Nav.adjPrac()', { dor:dir, prc:prc, adj:adj } )
    adj

  getDisp:( dir, practice ) ->
    @build.getDir( practice, dir )

  adjDir:( dir ) ->
    switch dir
      when 'west'  then 'east'
      when 'north' then 'south'
      when 'east'  then 'west'
      when 'south' then 'north'
      when 'next'  then 'prev'
      when 'prev'  then 'next'
      else              'west'

  pracs:(  comp ) ->
    @batch[comp].data[comp].pracs

  disps:(  comp, prac ) ->
    @batch[comp].data[comp][prac].disps

export default Nav