var Demo;

Demo = class Demo {
  constructor() {}

  cols() {
    return [
      {
        title: "Name",
        field: "name",
        editor: "input"
      },
      {
        title: "Progress",
        field: "progress",
        hozAlign: "left",
        formatter: "progress",
        editor: true
      },
      {
        title: "Gender",
        field: "gender",
        width: 95,
        editor: "select",
        editorParams: {
          values: ["male",
      "female"]
        }
      },
      {
        title: "Rating",
        field: "rating",
        formatter: "star",
        hozAlign: "center",
        width: 100,
        editor: true
      },
      {
        title: "Color",
        field: "col",
        width: 130,
        editor: "input"
      },
      {
        title: "Birth",
        field: "dob",
        width: 130,
        sorter: "date",
        hozAlign: "center"
      },
      {
        title: "Driver",
        field: "car",
        width: 90,
        hozAlign: "center",
        formatter: "tickCross",
        sorter: "boolean",
        editor: true
      }
    ];
  }

  rows() {
    return [
      {
        id: 1,
        name: "Oli Bob",
        progress: 12,
        gender: "male",
        rating: 1,
        col: "red",
        dob: "19/02/1984",
        car: 1
      },
      {
        id: 2,
        name: "Mary May",
        progress: 1,
        gender: "female",
        rating: 2,
        col: "blue",
        dob: "14/05/1982",
        car: true
      },
      {
        id: 3,
        name: "Christine Lobowski",
        progress: 42,
        gender: "female",
        rating: 0,
        col: "green",
        dob: "22/05/1982",
        car: "true"
      },
      {
        id: 4,
        name: "Brendon Philips",
        progress: 100,
        gender: "male",
        rating: 1,
        col: "orange",
        dob: "01/08/1980"
      },
      {
        id: 5,
        name: "Margret Marmajuke",
        progress: 16,
        gender: "female",
        rating: 5,
        col: "yellow",
        dob: "31/01/1999"
      },
      {
        id: 6,
        name: "Frank Harbours",
        progress: 38,
        gender: "male",
        rating: 4,
        col: "red",
        dob: "12/05/1966",
        car: 1
      }
    ];
  }

  opts() {
    return {
      columns: this.cols(), //  Column specs
      data: this.rows(), //  load row data from array
      height: '98%', // Height inside comp pane
      layout: "fitDataTable", // fit columns to width of table fitColumns fitDataFill  fitDataTable
      responsiveLayout: "hide", // hide columns that dont fit on the table
      tooltips: true, // show tool tips on cells
      addRowPos: "top", // when adding a new row, add it to the top of the table
      history: true, // allow undo and redo actions on the table
      pagination: "local", // paginate the data
      paginationSize: 7, // allow 7 rows per page of data
      movableColumns: true, // allow column order to be changed
      resizableRows: true, // allow row order to be changed
      initialSort: [
        {
          column: "name",
          dir: "asc"
        }
      ]
    };
  }

};

export default Demo;
