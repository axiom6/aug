<template>
  <div id="app">
    <transition-group name="list" tag="div">
      <t-drag v-for="n in numbers" :key="n" class="drag" :data="n" @cut="remove(n)">{{n}}</t-drag>
    </transition-group>
    <t-drop class="drop even" @drop="onEvenDrop" :accepts-data="(n) => n % 2 === 0">
      <span v-for="(n, index) in evenDropped" :key="index">Dropped : {{n}},&nbsp;</span>
    </t-drop>
    <t-drop class="drop odd" @drop="onOddDrop" :accepts-data="(n) => n % 2 === 1">
      <span v-for="(n, index) in oddDropped" :key="index">Dropped : {{n}},&nbsp;</span>
    </t-drop>
    <t-drop class="drop any" @drop="onAnyDrop" mode="cut">
      <span v-for="(n, index) in anyDropped" :key="index">Dropped : {{n}},&nbsp;</span>
    </t-drop>
  </div>
</template>

<script>

import { Drag, Drop } from "vue-easy-dnd";

let DnD = {
  name: "App",
  components: { 'd-drag':Drag, 'd-drop':Drop },

  data: function() {
    return {
      n:0,
      numbers: [1, 2, 3, 4, 5],
      evenDropped: [],
      oddDropped: [],
      anyDropped: []
    };
  },
  methods: {
    onEvenDrop(event) {
      this.evenDropped.push(event.data);
    },
    onOddDrop(event) {
      this.oddDropped.push(event.data);
    },
    onAnyDrop(event) {
      this.anyDropped.push(event.data);
    },
    remove(n) {
      let index = this.numbers.indexOf(n);
      this.numbers.splice(index, 1);
    }
  }
}
export default DnD;
</script>

<style>

.drag {
  width: 60px;
  height: 60px;
  background-color: rgb(220, 220, 255);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 10px 10px 0 10px;
  font-size: 20px;
  transition: all 0.5s;
}

.drop {
  margin: 20px 10px;
  height: 80px;
  border: 1px solid black;
  position: relative;
}

.drop::before {
  font-size: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  opacity: 0.2;
  white-space: nowrap;
}

.drop.even::before {
  content: "COPIES EVEN NUMBERS";
}

.drop.odd::before {
  content: "COPIES ODD NUMBERS";
}

.drop.any::before {
  content: "CUT ANY NUMBERS";
}

/*
.drop-allowed {
  background-color: rgba(0, 255, 0, 0.2);
}

.drop-forbidden {
  background-color: rgba(255, 0, 0, 0.2);
}

.drop-in {
  box-shadow: 0 0 5px rgba(0, 0, 255, 0.4);
}

.list-enter,
.list-leave-to {
  opacity: 0;
}

.list-leave-active {
  position: absolute; }

 */

</style>
