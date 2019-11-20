

<template>
  <div class="sect-pane">
    <div    v-if="hasProp('icon')"   class="sect-icon"><i :class="getProp('icon')"></i></div>
    <div    v-if="hasProp('banner')" class="sect-banner"><div>{{sectObj.banner}}</div></div>
    <div    v-if="hasProp('title')"  class="sect-title">{{sectObj.title}}</div>
    <div    v-if="hasProp('name')"   class="sect-name" >{{sectObj.name}}</div>
    <div    v-if="hasProp('desc')"   class="sect-desc">{{getProp('desc')}}</div>
    <t-prac v-if="isType('Prac')"    class="sect-prac" :sectObj="sectObj" :pracObj="dataObj"></t-prac>
    <t-disp v-if="isType('Disp')"    class="sect-disp" :sectObj="sectObj" :dispObj="dataObj"></t-disp>
    <div    v-if="hasProp('author')" class="sect-author">{{sectObj.author}}</div>
  </div>
</template>

<script type="module">

  import Prac from './Prac.vue';
  import Disp from './Disp.vue';
  import Data from '../../pub/base/util/Data.js';

  let Sect = {

    components:{ 't-prac':Prac, 't-disp':Disp },

    data() { return { talkObjs:null, talkObj:null, sectObjs:null, sectObj:null, dataObj:null, type:"Sect" } },

    methods: {

      isType: function(type) {
        return type===this.type; },
      
      hasProp: function(prop) {
        this.isDef(this.sectObj[prop]) || this.isDef(this.dataObj[prop]); },

      getProp: function(prop) {
        return this.isDef(this.sectObj[prop]) ? this.sectObj[prop] : this.dataObj[prop]; },
      
      asyncSects: function( url ) {
        let callback = (sectObjs) => {
          console.log( 'Sect.asyncSects()', sectObjs );
          this.sectObjs = sectObjs; };
        Data.asyncJSON( url, callback ); },

      onTalk: function(talkKey) {
        console.log( 'Sect.onTalk()', talkKey );
        this.talkObjs  = this.compObject('Talk');
        this.talkObj   = this.talkObjs(talkKey);
        this.asyncSects( this.talkObj.url ); },

      onSect: function( sectKey, dispKey ) {
        this.sectObj = this.sectObjs[sectKey];
        console.log( 'Sect.onSect()', sectKey, this.sectObj );
        this.dataObj = null;
        if( this.sectObj.type==='Prac' ) {
            this.dataObj = this.pracObject( this.talkObj.compKey, this.sectObj.name ) }
        if( this.sectObj.type==='Disp' ) {
            this.dataObj = this.dispObject( this.talkObj.compKey, this.sectObj.name, dispKey ) } },
    },

    beforeMount: function() {
      this.onTalk(); },

    mounted: function () {
      this.subscribe(  "Talk", 'Sect.vue', (obj) => {
        this.onTalk( obj.pracKey ); } );
      this.subscribe(  "Sect", 'Sect.vue', (obj) => {
        this.onSect( obj.pracKey, obj.dispKey ); } ); }
  }

  export default Sect;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @sectFS:2.0*@themeFS;  //  border-radius:0.5*@sectFS;
  
  .sect-pane   { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; font-size:@sectFS;
    .sect-icon   { position:absolute; left:0;   top:0;   width: 10%; height:10%; font-size:5.0*@sectFS;
      i { .themeCenterItems(); } }
    .sect-banner { position:absolute; left:35%; top:40%; width: 40%; height:20%; font-size:5.0*@sectFS;
      div { .themeCenterItems(); } }
    .sect-title  { position:absolute; left:0;   top:10%; width:100%; height:10%; font-size:3.0*@sectFS;
      div { .themeCenterItems(); } }
    .sect-name   { position:absolute; left:0;   top:10%; width:100%; height:10%; font-size:3.0*@sectFS;
      div { .themeCenterItems(); } }
    .sect-desc   { position:absolute; left:0;   top:20%; width:100%; height:80%; font-size:1.0*@sectFS;
      div { .themeCenterItems(); } }
    .sect-prac   { position:absolute; left:10%; top:10%; width: 80%; height:80%; font-size:1.0*@sectFS;  }
    .sect-disp   { position:absolute; left:10%; top:10%; width: 80%; height:80%; font-size:1.0*@sectFS;  }
    .sect-author { position:absolute; left:70%; top:95%; width: 30%; height: 5%; font-size:1.0*@sectFS;
      div { .themeCenterItems(); } }
  }

</style>
