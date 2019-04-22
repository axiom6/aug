
const m0 = {
  id: "72db2064e484bfda@648",
  variables: [

  {
    inputs: ["md"],
      value: (function (md) {
    return (
      md`## require`
    )
  })
  },
  {
    name: "d3",
      inputs: ["require"],
    value: (function (require) {
    return (
      require("d3@5")
    )
  })
  },
  {
    name: "topojson",
      inputs: ["require"],
    value: (function (require) {
    return (
      require("topojson-client", "topojson-simplify")
    )
  })
  },
  {
    inputs: ["require"],
      value: (function (require) {
    return (
      require("https://unpkg.com/d3@5/dist/d3.min.js")
    )
  })
  },
  {
    inputs: ["require"],
      value: (function (require) {
    return (
      require.resolve("d3@5")
    )
  } )
  },
  {
    inputs: ["md"],
    value: (function (md) {
      return (
        md`# Standard Library
  
    <figure><img src="https://user-images.githubusercontent.com/230541/33673828-b7aeb004-da62-11e7-9861-feb5df0ef622.jpg" alt="x"></figure>
    
    A cheatsheet for the [Observable standard library](https://github.com/observablehq/stdlib/blob/master/README.md).`
        )
      })
  },

  ]
};

const notebook = {
  id: "72db2064e484bfda@648",
  modules: [m0]
};

export default notebook;
