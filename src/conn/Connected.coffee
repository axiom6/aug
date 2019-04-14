
import Util    from '../util/Util.js'

class Connect

  Muse.Connect = Connect
  @id   = 0
  @msgs = []
  Util.noop( @toWest, @toEast, @toNorth, @toSouth, @toPrev, @toNext )
  # @migrateComplete = false
  # @StatusEnum  = ['Beg','In','End']
  # @MsgTypeEnum = ['Convey','Flow','Conduit']
  # @DirEnum     = ['West','East','North','South','Prev','Next']

  constructor:( @ui, @stream, @view, @page, @practice ) ->
    @name = @practice.name
    @msgs = {}

  ready:() ->
    [@west,@east,@north,@south,@prev,@next] = @adjacentConnects()
    # console.log( { name:@name, west:@west.name, east:@east.name, north:@north.name, south:@south.name, prev:@prev.name, next:@next.name } )
    @subscribe()
    return

  subscribe:() ->
    @stream.subscribe( 'Select',  'Connect', (select)  => @onSelect(  select  ) )
    @stream.subscribe( 'Content', 'Connect', (content) => @onContent( content ) )
    @stream.subscribe( 'Connect', 'Connect', (connect) => @onConnect( connect ) )
    @stream.subscribe( 'Test',    'Connect', (test)    => @onTest(    test    ) )

  adjacentConnects:() ->
    connects = []
    return connects if not @practice.column? # Somehow studies are getting mixed in
    for dir in ['east','west','north','south']
      prac    = @practice[dir]
      pane    = if prac.name isnt 'None'  then @view.getPaneOrGroup(prac.name,false) else @view.$empty
      connect = if pane.name isnt 'Empty' and pane.page? then pane.page.connect else { name:'None' }
      connects.push( connect )
    connects

  onSelect:(  select ) ->
    return if select.name isnt @name
    return

  onContent:( content ) ->
    return if content.content isnt 'Connect' or content.practice isnt @name
    return

  onTest:( topic ) ->
    switch topic
      when 'Populate'
        @stream.publish( 'Content', { content:"Connect", name:"All" } )
        Connect.testPopulate( @stream )
      when 'Migrate'
        @stream.publish( 'Content', { content:"Connect", name:"All" } )
        Connect.testMigrate(  @ui.prac  )
    return

  # Messaage subscriptions

  onConnect:( msg ) ->
    # console.log( 'onConnect', @isSrc(msg), @isMsg(msg), @name, msg )
    return if not @isSrc(msg) or not @isMsg(msg)
    msg.dir = @dir(msg)
    switch msg.type
      when 'Convey'  then @onConvey(  msg )
      when 'Flow'    then @onFlow(    msg )
      when 'Conduit' then @onConduit( msg )
      else console.error( 'Connect.onConnect() unknown msg type', msg.type )
    console.error( 'Connect.onConnect() msg not processed', msg.name, msg.id ) if msg.status isnt 'Beg'
    return
    
  onConvey:( convey ) ->
    return if not @isConvey( convey )
    if      convey.src is 'To'+@name then @onItem( convey, convey.dir )
    else if convey.src is @west.name then @onItem( convey, 'West'     )
    else if convey.src is @east.name then @onItem( convey, 'East'     )
    @msgs[convey.id] = convey
    convey.status = 'Beg'
    
  onFlow:( flow ) ->
    return if not @isFlow( flow )
    if      flow.src is 'To'+ @name then @onItem( flow, flow.dir )
    else if flow.src is @north.name then @onItem( flow, 'North'  )
    else if flow.src is @south.name then @onItem( flow, 'South'  )
    @msgs[flow.id] = flow
    flow.status = 'Beg'
    
  onConduit:( conduit ) ->
    return if not @isConduit( conduit )
    if      conduit.src is 'To'+@name then @onItem( conduit, conduit.dir )
    else if conduit.src is @prev.name then @onItem( conduit, 'Prev'      )
    else if conduit.src is @next.name then @onItem( conduit, 'Next'      )
    @msgs[conduit.id] = conduit
    conduit.status = 'Beg'

  # Message pushes to direction

  toWest:(  id ) -> @migrate( id, 'West'  )
  toEast:(  id ) -> @migrate( id, 'East'  )
  toNorth:( id ) -> @migrate( id, 'North' )
  toSouth:( id ) -> @migrate( id, 'South' )
  toPrev:(  id ) -> @migrate( id, 'Prev'  )
  toNext:(  id ) -> @migrate( id, 'Next'  )

  migrate:( id, dir  ) ->
    return if not @canMigrate( id, dir )
    msg     = @msgs[id]
    @rmItem( msg )
    msg.dir = dir
    msg.src = @name
    @connect(dir).onConnect( msg )
    delete   @msgs[msg.id]

  canMigrate:( id,  dir ) ->
    msg = @msgs[id]
    msg? and @dirOk(msg,dir) and @isConnected(dir) # and msg.status is 'End' - will check status later

  # --- UI Connect content ---

  onItem:( msg, dir ) ->
    htmlId = @page.contents.connect.htmlId+dir
    elem$      = @page.contents.connect.$.find('#'+htmlId)
    elem$.append( """<li id="#{htmlId+msg.id}">#{msg.name}</li>""" )
    msg.dir = dir
    return

  rmItem:( msg ) ->
    htmlId = @page.contents.connect.htmlId+msg.dir+msg.id
    $      = @page.contents.connect.$.find('#'+htmlId)
    $.remove()
    return

  dir:( msg ) ->
    dir = msg.dir
    if msg.src.substring(0,2) is 'To'
      switch @practice.column
        when 'Embrace'   then dir = 'West'
        when 'Encourage' then dir = 'East'
        when 'Innovate'
          switch @practice.row
            when 'Learn' then dir = 'North'
            when 'Do'    then dir = 'Next'
            when 'Share' then dir = 'South'
            else              dir = msg.dir
        else                  dir = msg.dir
    dir


  # --- Verifiers ---

  # Quick check for onConnect() subscription so no error messages
  isSrc:( msg ) ->
    return false if not msg? or not msg.src? or not msg.type?
    return true  if msg.src is 'To'+@name
    switch msg.type
      when 'Convey'  then msg.src is  @west.name or msg.src is  @east.name
      when 'Flow'    then msg.src is @north.name or msg.src is @south.name
      when 'Conduit' then msg.src is  @prev.name or msg.src is  @next.name
      else false

  isMsg:( msg ) ->
    ok = msg? and msg.id? and msg.name? and @isType(msg.type) and @isDir(msg.dir) and @isStatus(msg.status)
    console.error( 'Connect.isMsg()', 'msg      null' ) if not msg?
    console.error( 'Connect.isMsg()', 'msg.id   null' ) if msg? and not msg.id?
    console.error( 'Connect.isMsg()', 'msg.name null' ) if msg? and not msg.name?
    ok

  isConvey:(  convey  ) -> convey.type  is 'Convey'  and not @msgs[convey.id]?
  isFlow:(    flow    ) -> flow.type    is 'Flow'    and not @msgs[flow.id]?
  isConduit:( conduit ) -> conduit.type is 'Conduit' and not @msgs[conduit.id]?

  isType:( type ) ->
    ok = Util.contains( Connect.MsgTypeEnum, type )
    console.error( "Connect.isType() enum #{type} not", Connect.MsgTypeEnum  ) if not ok
    ok

  isDir:( dir ) ->
    ok = Util.contains( Connect.DirEnum, dir )
    console.error( "Connect.isDir() enum #{dir} not", Connect.DirEnum  ) if not ok
    ok

  isStatus:( status ) ->
    ok = Util.contains( Connect.StatusEnum, status )
    console.error( "Connect.isStatus() enum #{status} not", Connect.StatusEnum  ) if not ok
    ok

  isConnected:( dir ) ->
    @connect(dir).name isnt 'None'

  dirOk:( msg, dir ) ->
    switch  dir
      when 'West',  'East'  then msg.type is 'Convey'
      when 'North', 'South' then msg.type is 'Flow'
      when 'Prev',  'Next'  then msg.type is 'Conduit'
      else false

  connect:( dir ) ->
    switch  dir
      when 'West'  then @west
      when 'East'  then @east
      when 'North' then @north
      when 'South' then @south
      when 'Prev'  then @prev
      when 'Next'  then @next
      else
        console.error( 'Connect.toConnect() unknown direction', dir )
        @west

  # --- Class Tests

  @msg:( id, name, type, src, status='Beg' ) ->
    dir = 'West'
    msg = { id:id, name:name, type:type, src:src, dir:dir, status:status }
    Connect.msgs.push( msg )
    msg

  @testPopulate:( stream ) ->
    msg1 = Connect.msg( 1, 'Person',  'Convey',  'ToCollaborate' ); stream.publish( 'Connect', msg1 )
    msg2 = Connect.msg( 2, 'Entitle', 'Flow',    'ToConcept'     ); stream.publish( 'Connect', msg2 )
    msg3 = Connect.msg( 3, 'Channel', 'Convey',  'ToDiscover'    ); stream.publish( 'Connect', msg3 )
    msg4 = Connect.msg( 4, 'Trace',   'Convey',  'ToAdapt'       ); stream.publish( 'Connect', msg4 )
    msg5 = Connect.msg( 5, 'Screen',  'Flow',    'ToTechnology'  ); stream.publish( 'Connect', msg5 )
    msg6 = Connect.msg( 6, 'Review',  'Convey',  'ToBenefit'     ); stream.publish( 'Connect', msg6 )
    msg7 = Connect.msg( 7, 'Config',  'Convey',  'ToChange'      ); stream.publish( 'Connect', msg7 )
    msg8 = Connect.msg( 8, 'Support', 'Flow',    'ToFacilitate'  ); stream.publish( 'Connect', msg8 )
    msg9 = Connect.msg( 9, 'Comply',  'Convey',  'ToGovern'      ); stream.publish( 'Connect', msg9 )

  @testMigrate:( prac ) ->
    return if Connect.migrateComplete
    prac.migrateConnectMsg( 1, 'East'  )
    prac.migrateConnectMsg( 2, 'South' )
    prac.migrateConnectMsg( 3, 'West'  )
    prac.migrateConnectMsg( 4, 'East'  )
    #rac.migrateConnectMsg( 5, 'South' )
    prac.migrateConnectMsg( 6, 'West'  )
    prac.migrateConnectMsg( 7, 'East'  )
    prac.migrateConnectMsg( 8, 'North' )
    prac.migrateConnectMsg( 9, 'West'  )
    Connect.migrateComplete = true

export default Connect


