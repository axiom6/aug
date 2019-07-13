

import Util from './Util.js'


class Data

  # Util.noop( Data.hosted, Data.planeData, Data.refine, Data.asyncJSON )

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
        prac.comp        = comp
        prac['name']     = pkey if not prac['name']?
        prac.disps = {}
        for dkey, disp of prac  when Util.isChild(dkey)
          prac.disps[dkey] = disp
          disp.prac        = prac
          disp['name']     = dkey if not disp['name']?
          disp.areas = {}
          for akey, area of disp  when Util.isChild(akey)
            disp.areas[akey] = area
            area.disp        = disp
            area['name']     = akey if not area['name']?
            area.items = {}
            for ikey, item of area when Util.isChild(ikey)
              area.items[ikey] = item
              item.area        = area
              item['name']     = ikey if not item['name']?
              item.bases = {}
              for bkey, base of item when Util.isChild(bkey)
                item.bases[bkey] = base
                base.item        = item
                base['name']     = bkey if not base['name']?
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

  # "Access-Control-Request-Headers": "*", "Access-Control-Request-Method": "*"

  @batchJSON:( obj, batch, callback, refine=null ) ->
    url = if obj.type is 'Font' then obj.url else Data.toUrl(obj.url)
    console.log( 'Data.batchJSON', obj.url, url )
    opt = { mode:'no-cors', headers:{ 'Content-Type':'application/json' } }
    fetch( url, opt )
      .then( (response) =>
        return response.json() )
      .then( (data) =>
        obj['data'] = if Util.isFunc(refine) then refine( data, obj.type ) else data
        callback( batch ) if Data.batchComplete( batch ) )
      .catch( (error) =>
        console.error( "Data.batchJSON()", { url:url, error:error } ) )
    return

  @asyncJSON:( urla, callback ) ->
    url = Data.toUrl(urla)
    console.log( 'Data.asyncJSON', urla, url )
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

  @toUrl:(url) ->
    if window.location.href.includes('localhost') then Data.local+url else Data.hosted+url
           
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

Data.local   = "app/data/"
Data.hosted  = "https://augm-d4b3c.firebaseapp.com/augm/app/data/"

export default Data