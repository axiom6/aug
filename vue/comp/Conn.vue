
<template>
  <div :ref="prac.name" class="conn" @click="doPrac(prac.name)"></div>
</template>

<script type="module">
  
  import Build   from '../../pub/ikw/cube/Build.js';
  import Connect from '../../pub/ikw/conn/Connect.js';

  let Conn = {

    props: { comp:String, prac:Object },

    data() {
      return { build:null,  connect:null, size:null }; },

    methods: {
      doPrac: function (prac) {
        this.nav().pub( { prac:prac.name } ); },
      calcSize: function(elem) {        // Should only be called by $nextTick()
        let sz   = {}
      //sz.compWidth  = this.$refs['Conn']['clientWidth' ];
      //sz.compHeight = this.$refs['Conn']['clientHeight'];
        sz.elemWidth  = 383; // elem['clientWidth' ];
        sz.elemHeight = 130; // elem['clientHeight'];
        sz.elem = elem;
        sz.name = this.prac.name
        console.log( 'Conn.calcSize()', sz );
        return sz;
      },
      createConnect: function( stream, build ) {
        this.$nextTick( function() {
          let prac = this.prac;
          if( prac.row !== 'Dim' ) {
            let elem  = this.$refs[prac.name];
            this.size = this.calcSize(elem);
            this.connect = new Connect( stream, build, prac, elem, this.size ); } } ) },
      resize: function() {
        
        this.$nextTick( function() {
            let level = 'Resize';  // 'Restore' 'Expand' requires 'Comp' sizes
            if( level==='Expand') { this.connect.lastSize(this.size) }
            this.connect.layout( this.size, level );  } ); }
    },
    

    mounted: function () {
      this.build     = new Build(  this.batch() );
    //this.createConnect( this.stream(), this.build );
      },
    
    //created: function () {
    //  window.addEventListener(   'resize', this.resize ) },
    //destroyed: function () {
      //window.removeEventListener('resize', this.resize ) }
   }

  export default Conn;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .conn { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-conn(); }
  
</style>