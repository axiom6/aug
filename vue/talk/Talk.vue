
<template>
  <div class="talk-pane">
    <template v-for="talkObj in talkObjs">
      <div class="talk-talk" @click="doTalk(talkObj.name)">
        <i   :class="talkObj.icon"></i>
        <span class="talk-name">{{talkObj.name}}</span>
      </div>
    </template>
  </div>
</template>

<script type="module">

  let Talk = {

    data() { return { talkObjs:null, talkObj:null } },

    methods: {

      onTalk: function () {
          this.talkObjs = this.compObject('Talk'); },

      doTalk: function (talkKey) {
        this.talkObj = this.talkObjs[talkKey];
        let obj = { source:"Talk", route:"Talk", pracKey:talkKey };
        this.nav().pub( obj ); },
      
    },

    beforeMount: function() {
      this.onTalk(); }
    
  }

  export default Talk;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @sectFS:2.0*@themeFS;
  
  .talk-pane   { position:absolute; left:0; top:15%; width:100%; height:70%;
    color:@theme-fore; background-color:@theme-back; font-size:@sectFS; .themeCenterItems();
    .talk-talk {
      .talk-name { } } }

</style>
