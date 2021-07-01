
import { tester } from './Tester.js'

import Stream from '../base/util/Stream.js'

# git remote set-url origin 'https://axiom-muse:Axiom66#@github.com/axiom6-muse/viz.git'

class UnitTester

  UnitTester.appName = 'Initial'
  UnitTester.debug   = false

  UnitTester.start = (href) ->
    console.log( "Initial.start()", href )
    UnitTester.href = href
    UnitTester.init()
    return

  UnitTester.init =   () ->
    subjects           = ["TestStatus","TestString","TestSummary"]
    streamLog          = { subscribe:false, publish:false, subjects:subjects }
    UnitTester.stream  = new Stream( subjects, streamLog )

    # For illustration purposes, because we are just resseting the defaults
    tester.setOptions( { testing:true, archive:true, verbose:false, debug:false,
    statusSubject:"TestStatus", stringSubject:"TestString", summarySubject:"TestSummary" } )

    tester.injectStream( UnitTester.stream )
    UnitTester.stream.subscribe( 'TestSummary', "Initial", (summary) => UnitTester.onSummary(summary) )
    inViteJS = tester.isDef(`import.meta.env`)
    if inViteJS
      paths =       tester.toKeys( `import.meta.glob("/lib/**/*-unit.js")` )
      paths.concat( tester.toKeys( `import.meta.glob("/pub/**/*-unit.js")` ) )
    else
      paths = ["/lib/pub/test/Type-unit.js",   "/lib/pub/base/util/Stream-unit.js",
               "/lib/pub/test/Tester-unit.js", "/lib/pub/base/draw/Vis-unit.js"]
    tester.runUnitTests( paths )
    return

  UnitTester.onSummary = (summary) =>
    # console.log( "Initial.onSummary(summary)", summary )
    sum       = document.getElementById('summary')
    lines     = summary.split( "\n" )
    for line in lines
      div = document.createElement( 'div' )
      div.style = "font-size:3vmin;"
      div.append( line )
      sum.append( div  )
    return

export default UnitTester

###
    # This is vite.js dependent with import.meta.glob() and its dynamic await importer
  # Can't pass glob patterns like "/pub/xx/x-unit.js"
  Initial.runUnitTestsViteJS = ( modules ) ->
    console.log( "Tester.runUnitTestsViteJS()", { modules:modules, glob:"/lib/xx/x-unit.js" } ) if @debug
    for own path, importer of modules
      modules[path]().then( (importer) =>
        console.log( path,   importer ) if @debug
        await importer
        Initial.count++
        if Initial.count is Initial.total and not Initial.summaryPublished
           Initial.summaryPublished = true
           Initial.stream.publish( "TestSummay", tester.summary() )
           tester.log( tester.summary() )
        return )
###
