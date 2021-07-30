var Choice,
  hasProp = {}.hasOwnProperty;

import ChoiceObj from '../../../data/jitter/Choice.json';

import FlavorObj from '../../../data/jitter/Flavor.json';

Choice = class Choice {
  constructor(nav) {
    // Helper method called by Wheel.coffee
    this.onChoice = this.onChoice.bind(this);
    this.nav = nav;
    this.debug = false;
  }

  flavorJson() {
    return FlavorObj;
  }

  onChoice(compKey, choice, checked) {
    return this.nav.pub({
      source: "Choice.coffee",
      compKey: compKey,
      choice: choice,
      checked: checked
    });
  }

  choices(name) {
    return ChoiceObj[name].choices;
  }

  choose(obj) {
    var choices;
    choices = this.choices(obj.compKey);
    if (obj.checked) {
      choices.push(obj.choice);
    } else {
      choices = choices.filter(function(elem) {
        return elem !== obj.choice;
      });
      ChoiceObj[obj.compKey].choices = choices;
    }
    if (this.debug) {
      console.log("Choice.choose()", {
        choice: obj.choice,
        checked: obj.checked,
        choices: choices,
        compKey: obj.compKey
      });
    }
  }

  choosen(name, choice) {
    return this.nav.inArray(choice, this.choices(name));
  }

  choiceIndex(name, choice) {
    return this.choices(name).indexOf(choice);
  }

  refreshBtns(name, btns) {
    var btn, key;
    for (key in btns) {
      if (!hasProp.call(btns, key)) continue;
      btn = btns[key];
      btn.checked.value = this.choosen(name, btn.name);
    }
  }

};

export default Choice;

//# sourceMappingURL=Choice.js.map
