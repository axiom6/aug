
import { tester } from './Tester.js'

import Stream from '../base/util/Stream.js'

# git remote set-url origin 'https://axiom-muse:Axiom66#@github.com/axiom6-muse/viz.git'

class UnitTester

  UnitTester.appName = 'Initial'
  UnitTester.debug   = false

  UnitTester.start = (href) ->
    console.log( "-- Start  --", href )
    UnitTester.href = href
    UnitTester.init()
    return

  UnitTester.init =   () ->
    subjects           = ["TestStatus","TestString","TestSummary"]
    streamLog          = { subscribe:false, publish:false, subjects:subjects }
    UnitTester.stream  = new Stream( subjects, streamLog )

    # For illustration purposes, because we are just resseting the defaults
    tester.setOptions( { testing:true, archive:false, verbose:false, debug:false,
    statusSubject:"TestStatus", stringSubject:"TestString", summarySubject:"TestSummary" } )

    tester.injectStream( UnitTester.stream )
    UnitTester.stream.subscribe( 'TestSummary', "Initial", (summary) => UnitTester.onSummary(summary) )
    inViteJS = tester.isDef(`import.meta.env`)
    if inViteJS
      paths =       tester.toKeys( `import.meta.glob("/lib/**/*-unit.js")` )
      paths.concat( tester.toKeys( `import.meta.glob("/pub/**/*-unit.js")` ) )
    else
      paths = ["/lib/pub/test/Type-unit.js",   "/lib/pub/base/util/Stream-unit.js",
               "/lib/pub/test/Spec-unit.js",
               "/lib/pub/test/Tester-unit.js", "/lib/pub/base/draw/Vis-unit.js"]
    paths = ["/lib/pub/test/Type-unit.js"]
    tester.runUnitTests( paths )
    return

  UnitTester.onSummary = (summary) ->
    # console.log( "Initial.onSummary(summary)", summary )
    sum       = document.getElementById('summary')
    sum.stype = ""
    lines     = summary.split( "\n" )
    for line in lines
      div = document.createElement( 'div' )
      div.style = "font-size:3vmin; text-align:left; white-space:pre;"
      div.append( line )
      sum.append( div  )
    div = document.createElement( 'div' )
    div.append( "  "   )
    div.style = "font-size:3vmin; text-align:left; white-space:pre;"
    sum.append( div  )
    return

export default UnitTester
