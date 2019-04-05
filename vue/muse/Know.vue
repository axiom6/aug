
<template>
  <div class="view">
    <template v-for="prac in knows">
      <div :id="prac.name"  v-if="isPrac(prac.name)" :class="klass(prac.dir)" :key="prac.name">
        <div class="pane"><div class="cen"><div>{{prac.name}}</div></div>
          <template  v-for="disp in prac.disps">
            <div :class="disp.dir"><div>{{disp.name}}</div></div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">
  export default {
    data() {
      return { prac:"None", all:true, knows:{} } },
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.all; },
      onPrac: function (prac) {
        if( prac==='Know' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
      klass: function(klas) {
        return !this.all ? 'all' : klas; } },
    mounted: function () {
      this.knows = this.pracs('Know');
      this.subscribe( 'Know', 'Know.vue', (prac) => this.onPrac(prac) ); } }
</script>

<style lang="less">
  @import "View.less";
</style>

