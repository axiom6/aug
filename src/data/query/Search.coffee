
import Vis  from '../../../lib/pub/base/draw/Vis.js'

class Search

  constructor:() ->

  cols:() -> [
    { title:"Name",        field:"name"   },
    { title:"Row",         field:"row"    },
    { title:"Column",      field:"column" },
    { title:"Plane",       field:"plane"  },
    { title:"Description", field:"desc"   } ];

  opts:( pracs ) -> {
    columns:@cols(),         #  Column specs
    data:@toTabuRows(pracs), #  load row data from array
    dataTree:true,
    height:'98%',             # Height inside comp pane
    layout:"fitDataTable",    # fit columns to width of table fitColumns fitDataFill  fitDataTable
    responsiveLayout:"hide",  # hide columns that dont fit on the table
    tooltips:true,            # show tool tips on cells
    addRowPos:"top",          # when adding a new row, add it to the top of the table
    history:true,             # allow undo and redo actions on the table
    pagination:"local",       # paginate the data
    paginationSize:7,         # allow 7 rows per page of data
    movableColumns:true,      # allow column order to be changed
    resizableRows:true,       # allow row order to be changed
  }

  toTabuRows:( pracs ) ->
    rows = []
    for pkey, prac of pracs when Vis.isChild(pkey) and prac.plane isnt 'Prin'
      prac['name']      = pkey if not prac['name']?
      prac['_children'] = []
      rows.push( prac )
      for dkey, disp of prac  when Util.isChild(dkey)
        disp['name']   = dkey if not disp['name']?
        disp['row']    = prac.row
        disp['column'] = prac.column
        disp['plane']  = prac.plane
        prac['_children'].push( disp )
    # console.log( 'TabuComp.toTabuRows()', rows )
    rows


export default Search