
<template>
  <div class="navb">    <!-- <i class="fas fa-home"></i> -->
    <div class="home"><router-link :to="{ name:'Home'}">Home</router-link></div>
    <div class="search"   @click="click('Search')"  >
      <label><input class="input" placeholder="  Search"  type="text" size="16"></label><!-- &#xF002; -->
    </div>
    <div class="contact"  @click="click('Contact')" ><i class="fas fa-user"   ></i>Contact</div>
    <div class="signon"   @click="click('Signon')"  ><i class="fas fa-sign-in"></i>Sign On</div>
    <div class="settings"><i class="fas fa-cog"  ></i><span>Settings</span>
      <ul>
        <li @click="click('Preferences')">Preferences</li>
        <li @click="click('Connection')" >Connection</li>
        <li @click="click('Privacy')"    >Privacy</li>
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
  
  // top | right | bottom | left
  
  .grid1x5() { display:grid; grid-template-columns:5% 45% 20% 10% 10% 10%;
    grid-template-areas: "gleft ghome gsearch gcontact gsettings gsignon"; }
  
  .navb {  .grid1x5(); background-color:black; color:wheat; display:grid;
      font-family:Roboto, sans-serif; font-size:3vh; font-weight:bold;
    .home     { grid-area:ghome;     justify-self:start; align-self:center;
      a { color:wheat; text-decoration:none; }}
    .search   { grid-area:gsearch;   justify-self:start; align-self:center; // font-family:FontAwesome, sans-serif;
      label .input{ font-family:Roboto, sans-serif; font-size:3vh; font-weight:bold;
        border-radius:0 12px 12px 0; background:black; color:wheat; } }
    .contact  { grid-area:gcontact;  justify-self:start; align-self:center; }
    .signon   { grid-area:gsignon;   justify-self:start; align-self:center; }
    .settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;
      ul { display:none; align-self:start; list-style:none; font-size:2.2vh; z-index:3; background:#222;
        position:absolute; left:10px; top:12px; width:auto; height:auto;
        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;
        li { border-radius:0 18px 18px 0;  background:black; color:wheat;
             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em; } } }
    .settings:hover {
      ul { display:grid; align-self:start; background:#444;
        li:hover { background:#777; color:black; } } } }
  
</style>
