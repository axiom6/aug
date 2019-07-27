
<tenplate>
  <div   class="navd"  ref="Navd">
    <div class="west"  ref="West"  @click="pubNav('west' )"><i class="fas fa-angle-left"  ></i></div>
    <div class="north" ref="North" @click="pubNav('north')"><i class="fas fa-angle-up"    ></i></div>
    <div class="fwd"   ref="Fwd"   @click="pubNav('next' )"><i class="fas fa-plus-circle" ></i></div>
    <div class="bak"   ref="Bak"   @click="pubNav('prev' )"><i class="fas fa-minus-circle"></i></div>
    <div class="east"  ref="East"  @click="pubNav('east' )"><i class="fas fa-angle-right" ></i></div>
    <div class="south" ref="South" @click="pubNav('south')"><i class="fas fa-angle-down"  ></i></div>
  </div>
</tenplate>

<script type="module">
  
  let Navd = {
    name: 'Navd',
    data() { return { hi:"Hi" }; },
    methods:{
      pubNav: function (dir) {
         this.nav().dir(dir); } }
  }
  
  export default Navd;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .navd { background-color:@theme-back; color:@theme-color;
    .west  { position:absolute; left:0;   top:33%; width:33%; height:33%; }
    .north { position:absolute; left:33%; top:0;   width:33%; height:33%; }
    .fwd   { position:absolute; left:33%; top:33%; width:17%; height:33%; }
    .bak   { position:absolute; left:50%; top:33%; width:16%; height:33%; }
    .east  { position:absolute; left:66%; top:33%; width:33%; height:33%; }
    .south { position:absolute; left:33%; top:66%; width:33%; height:33%; }
  }
</style>