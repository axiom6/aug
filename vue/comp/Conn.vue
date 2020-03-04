
<template>
  <div :class="clConn()" @click="doPrac(pracObj.name)" :ref="pracObj.name" ></div>
</template>

<script type="module">
  
  import Connect from '../../pub/draw/conn/Connect.js';

  let Conn = {

    props: { pracObj:Object, level:String },

    data() {
      return { connect:null, size:null }; },
    
    watch: {
      pracObj() {
        this.onPrac(); } },
    
    methods: {
      
      onPrac: function() {
        if( this.mix().isDef(this.connect) ) {
            this.connect.clearSvg(); }
        this.createConnect( this.mix().stream(), this.pracObj ); },
      
      doPrac: function (pracKey) {
        this.mix().nav().pub( { pracKey:pracKey } ); },
      
      clConn: function() {
        return this.mix().nav().route === 'Prac' ? 'conn-prac' : 'conn-comp'; },
      
      createConnect: function( stream, pracObj ) {
        this.$nextTick( function() {
          let elem = this.$refs[this.pracObj.name] // this.getElem( this.$refs, this.pracObj.name );
          if( this.mix().hasElem(elem) ) {
            this.connect = new Connect( stream, this.mix().batch(), pracObj, elem, this.level );
            if( this.level==='Prac') {
              window.addEventListener( 'resize', this.resize ) } }
          else {
            console.log( 'Conn.createConnect()',
              { name:this.pracObj.name, has:this.mix().hasElem(elem), elem:elem, $refs:this.$refs } ); } } ) },
      
      resize: function() {
        this.$nextTick( function() {
          if( this.mix().isDef(this.connect) ) {
              this.connect.resize();  } } ); }
    },
    
    mounted: function () {
      this.onPrac(); },

    destroyed: function () {
      window.removeEventListener('resize', this.resize ) }
      
   }

  export default Conn;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @connFS:@themeFS;

  .conn-comp { font-size:@connFS; background-color:@theme-gray; color:@theme-fore; width:98%; height:97%;
    border-radius:2.0*@connFS; .themeCenterStretch();   }

  .conn-prac { font-size:@connFS; background-color:@theme-gray; color:@theme-fore; text-align:center;
    border-radius:2.0*@connFS; position:absolute; left:0; top:0; width:98%; height:97%; }
  
</style>