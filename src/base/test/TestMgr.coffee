
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
      @nav.pub( @nav.toPub(url), true )
    @local.add( @dbName, @appName+'Urls', @nav.urls )
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

  myCrawls: () -> [
    "http://localhost:3000/Prin?page=Icons",
    "http://localhost:3000/Prin?page=Topics",
    "http://localhost:3000/Prin/Embrace?page=Topics",
    "http://localhost:3000/Prin/Embrace?page=Graphs",
    "http://localhost:3000/Prin/Embrace?page=Texts",
    "http://localhost:3000/Info?page=Icons&innovate=Core",
    "http://localhost:3000/Info?page=Topics&innovate=Core",
    "http://localhost:3000/Info?page=Graphs&innovate=Core",
    "http://localhost:3000/Info?page=Texts&innovate=Core",
    "http://localhost:3000/Info?page=Texts&innovate=Soft",
    "http://localhost:3000/Info?page=Texts&innovate=Data",
    "http://localhost:3000/Know?page=Texts&innovate=Core",
    "http://localhost:3000/Know?page=Graphs&innovate=Core",
    "http://localhost:3000/Know?page=Topics&innovate=Core",
    "http://localhost:3000/Know?page=Icons&innovate=Core",
    "http://localhost:3000/Know?page=Icons&innovate=Science",
    "http://localhost:3000/Know?page=Icons&innovate=Math",
    "http://localhost:3000/Wise?page=Icons&innovate=Core",
    "http://localhost:3000/Wise?page=Topics&innovate=Core",
    "http://localhost:3000/Wise?page=Graphs&innovate=Core",
    "http://localhost:3000/Wise?page=Texts&innovate=Core",
    "http://localhost:3000/Defs" ]

export default TestMgr