
<template>
  <div class="view">
    <template v-for="prac in infos">
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
      return { prac:'None', disp:'None', all:true, infos:{} } },
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.all; },
      onPrac: function (prac) {
        if( prac==='Info' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
      onDisp: function (disp) {
        this.disp=disp; },
      klass: function(klas) {
        return !this.all ? 'all' : klas; } },
    mounted: function () {
      this.infos = this.pracs('Info');
      this.subscribe( 'Info', 'Info.vue',
        (obj) => { this.onPrac(obj.prac); this.onDisp(obj.disp); } ); } }
</script>

<style lang="less">
 @import "View.less";
</style>

