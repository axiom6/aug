
<template>
  <div id="CubeTh" class="cube">
  </div>
</template>

<script type="module">
  
  import Build  from '../../pub/cube/Build.js'
  import CubeTh from '../../pub/cube/CubeTh.js'
  
  export default {
    
    data() {
      return { build:{}, cubeTh:{} }; },
    
    mounted: function () {
      this.build  = new Build(  this.batch() );
      this.cubeTh = new CubeTh( this.build, "CubeTh", false );
      this.cubeTh.animate(); } }
      
</script>

<style lang="less">
  .cube {}
</style>