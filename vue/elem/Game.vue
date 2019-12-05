
<tenplate>
  <div   class="game-pane"  ref="Navd">
    <div class="game-west"  style="style('west')"  @click="pubNav('west' )"><i class="fas fa-angle-left"  ></i></div>
    <div class="game-north" style="style('north')" @click="pubNav('north')"><i class="fas fa-angle-up"    ></i></div>
    <div class="game-next"  style="style('next')"  @click="pubNav('next' )"><i class="fas fa-plus-circle" ></i></div>
    <div class="game-prev"  style="style('prev')"  @click="pubNav('prev' )"><i class="fas fa-minus-circle"></i></div>
    <div class="game-east"  style="style('east')"  @click="pubNav('east' )"><i class="fas fa-angle-right" ></i></div>
    <div class="game-south" style="style('south')" @click="pubNav('south')"><i class="fas fa-angle-down"  ></i></div>
  </div>
</tenplate>

<script type="module">
  
  let Game = {
    
    name: 'Game',
    
    data() { return { dirs:{ west:true, east:true, north:true, south:true, prev:true, next:true } }; },
    
    methods: {
      
      pubNav: function(dir) {
        this.nav().dir(dir); },
      
      style:  function(dir) {
        return this.dirs[dir] ? { color:'wheat' } : { color:'#333' } },
      
      onDirs:  function(dirs) {
        for( let key in dirs ) {
          this.dirs[key] = dirs[key]; } },
    },
    
    mounted: function () {
      this.subscribe(  "Game", 'Game.vue', (dirs) => {
        this.onDirs( dirs ); } ); }
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