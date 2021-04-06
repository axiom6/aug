
<template>
  <table class="table">
    <!--caption>{{caption}}</caption-->
    <thead><tr><template v-for="col  in culs"><th>{{col}}</th></template></tr></thead>
    <tbody><template v-for="row  in rows">
       <tr><template v-for="cell in row"><td>{{cell}}</td></template></tr>
    </template></tbody>
    <tfoot></tfoot>
  </table>
</template>

<script type="module">
  
  import Table from '../../pub/base/store/Table.js'
  
  let Table1 = {
    
    data() {
      return { comp:'Table1', key:'Table1', caption:"Table1",
        culs:{},
        rows:{},
        culs2:{  key:"Id", first:"First", last:"Last",    rank:"Rank"    },
        rows2:{
          r1: { key:"1",   first:"Mark",  last:"Felton",  rank:"Colonel" },
          r2: { key:"2",   first:"Brian", last:"Jackson", rank:"Captain" },
          r3: { key:"3",   first:"Dave",  last:"Markum",  rank:"Sargent" } }
     } },

    methods: {},

    mounted: function () {
      let table = new Table( this.stream() );
      let onSelect = (results) => {
        this.rows = results;
        this.culs = table.columns(results); }
      table.selectPrac( onSelect );
    }
  }
  
  export default Table1;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';
  
  @tableFS:@themeFS;
  
  .table { background-color:@theme-back; justify-self:center; align-self:center; font-size:@tableFS;
     table-layout: fixed; border-collapse: collapse; border:1px solid @theme-fore; }

  caption  { color:@theme-fore; }
  thead th { color:@theme-fore; padding:0.1em 0.2em 0.1em 0.2em; border:1px solid @theme-fore; }

  tbody tr {}
  tbody tr:nth-child(odd)  { background-color: #111111; }
  tbody tr:nth-child(even) { background-color: #222222; }
  
  tbody tr td { color:@theme-fore; padding:0.1em 0.2em 0.1em 0.2em; border:1px solid @theme-fore; }

</style>