
<template>
  <div class="talk-pane">
    <div v-show="sectObj===null" class="talk-list">
      <t-area :areat="talkObjs" :size="2.0" :fnClick="doTalk"></t-area>
    </div>
  <div v-if="sectObj!==null" class="talk-sect">
    <t-sect :sectObj="sectObj" :dataObj="dataObj"></t-sect>
  </div>
  </div>
</template>

<script type="module">

  import Sect from './Sect.vue';
  import Area from '../elem/Area.vue';

  let Talk = {

    components:{ 't-sect':Sect, 't-area':Area },

    data() { return { sectObj:null, dataObj:null, talkObjs:null, takkObj:null } },

    methods: {
      
      doTalk: function(talkKey) {
        this.mix().nav().pub( { source:'Talk.vue', pracKey:talkKey, dispKey:'None', pageKey:'None' } );
        this.mix().nav().dirsNavd('Init'); },

      onNav: function (obj) {
        if( this.mix().nav().isMyNav( obj, 'Talk' ) ) {
            this.onSect( obj.pracKey, obj.dispKey, obj.pageKey ); } },

      onSect: function( talkKey, sectKey, pageKey ) {
        let dispObj  = this.mix().sectObject( talkKey, sectKey );
        this.sectObj = pageKey!=='None' ? this.mix().pageObject(dispObj,pageKey) : dispObj;
      //this.dataObj = this.dataObject( this.sectObj, pageKey );
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
