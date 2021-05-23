
import Local  from '../store/Local.js'

class TestMgr

  constructor:( @nav, @appName ) ->
    @dbName = 'Test'
    @local  = new Local( @nav.stream, @dbName )

  doPubs:( pubs ) =>       # CoffeeScript implicitly makes doReplay()
    for obj in pubs   #   async when in encounters await
      await @nav.sleep( 1000 )
      obj.source = 'Replay'
      @nav.pub( obj, true )
    @local.add( @dbName, @appName+'Pubs', @nav.pubs )
    return

  doUrls:( urls ) =>
    for url in urls
      await @nav.sleep( 1000 )
      @nav.toMsg( url )
    @local.add( @dbName, @appName+'Pubs', @nav.pubs )
    return

  myUrls: () -> [
    'http://localhost:3000/Home'
    'http://localhost:3000/Prin'
    'http://localhost:3000/Prin/Embrace'
    'http://localhost:3000/Info'
    'http://localhost:3000/Info?page=Topics'
    'http://localhost:3000/Info?page=Topics&innovate=Soft'
    'http://localhost:3000/Info/Team'
    'http://localhost:3000/Info/Team/Collab'
    'http://localhost:3000/Info/Team/Collab?page=Topics'
    'http://localhost:3000/Info/Team?page=Graphs'
    'http://localhost:3000/Cube' ]

export default TestMgr