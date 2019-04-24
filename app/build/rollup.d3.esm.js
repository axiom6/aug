import ascii     from "rollup-plugin-ascii";
import node      from "rollup-plugin-node-resolve";

export default [
  {
    input: "d3.index.js",
    plugins: [ node(), ascii() ],
    output: {
      extend: true,
      file: "d3.esm.js",
      format: "esm",
      indent: false,
      name: "d3"
    }
  },
];
