
<tenplate>
  <div   class="game-pane"  ref="Navd">
    <div class="game-west"  ref="West"  @click="pubNav('west' )"><i class="fas fa-angle-left"  ></i></div>
    <div class="game-north" ref="North" @click="pubNav('north')"><i class="fas fa-angle-up"    ></i></div>
    <div class="game-next"  ref="Next"  @click="pubNav('next' )"><i class="fas fa-plus-circle" ></i></div>
    <div class="game-pref"  ref="Prev"  @click="pubNav('prev' )"><i class="fas fa-minus-circle"></i></div>
    <div class="game-east"  ref="East"  @click="pubNav('east' )"><i class="fas fa-angle-right" ></i></div>
    <div class="game-south" ref="South" @click="pubNav('south')"><i class="fas fa-angle-down"  ></i></div>
  </div>
</tenplate>

<script type="module">
  
  let Game = {
    name: 'Game',
    data() { return { hi:"Hi" }; },
    methods:{
      pubNav: function (dir) {
         this.nav().dir(dir); } }
  }
  
  export default Game;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .game-pane { background-color:@theme-back; color:@theme-fore;
    .game-west  { position:absolute; left: 0;  top:33%; width:33%; height:33%; }
    .game-north { position:absolute; left:33%; top: 0;  width:33%; height:33%; }
    .game-mext  { position:absolute; left:33%; top:33%; width:17%; height:33%; }
    .game-prev  { position:absolute; left:50%; top:33%; width:16%; height:33%; }
    .game-east  { position:absolute; left:66%; top:33%; width:33%; height:33%; }
    .game-south { position:absolute; left:33%; top:66%; width:33%; height:33%; }
  }
</style>