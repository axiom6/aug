
import { tester } from '../../../lib/pub/util/Util.js'
import Prin from '../../../data/muse/Prin.json'
import Rows from '../../../data/muse/Rows.json'
import Info from '../../../data/muse/Info.json'
import Know from '../../../data/muse/Know.json'
import Wise from '../../../data/muse/Wise.json'
#mport Soft from '../../../data/inno/Soft.json'
#mport Data from '../../../data/inno/Data.json'
#mport Scie from '../../../data/inno/Scie.json'
#mport Math from '../../../data/inno/Math.json'

class MuseLD

  constructor:( @Home ) ->
    @site      = "http://example.com/"
    @jsonLD    = @toJsonLD(@site)
    @jsonLDStr = JSON.stringify(@jsonLD)
    @children  = []

  toJsonLD:(site) ->
    jsonLD = {}
    jsonLD["@context"] = {
      "principles":  "#{site}principles",
      "refinements": "#{site}refinements",
      "information": "#{site}information",
      "knowledge":   "#{site}knowledge",
      "wisdom":      "#{site}wisdom" }
    jsonLD['principles']  = @toPracticesLD(Prin,site)
    jsonLD['refinements'] = @toPracticesLD(Rows,site)
    jsonLD['information'] = @toPracticesLD(Info,site)
    jsonLD['knowledge']   = @toPracticesLD(Know,site)
    jsonLD['wisdom']      = @toPracticesLD(Wise,site)
    # console.log( 'MuseLD.toJsonLD()', jsonLD )
    jsonLD

  isChild:( key ) ->
    tester.isChild(key)
    
  toPracLD:( pkey, prac, site ) ->
    pracLD              = {}
    pracLD["@context"] = {
      '@type':       "#{site}",
      "name":        "#{site}name",
      "column":      "#{site}column",
      "row":         "#{site}row",
      "plane":       "#{site}plane",
      "description": "#{site}description" }
    pracLD['@type']     = 'Practice'
    pracLD.name         = pkey
    pracLD.column       = prac.column
    pracLD.row          = prac.row
    pracLD.plane        = prac.plane
    pracLD.description  = prac.desc
    pracLD
    
  toDispLD:( dkey, disp, site ) ->
    dispLD              = {}
    dispLD["@context"] = {
      '@type':       "#{site}",
      "name":        "#{site}name",
      "description": "#{site}description" }
    dispLD['@type']     = 'Discipline'
    dispLD.name         = dkey
    dispLD.description  = disp.desc
    dispLD

  toPracticesLD:( data, site ) ->
    practices = {}
    for pkey, prac of data when @isChild(pkey)
      practices[pkey] = @toPracLD( pkey, prac, site )
      practices[pkey].disciplines = {}
      for dkey, disp of prac  when @isChild(dkey)
        practices[pkey].disciplines[dkey] = @toDispLD( dkey, disp, site  )
    practices

  @toJsonScript:(jsonLD) ->
    html  = """<script type="application/ld+json">"""
    html += JSON.stringify(jsonLD)
    html += """</script"""
    html

  ###
    @AugmRoutes = [
      { path: '/',       name:'Home',   components:{ Home:   Home } },
      { path: '/math',   name:'Math',   components:{ Math:   Home.Math }, children: [
        { path:'ML',     name:'MathML', components:{ MathML: loader.load('MathND') } },
        { path:'EQ',     name:'MathEQ', components:{ MathEQ: loader.load('MathND') } } ] },
      { path: '/draw',   name:'Draw',   components:{ Draw:   loader.load('Draw') } },
      { path: '/hues',   name:'Hues',   components:{ Hues:   loader.load('Hues') } },
      { path: '/tool',   name:'Tool',   components:{ Tool:   Home.Tool }, children: [
        { path:'Gauges', name:'Gauges', components:{ Gauges: loader.load('Tools') } },
        { path:'Widget', name:'Widget', components:{ Widget: loader.load('Tools') } } ] },
      { path: '/cube',   name:'Cube',   components:{ Cube:   loader.load('Cube') } },
      { path: '/wood',   name:'Wood',   components:{ Wood:   loader.load('Wood') } } ]

    Muse.routes = [
      { path: '/',     name:'Home', components:{ Home: Home      } },
      { path: '/Prin', name:'Prin', components:{ Prin: Home.Prin } },
      { path: '/Comp', name:'Comp', components:{ Comp: Home.Comp } },
      { path: '/Prac', name:'Prac', components:{ Prac: Home.Prac } },
      { path: '/Disp', name:'Disp', components:{ Disp: Home.Disp } },
      { path: '/Cube', name:'Cube', components:{ Cube: Home.Cube } } ]
  ###

  toRoutes:() ->
    comps  = [Prin,Info,Know,Wise]
    routes = []
    routes.push( @toPath( '/', 'Home', 'Comp', 'Home' ) )
    for comp in comps
      compName = @toCompName(comp)
      vueComp  = if compName is 'Principles' then 'Home.Prin' else 'Home.Comp'
      routes.push( @toPath( '/'+compName, compName, 'Parent', vueComp ) )
      for pkey, prac of comp when @isChild(pkey)
        routes.push( @toPath( pkey, pkey, 'Child', 'Home.Prac' ) )
    routes.push( @toPath( '/Cube', 'Cube', 'Comp', 'Home.Cube' ) )
    routes

  toPath:( path, name, type, comp ) ->
    @children = [] if type is 'Parent'
    route = {}
    route.path = path
    route.name = name
    switch type
      when 'Comp'
        route.components = { "#{name}":comp }
      when 'Parent'
        route.components = { "#{name}":comp }
        route.children   = @children
      when 'Child'
        route.components = { "#{name}":comp }
        @children.push( route )
    route

  toCompName:( comp ) ->
    if      comp is Prin then 'Principles'
    else if comp is Info then 'Information'
    else if comp is Know then 'Knowledge'
    else if comp is Wise then 'Wisdom'
    else                      'none'

export default MuseLD