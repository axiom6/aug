
class Dir

  constructor:( @nav ) ->
    @komps = @nav.komps
    @build = @nav.build
    @debug = true
    @keyEvents()

  keyEvents:() ->
    keyDir = (event) =>
      switch event.key
        when 'ArrowRight' then @dir( 'east'  )
        when 'ArrowLeft'  then @dir( 'west'  )
        when 'ArrowDown'  then @dir( 'south' )
        when 'ArrowUp'    then @dir( 'north' )
        when '+'          then @dir( 'next'  )
        when '-'          then @dir( 'prev'  )
    document.addEventListener('keydown', (event) => keyDir(event) )
    return

  dir:( direct ) =>
    if @nav.isApp('Muse')
      switch @nav.level
        when 'Comp' then @dirComp( direct )
        when 'Prac' then @dirPrac( direct )
        when 'Disp' then @dirDisp( direct )
        else             @dirComp( direct )
    else if @nav.pageKey isnt 'none' and ( direct is 'west' or direct is 'east' )
      @dirPage( direct )
    else
      @dirComp( direct )
    return

  dirComp:( dir ) ->
    return if not @komps? or @nav.compKey is 'none'
    compDir = @komps[@nav.compKey][dir]
    msg         = {}
    msg.source  = "#{'Dir.dirComp'}(#{dir})"
    msg.compKey = compDir
    @nav.pub( msg )
    return

  dirPrac:( dir ) ->
    return if @nav.compKey is 'none' or @nav.pracKey is 'none'
    pracs = @build.getPractices( @nav.compKey )
    prac  = @build.adjacentPractice( pracs[@nav.pracKey], dir )
    msg         = {}
    msg.source  = "#{'Dir.dirPrac'}(#{dir})"
    msg.pracKey = prac.name
    msg.compKey = @build.getPlane( msg.pracKey )
    if @debug
      console.log( "Dir.dirPrac()",  { dir:dir,
      nextPrac:msg.pracKey, prevPrac:@nav.pracKey,
      nextComp:msg.compKey, prevComp:@nav.compKey, prac:prac } )
    @nav.pub( msg )
    return

  dirDisp:( dir ) ->
    return if @nav.compKey is 'none' or @nav.pracKey is 'none' or @nav.dispKey is 'none'
    pracs = @build.getPractices( @nav.compKey )
    prac  = @build.adjacentPractice( pracs[@nav.pracKey], dir )
    msg         = {}
    msg.source  = "#{'Dir.dirDisp'}(#{dir})"
    msg.pracKey = prac.name
    msg.compKey = @build.getPlane( msg.pracKey )
    msg.dispKey = @build.getNextDispKey( @nav.compKey, msg.compKey, @nav.pracKey, msg.pracKey, @nav.dispKey )
    if @debug
      console.log( "Dir.dirDisp()",  { dir:dir,
      nextDisp:msg.dispKey, prevDisp:@nav.dispKey,
      nextPrac:msg.pracKey, prevPrac:@nav.pracKey, prac:prac,
      nextComp:msg.compKey, prevComp:@nav.compKey } )
    @nav.pub( msg ) if msg.dispKey isnt 'none'
    return

  dirPage:( dir ) ->
    console.log( "Dir.dirPage()", { dir:dir, pageKey:@nav.pageKey }  )
    return if @nav.compKey is 'none' or @nav.pageKey is 'none'
    pages   = @nav.toKeys( @nav.pages[@nav.compKey] )
    return if pages.length <= 1
    pageIdx = -1
    i       =  0
    for i in [0...pages.length] when pages[i].name is @nav.pageKey
      pageIdx = i
    if      dir is "next"
      pageIdx = if pageIdx < pages.length-1 then pageIdx + 1 else 0
    else if dir is "prev"
      pageIdx = if pageIdx is 0 then pages.length-1 else pageIdx - 1
    msg        = {}
    msg.source  = "#{'Nav.dirPage'}(#{dir})"
    msg.pageKey = pages[pageIdx].key
    @nav.pub( msg )
    return

export default Dir