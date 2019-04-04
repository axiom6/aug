
<template>
  <div class="view">
    <div id="Humanity"    class="nw"     ><div class="pane"><div class="name">Humanity</div></div></div>
    <div id="Science"     class="north"  ><div class="pane"><div class="name">Science</div></div></div>
    <div id="Understand"  class="ne"     ><div class="pane"><div class="name">Understand</div></div></div>
    <div id="Orchestrate" class="west"   ><div class="pane"><div class="name">Orchestrate</div></div></div>
    <div id="Cognition"   class="cen"    ><div class="pane"><div class="name">Cognition</div></div></div>
    <div id="Reason"      class="east"   ><div class="pane"><div class="name">Reason</div></div></div>
    <div id="Evolve"      class="sw"     ><div class="pane"><div class="name">Evolve</div></div></div>
    <div id="Educate"     class="south"  ><div class="pane"><div class="name">Educate</div></div></div>
    <div id="Culture"     class="se"     ><div class="pane"><div class="name">Culture</div></div></div>
  </div>
</template>

<script type="module">
  export default {
    data() { return { sel:"Info" } },
    methods: {
      onSelect: function (select) {
        this.sel =  select;
        console.log( 'view.vue', select ); } },
    mounted: function () {
      console.log( 'Know.vue', 'mounted' );
      this.subscribe( 'Select', 'view.vue', (select) => this.onSelect(select) ); }
  }
</script>

<style lang="less">
  .view { background-color:grey;
    display:grid;
    grid-template-columns: 33%  33% 34%;
    grid-template-rows:    33%  33% 34%;
    grid-template-areas:
      "nw   north ne"
      "west cen   east"
      "sw   south se";
    justify-items:center; align-items:center;
    .nw     { grid-area:nw;    justify-self:stretch; align-self:stretch; display:grid; }
    .north  { grid-area:north; justify-self:stretch; align-self:stretch; display:grid; }
    .ne     { grid-area:ne;    justify-self:stretch; align-self:stretch; display:grid; }
    .west   { grid-area:west;  justify-self:stretch; align-self:stretch; display:grid; }
    .cen    { grid-area:cen;   justify-self:stretch; align-self:stretch; display:grid; }
    .east   { grid-area:east;  justify-self:stretch; align-self:stretch; display:grid; }
    .sw     { grid-area:sw;    justify-self:stretch; align-self:stretch; display:grid; }
    .south  { grid-area:south; justify-self:stretch; align-self:stretch; display:grid; }
    .se     { grid-area:se;    justify-self:stretch; align-self:stretch; display:grid; }
    .pane { font-size:1.5em; width:90%; height:80%; background-color:tan;
      justify-self:center; align-self:center; display:grid; border-radius:0.5em; }
    .pane .name  { font-size:2em; background-color:tan;
      justify-self:center; align-self:center; text-align:center; }
  }

</style>

