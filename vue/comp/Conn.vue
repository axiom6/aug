
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

      onNav:  function (obj) {
        if( ( obj.route==='Comp' || obj.route==='Prac' ) && this.isDef(obj.pageKey) && obj.pageKey==='Conn' ) {
          this.onPrac(); } },
      
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
          let elem = this.$refs[this.pracObj.name] // this.getElem( this.$refs, this.pracObj.name );
          if( this.hasElem(elem) ) {
            this.connect = new Connect( stream, this.batch(), pracObj, elem, this.level );
            if( this.level==='Prac') {
              window.addEventListener(   'resize', this.resize ) } }
          else {
            console.log( 'Conn.createConnect()',
              { name:this.pracObj.name, has:this.hasElem(elem), elem:elem } ); } } ) },
      
      resize: function() {
        this.$nextTick( function() {
          if( this.isDef(this.connect) ) {
              this.connect.resize();  } } ); }
    },
    
    mounted: function () {
      this.onPrac(); },
    //this.subscribe( 'Nav', 'Conn.vue', (obj) => {
    //    this.onNav(obj); } );
    
    // created: function () {
    //  window.addEventListener(   'resize', this.resize ) },
    destroyed: function () {
      window.removeEventListener('resize', this.resize ) }
      
   }

  export default Conn;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';

  .conn-comp { display:grid; align-self:center; justify-self:center; align-items:center; justify-items:center;
    color:@theme-color; text-align:center; .theme-conn(); }

  .conn-prac { position:absolute; left:0; top:0; right:0; bottom:0;
    color:@theme-color; text-align:center; .theme-conn(); }
  
</style>