
<template>
  <div class="logo">
    <!--d-navd id="navd"></d-navd-->
    <div   class="navd"  ref="navd">
      <div class="west"  ref="west"  @click="pubNav('west' )"><i class="fas fa-angle-left"  ></i></div>
      <div class="north" ref="north" @click="pubNav('north')"><i class="fas fa-angle-up"    ></i></div>
      <div class="next"  ref="next"  @click="pubNav('next')" ><i class="fas fa-plus-circle" ></i></div>
      <div class="prev"  ref="prev"  @click="pubNav('prev')" ><i class="fas fa-minus-circle"></i></div>
      <div class="east"  ref="east"  @click="pubNav('east' )"><i class="fas fa-angle-right" ></i></div>
      <div class="south" ref="south" @click="pubNav('south')"><i class="fas fa-angle-down"  ></i></div>
    </div>
  </div>
</template>

<script type="module">
  
  let Logo = {
    name: 'logo',
    methods:{
      pubNav: function( dir ) {
        this.nav().dir( dir ); } },
    mounted: function () {
      this.nav().set( { $router:this.$router } ); }
  };

  export default Logo;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .logo { background-color:@theme-back; }
  
  .navd { background-color:@theme-back; color:@theme-color;
             position:relative; left:20%; top:0;   width:60%; height:100%;
    .west  { position:absolute; left:0;   top:33%; width:33%; height: 33%; font-size:@theme-dirs-size; }
    .north { position:absolute; left:33%; top:0;   width:33%; height: 33%; font-size:@theme-dirs-size; }
    .next  { position:absolute; left:33%; top:33%; width:17%; height: 33%; font-size:@theme-navd-size; }
    .prev  { position:absolute; left:50%; top:33%; width:16%; height: 33%; font-size:@theme-navd-size; }
    .east  { position:absolute; left:66%; top:33%; width:33%; height: 33%; font-size:@theme-dirs-size; }
    .south { position:absolute; left:33%; top:66%; width:33%; height: 33%; font-size:@theme-dirs-size; }
    div    { display:grid;
      i    { justify-self:center; align-self:center; } } }
  
</style>
