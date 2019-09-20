
<script type="module">

  import Choice from './Choice.vue'

  let Roast = {

    extends:Choice,

    data() { return { name:'Roast', btns:{
        Blonde:    { title:'Blonde',    name:'Blonde',    pos:[7, 5,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/1.png' },
        Light:    { title:'Light',    name:'Light',       pos:[7,15,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/2.png' },
        City:    { title:'City',    name:'City',          pos:[7,25,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/3.png' },
        Full:   { title:'Full',   name:'Full',            pos:[7,35,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/4.png' },
        Medium: { title:'Medium', name:'Medium',          pos:[7,45,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/5.png' },
        Vienna:    { title:'Vienna',     name:'Vienna',   pos:[7,55,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/6.png' },
        Dark:   { title:'Dark',   name:'Dark',            pos:[7,65,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/7.png' },
        French: { title:'French', name:'French',          pos:[7,75,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/8.png' },
        Black:    { title:'Black',     name:'Black',      pos:[7,85,86,9], hsv:[34,44,69],
          check:true, checked:false, img:'roast/9.png' }
      } } }

  }

  export default Roast;

</script>