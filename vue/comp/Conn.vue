
<template>
  <div class="conn" @click="doPrac(pracObj.name)" :ref="pracObj.name" ></div>
</template>

<script type="module">
  
  import Build   from '../../pub/ikw/cube/Build.js';
  import Connect from '../../pub/ikw/conn/Connect.js';

  let Conn = {

    props: { pracObj:Object },

    data() {
      return { build:null, connect:null, size:null }; },

    methods: {
      
      doPrac: function (pracKey) {
        this.nav().pub( { pracKey:pracKey } ); },
      
      calcSize: function(elem) { // Should only be called within $nextTick()
        let sz   = {}
      //sz.compWidth  = this.$refs['Conn']['clientWidth' ];
      //sz.compHeight = this.$refs['Conn']['clientHeight'];
        sz.elemWidth  = elem['clientWidth' ];
        sz.elemHeight = elem['clientHeight'];
        sz.elem = elem;
        sz.name = this.pracObj.name
      //console.log( 'Conn.calcSize()', sz );
        return sz; },
      
      createConnect: function( stream, build ) {
        this.$nextTick( function() {
          if( this.pracObj.row !== 'Dim' ) {
            let elem  = this.$refs[this.pracObj.name];
          //console.log( 'Conn.createConnect', { refs:this.$refs, elem:elem } );
            this.size    = this.calcSize(elem);
            this.connect = new Connect( stream, build, this.pracObj, elem, this.size ); } } ) },
      
      resize: function() {
        this.$nextTick( function() {
            let level = 'Resize';  // 'Restore' 'Expand' requires 'Comp' sizes
            if( level==='Expand') { this.connect.lastSize(this.size) }
            this.connect.layout( this.size, level );  } ); }
    },
    
    mounted: function () {
      this.build     = new Build(  this.batch() );
      this.createConnect( this.stream(), this.build ); },
    
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