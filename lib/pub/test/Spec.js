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
    type = this.toType(arg);
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
    type = this.toType(arg);
    return this.isDef(arg) && type !== "object" && (type === "regexp" || (type === "string" && arg.includes(":")));
  }

  isSpecObject(arg) {
    return this.isObject(arg) && this.isIn(arg.type, "results") && (arg.match != null) && this.isMatch(arg.match) && (arg.card != null) && this.isCard(arg.card);
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
  // rangeStr    = "| a-z, 0-9, A-Z |"
  // rangeRgb    = "| 0-255 |"
  // rangeHsv    = "| 0-360, 0-100, 0-100 |"
  // rangeFlt    = "| 0-360+0.001, 0-100+0.001, 0-100+0.001 |"
  isRange(range) {
    var a, isFloatRange, isIntRange, isStrRange;
    if (range.includes(",")) {
      return this.isRanges(this.toRanges(range));
    }
    a = this.toRangeArray(range);
    isStrRange = function(a) {
      return a.length === 2 && a[0] <= a[1];
    };
    isIntRange = function(a) {
      return a.length === 2 && a[0] <= a[1];
    };
    isFloatRange = function(a) {
      return a.length === 3 && a[0] - a[2] <= a[1] + a[2];
    };
    switch (this.toType(a[0])) {
      case 'string':
        return isStrRange(a);
      case 'int':
        return isIntRange(a);
      case 'float':
        return isFloatRange(a);
      default:
        return false;
    }
  }

  isRanges(ranges) {
    var j, len, pass, range;
    pass = true;
    for (j = 0, len = ranges.length; j < len; j++) {
      range = ranges[j];
      pass = pass && this.isRange(range);
    }
    return pass;
  }

  // Moved to Type.coffee
  isEnums(arg) {
    return super.isEnums(arg);
  }

  isResult(result) {
    var type;
    type = this.toType(result);
    return this.isDef(result) && this.isIn(type, "results");
  }

  isExpect(expect) {
    var type;
    type = this.toType(expect);
    return this.isDef(expect) && this.isIn(type, "expects");
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
        return this.toSpecInit(); // @toSpecInit() creates a do nothing spec
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
    spec = this.toSpecInit();
    splits = arg.split(":");
    length = splits.length;
    if (length >= 1) {
      spec.type = splits[0];
    }
    if (length >= 1) { // match
      type = this.toType(splits[1]);
      spec.match = (function() {
        switch (type) {
          case "regexp":
            return "regexp"; // regex
          case "string":
            switch (false) {
              case !splits[1].includes("|"):
                return this.toEnums(splits[1]);
              case !this.isEnclosed("[", splits[1], "]"):
                return this.toArray(splits[1]);
              case !this.isEnclosed("{", splits[1], "}"):
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
    spec = this.toSpecInit();
    spec.type = arg.type != null ? arg.type : "any";
    spec.match = arg.match != null ? arg.match : "any";
    spec.card = arg.card != null ? arg.card : "1"; // required
    return spec;
  }

  toSpecInit() {
    return {
      type: "any",
      match: "any",
      card: "1"
    };
  }

  toRange(arg) {
    if (this.isType(arg, "range")) {
      return arg;
    } else {
      return "any";
    }
  }

  toRanges(range) {
    range = this.strip(range, "|", "|");
    range = range.replaceAll(" ", ""); // remove white space
    return range.split(",");
  }

  // |a-z| |0-100|  |0-100+0.001|
  toRangeArray(range) {
    var a, splits, splits2;
    a = [];
    range = this.strip(range, "|", "|");
    range = range.replaceAll(" ", ""); // remove white space
    splits = range.split("-");
    // Append the optional 3rd parameter tolerance for 'float' ranges
    if (splits.length === 2 && splits[1].includes("+")) {
      splits2 = splits[1].split("+");
      splits[1] = splits2[0];
      splits.push(splits2[1]);
    }
    switch (this.toType(splits[0])) {
      case "string" && splits.length === 2: // 'string'
        a.push(splits[0]);
        return a.push(splits[1]);
      case "int" && splits.length === 2: // 'int'
        a.push(this.toInt(splits[0]));
        return a.push(this.toInt(splits[1]));
      case "float" && splits.length === 3: // 'float'
        a.push(this.toFloat(splits[0]));
        a.push(this.toFloat(splits[1]));
        return a.push(this.toFloat(splits[2]));
      default:
        return a;
    }
  }

  // Moved to Type.coffee
  toEnums(arg) {
    return super.toEnums(arg);
  }

  // Arg types must be 'regexp' or 'string', otherwise returns 'any'
  toRegexp(arg) {
    switch (this.toType(arg)) {
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
    if (this.isNot(spec) || !(this.isSpec(spec) && this.toType(result) === spec.type && this.inCard(result, spec))) {
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
      if (result[key] != null) {
        pass = pass && this.inSpec(result[key], spec[key]);
      }
    }
    return pass;
  }

  // Determine if a result is bounded witnin a range.
  // This method is here in Tester because it call @examine()
  inRange(result, range) {
    var a, inFloatRange, inIntRange, inStrRange;
    if (range.includes(",")) {
      return this.inRanges(result, this.toRanges(range));
    }
    if (!this.isType(range)) { // @isRange(range)
      return false;
    }
    a = this.toRangeArray(range); // Convers the range to an array
    inStrRange = function(string, a) {
      return a[0] <= string && string <= a[1];
    };
    inIntRange = function(int, a) {
      return a[0] <= int && int <= a[1];
    };
    inFloatRange = function(float, a) {
      return a[0] - a[2] <= float && float <= a[1] + a[2];
    };
    switch (this.toType(result)) {
      case "string":
        return inStrRange(result, a);
      case "int":
        return inIntRange(result, a);
      case "float":
        return inFloatRange(result, a);
      default:
        return false;
    }
  }

  // Ony apply the ranges we have are applied
  // if ranges is just a single range applied then it is applied to each result
  inRanges(results, ranges) {
    var i, j, k, len, min, pass, ref, result;
    pass = true;
    switch (false) {
      case !(this.isArray(results) && this.isArray(ranges)):
        min = Math.min(results.length, ranges.length); // Ony apply the ranges we ga
        for (i = j = 0, ref = min; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          pass = pass && this.inRange(results[i], ranges[i]);
        }
        break;
      case !this.isArray(results):
        for (k = 0, len = results.length; k < len; k++) {
          result = results[k];
          pass = pass && this.inRange(results, ranges);
        }
        break;
      default:
        pass = false;
    }
    return pass;
  }

  // Determine if a result is enumerated.
  // inEnums:( result, enums ) ->
  //   super.toEnums( result, enums )
  inRegexp(result, regexp) {
    if (!this.isRegexp(regexp)) {
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
      case !(this.isStr(card) && card.includes("-")):
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

};

export var spec = new Spec(); // Export a singleton instence of type

export default Spec;

//# sourceMappingURL=Spec.js.map
