
import ChoiceObj from '../../../data/jitter/Choice.json'
import FlavorObj from '../../../data/jitter/Flavor.json'

class Choice

  constructor:( @nav ) ->
    @debug = false

  flavorJson: () ->
    FlavorObj

  # Helper method called by Wheel.coffee
  onChoice: ( compKey, choice, checked ) =>
    @nav.pub( { source:"Choice.coffee", compKey:compKey, choice:choice, checked:checked } )

  choices:(name) ->
    ChoiceObj[name].choices

  choose:( obj ) ->
    choices = @choices(obj.compKey)
    if obj.checked
      choices.push( obj.choice )
    else
      choices = choices.filter( (elem) -> elem isnt obj.choice )
      ChoiceObj[obj.compKey].choices = choices
    console.log( "Choice.choose()", { choice:obj.choice, checked:obj.checked, choices:choices, compKey:obj.compKey }) if @debug
    return

  choosen:( name, choice ) ->
    @nav.inArray( choice, @choices(name) )

  choiceIndex:( name, choice ) ->
    @choices(name).indexOf(choice)

  refreshBtns:( name, btns ) ->
    for own key,btn of btns
      btn.checked.value = @choosen( name, btn.name )
    return


export default  Choice
