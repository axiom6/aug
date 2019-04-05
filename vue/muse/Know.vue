
<template>
<div class="view">
  <div id="Human"   v-if="isPrac('Human')"   :class="klass('nw')">
    <div class="pane"><div class="name">Human</div></div></div>
  <div id="Science" v-if="isPrac('Science')" :class="klass('north')" >
    <div class="pane"><div class="name">Science</div></div></div>
  <div id="Grasp"   v-if="isPrac('Grasp')"   :class="klass('ne')"    >
    <div class="pane"><div class="name">Grasp</div></div></div>
  <div id="Conduct" v-if="isPrac('Conduct')" :class="klass('west')"  >
    <div class="pane"><div class="name">Conduct</div></div></div>
  <div id="Think"   v-if="isPrac('Think')"   :class="klass('cen')"   >
    <div class="pane"><div class="name">Think</div></div></div>
  <div id="Reason"  v-if="isPrac('Reason')"  :class="klass('east')"  >
    <div class="pane"><div class="name">Reason</div></div></div>
  <div id="Evolve"  v-if="isPrac('Evolve')"  :class="klass('sw')"    >
    <div class="pane"><div class="name">Evolve</div></div></div>
  <div id="Educate" v-if="isPrac('Educate')" :class="klass('south')" >
    <div class="pane"><div class="name">Educate</div></div></div>
  <div id="Culture" v-if="isPrac('Culture')" :class="klass('se')"    >
    <div class="pane"><div class="name">Culture</div></div></div>
</div>
</template>

<script type="module">
  export default {
    data() { return { prac:"None", all:true } },
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.all; },
      onPrac: function (prac) {
        // console.log( 'Know.onPrac', { all:this.all, prac:this.prac } );
        if( prac==='Know' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
      klass: function(klas) {
        return !this.all ? 'all' : klas;
      } },
    mounted: function () {
      this.prac = 'Know';
      // console.log( 'Know.vue', 'mounted' );
      this.subscribe( 'Know', 'Know.vue', (prac) => this.onPrac(prac) ); }
  }
</script>

<style lang="less">
  @import "View.less";
</style>

