
<template>
  <div :class="clConn()" @click="doPrac(pracObj.name)" ref="pracElem" ></div>
</template>

<script type="module">
  
  import Connect from '../../../pub/muse/conn/Connect.js';
  import { ref, inject, nextTick, onMounted, watch, onDeactivated } from "vue";

  let Conn = {

    props: { pracObj:Object, level:String },

    setup( props ) {

      const nav = inject( 'nav' );

      let   connect  = null;
      const pracElem = ref(null); // props.pracObj.name

      watch( props.pracObj, function() { // (newValue, oldValue)
        onPrac(); } )

      const onPrac = function() {
        if( nav.isDef(connect) ) {
            connect.clearSvg(); }
        createConnect( nav.stream, props.pracObj ); }

      const doPrac = function (pracKey) {
        nav.pub( { pracKey:pracKey } ); }

      const clConn = function() {
        return nav.level === 'Prac' ? 'conn-prac' : 'conn-comp'; }

      const createConnect = function( stream, pracObj ) {
        nextTick( function() {
          let elem = pracElem.value;
          if( nav.hasElem(elem) ) {
            connect = new Connect( stream, nav.batch, pracObj, elem, props.level );
            if( props.level==='Prac') {
              window.addEventListener( 'resize', resize ) } }
          else {
            console.log( 'Conn.createConnect()',
              { name:pracObj.name, has:nav.hasElem(elem), elem:elem } ); } } ) }

      const resize = function() {
        nextTick( function() {
          if( nav.isDef(connect) ) {
              connect.resize();  } } ); }


      onMounted( function () {
        onPrac(); } )

      onDeactivated(function () {
        window.removeEventListener('resize', resize ) } )
        
    return { pracElem, clConn, doPrac }; }
   }

  export default Conn;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @connFS:@themeFS;

  .conn-comp { font-size:@connFS; background-color:@theme-gray; color:@theme-fore; width:98%; height:97%;
    border-radius:2.0*@connFS; .themeCenterStretch();   }

  .conn-prac { font-size:@connFS; background-color:@theme-gray; color:@theme-fore; text-align:center;
    border-radius:2.0*@connFS; position:absolute; left:0; top:0; width:98%; height:97%; }
  
</style>