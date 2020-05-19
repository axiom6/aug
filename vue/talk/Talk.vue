
<template>
  <div class="talk-pane">
    <div v-show="sectObj===null" class="talk-list">
      <t-area :areat="talkObjs" :size="2.0" :fnClick="doTalk"></t-area>
    </div>
  <div v-if="sectObj!==null" class="talk-sect">
    <t-sect :sectObj="sectObj" :dataObj="dataObj" :imgsObj="imgsObj"></t-sect>
  </div>
  </div>
</template>

<script type="module">

  import Sect from './Sect.vue';
  import Area from '../elem/Area.vue';

  let Talk = {

    components:{ 't-sect':Sect, 't-area':Area },

    data() { return { sectObj:null, dataObj:null, imgsObj:null, talkObjs:null, takkObj:null } },

    methods: {
      
      doTalk: function(talkKey) {
        this.nav().pub( { source:'Talk.vue', pracKey:talkKey, dispKey:'None',
          presKey:'None', imgsNum:0, imgsIdx:0 } );
        this.nav().dirsNavd('Init'); },

      onNav: function (obj) {
        if( this.nav().isMyNav( obj, 'Talk' ) ) {
            this.onSect( obj.pracKey, obj.dispKey, obj.presKey, obj.imgsIdx ); } },

      onSect: function( talkKey, sectKey, presKey, imgsIdx ) {
        let  dispObj = this.mix().sectObject( talkKey, sectKey );
        this.sectObj = this.mix().isDef(presKey) ? this.mix().presObject(dispObj,presKey) : dispObj;
        if( !this.mix().isDef(this.sectObj) ) {
          console.error( 'Talk.vue.onSect() sectObj null',
            { dispObj:dispObj, talkKey:talkKey, sectKey:sectKey, presKey:presKey } );
          this.sectObj = {}; }
        this.sectObj.imgsIdx = imgsIdx;
        this.imgsObj = this.mix().compObject( 'Imgs' );
        
      } },

    beforeMount: function() {
      this.talkObjs = this.mix().compObject('Talk'); },

    mounted: function () {
      this.mix().subscribe(  "Nav", 'Talk.vue', (obj) => {
        this.onNav( obj ); } ); }
    
  }

  export default Talk;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @sectFS:2.0*@themeFS;
  
  .talk-pane   { position:absolute; left:5%; top:5%; width:90%; height:90%;
    color:@theme-fore; background-color:@theme-back; font-size:@sectFS; .themeCenterItems();
    .talk-list {  }  }

</style>
