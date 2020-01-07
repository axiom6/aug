
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
  
  let Navd = {
    
    name: 'navd',

    data() { return { dirs:{ west:true, east:true, north:true, south:true, prev:true, next:true } }; },
    
    methods: {
      
      doDir: function( dir ) {
        if( this.mix().isTouch() ) {
            this.mix().touch().doTouch( dir ); }
        else if( this.mix().isNav() && this.dirs[dir] ) {
            this.mix().nav().dir( dir ); }
        else {
          console.error( 'Navd.doDir() no direction navigator' ); } },

      style:  function(dir) {
        return this.dirs[dir] ? { color:'wheat' } : { color:'#333' } },

      onDirs:  function(dirs) {
        for( let key in dirs ) {
          this.dirs[key] = dirs[key]; } } },

    mounted: function () {
      this.mix().subscribe(  "Navd", 'Navd.vue', (dirs) => {
        this.onDirs( dirs ); } ); }
  };

  export default Navd;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @navdFS:2*@themeFS;
  
  .navd-pane { background-color:@theme-back; }
  
  .navd-navd { background-color:@theme-back; color:@theme-fore;
                  position:relative; left:15.0%; top:0;   width:70%; height:100%;
    .navd-west  { position:absolute; left:0;     top:33%; width:25%; height: 33%; font-size:133% }
    .navd-north { position:absolute; left:37.5%; top:0;   width:25%; height: 33%; font-size:133% }
    .navd-next  { position:absolute; left:50.0%; top:33%; width:25%; height: 33%; font-size:100% }
    .navd-prev  { position:absolute; left:25.0%; top:33%; width:25%; height: 33%; font-size:100% }
    .navd-east  { position:absolute; left:75.0%; top:33%; width:25%; height: 33%; font-size:133% }
    .navd-south { position:absolute; left:37.5%; top:66%; width:25%; height: 33%; font-size:133% }
    div    { display:grid;
      i    { justify-self:center; align-self:center; } } }
  
</style>
