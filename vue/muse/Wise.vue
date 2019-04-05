
<template>
  <div class="view">
    <div id="Trust"   v-if="isPrac('Trust')" :class="klass('nw')"    >
      <div class="pane"><div class="name">Trust</div></div></div>
    <div id="Nature"  v-if="isPrac('Nature')" :class="klass('north')" >
      <div class="pane"><div class="name">Nature</div></div></div>
    <div id="Truth"   v-if="isPrac('Truth')" :class="klass('ne')"    >
      <div class="pane"><div class="name">Truth</div></div></div>
    <div id="Explore" v-if="isPrac('Explore')" :class="klass('west')"  >
      <div class="pane"><div class="name">Explore</div></div></div>
    <div id="Create"  v-if="isPrac('Create')" :class="klass('cen')"   >
      <div class="pane"><div class="name">Create</div></div></div>
    <div id="Mind"    v-if="isPrac('Mind')" :class="klass('east')"  >
      <div class="pane"><div class="name">Mind</div></div></div>
    <div id="Emerge"  v-if="isPrac('Emerge')" :class="klass('sw')"    >
      <div class="pane"><div class="name">Emerge</div></div></div>
    <div id="Inspire" v-if="isPrac('Inspire')" :class="klass('south')" >
      <div class="pane"><div class="name">Inspire</div></div></div>
    <div id="Actual"  v-if="isPrac('Actual')" :class="klass('se')"    >
      <div class="pane"><div class="name">Actual</div></div></div>
  </div>
</template>

<script type="module">
  export default {
    data() { return { prac:"None", all:true } },
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.all },
      onPrac: function (prac) {
        // console.log( 'Wise.onPrac', { all:this.all, prac:this.prac } );
        if( prac==='Wise' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
      klass: function(klas) {
        return !this.all ? 'all' : klas; } },
    mounted: function () {
      // console.log( 'Wise.vue', 'mounted' );
      this.subscribe( 'Wise', 'Wise.vue', (prac) => this.onPrac(prac) ); }
  }
</script>

<style lang="less">
  @import "View.less";
</style>

