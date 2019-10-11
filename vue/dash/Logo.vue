
<template>
  <div     class="logo-pane">
    <div   class="logo-navd"  ref="navd">
      <div class="logo-west"  ref="west"  @click="doDir('west' )"><i class="fas fa-angle-left"  ></i></div>
      <div class="logo-north" ref="north" @click="doDir('north')"><i class="fas fa-angle-up"    ></i></div>
      <div class="logo-next"  ref="next"  @click="doDir('next')" ><i class="fas fa-plus-circle" ></i></div>
      <div class="logo-prev"  ref="prev"  @click="doDir('prev')" ><i class="fas fa-minus-circle"></i></div>
      <div class="logo-east"  ref="east"  @click="doDir('east' )"><i class="fas fa-angle-right" ></i></div>
      <div class="logo-south" ref="south" @click="doDir('south')"><i class="fas fa-angle-down"  ></i></div>
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
  
  .logo-navd { background-color:@theme-back; color:@theme-color;
                  position:relative; left:15.0%; top:0;   width:70%; height:100%;
    .logo-west  { position:absolute; left:0;     top:33%; width:25%; height: 33%; .theme-arrow(); }
    .logo-north { position:absolute; left:37.5%; top:0;   width:25%; height: 33%; .theme-arrow(); }
    .logo-next  { position:absolute; left:25.0%; top:33%; width:25%; height: 33%; .theme-gamer(); }
    .logo-prev  { position:absolute; left:50.0%; top:33%; width:25%; height: 33%; .theme-gamer(); }
    .logo-east  { position:absolute; left:75.0%; top:33%; width:25%; height: 33%; .theme-arrow(); }
    .logo-south { position:absolute; left:37.5%; top:66%; width:25%; height: 33%; .theme-arrow(); }
    div    { display:grid;
      i    { justify-self:center; align-self:center; } } }
  
</style>
