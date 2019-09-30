
<template>
  <div :class="clConn()" @click="doPrac(pracObj.name)" :ref="pracObj.name" ></div>
</template>

<script type="module">
  
  import Connect from '../../pub/ikw/conn/Connect.js';

  let Conn = {

    props: { pracObj:Object, level:String },

    data() {
      return { connect:null, size:null }; },
    
    watch: {
      pracObj() {
        this.onPrac(); } },
    
    methods: {
      
      onPrac: function() {
        if( this.isDef(this.connect) ) {
            this.connect.clearSvg(); }
        this.createConnect( this.stream(), this.pracObj ); },
      
      doPrac: function (pracKey) {
        this.nav().pub( { pracKey:pracKey } ); },
      
      clConn: function() {
        return this.nav().route === 'Comp' ? 'conn-comp' : 'conn-prac'; },
      
      createConnect: function( stream, pracObj ) {
        this.$nextTick( function() {
          let elem     = this.$refs[this.pracObj.name];
          if( elem['clientHeight'] > 0 ) {
            this.connect = new Connect( stream, this.batch(), pracObj, elem, this.level ); }
          else {
            console.error( 'Conn.vue empty elem for',
              { name:this.pracObj.name, height:elem['clientHeight'], elem:elem, refs:this.$refs } ); } } ) },
      
      resize: function() {
        this.$nextTick( function() {
          if( this.isDef(this.connect) ) {
              this.connect.resize();  } } ); }
    },
    
    mounted: function () {
      this.onPrac(); },
    created: function () {
      window.addEventListener(   'resize', this.resize ) },
    destroyed: function () {
      window.removeEventListener('resize', this.resize ) }
      
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