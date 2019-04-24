
<template>
  <div>
    <div class="controls">
      <div>
        <label for="Width">Chart width</label>
        <input  id="Width" type="range" v-model="width" min="0" max="1000" />
      </div>
      <div>
        <label for="Color">Stroke color</label>
        <input  id="Color" type="color" v-model="strokeColor" />
      </div>
      <div>
        <label for="Search">Search…</label>
        <input  id="Search" type="text" v-model="search" />
      </div>
      <button v-on:click="add">Add node</button>
      <div>
        Selected: {{ selected }}
      </div>
    </div>
    
    <svg :width="width" :height="height">
      <transition-group tag="g" name="line" >
        <path v-for="link in links" class="link" v-bind:key="link.id" v-bind:d="link.d" v-bind:style="link.style"></path>
      </transition-group>
      <transition-group tag="g" name="list">
        <g class="node" v-on:click="select(index, node)" v-for="(node, index) in nodes"
          v-bind:key="node.id" v-bind:style="node.style" v-bind:class="[node.className, {'highlight': node.highlight}]">
          <circle v-bind:r="node.r" v-bind:style="{'fill': index === selected ? '#ff0000' : '#bfbfbf'}"></circle>
           <text v-bind:dx="node.textpos.x" v-bind:dy="node.textpos.y"
             v-bind:style="node.textStyle">{{ node.text }}</text>
        </g>
      </transition-group>
    </svg>
  </div>
  
</template>

<script type="module">
  
//import Vue     from '../../../lib/vue/vue.esm.browser.js';
  import * as d3 from '../../../lib/d3/d3.5.9.0.esm.js';
  
  let Dend = {
    //el: "#app",
    data() { return {
        csv: null,
        selected: null,
        search: "force",
        strokeColor: "#000000",
        width: 960,
        height: 2000 } },
  
    mounted: function() {
      let that = this;
      d3.csv("flare.csv", function(error, data) {
          if (error) throw error;
          that.csv = data;} );
    },

    computed: {

      root: function() {

        let that = this;

        if (this.csv) {
          let stratify = d3.stratify().parentId(function(d) {
            return d.id.substring(0, d.id.lastIndexOf("."));
          });

          // attach the tree to the Vue data object
          return this.tree(
            stratify(that.csv).sort(function(a, b) {
              return a.height - b.height || a.id.localeCompare(b.id);
            })
          );
        }
      },

      // the "tree" is also a computed property so that it is always up to date when the width and height settings change

      tree: function() {
        return d3
          .cluster()
          .size([this.height, this.width - 160]);
      },

      // Instead of enter, update, exit, we mainly use computed properties and instead of "d3.data()" we can use array.map to create objects that hold class names, styles, and other attributes for each datum

      nodes: function() {
        let that = this;
        if (this.root) {
          return this.root.descendants().map(function(d) {
            return {
              id: d.id,
              r: 2.5,
              className: "node" +
                (d.children ? " node--internal" : " node--leaf"),
              text: d.id.substring(d.id.lastIndexOf(".") + 1),
              highlight: d.id.toLowerCase().indexOf(that.search.toLowerCase()) !== -1 && that.search !== "",
              style: {
                transform: "translate(" + d.y + "px," + d.x + "px)"
              },
              textpos: {
                x: d.children ? -8 : 8,
                y: 3
              },
              textStyle: {
                textAnchor: d.children ? "end" : "start"
              }
            };
          });
        }
      },

      // Instead of enter, update, exit, we mainly use computed properties and instead of "d3.data()" we can use array.map to create objects that hold class names, styles, and other attributes for each datum

      links: function() {
        let that = this;

        if (this.root) {

          // here we’ll calculate the "d" attribute for each path that is then used in the template where we use "v-for" to loop through all of the links to create <path> elements

          return this.root.descendants().slice(1).map(function(d) {
            return {
              id: d.id,
              d: "M" + d.y + "," + d.x + "C" + (d.parent.y + 100) + "," + d.x + " " + (d.parent.y + 100) + "," + d.parent.x + " " + d.parent.y + "," + d.parent.x,

              // here we could of course calculate colors depending on data but for now all links share the same color from the settings object that we can manipulate using UI controls and v-model

              style: {
                stroke: that.strokeColor
              }
            };
          });
        }
      }
    },
    methods: {
      add: function () {
        this.csv.push({
          id: "flare.physics.Dummy",
          value: 0
        })
      },
      select: function(index, node) {
        if( node===false) {}
        this.selected = index;
      }
    }
  };

  export default Dend;
</script>

<style lang="less">
  
  body {
    width: 100%;
    height: 100%;
    font-family: monospace;
  }
  
  .node {
    opacity: 1;
  }
  
  .node circle {
    fill: #999;
    cursor: pointer;
  }
  
  .node text {
    font: 10px sans-serif;
    cursor: pointer;
  }
  
  .node--internal circle {
    fill: #555;
  }
  
  .node--internal text {
    text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
  }
  
  .link {
    fill: none;
    stroke: #555;
    stroke-opacity: 0.4;
    stroke-width: 2px;
    stroke-dasharray: 1000;
  }
  
  .node:hover {
    pointer-events: all;
    stroke: #ff0000;
  }
  
  .node.highlight {fill: red;}
  
  .controls {
    position: fixed;
    top: 16px;
    left: 16px;
    background: #f8f8f8;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
  }
  
  .controls > * + * {
    margin-top: 1rem;
  }
  
  label {
    display: block;
  }
  
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  
  .line-enter-active, .line-leave-active {
    transition: all 2s;
    stroke-dashoffset: 0;
  }
  .line-enter, .line-leave-to /* .list-leave-active for <2.1.8 */ {
    stroke-dashoffset: 1000;
  }

</style>
