
<template>
  <div   class="menu-pane">    <!-- <i class="fas fa-home"></i> -->
    <div class="menu-navh"><router-link :to="{ name:'Home'}"><i class="fas fa-home"></i>Home</router-link></div>
    <div class="menu-search"   @click="click('Search')">
      <label for="search">Search</label>
      <i class="fas fa-search"></i>
      <input class="menu-input" placeholder=" Search" id="search" type="text" size="16">
    </div>
    <div class="menu-contact"  @click="click('Contact')" ><i class="fas fa-user"       ></i>Contact</div>
    <div class="menu-signon"   @click="click('Signon')"  ><i class="fas fa-sign-in-alt"></i>Sign On</div>
    <div class="menu-settings"><i class="fas fa-cog"></i><span>Settings</span>
      <ul>
        <li @click="click('Preferences')"><i class="fas fa-cog"></i><span>Preferences</span></li>
        <li @click="click('Connection')" ><i class="fas fa-cog"></i><span>Connection</span></li>
        <li @click="click('Privacy')"    ><i class="fas fa-cog"></i><span>Privacy</span></li>
      </ul>
    </div>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  
  export default {
    data() {
      return {} },
    methods: {
      click:  function( obj )  {
        this.mix.publish(  'Menu', obj    ); },
      onMenu: function( obj )  {
        console.log(  'Menu.onMenu()', obj ); } },
    mounted: function () {
      this.mix.subscribe( 'Menu', 'Menu', this.onMenu ) } };
  
</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';
  
  @menuFS:@themeFS;
  @menu-back:#222;
  @item-back:#444;
  @fore-hover:#777;
  @back-hover:black;
  
  .grid1x5() { display:grid; grid-template-columns:5fr 40fr 25fr 10fr 10fr 10fr; grid-template-rows:1fr;
    grid-template-areas: "gleft ghome gsearch gcontact gsettings gsignon"; }
  
  .menu-pane {  .grid1x5(); display:grid; background:@theme-back; color:@theme-fore;
    font-family:@theme-font-family; font-weight:bold;    // Using because Navb sensistive to width
    .menu-navh     { grid-area:ghome;     justify-self:start; align-self:center;
      i { margin-right:0.3em; }
      a { color:@theme-fore; text-decoration:none; }}
    .menu-search   { grid-area:gsearch;   justify-self:start; align-self:center;
      label { color:@theme-back; }
      .menu-input{ font-family:@theme-font-family; font-weight:bold;  font-size:0.9*@menuFS;
        border-radius:0 12px 12px 0; background:@theme-fore; color:@theme-back; } }
    .menu-contact  { grid-area:gcontact;  justify-self:start; align-self:center; }
    .menu-signon   { grid-area:gsignon;   justify-self:start; align-self:center; }
    .menu-settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;
      ul { display:none; align-self:start; list-style:none; font-size:0.7@menuFS; z-index:3;
        background:@menu-back;
        position:absolute; left:10px; top:12px; width:200px; height:auto;
        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;
        li { display:inline; border-radius:0 18px 18px 0;  background-color:@theme-back; color:@theme-fore;
             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em;
          i {    display:inline-block; margin-right:0.25em; }
          span { display:inline-block; } } } }
    .menu-settings:hover {
      ul { display:grid; align-self:start; background:@item-back;
        li:hover { background:@back-hover; color:@fore-hover; } } }
     div i { margin-right:0.3em; } }
  
</style>
