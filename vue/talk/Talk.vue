
<template>
  <div class="talk-pane">
    <div v-if="myRoute()" class="talk-list">
    <template v-for="talkObj in talkObjs">
      <div class="talk-talk" @click="doTalk(talkObj.name)">
        <i   :class="talkObj.icon"></i>
        <span class="talk-name">{{talkObj.name}}</span>
      </div>
    </template>
  </div>
  <!--div v-show="!myRoute()" class="talk-sect">
    <template v-for="talkObj in talkObjs">
      <t-sect :talkObj="talkObj"></t-sect>
      <router-view :name="talkObj.route"></router-view>
    </template>
  </div-->
  </div>
</template>

<script type="module">

  import Sect from './Sect.vue';

  let Talk = {

    components:{ 't-sect':Sect },

    data() { return { talkObjs:null, talkObj:null } },

    methods: {

      myRoute: function() {
        return this.isRoute('Talk'); },

      doTalk: function(talkKey) {
        this.talkObj = this.talkObjs[talkKey];
        let obj = { source:"Talk", route:'Sect', pracKey:talkKey, dispKey:'Beg' };
        this.nav().pub( obj ); },
      
    },

    beforeMount: function() {
      this.talkObjs = this.compObject('Talk'); }
    
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
