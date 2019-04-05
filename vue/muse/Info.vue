
<template>
  <div class="view">
    <div id="Collab"   v-if="isPrac('Collab')" :class="klass('nw')"    >
      <div class="pane"><div class="name">Collab</div></div></div>
    <div id="Domain"   v-if="isPrac('Domain')" :class="klass('north')"    >
      <div class="pane"><div class="name">Domain</div></div></div>
    <div id="Discover" v-if="isPrac('Discover')" :class="klass('ne')"    >
      <div class="pane"><div class="name">Discover</div></div></div>
    <div id="Adapt"    v-if="isPrac('Adapt')" :class="klass('west')"    >
      <div class="pane"><div class="name">Adapt</div></div></div>
    <div id="Make"     v-if="isPrac('Make')" :class="klass('cen')"    >
      <div class="pane"><div class="name">Make</div></div></div>
    <div id="Benefit"  v-if="isPrac('Benefit')" :class="klass('east')"    >
      <div class="pane"><div class="name">Benefit</div></div></div>
    <div id="Change"   v-if="isPrac('Change')" :class="klass('sw')"    >
      <div class="pane"><div class="name">Change</div></div></div>
    <div id="Deliver"   v-if="isPrac('Deliver')" :class="klass('south')"    >
      <div class="pane"><div class="name">Deliver</div></div></div>
    <div id="Govern"   v-if="isPrac('Govern')" :class="klass('se')"    >
      <div class="pane"><div class="name">Govern</div></div></div>
  </div>
</template>

<script type="module">
  export default {
    data() { return { prac:"None", all:true } },
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.all; },
      onPrac: function (prac) {
        // console.log( 'Info.onPrac', { all:this.all, prac:this.prac } );
        if( prac==='Info' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
      klass: function(klas) {
        return !this.all ? 'all' : klas; } },
    mounted: function () {
      // console.log( 'Info.vue', 'mounted' );
      this.subscribe( 'Info', 'Info.vue', (prac) => this.onPrac(prac) ); }
  }
</script>

<style lang="less">
 @import "View.less";
</style>

