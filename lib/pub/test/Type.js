var Type,
  hasProp = {}.hasOwnProperty;

Type = class Type {
  constructor() {
    // An improved typeof() that follows the convention by returning types in lower case by default.
    // The 15 types similar to typeof() returned are:
    // "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date"
    this.toType = this.toType.bind(this);
    // -- Warnings ---

    // A gem methods that appends text along with retrStr to @warn for detailed reporting of inconsistence
    //  along with a vialble actual return specified by the caller
    this.toWarn = this.toWarn.bind(this);
    this.isWarn = this.isWarn.bind(this);
    this.inWarn = this.inWarn.bind(this);
    // (t) => t.log( t.info() )
    this.doWarn = this.doWarn.bind(this);
    this.warn = this.warn.bind(this);
  }

  comstructor() {
    this.warned = "";
    this.lasted = "";
    this.logging = true;
    this.log = console.log;
    return this.error = console.error;
  }

  toType(arg, lowerCase = true) {
    var str, tok, typ;
    str = Object.prototype.toString.call(arg);
    tok = str.split(' ')[1];
    typ = tok.substring(0, tok.length - 1);
    typ = this.toMoreTypes(typ, arg);
    if (lowerCase) {
      return typ.toLowerCase();
    } else {
      return typ;
    }
  }

  // Detects and converts to 'Int' "Float' 'Range' 'Enums' types
  toMoreTypes(typ, arg) {
    switch (false) {
      case typ !== "Number":
        if (Number.isInteger(arg)) {
          return "Int";
        } else {
          return "Float";
        }
        break;
      case !(typ === "String" && this.isEnclose(arg, "|")): // @isEnclose(typ,"|") avoids infinite recursion
        if (arg.includes("-")) {
          return "Range";
        } else {
          return "Enums";
        }
        break;
      default:
        return typ;
    }
  }

  // A more detail type that returns basic types, class, object and function name in upper case
  toKlass(arg) {
    var typ;
    typ = this.toType(arg, false); // Start with basic type to catch "Null" and "Undefined"
    switch (typ) {
      case "Null":
        return "Null";
      case "Undefined":
        return "Undefined";
      case "Function":
        return arg.name;
      case "Object":
        return arg.constructor.name;
      default:
        return typ;
    }
  }

  
    // The 9 fundamental type Assertions that leverage @toType(arg) the improved typeof(arg)
  // In addition isInt isFloat isBoolean isArray isObject can optionally chech strings
  isStr(s) {
    return this.isType(s, "string") && s.length > 0 && s !== "none";
  }

  isInt(i) {
    return (this.isType(i, "int") && !isNaN(i)) || (this.isType(i, "string") && this.isStrInt(i));
  }

  isFloat(f) {
    return (this.isType(f, "float") && !isNaN(f)) || (this.isType(f, "string") && this.isStrFloat(f));
  }

  isBoolean(b) {
    return this.isType(b, "boolean") || (this.isType(b, "string") && this.isStrBoolean(b));
  }

  isArray(a) {
    return (this.isType(a, "array") && a.length > 0) || (this.isType(a, "string") && this.isStrArray(a));
  }

  isObject(o) {
    return this.isType(o, "object") || (this.isType(o, "string") && this.isStrObject(o));
  }

  isRegexp(r) {
    return this.isType(r, "regexp");
  }

  isFunction(f) {
    return this.isType(f, "function");
  }

  isNull(m) {
    return this.isType(m, "null");
  }

  isUndef(u) {
    return this.isType(u, "undefined");
  }

  isBigInt(b) {
    return typeof b === "bigint"; // Will incorporate into type
  }

  isSymbol(s) {
    return typeof s === "symbol"; // Will incorporate into type
  }

  
    // General purpose since if checks the array's existence and interate over all the elements
  isArrayTyped(a, t) {
    var e, j, len1;
    if (!this.isArray(a)) {
      return false;
    }
    for (j = 0, len1 = a.length; j < len1; j++) {
      e = a[j];
      if (this.toType(e) !== t) {
        return false;
      }
    }
    return true;
  }

  // General purpose since if checks the array's existence and interate over all the elements
  isArrayMixed(a) {
    var e, j, len1, type;
    if (!this.isArray(a)) {
      return false;
    }
    type = this.toType(a[0]);
    for (j = 0, len1 = a.length; j < len1; j++) {
      e = a[j];
      if (this.toType(e) !== type) {
        return true;
      }
    }
    return false;
  }

  // Aggregate and special value assertions
  isType(v, t) {
    return this.toType(v) === t;
  }

  isDef(d) {
    return this.toType(d) !== 'null' && this.toType(d) !== 'undefined';
  }

  isNumber(n) {
    return this.isIn(this.toType(n), "numbers");
  }

  isNot(d) {
    return !this.isDef(d);
  }

  isNaN(n) {
    return Number.isNaN(n); // @isNumber(n) and
  }

  
    // Containment assertions where args are always ( value, container )
  inStr(e, s) {
    return this.isStr(s) && this.isDef(e) && s.includes(e);
  }

  inArray(e, a) {
    return this.isArray(a) && this.isDef(e) && a.includes(e);
  }

  inObject(k, o) {
    return this.isObject(o) && this.isDef(o[k]) && o.hasOwnProperty(k);
  }

  // -- More assertions --

    // Checks for offical child key which starts with capital letter and isnt an _ or $
  isChild(key) {
    var a, b;
    a = key.charAt(0);
    b = key.charAt(key.length - 1);
    return a === a.toUpperCase() && a !== "$" && b !== "_";
  }

  // Check if an object or array or string is empty
  isEmpty(e) {
    if (this.isNot(e)) {
      return false;
    }
    switch (this.isType(e)) {
      case "object":
        return Object.getOwnPropertyNames(e).length === 0;
      case "array":
        return e.length === 0;
      case "string":
        return e.length === 0;
      default:
        return false; // Look into
    }
  }

  isStrInt(str) {
    var regexp;
    if (this.isStr(str)) {
      regexp = /^-?\d+$/;
      return regexp.test(str);
    } else {
      return false;
    }
  }

  isStrFloat(str) {
    var regexp;
    if (this.isStr(str)) {
      regexp = /^-?\d+(?:[.,]\d*?)?$/;
      return regexp.test(str);
    } else {
      return false;
    }
  }

  isStrBoolean(str) {
    return this.isStr(str) && (str === "true" || str === "false");
  }

  isStrArray(str) {
    return this.isStrEnclosed("[", str, "]");
  }

  isStrObject(str) {
    return this.isStrEnclosed("{", str, "}");
  }

  // Tests if string is enclosed good for [array] and {object}
  isStrEnclosed(beg, str, end) {
    var s;
    if (this.isStr(str)) {
      s = str.trim();
      return s.startsWith(beg) && s.endsWith(end);
    } else {
      return false;
    }
  }

  // A coerced conversion that can return a value of 'none'
  // |string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date
  // Still need |regexp|null|undefined|function|bigint|symbol|date|
  toConvert(arg, type) {
    switch (type) {
      case "string":
      case "enums":
      case "range":
        return this.toStr(arg);
      case "int":
        return this.toInt(arg);
      case "float":
        return this.toFloat(arg);
      case "boolean":
        return this.toBoolean(arg);
      case "array":
        return this.toArray(arg);
      case "object":
        return this.toObject(arg);
      default:
        return "none";
    }
  }

  /*
  obj = @toObject(  arg )
  if not @isType(obj,"object")
    console.log( "Test.toConvert(arg,type)", { arg:arg, obj:obj, type:type } )
  */
  // A value conversion from a 'string' that can return a value of 'none'
  // |string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date
  // Still need |regexp|null|undefined|function|bigint|symbol|date
  toValue(str) {
    if (!this.isStr(str)) {
      return "none";
    }
    switch (false) {
      case !this.isStrInt(str):
        return this.toInt(str);
      case !this.isStrFloat(str):
        return this.toFloat(str);
      case !this.isStrBoolean(str):
        return this.toBoolean(str);
      case !this.isStrArray(str):
        return this.toArray(str);
      case !this.isStrObject(str):
        return this.toObject(str);
      case !this.isStr(str):
        return str; // Also gets 'enums' 'range'
      default:
        return "none";
    }
  }

  isEnclose(str, enc = "") {
    switch (false) {
      case enc.length !== 2:
        return str.charAt(0) === enc.charAt(0) && str.charAt(str.length - 1) === enc.charAt(1);
      case enc.length !== 1:
        return str.charAt(0) === enc.charAt(0) && str.charAt(str.length - 1) === enc.charAt(0);
      default:
        return false;
    }
  }

  // toEnclose a "string'
  // toEnclose("abc",   '"'  )       # returns "abc" - ? good for JSON keys and values
  // toEnclose("123",   "'"  )       # returns '123'
  // toEnclose("xyz",   "()" )       # returns (xyz)
  // toEnclose("d,e,f", "[]" )       # returns [d,e,f]
  // toEnclose("a:x,b:y,c:z", "{}" ) # returns {a:x,b:y,c:z}
  toEnclose(str, enc) {
    switch (false) {
      case enc.length !== 2:
        return `${enc.charAt(0)}${str}${enc.charAt(1)}`;
      case enc.length !== 1:
        return `${enc.charAt(0)}${str}${enc.charAt(0)}`;
      default:
        return `\"${str}\"`;
    }
  }

  // toStr(arg) avoids conflicts with arg.toString()
  //  returns "none" if unsuccesful
  // This combination of travesal and recursion is cleaner than JSON.stringify()
  // A super set of typeof with far all vaild 15 types detected by @toType() plus 'none' and 'any'
  // "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|function|bigint|symbol|date|any|none|"
  toStr(arg) {
    var str, type;
    type = this.toType(arg);
    str = (function() {
      switch (type) {
        case "string":
        case "enums":
        case "range":
        case "any":
          return arg;
        case "int":
          return parseInt(arg);
        case "float":
          return parseFloat(arg);
        case "boolean":
          if (arg) {
            return "true";
          } else {
            return "false";
          }
          break;
        case "array":
          return this.toStrArray(arg);
        case "object":
          return this.toStrObject(arg);
        case "null":
          return "null";
        case "undefined":
          return "undefined";
        case "function":
          return "function";
        case "regexp":
        case "date":
        case "bigint":
        case "symbol":
          return arg.toString(); // hail marys
        default:
          return "none";
      }
    }).call(this);
    return str;
  }

  // str = if not @isIn(type,"manys") and enc.length > 0 then @toEnclose(str,enc) else str
  // else  console.log( "toStr(arg)", "unable to convert", arg, type, "string", arg.toString(), arg.toString() )
  // else  @toWarn( "toStr(arg)", "unable to convert", arg, type,
  //              "string", arg.toString(), arg.toString(), (t) => t.log( t.warn() ) )
  // str += key+":"+@toEnclose(@toStr(val),'"')+","
  toStrObject(obj) {
    var key, str, val;
    str = "{";
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      str += key + ":" + this.toStr(val) + ",";
    }
    str = str.substring(0, str.length - 1); // remove trailing comma
    str += "}";
    return str;
  }

  toStrArray(array) {
    var i, j, ref, str;
    str = "[";
    for (i = j = 0, ref = array.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      str += this.toStr(array[i]);
      str += i < array.length - 1 ? "," : "";
    }
    str += "]";
    return str;
  }

  toFloat(arg) {
    var type;
    type = this.toType(arg);
    switch (type) {
      case "float":
        return arg;
      case "int":
        return parseFloat(arg.toFixed(1)); // Coerces an 'int' like '1' to a 'float' like '1.0'
      case "string":
        if (this.isStrFloat(arg)) {
          return parseFloat(arg);
        } else {
          //lse @toWarn( "toFloat(arg)", "unable to convert", arg, "float", NaN, (t) => t.log( t.warn() ) )
          return 0/0;
        }
        break;
      default:
        //lse   @toWarn( "toFloat(arg)", "unable to convert", arg, "float", NaN, (t) => t.log( t.warn() ) )
        return 0/0;
    }
  }

  toInt(arg) {
    var type;
    type = this.toType(arg);
    switch (type) {
      case "int":
        return arg;
      case "float":
        return Math.round(arg);
      case "string":
        if (this.isStrInt(arg)) {
          return parseInt(arg);
        } else {
          //lse @toWarn( "toInt(arg)", "unable to convert", arg, "int", NaN, (t) => t.log( t.warn() ) )
          return 0/0;
        }
        break;
      default:
        //lse   @toWarn( "toInt(arg)", "unable to convert", arg, "int", NaN, (t) => t.log( t.warn() ) )
        return 0/0;
    }
  }

  toBoolean(arg) {
    var type;
    type = this.toType(arg);
    switch (type) {
      case "boolean":
        return arg;
      case "string":
        switch (arg) {
          case "true":
            return true;
          case "false":
            return false;
          default:
            return this.toWarn("toBoolean(arg)", "unable to convert", arg, "boolean", false, (t) => {
              return t.log(t.warn());
            });
        }
        break;
      case "int":
        return arg !== 0; // check 0   false may not be a convention
      case "float":
        return arg !== 0.0; // check 0.0 false may not be a convention
      default:
        //lse     @toWarn( "toBoolean(arg)", "unable to convert", arg, "boolean", false, (t) => t.log( t.warn() ) )
        return false;
    }
  }

  toArray(arg) {
    var array, j, len1, value, values;
    switch (this.toType(arg)) {
      case "array":
        return arg;
      case "string" && this.isEnclose(arg, "[]"):
        arg = this.strip(arg, "[", "]");
        array = [];
        values = arg.split(",");
        for (j = 0, len1 = values.length; j < len1; j++) {
          value = values[j];
          array.push(this.toValue(value));
        }
        return array;
      default:
        return [];
    }
  }

  toObject(arg) {
    var i, j, key, keyValue, keyValues, l, len1, obj, ref, type, value;
    obj = {};
    type = this.toType(arg);
    switch (false) {
      case type !== "object":
        obj = arg;
        break;
      case type !== "array":
        for (i = j = 0, ref = arg.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          obj[i] = arg[i];
        }
        break;
      case !"int":
      case !"float":
      case !"boolean":
      case !"function":
        obj[type] = arg;
        break;
      case !(type === "string" && this.isEnclose(arg, "{}")):
        arg = this.strip(arg, "{", "}");
        obj = {};
        keyValues = arg.split(",");
        for (l = 0, len1 = keyValues.length; l < len1; l++) {
          keyValue = keyValues[l];
          [key, value] = keyValue.split(":");
          obj[key] = value;
        }
        break;
      default:
        obj = {};
    }
    return obj;
  }

  // For extenal use where val is expossed to the outside environment so 'string'
  //  is wrapped in "" and all other vals are converted by their type  ??? what does this mean ???
  v(val) {
    if (this.isType(val, 'string')) {
      return '"' + this.toStr(val) + '"';
    } else {
      return this.toValue(val);
    }
  }

  toKeys(o) {
    if (this.isObject(o)) {
      return Object.keys(o);
    } else {
      return [];
    }
  }

  hasChild(obj) {
    var key, val;
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (this.isChild(key)) {
        return true;
      }
    }
    return false;
  }

  childKeys(obj) {
    var key, val, vals;
    vals = [];
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (this.isChild(key)) {
        vals.push(key);
      }
    }
    return vals;
  }

  // Return a number with a fixed number of decimal places
  toFixed(arg, dec = 2) {
    var num;
    num = (function() {
      switch (this.toType(arg)) {
        case "int":
        case "float":
          return arg;
        case "string":
          return parseFloat(arg);
      }
    }).call(this);
    return num.toFixed(dec);
  }

  toCap(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  unCap(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
  }

  head(arg) {
    switch (this.toType(arg)) {
      case "array":
        return arg[0];
      case "string":
        return arg.charAt(0);
      default:
        //lse @toWarn( "head(arg)", "unable to get the first element of", arg, @toType(arg), null, (t) => t.log( t.warn() ) )
        return "none";
    }
  }

  tail(arg) {
    switch (this.toType(arg)) {
      case "array":
        return arg[arg.length - 1];
      case "string":
        return arg.charAt(arg.length - 1);
      default:
        //lse @toWarn( "tail(arg)", "unable to get the last element of", arg, @toType(arg), null, (t) => t.log( t.warn() ) )
        return "none";
    }
  }

  strip(str, beg, end) {
    str = str.trim();
    if (this.isStr(beg) && str.startsWith(beg)) {
      str = str.substring(beg.length);
    }
    if (this.isStr(end) && str.endsWith(end)) {
      str = str.substring(0, str.length - end.length);
    }
    return str;
  }

  // Unlike the built in Array v.slice(beg,end) where beg is a zero-based index and end
  //  here beg starts at 1 and end includes the last position or is set to beg if ommitted
  //  an array slice( "[a","b","c"], 1, 2 ) returns "[a","b"]
  //  an array slice( "[a","b","c"], 2    ) returns "[b"]
  //  a string slice( "[abc"],       1, 2 ) returns   "ab"
  //  a string slice( "[abc"],       2    ) returns   "b"
  // where with Array.slice() it is open
  slice(v, beg, end = null) {
    end = this.isDef(end) && beg <= beg ? end : beg;
    switch (false) {
      case !this.isArray(v):
        return v.slice(beg - 1, end);
      case !this.isStr(v):
        return v.slice(beg - 1, end);
      default:
        return "";
    }
  }

  pad(n, m) {
    var i, j, len, ref, ref1, str, tot;
    len = this.numDigits(n);
    tot = this.numDigits(m);
    str = n.toString();
    for (i = j = ref = len, ref1 = tot; (ref <= ref1 ? j < ref1 : j > ref1); i = ref <= ref1 ? ++j : --j) {
      str = " " + str;
    }
    return str;
  }

  numDigits(n) {
    return Math.max(Math.floor(Math.log10(Math.abs(n))), 0) + 1;
  }

  time() {
    return new Date().getTime();
  }

  // A deliberate do nothing consumer of arguments and variables
  noop(...args) {
    if (args) {
      false;
    }
  }

  toWarn(method, text, arg, typeTo, retn, closure = null) {
    var warn;
    warn = `${method} ${text} ${this.toStr(arg)} of '${this.toType(arg)}' to'${typeTo}' returning ${this.toStr(arg)}`;
    return this.doWarn(warn, closure, retn);
  }

  isWarn(pass, text, type, types, closure = null) {
    var warn;
    if (pass) {
      return true;
    }
    warn = `${text} of type '${type}' not in '${types}'`;
    return this.doWarn(warn, closure, pass);
  }

  inWarn(pass, result, expect, oper, spec, text, closure = null) {
    var condit, prefix, warn;
    prefix = pass ? "-- Passed --" : "-- Failed --";
    condit = pass ? "matches " : "no match";
    warn = `${prefix} ${result} ${condit} ${expect} with oper ${oper} and spec ${spec} ${text}`;
    return this.doWarn(warn, closure, pass);
  }

  doWarn(warn, closure, retn) {
    this.lasted = warn;
    this.warned += warn;
    if (this.logging && this.isFunction(closure)) {
      closure(this);
    }
    return retn;
  }

  warn() {
    return this.lasted;
  }

  // Moved from Spec.coffee
  isEnums(arg) {
    return this.isType(arg, "enums");
  }

  // Leverage the stronger assertions @isStr(arg) and @isArray(arg)
  toEnums(arg) {
    var enums, i, j, ref;
    switch (false) {
      case !this.isType(arg, "enums"):
        return arg;
      case !this.isArray(arg):
        enums = "|";
        for (i = j = 0, ref = arg.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          enums += this.toStr(arg[i]) + "|";
        }
        return enums;
      default:
        return "||";
    }
  }

  inEnums(result, enums) {
    return enums.includes("|" + result + "|");
  }

  isIn(type, arg) {
    switch (false) {
      case !this.isArray(arg):
        return this.inArray(type, arg);
      case !this.isEnums(arg):
        return this.inArray(type, this.toEnums(arg));
      case !this.isStr(arg):
        return this.toIn(arg).includes(type);
      default:
        //lse @isWarn( false, "arg #{arg} not 'array', 'enums' or 'string'", type, false )
        return false;
    }
  }

  toIn(arg) {
    switch (false) {
      case !(arg == null):
        return "||";
      case Type[arg] == null:
        return Type[arg];
      default:
        return "||";
    }
  }

};

