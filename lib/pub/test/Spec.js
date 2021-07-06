var Spec;

import Type from "./Type.js";

Spec = class Spec extends Type {
  constructor() {
    super();
  }

  isEnums(arg, oper, type) {
    return oper === "enums" && this.isArray(arg, type) && this.isResultType(type);
  }

  // Check if an arg like expect is a 'spec'
  verifySpec(arg) {
    return this.conditions(this.isObject(arg), this.isResultType(arg.type), this.isSpec(arg.expect, arg.oper), this.isCard(arg.card));
  }

  isResultType(type) {
    var pass;
    pass = this.isDef(type) && this.isIn(type, "results");
    return this.isWarn(pass, "Not a Result", type, Type.results, function(t) {
      return t.log(t.warn());
    });
  }

  isExpectType(type) {
    var pass;
    pass = this.isDef(type) && this.isIn(type, "expects");
    return this.isWarn(pass, "Not a Expect", type, Spec.expects, function(t) {
      return t.log(t.warn());
    });
  }

  isOper(oper) {
    var pass;
    pass = this.isDef(oper) && this.isIn(oper, "opers");
    return this.isWarn(pass, "Not an 'oper'", oper, "opers", function(t) {
      return t.log(t.warn());
    });
  }

  isCard(card) {
    var pass;
    pass = this.isDef(card) && this.isIn(card, "cards");
    return this.isWarn(pass, "Not a 'card'", card, Spec.cards, function(t) {
      return t.log(t.warn());
    });
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

  isSpec(expect) {
    var isObj, isParse, type;
    type = this.type(expect);
    isParse = this.isSpecParse(expect, type);
    isObj = this.isSpecObject(expect, type);
    if (this.debug) {
      console.log("isSpec(expect)", {
        expect: expect,
        type: type,
        isParse: isParse,
        isObj: isObj
      });
    }
    return isParse || isObj;
  }

  // In the first t
  toSpec(expect) {
    var spec, type;
    type = this.type(expect);
    spec = {
      type: "any",
      oper: "any",
      expect: "any",
      card: "1",
      spec: ""
    };
    return spec = (function() {
      switch (false) {
        case !this.isSpecParse(expect, type):
          return this.toSpecParse(spec, expect);
        case !this.isSpecObject(expect, type):
          return this.toSpecObject(spec, expect);
        default:
          return this.toWarn("toSpec(expect)", "expect not spec 'string' or 'object'", expect, type, "spec", spec, function(t) {
            return t.log(t.warn());
          });
      }
    }).call(this);
  }

  isSpecParse(arg, type) {
    return type === "string" && arg.includes(":");
  }

  // toSpecParse:( spec, arg )
  // Examples
  //   "array:[0,255]" }      { type:"array",   oper:"range", check:[0,255],         card="1" }
  //   "string:James"         { type:"string",  oper:"eq",    check:James,           card="1" }
  //   "string:a|b|c"         { type:"string",  oper:"enums", check:"a|b|c",         card="1" }
  //   "int:[0,100]"          { type:"int",     oper:"range", check:[0,100],         card="1" }
  //   "float:[0.0,100.0,1.0] { type:"float",   oper:"range", check:[0.0,100.0,1.0], card="1" }
  //   "string:["","zzz"]     { type:"string",  oper:"range", check:["","zzz"],      card="1" }
  //   "boolean"              { type:"boolean", oper:"any",   check:"any",           card="1" }
  //   "object:{r:[0,255],g:[0,255],b:[0,255]}
  //     { type:"object", oper:"range", range:{r:[0,255],g:[0,255],b:[0,255]}, card="1" }
  //  "array:[[0,360],[0,100],[0,100]]:?"
  //     { type:"array",  oper:"range", range:[[0,360],[0,100],[0,100]], card="?" }
  toSpecParse(spec, arg) {
    var length, splits;
    splits = arg.split(":");
    length = splits.length;
    if (length >= 1) { // type
      spec.type = splits[0];
    }
    if (length >= 1) { // expect
      spec.spec = splits[1];
      if (splits[1].includes("|")) { //   enum
        spec.oper = "enums";
        spec.expect = this.toEnums(splits[1]);
      } else if (this.isStrEnclosed("[", splits[1], "]")) { //    range array
        spec.oper = "range";
        spec.expect = this.toArray(splits[1]);
      }
    } else if (this.isStrEnclosed("{", splits[1], "}")) { //    range object
      spec.oper = "range";
      spec.expect = this.toObject(splits[1]);
    } else {
      spec.oper = "any";
      spec.expect = "any";
    }
    if (length >= 2) { // card i.e cardinaliry
      spec.oper = splits[2];
    }
    return spec;
  }

  isSpecObject(arg, type) {
    return type === "object" && (arg.oper != null) && (arg.expect != null); // and arg.type? and arg.card?
  }

  toSpecObject(spec, arg) {
    spec.type = arg.type != null ? arg.type : "any";
    spec.oper = arg.oper != null ? arg.oper : "any";
    spec.expect = arg.expect != null ? arg.expect : "any";
    spec.card = arg.card != null ? arg.card : "1"; // required
    spec.spec = arg.spec != null ? arg.spec : ""; // required
    return spec;
  }

  isSpecValue(type) {
    return this.isIn(type, "results");
  }

  // Holding off on this conversion. Instead we will just return an expect value
  toSpecValue(spec, arg, type) {
    spec.type = type;
    spec.oper = "eq";
    spec.expect = arg;
    spec.card = "1"; // required
    spec.spec = "";
    return spec;
  }

  // Camnot is @arraysEq(...) because a single ramge can be applied to all resuls in a result array
  inArrayRange(result, range) {
    var i, j, k, min, nRange, nResult, pass, ref, ref1, text, type;
    pass = true;
    type = this.type(result);
    nResult = result.length;
    nRange = range.length;
    if (nRange === 1) {
      for (i = j = 0, ref = nResult; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        if (this.isArray(result[i])) {
          pass = pass && this.inMyRange(result[i], range);
        }
      }
    } else if (nResult > nRange) {
      text = `not enough range tests ${nRange} for result so only will be ${nRange} tests on result`;
      pass = this.toWarn("inRange()", text, result, type, false, function(t) {
        return t.log(t.warn());
      });
    } else if (nResult < nRange) {
      text = `OK with more range bounds ${nRange} than needed for result ${nResult}`;
      pass = this.toWarn("inRange()", result, text, type, true, function(t) {
        return t.log(t.warn());
      });
      min = Math.min(nResult, nRange);
      for (i = k = 0, ref1 = min; (0 <= ref1 ? k < ref1 : k > ref1); i = 0 <= ref1 ? ++k : --k) {
        if (this.isArray(result[i]) && this.isArray(range[i])) {
          pass = pass && this.inMyRange(result[i], range[i]);
        }
      }
    }
    return pass;
  }

  toEnums(arg) {
    var enums, j, len, split, splits, type;
    enums = [];
    type = type = this.type(arg);
    switch (type) {
      case "string" && arg.includes("|"):
        splits = arg.split("|");
        for (j = 0, len = splits.length; j < len; j++) {
          split = splits[j];
          enums.push(split);
        }
        break;
      case "array":
        enums = arg;
        break;
      default:
        enums = this.toWarn("toEnums(arg)", "unable to convert", arg, "enums", [], function(t) {
          return t.log(t.warn());
        });
    }
    return enums;
  }

  rangeType(range) {
    var type;
    type = range.length > 0 ? this.type(range[0]) : "null";
    if (this.isIn(type, "ranges")) {
      if (this.isArray(range, type)) {
        return type;
      } else {
        return "mixed";
      }
    } else if (type === "array") {
      return this.rangeType(range[0]);
    }
  }

  // -- Range Methods --

    // Asserts range with for types "string" or "int" or "float"
  isRange(range) {
    var isArrayRange, isFloatRange, isIntRange, isStrRamge, type;
    // internal functions called after @rangeType(range) has verified that range
    //   is an array of type "string" or "int" or "float"
    isStrRamge = function(r) {
      return r.length === 2 && r[0] <= r[1];
    };
    isIntRange = function(r) {
      return r.length === 2 && r[0] <= r[1];
    };
    isFloatRange = function(r) {
      return r.length === 3 && r[0] - r[2] <= r[1] + r[2];
    };
    isArrayRange = function(r) {
      var e, j, len, pass;
      pass = true;
      for (j = 0, len = r.length; j < len; j++) {
        e = r[j];
        pass = pass && this.isRange(e);
      }
      return pass;
    };
    // @rangeType(...) checks array existence and asserts type with @isArray(range,type)
    type = this.rangeType(range);
    switch (type) {
      case 'string':
        return isStrRamge(range);
      case 'int':
        return isIntRange(range);
      case 'float':
        return isFloatRange(range);
      case 'array':
        return isArrayRange(range);
      default:
        return this.toWarn("isRange(range)", "not a range type", range, "", false, function(t) {
          return t.log(t.warn());
        });
    }
  }

  // Override type.isIn() with addional Tester type arrays
  isIn(type, key) {
    if (Type[key] != null) {
      return Type[key].includes(type); // Only reason for importing Type
    } else if (Spec[key] != null) {
      return Spec[key].includes(type);
    } else {
      return this.isWarn(false, `key ${key} missing for`, type, [], function(t) {
        return t.log(t.warn());
      });
    }
  }

};

Spec.specs = [
  "range",
  "enums" // high level spec   based comparision specs
];

Spec.opers = [
  "eq",
  "le",
  "lt",
  "ge",
  "gt",
  "ne" // low  level value  based comparison  ooers 'eq' default
];

Spec.cards = [
  "n",
  "?",
  "*",
  "+",
  "min to max" // cards  1 required, ? optional, * 0 to many, + 1 to many, m:m range
];

export var spec = new Spec(); // Export a singleton instence of type

export default Spec;

//# sourceMappingURL=Spec.js.map