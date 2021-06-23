var Search;

import Vis from '../../../lib/pub/base/draw/Vis.js';

Search = class Search {
  constructor() {}

  cols() {
    return [
      {
        title: "Name",
        field: "name"
      },
      {
        title: "Row",
        field: "row"
      },
      {
        title: "Column",
        field: "column"
      },
      {
        title: "Plane",
        field: "plane"
      },
      {
        title: "Description",
        field: "desc"
      }
    ];
  }

  opts(pracs) {
    return {
      columns: this.cols(), //  Column specs
      data: this.toTabuRows(pracs), //  load row data from array
      dataTree: true,
      height: '98%', // Height inside comp pane
      layout: "fitDataTable", // fit columns to width of table fitColumns fitDataFill  fitDataTable
      responsiveLayout: "hide", // hide columns that dont fit on the table
      tooltips: true, // show tool tips on cells
      addRowPos: "top", // when adding a new row, add it to the top of the table
      history: true, // allow undo and redo actions on the table
      pagination: "local", // paginate the data
      paginationSize: 7, // allow 7 rows per page of data
      movableColumns: true, // allow column order to be changed
      resizableRows: true // allow row order to be changed
    };
  }

  toTabuRows(pracs) {
    var disp, dkey, pkey, prac, rows;
    rows = [];
    for (pkey in pracs) {
      prac = pracs[pkey];
      if (!(Vis.isChild(pkey) && prac.plane !== 'Prin')) {
        continue;
      }
      if (prac['name'] == null) {
        prac['name'] = pkey;
      }
      prac['_children'] = [];
      rows.push(prac);
      for (dkey in prac) {
        disp = prac[dkey];
        if (!(Util.isChild(dkey))) {
          continue;
        }
        if (disp['name'] == null) {
          disp['name'] = dkey;
        }
        disp['row'] = prac.row;
        disp['column'] = prac.column;
        disp['plane'] = prac.plane;
        prac['_children'].push(disp);
      }
    }
    // console.log( 'TabuComp.toTabuRows()', rows )
    return rows;
  }

};

export default Search;

//# sourceMappingURL=Search.js.map
