
<template>
  <div class="navb">    <!-- <i class="fas fa-home"></i> -->
    <div class="navh"><router-link :to="{ name:'Home'}"><i class="fas fa-home"></i>Home</router-link></div>
    <div class="search"   @click="click('Search')">
      <i class="fas fa-search"></i>
      <label for="search"><input class="input" placeholder=" Search" id="search" type="text" size="16"></label>
    </div>
    <div class="contact"  @click="click('Contact')" ><i class="fas fa-user"       ></i>Contact</div>
    <div class="signon"   @click="click('Signon')"  ><i class="fas fa-sign-in-alt"></i>Sign On</div>
    <div class="settings"><i class="fas fa-cog"></i><span>Settings</span>
      <ul>
        <li @click="click('Preferences')"><i class="fas fa-cog"></i><span>Preferences</span></li>
        <li @click="click('Connection')" ><i class="fas fa-cog"></i><span>Connection</span></li>
        <li @click="click('Privacy')"    ><i class="fas fa-cog"></i><span>Privacy</span></li>
      </ul>
    </div>
  </div>
</template>

<script type="module">
  
  export default {
    data() {
      return {} },
    methods: {
      click:  function( obj )  {
        this.publish(  'Navb', obj    ); },
      onNavb: function( obj )  {
        console.log(  'Navb.onNavb()', obj ); } },
    mounted: function () {
      this.subscribe( 'Navb', 'Navb.vue', this.onNavb ) } };
  
</script>

<style lang="less">
  
  @import 'theme.less';
  
  .grid1x5() { display:grid; grid-template-columns:5% 40% 25% 10% 10% 10%; grid-template-rows:@theme-north;
    grid-template-areas: "gleft ghome gsearch gcontact gsettings gsignon"; }
  
  .navb {  .grid1x5(); display:grid; background:@theme-back; color:@theme-color;
    font-family:@theme-font-family; font-size:1.4vw; font-weight:bold;    // Using because Navb sensistive to width
    .navh     { grid-area:ghome;     justify-self:start; align-self:center;
      i { margin-right:0.3em; }
      a { color:@theme-color; text-decoration:none; }}
    .search   { grid-area:gsearch;   justify-self:start; align-self:center; // font-family:FontAwesome, sans-serif;
      label .input{ font-family:@theme-font-family; font-weight:bold;  font-size:0.9em;
        border-radius:0 12px 12px 0; background:@theme-color; color:@theme-back; } }
    .contact  { grid-area:gcontact;  justify-self:start; align-self:center; }
    .signon   { grid-area:gsignon;   justify-self:start; align-self:center; }
    .settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;
      ul { display:none; align-self:start; list-style:none; font-size:0.7em; z-index:3; background:@theme-back-navb-menu;
        position:absolute; left:10px; top:12px; width:200px; height:auto;
        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;
        li { display:inline; border-radius:0 18px 18px 0;  background-color:@theme-back; color:@theme-color;
             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em;
          i {    display:inline-block; margin-right:0.25em; }
          span { display:inline-block; } } } }
    .settings:hover {
      ul { display:grid; align-self:start; background:@theme-back-navb-item;
        li:hover { background:@theme-back-navb-item-hover; color:@theme-color-navb-item-hover; } } }
     div i { margin-right:0.3em; } }
  
</style>
