
<template>
  <div class="talk-pane">
    <div v-show="sectObj===null" class="talk-list">
    <template v-for="talkObj in talkObjs">
      <div class="talk-talk" @click="doTalk(talkObj.name)">
        <i   :class="talkObj.icon"></i>
        <span class="talk-name">{{talkObj.name}}</span>
      </div>
    </template>
  </div>
  <div v-if="sectObj!==null" class="talk-sect">
    <t-sect :sectObj="sectObj" :dataObj="dataObj"></t-sect>
  </div>
  </div>
</template>

<script type="module">

  import Sect from './Sect.vue';

  let Talk = {

    components:{ 't-sect':Sect },

    data() { return { talkObjs:null, talkObj:null, sectObjs:null, sectObj:null, dataObj:null } },

    methods: {
      
      doTalk: function(talkKey) {
        this.nav().pub( { pracKey:talkKey, dispKey:'Beg', pageKey:'None' } ); },

      onNav: function (obj) {
        if( this.nav().isMyNav( obj, 'Talk' ) ) {
            this.onSect( obj.pracKey, obj.dispKey, obj.pageKey ); } },

      onSect: function( talkKey, dispKey, pageKey ) {
        this.talkObj  = this.talkObjs[talkKey];
        this.sectObjs = this.compObject(this.talkObj.comp);
        let  sectKey  = dispKey==='None' ? 'Beg' : dispKey
        let  sectObj  = this.sectObjs[sectKey];
        this.sectObj  = pageKey!=='None' && Util.isDef(sectObj[pageKey]) ? sectObj[pageKey] : sectObj;
        console.log( 'Sect.onSect()',
          { talkKey:talkKey, talkObj:this.talkObj,   sectKey:sectKey,
            pageKey:pageKey, sectObjs:this.sectObjs, sectObj:sectObj, pageObj:this.sectObj } );
        this.dataObj   = null;
        if( this.sectObj.type==='Prac' ) {
          this.dataObj = this.pracObject( this.talkObj.src, sectObj.name ) }
        else if( this.sectObj.type==='Disp' && pageKey!=='None' ) {
          this.dataObj = this.dispObject( this.talkObj.src, sectObj.name, pageKey ) } }
      
    },

    beforeMount: function() {
      this.talkObjs = this.compObject('Talk'); },

    mounted: function () {
      this.subscribe(  "Nav", 'Talk.vue', (obj) => {
        this.onNav( obj ); } ); }
    
  }

  export default Talk;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @sectFS:2.0*@themeFS;
  
  .talk-pane   { position:absolute; left:0; top:15%; width:100%; height:70%;
    color:@theme-fore; background-color:@theme-back; font-size:@sectFS; .themeCenterItems();
    .talk-list { }
    .talk-sect { }
    .talk-talk {
      .talk-name { } } }

</style>
