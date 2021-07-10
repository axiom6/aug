var Spec,
  hasProp = {}.hasOwnProperty,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Type from "./Type.js";

Spec = class Spec extends Type {
  constructor() {
    super();
    // -- in... Spec matches
    this.inSpec = this.inSpec.bind(this);
  }

  // -- is... Spec assertions
  isSpec(arg) {
    var j, key, len, pass, type, val;
    type = this.type(arg);
    switch (type) {
      case "string":
        return this.isSpecParse(arg);
      case "object":
        if (this.isSpecObject(arg)) {
          return true;
        } else {
          pass = true;
          for (key in arg) {
            if (!hasProp.call(arg, key)) continue;
            val = arg[key];
            pass = pass && this.isSpec(val);
          }
          return pass;
        }
        break;
      case "array":
        pass = true;
        for (j = 0, len = arg.length; j < len; j++) {
          val = arg[j];
          pass = pass && this.isSpec(val);
        }
        return pass;
      default:
        return false;
    }
  }

  isSpecParse(arg) {
    var type;
    type = this.type(arg);
    return this.isDef(arg) && type !== "object" && (type === "regexp" || (type === "string" && arg.includes(":")));
  }

  isSpecObject(arg) {
    return this.conditions(this.isObject(arg), this.isIn(arg.type, "results"), this.isMatch(arg.match), this.isCard(arg.card));
  }

  isMatch(match) {
    switch (false) {
      case !this.isRegexp(match):
        return true;
      case !this.isEnums(match):
        return true;
      case !this.isRange(match):
        return true;
      default:
        return false;
    }
  }

  // let re = /ab+c/i; // literal notation
  // let re = new RegExp('ab+c', 'i') // constructor with string pattern as first argument
  // let re = new RegExp(/ab+c/, 'i') // constructor with regular express
  isRegexp(arg) {
    return this.isType(arg, "regexp");
  }

  // Asserts range with for types "string" or "int" or "float"
  // internal functions verify an array of type "string" or "int" or "float"
  //   is an array of type "string" or "int" or "float"
  isRange(range) {
    var isFloatRange, isIntRange, isStrRange;
    if (!this.isArray(range)) {
      return false;
    }
    isStrRange = function(r) {
      return r.length === 2 && r[0] <= r[1];
    };
    isIntRange = function(r) {
      return r.length === 2 && r[0] <= r[1];
    };
    isFloatRange = function(r) {
      return r.length === 3 && r[0] - r[2] <= r[1] + r[2];
    };
    switch (this.type(range[0])) {
      case 'string':
        return isStrRange(range);
      case 'int':
        return isIntRange(range);
      case 'float':
        return isFloatRange(range);
      default:
        return false;
    }
  }

  // Moved to Type.coffee
  isEnums(arg) {
    return super.isEnums(arg);
  }

  isResult(result) {
    var type;
    type = this.type(result);
    return this.isDef(result) && this.isIn(type, "results");
  }

  isExpect(expect) {
    var type;
    type = this.type(expect);
    return this.isDef(expect) && this.isIn(type, "expects");
  }

  // This approach insures that all conditions are checked and messages sent
  //   then all arg returns are anded together to determine a final pass or fail
  conditions(...args) {
    var arg, j, len, pass;
    pass = true;
    for (j = 0, len = args.length; j < len; j++) {
      arg = args[j];
      pass = pass && arg;
    }
    return pass;
  }

  // -- to... Spec conversions
  toSpec(arg) {
    var array, j, key, len, obj, val;
    switch (false) {
      case !this.isSpecParse(arg):
        return this.toSpecParse(arg);
      case !this.isSpecObject(arg):
        return this.toSpecObject(arg);
      case !this.isArray(arg):
        array = [];
        for (j = 0, len = arg.length; j < len; j++) {
          val = arg[j];
          array.push(this.toSpec(val));
        }
        return array;
      case !this.isObject(arg):
        obj = {};
        for (key in arg) {
          if (!hasProp.call(arg, key)) continue;
          val = arg[key];
          obj[key] = this.toSpec(val);
        }
        return obj;
      default:
        return this.specInit(); // @specInit() creates a do nothing spec
    }
  }

  
    // toSpecParse:( spec, arg )
  // Examples
  //   "array:[0,255]" }      { type:"array",   oper:"range", match:[0,255],         card="1" }
  //   "string:James"         { type:"string",  oper:"eq",    match:James,           card="1" }
  //   "string:a|b|c"         { type:"string",  oper:"enums", match:"a|b|c",         card="1" }
  //   "int:[0,100]"          { type:"int",     oper:"range", match:[0,100],         card="1" }
  //   "float:[0.0,100.0,1.0] { type:"float",   oper:"range", match:[0.0,100.0,1.0], card="1" }
  //   "string:["","zzz"]     { type:"string",  oper:"range", match:["","zzz"],      card="1" }
  //   "boolean"              { type:"boolean", oper:"any",   match:"any",           card="1" }
  //   "object:{r:[0,255],g:[0,255],b:[0,255]}
  //     { type:"object", oper:"range", match:{r:[0,255],g:[0,255],b:[0,255]}, card="1" }
  //  "array:[[0,360],[0,100],[0,100]]:?"
  //     { type:"array",  oper:"range", match:[[0,360],[0,100],[0,100]], card="?" }
  toSpecParse(arg) {
    var length, spec, splits, type;
    spec = this.toInit();
    splits = arg.split(":");
    length = splits.length;
    if (length >= 1) {
      spec.type = splits[0];
    }
    if (length >= 1) { // match
      type = this.type(splits[1]);
      spec.match = (function() {
        switch (type) {
          case "regexp":
            return "regexp"; // regex
          case "string":
            switch (false) {
              case !splits[1].includes("|"):
                return this.toEnums(splits[1]);
              case !this.isStrEnclosed("[", splits[1], "]"):
                return this.toArray(splits[1]);
              case !this.isStrEnclosed("{", splits[1], "}"):
                return this.toObject(splits[1]);
              default:
                return "any";
            }
            break;
          default:
            return "any";
        }
      }).call(this);
    }
    if (length >= 2) {
      spec.card = splits[2];
    }
    return spec;
  }

  toSpecObject(arg) {
    var spec;
    spec = this.specInit();
    spec.type = arg.type != null ? arg.type : "any";
    spec.match = arg.match != null ? arg.match : "any";
    spec.card = arg.card != null ? arg.card : "1"; // required
    return spec;
  }

  specInit() {
    return {
      type: "any",
      match: "any",
      card: "1"
    };
  }

  toRange(arg) {
    switch (this.type(arg)) {
      case "array":
        return arg;
      case "string":
        return this.toArray(arg);
      default:
        return "any";
    }
  }

  // Moved to Type.coffee
  toEnums(arg) {
    return super.toEnums(arg);
  }

  // Arg types must be 'regexp' or 'string', otherwise returns 'any'
  toRegexp(arg) {
    switch (this.type(arg)) {
      case "regexp":
        return arg;
      case "string":
        return new RegExp(arg);
      default:
        return "any";
    }
  }

  inSpec(result, spec) {
    var match;
    boundMethodCheck(this, Spec);
    if (!(this.isSpec(spec) && this.type(result) === spec.type && this.inCard(spec.card))) {
      return false;
    }
    match = spec.match;
    switch (false) {
      case !(this.isArray(result) && this.isArray(spec)):
        return this.inSpecArray(result, spec);
      case !(this.isObject(result) && this.isObject(spec)):
        return this.inSpecObject(result, spec);
      case !this.isRange(match):
        return this.isRange(result, match);
      case !this.isEnums(match):
        return this.isEnums(result, match);
      case !this.isRegexp(match):
        return this.isRegexp(result, match);
      default:
        return false;
    }
  }

  // Here only minimum length of spec and result are checked
  inSpecArray(result, spec) {
    var i, j, min, pass, ref;
    pass = true;
    min = Math.min(result.length, spec.length);
    for (i = j = 0, ref = min; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      pass = pass && this.inSpec(result[i], spec[i]);
    }
    return pass;
  }

  // Here only the keys common to both spec and result are checked
  inSpecObject(result, spec) {
    var key, pass, val;
    pass = true;
    for (key in spec) {
      if (!hasProp.call(spec, key)) continue;
      val = spec[key];
      if (result[key]) {
        pass = pass && this.inSpec(result[key], spec[key]);
      }
    }
    return pass;
  }

  // Determine if a result is bounded witnin a range.
  // This method is here in Tester because it call @examine()
  inRange(result, range) {
    var inFloatRange, inIntRange, inStrRange;
    if (!this.isRange(range)) {
      return false;
    }
    range = this.toRange(range); // Convers the 'string' represention of range if necessary
    inStrRange = function(string, range) {
      return range[0] <= string && string <= range[1];
    };
    inIntRange = function(int, range) {
      return range[0] <= int && int <= range[1];
    };
    inFloatRange = function(float, range) {
      return range[0] - range[2] <= float && float <= range[1] + range[2];
    };
    switch (this.type(result)) {
      case "string":
        return inStrRange(result, range);
      case "int":
        return inIntRange(result, range);
      case "float":
        return inFloatRange(result, range);
      default:
        return false;
    }
  }

  // Determine if a result is enumerated.
  inEnums(result, enums) {
    if (!this.isEnums(enums)) {
      return false;
    }
    enums = this.toEnums(enums); // Convers the 'string' represention of enums if necessary
    return this.inArray(result, enums);
  }

  inRegexp(result, regexp) {
    if (!this.isRegexo(regexp)) {
      return false;
    }
    regexp = this.toRegexp(regexp);
    return regexp.test(result);
  }

  isCard(card) {
    return this.isStr(card) && (this.isType(card, "int") || card.includes(":") || this.isIn(card, "cards"));
  }

  // ... more to come for checking cardinallity
  inCard(result, spec) {
    var card, minMax, num;
    card = spec.card;
    switch (false) {
      case !this.isType(card, "int"):
        return true;
      case !(this.isStr(card) && card.includes(":")):
        minMax = this.toMinMax(card);
        num = minMax[0];
        return (minMax[0] <= num && num <= minMax[1]);
      default:
        switch (card) {
          case "1":
            return true;
          case "?":
            return true;
          case "*":
            return true;
          case "+":
            return true;
          default:
            return false;
        }
    }
  }

  toMinMax(card) {
    var max, min, splits;
    splits = card.split(":");
    min = this.toInt(splits[0]);
    max = this.toInt(splits[1]);
    return [min, max];
  }

  // Override Type.isIn() with addional Spec type arrays
  isIn(type, arg) {
    switch (false) {
      case !this.isArray(arg):
        return this.inArray(type, arg);
      case !this.isEnums(arg):
        return this.inArray(type, this.toEnums(arg));
      case !this.isStr(arg):
        return this.toIn(arg).includes(type);
      default:
        return this.isWarn(false, `arg ${arg} not 'array', 'enums' or 'string'`, type, false);
    }
  }

  // Override Type.isIn() with addional Spec type arrays
  toIn(arg) {
    switch (false) {
      case !(arg == null):
        return [];
      case Type[arg] == null:
        return Type[arg];
      case Spec[arg] == null:
        return Spec[arg];
      default:
        return [];
    }
  }

};

Spec.matches = [
  "range",
  "enums",
  "regexp" // high level matches
];

Spec.opers = [
  "to",
  "eq",
  "le",
  "lt",
  "ge",
  "gt",
  "ne" // low  level value  based comparison  ooers 'eq' default
];

Spec.cards = [
  "1",
  "?",
  "*",
  "+" // cards  1 required, ? optional, * 0 to many, + 1 to many
];

export var spec = new Spec(); // Export a singleton instence of type

export default Spec;

//# sourceMappingURL=Spec.js.map
