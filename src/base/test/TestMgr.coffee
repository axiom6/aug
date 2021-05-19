
import Local  from '../store/Local.js'

class TestMgr

  constructor:( @nav, @appName ) ->
    @dbName = 'Test'
    @local  = new Local( @nav.stream, @dbName )

  doReplay:() =>                      # CoffeeScript implicitly makes doReplay()
    for own key,obj of @nav.replays   #  async when in encounters await
      await @nav.sleep( 1000 )
      obj.source = 'Replay'
      @nav.pub( obj, true )
    @local.add( @dbName, @appName, @nav.replays )
    return

  doUrlMsg:() ->
    urls = [
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
    for url in urls
      @nav.toMsg( url )
    return

export default TestMgr