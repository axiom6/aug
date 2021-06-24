
import { tester } from './Tester.js'

import Stream from '../base/util/Stream.js'

# git remote set-url origin 'https://axiom-muse:Axiom66#@github.com/axiom6-muse/viz.git'

class Initial

  Initial.appName = 'Initial'
  Initial.debug   = false

  Initial.start = (href) ->
    console.log( "Initial.start()", href )
    Initial.href = href
    Initial.init()
    return

  Initial.init =   () ->
    subjects        = ["TestStatus","TestString","TestSummary"]
    streamLog       = { subscribe:false, publish:false, subjects:subjects }
    Initial.stream  = new Stream( subjects, streamLog )

    # For illustration purposes, because we are just resseting the defaults
    tester.setOptions( { testing:true, archive:true, verbose:false, debug:false,
    statusSubject:"TestStatus", stringSubject:"TestString", summarySubject:"TestSummary" } )

    tester.injectStream( Initial.stream )
    Initial.stream.subscribe( 'TestSummary', "Initial", (summary) => Initial.onSummary(summary) )
    inViteJS = tester.isDef(`import.meta.env`)
    if inViteJS
      modulesLib = `import.meta.glob("/lib/**/*-unit.js")`
      modulesPub = `import.meta.glob("/pub/**/*-unit.js")`
      Initial.total = tester.toKeys(modulesLib).length + tester.toKeys(modulesPub).length
      Initial.count = 0
      Initial.summaryPublished = false
      Initial.runUnitTestsViteJS( modulesLib )
      Initial.runUnitTestsViteJS( modulesPub )
    else
      paths = ["/lib/pub/base/util/Stream-unit.js","/lib/pub/test/Tester-unit.js","/lib/pub/base/draw/Vis-unit.js"]
      tester.runUnitTests( paths )
    return

  # This is vite.js dependent with import.meta.glob() and its dynamic await importer
  # Can't pass glob patterns like "/pub/xx/x-unit.js"
  Initial.runUnitTestsViteJS = ( modules ) ->
    console.log( "Tester.runUnitTestsViteJS()", { modules:modules, glob:"/lib/**/*-unit.js" } ) if @debug
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

  Initial.onSummary = (summary) =>
    # console.log( "Initial.onSummary(summary)", summary )
    sum       = document.getElementById('summary')
    lines     = summary.split( "\n" )
    for line in lines
      div = document.createElement( 'div' )
      div.style = "font-size:3vmin;"
      div.append( line )
      sum.append( div  )
    return

export default Initial