// All Type[key] 'enums'. Considering if "none" belongs
Type.undefs = "|null|undefined|";

Type.numbers = "|int|float|";

Type.values = "|string|int|float|boolean|";

Type.manys = "|object|array|";

Type.ranges = "|string|int|float|";

Type.matches = "|regexp|range|enums|amy|";

Type.results = "|string|int|float|boolean|object|array|";

Type.expects = "|string|int|float|boolean|object|array|regexp|range|enums|amy|";

Type.typeofs = "|number|string|boolean|object|function|bigint|symbol|null|undefined|";

Type.types = "|string|int|float|boolean|array|object|enums|range|regexp|null|undefined|";

Type.types += "function|bigint|symbol|date|any|none|";

Type.opers = "|to|eq|le|lt|ge|gt|ne|"; // low  level value  based comparison  ooers 'eq' default

Type.cards = "|1|?|*|+|"; // cards  1 required, ? optional, * 0 to many, + 1 to many

export var type = new Type(); // Export a singleton instence of type

export default Type;

/*
  obj = arg.split(",")
         .map( (keyVal) => keyVal.split(":").map( (arg) => arg.trim() ) )
         .reduce( (acc,cur) => acc[cur[0]] = cur[1]; acc )  # {}  acc accumulator cur current
*/

//# sourceMappingURL=Type.js.map
