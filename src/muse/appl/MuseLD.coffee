
import Util from '../../base/util/Util.js'
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

  constructor:() ->
    @site      = "http://example.com/"
    @jsonLD    = @toJsonLD(@site)
    @jsonLDStr = JSON.stringify(@jsonLD)


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
    console.log( 'MuseLD.toJsonLD()', jsonLD )
    jsonLD

  isChild:( key ) ->
    Util.isChild(key)
    
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

export default MuseLD