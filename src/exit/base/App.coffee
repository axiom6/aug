
import $             from 'jquery'
import Util          from '../util/Util.js'
import Stream        from '../util/Stream.js'
import Rest          from '../Rest.js'
import Data          from '../Data.js'           # Static class with no need to instaciate
import Model         from '../Model.js'
import Simulate      from '../Simulate.js'
import DestinationUI from '../ui/DestinationUI.js'
import GoUI          from '../ui/GoUI.js'
import TripUI        from '../ui/TripUI.js'
import DealsUI       from '../ui/DealsUI.js'
import NavigateUI    from '../ui/NavigateUI.js'
import UI            from '../ui/UI.js'

class App

  # This kicks off everything
  $(document).ready ->
    Util.debug = true # Swithes  Util.dbg() debugging on or off
    Util.init()
    Util.app = new App( 'Local' ) # @dataSource = 'Rest', 'RestThenLocal', 'Local', 'LocalForecasts'

  constructor:( @dataSource='RestThenLocal' ) ->

    @subjects = ['Icons','Location','Screen','Source','Destination','Trip','Forecasts']

    # Instantiate main App classes
    logSpec     = { subscribe:false, publish:false, complete:false, subjects:@subjects }
    @stream     = new Stream( @subjects, logSpec )
    @rest       = new Rest(   @stream        )
    @model      = new Model(  @stream, @rest, @dataSource )

    @destinationUI = new DestinationUI(  @stream, @thresholdUC )
    @goUI          = new GoUI(           @stream )
    @tripUI        = new TripUI(         @stream )
    @dealsUI       = new DealsUI(        @stream )
    @navigateUI    = new NavigateUI(     @stream )
    @ui            = new UI(             @stream, @destinationUI, @goUI, @tripUI, @dealsUI, @navigateUI )

    @ready()
    @position( @ui.toScreen('Portrait' ) )

    # Run simulations and test if test modules presents
    @simulate = new Simulate( @, @stream )

    if Util.hasModule( 'app/App.Test',false)
      $('body').css( { "background-image":"none" } )
      $('#App').hide()
      @appTest = new App.Test( @, @stream, @simulate, @rest, @model )

    if Util.hasModule( 'ui/UI.Test',false)
      @uiTest = new UI.Test( @ui, @trip, @destinationUI, @goUI, @tripUI, @navigateUI )

    # Jumpstart App
    # @stream.publish( 'Source',      'Denver' )
    # @stream.publish( 'Destination', 'Vail'   )

    Util.noop( Data, @appTest, @uiTest )

  addToHead:() ->
    # manifest = """<link href="manifest.json"  rel="manifest" crossorigin="use-credentials">"""
    # siteLink = """<link href="https://vit-muse.web.app/" rel="canonical">"""
    maniElem                = document.createElement('link')
    maniElem.href           = "manifest.json"
    maniElem.rel            = "manifest"
    maniElem['crossorigin'] = "use-credentials"
    siteElem = document.createElement('link')
    # console.log( 'Location', window.location.href )
    siteElem.href        =   window.location.href # "https://vit-muse.web.app/" if window.location.contains('vit-muse')
    siteElem.rel         = "canonical"
    document.getElementsByTagName("head")[0].appendChild(maniElem);
    document.getElementsByTagName("head")[0].appendChild(siteElem);
    return


  ready:() ->
    @addToHead()
    @model.ready()
    @ui.ready()

  position:( screen ) ->
    @ui.position( screen )
    
export default App
