
<template>
  <div :class="clConn()" @click="doPrac(pracObj.name)" :ref="pracObj.name" ></div>
</template>

<script type="module">
  
  import Build   from '../../pub/ikw/cube/Build.js';
  import Connect from '../../pub/ikw/conn/Connect.js';

  let Conn = {

    props: { pracObj:Object },

    data() {
      return { build:null, connect:null, size:null }; },
    
    watch: {
      pracObj: function() {
        console.log( 'Conn.watch', this.pracObj );
        this.onPrac(); } },
    
    methods: {
      
      onNav: function( obj ) {
        if( this.pracObj.name !== obj.pracKey && obj.pageKey === 'Conn' ) {
          let    pracObj = this.pracObject( this.nav().compKey, obj.pracKey );
          this.onPrac( pracObj ); } },
      
      onPrac: function() {
        this.createConnect( this.stream(), this.build, this.pracObj ); },
      
      doPrac: function (pracKey) {
        this.nav().pub( { pracKey:pracKey } ); },
      
      clConn: function() {
        // console.log( 'Conn.clConn() called' );
        return this.nav().level === 'Comp' ? 'conn-comp' : 'conn-prac'; },
      
      calcSize: function(elem) { // Should only be called within $nextTick()
        let sz   = {}
        sz.elemWidth  = elem['clientWidth' ];
        sz.elemHeight = elem['clientHeight'];
        sz.elem = elem;
        sz.name = this.pracObj.name
        return sz; },
      
      createConnect: function( stream, build, pracObj ) {
        this.$nextTick( function() {
          let elem  = this.$refs[this.pracObj.name];
          this.size    = this.calcSize(elem);
          this.connect = new Connect( stream, build, pracObj, elem, this.size ); } ) },
      
      resize: function() {
        this.$nextTick( function() {
            let level = 'Resize';  // 'Restore' 'Expand' requires 'Comp' sizes
            if( level==='Expand') { this.connect.lastSize(this.size) }
            this.connect.layout( this.size, level );  } ); }
    },
    
    mounted: function () {
      this.build = new Build(  this.batch() );
      this.onPrac(); }
    
    //created: function () {
    //  window.addEventListener(   'resize', this.resize ) },
    //destroyed: function () {
      //window.removeEventListener('resize', this.resize ) }
   }

  export default Conn;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .conn-comp { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-comp-conn(); }

  .conn-prac { position:absolute; left:0; top:0; right:0; bottom:0;
    color:@theme-color; font-size:@theme-icon-size; text-align:center; .theme-prac-conn(); }
  
</style>