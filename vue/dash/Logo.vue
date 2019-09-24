
<template>
  <div class="logo">
    <div   class="navd"  ref="navd">
      <div class="west"  ref="west"  @click="doDir('west' )"><i class="fas fa-angle-left"  ></i></div>
      <div class="north" ref="north" @click="doDir('north')"><i class="fas fa-angle-up"    ></i></div>
      <div class="next"  ref="next"  @click="doDir('next')" ><i class="fas fa-plus-circle" ></i></div>
      <div class="prev"  ref="prev"  @click="doDir('prev')" ><i class="fas fa-minus-circle"></i></div>
      <div class="east"  ref="east"  @click="doDir('east' )"><i class="fas fa-angle-right" ></i></div>
      <div class="south" ref="south" @click="doDir('south')"><i class="fas fa-angle-down"  ></i></div>
    </div>
  </div>
</template>

<script type="module">
  
  let Logo = {
    
    name: 'logo',
    
    methods: {
      doDir: function( dir ) {
        if( this.isDir() ) {
            this.dir().touch( dir ); }
        else if( this.isNav() ) {
            this.nav().dir( dir ); }
        else {
          console.error( 'Logo.vue.doDir() no direction navigator' ); } } },
    
    mounted: function () {}
  };

  export default Logo;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .logo { background-color:@theme-back; }
  
  .navd { background-color:@theme-back; color:@theme-color;
             position:relative; left:15.0%; top:0;   width:70%; height:100%;
    .west  { position:absolute; left:0;     top:33%; width:25%; height: 33%; font-size:@theme-dirs-size; }
    .north { position:absolute; left:37.5%; top:0;   width:25%; height: 33%; font-size:@theme-dirs-size; }
    .next  { position:absolute; left:25.0%; top:33%; width:25%; height: 33%; font-size:@theme-navd-size; }
    .prev  { position:absolute; left:50.0%; top:33%; width:25%; height: 33%; font-size:@theme-navd-size; }
    .east  { position:absolute; left:75.0%; top:33%; width:25%; height: 33%; font-size:@theme-dirs-size; }
    .south { position:absolute; left:37.5%; top:66%; width:25%; height: 33%; font-size:@theme-dirs-size; }
    div    { display:grid;
      i    { justify-self:center; align-self:center; } } }
  
</style>
