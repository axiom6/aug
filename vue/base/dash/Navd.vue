
<template>
  <div   class="navd-pane">
    <div   class="navd-navd">
      <div class="navd-west"  :style="style('west')"  @click="doDir('west' )"><i class="fas fa-angle-left"  ></i></div>
      <div class="navd-north" :style="style('north')" @click="doDir('north')"><i class="fas fa-angle-up"    ></i></div>
      <div class="navd-next"  :style="style('next')"  @click="doDir('next' )"><i class="fas fa-plus-circle" ></i></div>
      <div class="navd-prev"  :style="style('prev')"  @click="doDir('prev' )"><i class="fas fa-minus-circle"></i></div>
      <div class="navd-east"  :style="style('east')"  @click="doDir('east' )"><i class="fas fa-angle-right" ></i></div>
      <div class="navd-south" :style="style('south')" @click="doDir('south')"><i class="fas fa-angle-down"  ></i></div>
    </div>
  </div>
</template>

<script type="module">
  
  import { inject, onMounted } from "vue";

  let Navd = {
    
    name: 'navd',

    setup() {

      const mix = inject( 'mix' );
      const nav = inject( 'nav' );

      const dirs = { west:true, east:true, north:true, south:true, prev:true, next:true };

      const doDir = function(  dir )  {
          nav.dir( dir ); }

      const style =  function(dir) {
          return dirs[dir] ? { color:'wheat' } : { color:'#333' } }

      const onDirs = function(dirsa) {
          for( let keyn in dirsa ) {
            dirs[keyn] = dirsa[keyn]; } }

      onMounted( function () {
        mix.subscribe(  "Navd", 'Navd.vue', (dirs) => {
          onDirs( dirs ); } ); } )

    return{ doDir, style }; }
  }

  export default Navd;
  
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @navdFS:2*@themeFS;
  
  .navd-pane { background-color:@theme-back; }
  
  .navd-navd { background-color:@theme-back; color:@theme-fore;
                  position:relative; left:15.0%; top:0;   width:70%; height:100%;
    .navd-west  { position:absolute; left:0;     top:35%; width:25%; height: 33%; font-size:6.0vmin }
    .navd-north { position:absolute; left:37.5%; top:0;   width:25%; height: 33%; font-size:6.0vmin }
    .navd-next  { position:absolute; left:50.0%; top:38%; width:25%; height: 33%; font-size:3.5vmin }
    .navd-prev  { position:absolute; left:25.0%; top:38%; width:25%; height: 33%; font-size:3.5vmin }
    .navd-east  { position:absolute; left:75.0%; top:35%; width:25%; height: 33%; font-size:6.0vmin }
    .navd-south { position:absolute; left:37.5%; top:66%; width:25%; height: 33%; font-size:6.0vmin }
    div    { display:grid;
      i    { justify-self:center; align-self:center; } } }
  
</style>
