
<script type="module">

  import Choice from './Choice.vue'

  let Brew = {

    extends:Choice,

    data() { return { name:'Brew', btns:{
      ColdBrew:    { title:'Cold Brew',    name:'ColdBrew',    pos:[7, 5,86,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/ColdBrew.jpg' },
      PourOver:    { title:'Pour Over',    name:'PourOver',    pos:[7,20,86,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/PourOver.jpg' },
      AutoDrip:    { title:'Auto Drip',    name:'AutoDrip',    pos:[7,35,86,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/AutoDrip.jpg' },
      SyphonPot:   { title:'Syphon Pot',   name:'SyphonPot',   pos:[7,50,86,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/SyphonPot.jpg' },
      FrenchPress: { title:'French Press', name:'FrenchPress', pos:[7,65,86,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/FrenchPress.jpg' },
      Expresso:    { title:'Expresso',     name:'Expresso',    pos:[7,80,86,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/Expresso.jpg' }
      } } }

  }

  export default Brew;

</script>