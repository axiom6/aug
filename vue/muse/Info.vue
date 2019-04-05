
<template>
  <div class="view">
    <div id="Collab"   v-if="isPrac('Collab')" :class="klass('nw')"    >
      <div class="pane"><div class="cen"><div>Collab</div></div>
        <div class="west"><div>Respond</div></div><div class="north"><div>Charter</div></div>
        <div class="east"><div>Team</div>   </div><div class="south"><div>Activity</div></div></div></div>
    <div id="Domain"   v-if="isPrac('Domain')" :class="klass('north')"    >
      <div class="pane"><div class="cen"><div>Domain</div></div>
        <div class="west"><div>Entitle</div></div><div class="north"><div>Propose</div></div>
        <div class="east"><div>Acquire</div>   </div><div class="south"><div>Portfolio</div></div></div></div>
    <div id="Discover" v-if="isPrac('Discover')" :class="klass('ne')"    >
      <div class="pane"><div class="cen"><div>Discover</div></div>
        <div class="west"><div>Insight</div></div><div class="north"><div>Strategy</div></div>
        <div class="east"><div>Vision</div>   </div><div class="south"><div>Market</div></div></div></div>
    <div id="Adapt"    v-if="isPrac('Adapt')" :class="klass('west')"    >
      <div class="pane"><div class="cen"><div>Adapt</div></div>
        <div class="west"><div>Feature</div></div><div class="north"><div>Status</div></div>
        <div class="east"><div>Guide</div>   </div><div class="south"><div>Module</div></div></div></div>
    <div id="Make"     v-if="isPrac('Make')" :class="klass('cen')"    >
      <div class="pane"><div class="cen"><div>Make</div></div>
        <div class="west"><div>UX</div></div><div class="north"><div>Service</div></div>
        <div class="east"><div>Model</div>   </div><div class="south"><div>Cloud</div></div></div></div>
    <div id="Benefit"  v-if="isPrac('Benefit')" :class="klass('east')"    >
      <div class="pane"><div class="cen"><div>Benefit</div></div>
        <div class="west"><div>Interpret</div></div><div class="north"><div>Design</div></div>
        <div class="east"><div>Realize</div>   </div><div class="south"><div>Review</div></div></div></div>
    <div id="Change"   v-if="isPrac('Change')" :class="klass('sw')"    >
      <div class="pane"><div class="cen"><div>Change</div></div>
        <div class="west"><div>Transition</div></div><div class="north"><div>Proof</div></div>
        <div class="east"><div>Deploy</div>   </div><div class="south"><div>Sight</div></div></div></div>
    <div id="Deliver"   v-if="isPrac('Deliver')" :class="klass('south')"    >
      <div class="pane"><div class="cen"><div>Deliver</div></div>
        <div class="west"><div>Support</div></div> <div class="north"><div>Network</div></div>
        <div class="east"><div>Simulate</div></div><div class="south"><div>Secure</div></div></div></div>
    <div id="Govern"   v-if="isPrac('Govern')" :class="klass('se')"    >
      <div class="pane"><div class="cen"><div>Govern</div></div>
        <div class="west"><div>Advise</div></div><div class="north"><div>Maturity</div></div>
        <div class="east"><div>Impact</div>   </div><div class="south"><div>What</div></div></div></div>
  </div>
</template>

<script type="module">
  export default {
    data() { return { prac:"None", all:true } },
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.all; },
      onPrac: function (prac) {
        // console.log( 'Info.onPrac', { all:this.all, prac:this.prac } );
        if( prac==='Info' ) { this.all=true; } else { this.all=false; this.prac=prac; } },
      klass: function(klas) {
        return !this.all ? 'all' : klas; } },
    mounted: function () {
      // console.log( 'Info.vue', 'mounted' );
      this.subscribe( 'Info', 'Info.vue', (prac) => this.onPrac(prac) ); }
  }
</script>

<style lang="less">
 @import "View.less";
</style>

