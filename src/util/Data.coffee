

import Util from '../util/Util.js'

class Data

  Data.hosted    = "https://ui-48413.firebaseapp.com/"
  Data.local     = "http://localhost:63342/muse/public/"
  Data.localJSON = "http://localhost:63342/muse/public/json"

  Util.noop( Data.hosted, Data.planeData, Data.refine, Data.asyncJSON )

  @refine:( data, type ) ->
    return  data if type is 'None'
    data.comps = {}
    for ckey, comp of data when Util.isChild(ckey)
      # console.log( 'Data.refine comp', comp )
      data.comps[ckey] = comp
      comp['name']     = ckey if not comp['name']?
      comp.pracs = {}
      for pkey, prac of comp when Util.isChild(pkey)
        # console.log( '  Data.refine prac', prac )
        comp.pracs[pkey] = prac
        prac['name']     = pkey if not prac['name']?
        prac.disps = {}
        for dkey, disp of prac  when Util.isChild(dkey)
          prac.disps[dkey] = disp
          disp['name']     = dkey if not disp['name']?
          disp.areas = {}
          for akey, area of disp  when Util.isChild(akey)
            disp.areas[akey] = area
            area['name']     = akey if not area['name']?
            area.items = {}
            for ikey, item of area when Util.isChild(ikey)
              area.items[ikey] = item
              item['name']   = ikey if not item['name']?
              item.bases = {}
              for bkey, base of item when Util.isChild(bkey)
                item.bases[bkey] = base
                base['name'] = bkey if not base['name']?
    data

  # ---- Read JSON with batch async

  @batchRead:( batch, callback, create=null ) ->
    for  own key, obj of batch
      @batchJSON( obj,   batch, callback, create )
    return

  @batchComplete:( batch ) ->
    for own key, obj of batch
      return false if not obj['data']
    true

  @batchJSON:( obj, batch, callback, refine=null ) ->
    url = Data.baseUrl() + obj.url
    fetch( url )
      .then( (response) =>
        return response.json() )
      .then( (data) =>
        obj['data'] = if Util.isFunc(refine) then refine( data, obj.type ) else data
        callback( batch ) if Data.batchComplete( batch ) )
      .catch( (error) =>
        console.error( "Data.batchJSON()", { url:url, error:error } ) )
    return

  @asyncJSON:( url, callback ) ->
    url = Data.baseUrl() + url
    fetch( url )
      .then( (response) =>
        response.json() )
      .then( (data) =>
        callback( data ) )
      .catch( (error) =>
        console.error( "Data.asyncJSON()", { url:url, error:error } ) )
    return

  @planeData:( batch, plane ) ->
    batch[plane].data[plane]

  @baseUrl:() ->
    if window.location.href.includes('localhost') then Data.local else Data.hosted

  # ------ Quick JSON read ------

  @read:( url, callback ) ->
    if Util.isObj( url )
      Data.readFile(  url, callback )
    else
      Data.asynsJson( url, callback )
    return

  @readFile:( fileObj, doJson ) ->
    fileReader = new FileReader()
    fileReader.onerror = (e) -> console.error( 'Store.readFile', fileObj.name, e.target.error )
    fileReader.onload  = (e) -> doJson( JSON.parse(e.target.result) )
    fileReader.readAsText( fileObj )
    return

  @saveFile:( data, fileName ) ->
    htmlBlob = new Blob( [data], { type:"text/html;charset=utf-8" } )
    htmlUrl  = window['URL'].createObjectURL(htmlBlob)
    downloadLink          = document.createElement("a")
    downloadLink.href     = htmlUrl
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    return

  Data.Databases = {
    color: {
      id:"color"
      key:"id"
      uriLoc:Data.localJSON+'/color'
      uriWeb:'https://github.com/axiom6/ui/data/color'
      tables:['master','ncs','gray'] }
    exit: {
      id:"exit"
      key:"_id"
      uriLoc:Data.localJSON+'/exit'
      uriWeb:'https://github.com/axiom6/ui/data/exit'
      tables:['ConditionsEast','ConditionsWest','Deals','Forecasts','I70Mileposts','SegmentsEast','SegmentsWest'] }
    radar:{
      id:"radar"
      key:"name"
      uriLoc:Data.localJSON+'/radar'
      uriWeb:'https://github.com/axiom6/ui/data/radar'
      tables:['axiom-techs','axiom-quads','axiom-techs-schema','axiom-quads-schema','polyglot-principles'] }
    sankey:{
      id:"radar"
      uriLoc:Data.localJSON+'/sankey'
      uriWeb:'https://github.com/axiom6/ui/data/sankey'
      tables:['energy','flare','noob','plot'] }
    muse:{
      id:"muse"
      uriLoc:Data.localJSON+'/muse'
      uriWeb:'https://github.com/axiom6/ui/data/muse'
      tables:['Columns','Rows','Practices'] }
    pivot:{
      id:"pivot"
      uriLoc:Data.localJSON+'/pivot'
      uriWeb:'https://github.com/axiom6/ui/data/pivot'
      tables:['mps'] }
    geo:{
      id:"geo"
      uriLoc:Data.localJSON+'/geo'
      uriWeb:'https://github.com/axiom6/ui/data/geo'
      tables:['upperLarimerGeo']
      schemas:['GeoJSON'] }
    f6s:{
      id:"f6s"
      uriLoc:Data.localJSON+'/f6s'
      uriWeb:'https://github.com/axiom6/ui/data/fs6'
      tables:['applications','followers','mentors','profile','teams'] }
  }

export default Data