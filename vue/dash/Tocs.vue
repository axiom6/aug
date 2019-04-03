
<template>
  <div class="tocs">
    <ul>
      <li @click="doSelect('Collaborate')">Collaborate</li>
      <li @click="doSelect('Domain')"     >Domain</li>
      <li @click="doSelect('Discover')"   >Discover</li>
      <li @click="doSelect('Adapt')"      >Adapt</li>
      <li @click="doSelect('Technology')" >Technology</li>
      <li @click="doSelect('Benefit')"    >Benefit</li>
      <li @click="doSelect('Change')"     >Change</li>
      <li @click="doSelect('Deliver')"    >Deliver</li>
      <li @click="doSelect('Govern')"     >Govern</li>
      <li @click="doSelect('View')"       >View</li>
    </ul>
  </div>
</template>

<script type="module">
  let Tocs = {
    methods: {
      doSelect: function (select) {
        console.log( 'tocs.vue', select );
        this.publish("Select",   select ); }
    } };
   export default Tocs;
</script>

<style lang="less">
  .tocs             { background-color:darkgrey;  }
  .tocs ul          { margin:0; padding:0; list-style: none; }
  .tocs ul li       { margin:0; background-color:black; color:white; border:white solid 1px; padding-left:0.25em; }
  .tocs ul li:hover { margin:0; background-color:white; color:black; border:white solid 1px; }
</style>
