var Type,
  hasProp = {}.hasOwnProperty;

Type = class Type {
  constructor() {
    // An improved typeof() that follows the convention by returning types in lower case by default.
    // The basic types similar to typeof() returned are:
    this.type = this.type.bind(this);
    // -- info reporting ---

    // A gem methods that appends text along with retrStr to @warn for detailed reporting of inconsistence
    //  along with a vialble actual return specified by the caller
    this.toInfo = this.toInfo.bind(this);
    this.isInfo = this.isInfo.bind(this);
    this.inInfo = this.inInfo.bind(this);
    // (t) => t.log( t.info() )
    this.doInfo = this.doInfo.bind(this);
    this.info = this.info.bind(this);
  }

  comstructor() {
    this.warn = "";
    this.last = this.logging = true;
    this.log = console.log;
    this.error = console.error;
    return this.log("I am a log");
  }

  type(arg, lowerCase = true) {
    var str, tok, typ;
    str = Object.prototype.toString.call(arg);
    tok = str.split(' ')[1];
    typ = tok.substring(0, tok.length - 1);
    typ = typ === "Number" && Number.isInteger(arg) ? "Int" : typ; // Previous CoffeeScript issue
    typ = typ === "Number" && !Number.isInteger(arg) ? "Float" : typ; //  with return on nested if's
    if (lowerCase) {
      return typ.toLowerCase();
    } else {
      return typ;
    }
  }

  type2(arg, lowerCase = true) {
    var str, tok, typ;
    str = Object.prototype.toString.call(arg);
    tok = str.split(" ")[1];
    typ = tok.substring(0, tok.length - 1);
    console.log("Type.type(arg)", typ, arg);
    typ = typ === "Number" ? Number.isInteger(arg) ? "Int" : "Float" : void 0;
    if (lowerCase) {
      return typ.toLowerCase();
    } else {
      return typ;
    }
  }

  // A more detail type that returns basic types, class, object and function name in upper case
  klass(arg) {
    var typ;
    typ = this.type(arg, false); // Start with basic type to catch "Null" and "Undefined"
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

  
    // The 9 fundamental type Assertions that leverage @type(arg) the improved typeof(arg)
  // In addition isInt isFloat isBoolean isArray isObject can optionally chech strings
  isStr(s) {
    return this.isType(s, "string") && s.length > 0 && s !== "None";
  }

  isInt(i, sc = false) {
    return (this.isType(i, "int") && !isNaN(i)) || (sc && this.isStrInt(i));
  }

  isFloat(f, sc = false) {
    return (this.isType(f, "float") && !isNaN(f)) || (sc && this.isStrFloat(f));
  }

  isBoolean(b, sc = false) {
    return this.isType(b, "boolean") || (sc && this.isStrBoolean(b));
  }

  isObject(o, sc = false) {
    return this.isType(o, "object") || (sc && this.isStrObject(o));
  }

  isRegex(r) {
    return this.isType(r, "regex");
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

  
    // Set type for asserting uniformly typed arrays and sc=true for determining if a string is an array
  // isArrayOfType called within @isArray(...) because it assumes array exists
  //   and returns true for 'null' that signifies that the type assertions
  //   on the elements should be skipped
  isArray(a, type = null, sc = false) {
    var isArrayOfType;
    if (sc) {
      return this.isStrArray(a);
    }
    // Internal function that assert that an viable is uniformly types
    isArrayOfType = (a, t) => {
      var e, j, len1;
      if (t === 'null') {
        return true;
      }
      for (j = 0, len1 = a.length; j < len1; j++) {
        e = a[j];
        if (this.type(e) !== t) {
          return false;
        }
      }
      return true;
    };
    if (this.isType(a, "array") && (a.length != null) && a.length > 0) {
      type = this.type(a[0]);
      return isArrayOfType(a, type);
    }
  }

  // General purpose since if checks the array's existence and interate over all the elements
  isArrayType(a, t) {
    var e, j, len1;
    if (!this.isArray(a)) {
      return false;
    }
    for (j = 0, len1 = a.length; j < len1; j++) {
      e = a[j];
      if (this.type(e) !== t) {
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
    type = this.type(a[0]);
    for (j = 0, len1 = a.length; j < len1; j++) {
      e = a[j];
      if (this.type(e) !== type) {
        return false;
      }
    }
    return false;
  }

  // Aggregate and special value assertions
  isType(v, t) {
    return this.type(v) === t;
  }

  isDef(d) {
    return this.type(d) !== 'null' && this.type(d) !== 'undefined';
  }

  isNumber(n) {
    return this.isIn(this.type(n), "numbers");
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

  isStrFloat(str) {
    var regex;
    if (this.isStr(str)) {
      regex = /^-?\d+(?:[.,]\d*?)?$/;
      return regex.test(str);
    } else {
      return false;
    }
  }

  isStrInt(str) {
    var regex;
    if (this.isStr(str)) {
      regex = /^-?\d+$/;
      return regex.test(str);
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

  // Converters
  toType(arg, type) {
    switch (type) {
      case "string":
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
        console.error("Type.toType(type,arg) unknown type", {
          type: type,
          arg: arg
        });
        return null;
    }
  }

  // toEnclose a "string'
  // toEnclose("abc",   '"'  )       # returns "abc" - good for JSON keys and values
  // toEnclose("123",   "'"  )       # returns '123'
  // toEnclose("xyz",   "()" )       # returns (xyz)
  // toEnclose("d,e,f", "[]" )       # returns [d,e,f]
  // toEnclose("a:x,b:y,c:z", "{}" ) # returns {a:x,b:y,c:z}
  toEnclose(str, enc = "") {
    if (enc.length === 2) {
      `${enc.charAt(0)}${str}${enc.charAt(1)}`;
    }
    if (enc.length === 1) {
      return `${enc.charAt(0)}${str}${enc.charAt(0)}`;
    } else {
      return str;
    }
  }

  // toStr(arg) avoids conflicts with arg.toString()
  // This combination of travesal and recursion is cleaner than JSON.stringify()
  // So far all vaild 13 Type.types a super set of Type.typeofs has been accounted for
  // Type.typeofs = ["string","number","boolean","object","function","bigint","symbol","null","undefined"]
  // Type.types   = Type.typeofs.concat(["int","float","array","regex","date"])
  toStr(arg) { // , enc=""
    var str, type;
    type = this.type(arg);
    str = (function() {
      switch (type) {
        case "string":
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
        case "object":
          return this.toStrObject(arg);
        case "array":
          return this.toStrArray(arg);
        case "null":
          return "null";
        case "undefined":
          return "undefined";
        case "function":
          return "?function?";
        case "regex":
        case "date":
        case "bigint":
        case "symbol":
          return arg.toString(); // hail marys
        default:
          return arg.toString();
      }
    }).call(this);
    console.log("toStr(arg)", {
      str: str,
      type: type
    });
    return str;
  }

  // str = if not @isIn(type,"manys") and enc.length > 0 then @toEnclose(str,enc) else str
  // else  console.log( "toStr(arg)", "unable to convert", arg, type, "string", arg.toString(), arg.toString() )
  // else  @toInfo( "toStr(arg)", "unable to convert", arg, type,
  //              "string", arg.toString(), arg.toString(), (t) => t.log( t.info() ) )
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
    for (i = j = 0, ref = array.length - 1; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      str += this.toStr(array[i]) + (i < array.length - 2 ? "," : "");
    }
    str += "]";
    return str;
  }

  toFloat(arg) {
    var type;
    type = this.type(arg);
    switch (type) {
      case "float":
        return arg;
      case "int":
        return parseFloat(arg.toFixed(1)); // Coerces an 'int' like '1' to a 'float' like '1.0'
      case "string":
        if (this.isStrFloat(arg)) {
          return parseFloat(arg);
        } else {
          return this.toInfo("toFloat(arg)", "unable to convert", arg, "string", "float", "NaN", 0/0, (t) => {
            return t.log(t.info());
          });
        }
        break;
      default:
        return this.toInfo("toFloat(arg)", "unable to convert", arg, type, "float", "NaN", 0/0, (t) => {
          return t.log(t.info());
        });
    }
  }

  toInt(arg) {
    var type;
    type = this.type(arg);
    switch (type) {
      case "int":
        return arg;
      case "float":
        return Math.round(arg);
      case "string":
        if (this.isStrInt(arg)) {
          return parseInt(arg);
        } else {
          return this.toInfo("toInt(arg)", "unable to convert", arg, "string", "int", "NaN", 0/0, (t) => {
            return t.log(t.info());
          });
        }
        break;
      default:
        return this.toInfo("toInt(arg)", "unable to convert", arg, type, "int", "NaN", 0/0, (t) => {
          return t.log(t.info());
        });
    }
  }

  toBoolean(arg) {
    var type;
    type = this.type(arg);
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
            return this.toInfo("toBoolean(arg)", "unable to convert", arg, type, "boolean", "false", false, (t) => {
              return t.log(t.info());
            });
        }
        break;
      case "int":
        return arg !== 0; // check 0   false may not be a convention
      case "float":
        return arg !== 0.0; // check 0.0 false may not be a convention
      default:
        return this.toInfo("toBoolean(arg)", "unable to convert", arg, type, "boolean", "false", false, (t) => {
          return t.log(t.info());
        });
    }
  }

  toArray(arg, type, sep = ",") {
    var array, j, len1, str, strs;
    type = this.type(arg);
    switch (type) {
      case "array":
        return arg;
      case "string":
        str = arg.trim();
        if (this.head(arg) === "[" && this.tail(arg) === "]") { // Strip off brackets
          arg = this.slice(arg, 2, arg.length - 1);
        }
        array = [];
        strs = this.slice(arg, 2, arg.length - 1).split(sep);
        for (j = 0, len1 = strs.length; j < len1; j++) {
          str = strs[j];
          array.push(this.toType(str, type));
        }
        return array;
      default:
        return this.toInfo("toArray(arg)", "unable to convert", arg, type, "array", "[]", [], (t) => {
          return t.log(t.info());
        });
    }
  }

  toObject(arg) {
    var i, j, obj, ref, type;
    obj = {};
    type = this.type(arg);
    switch (type) {
      case "object":
        obj = arg;
        break;
      case "array":
        for (i = j = 0, ref = arg.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
          obj[i] = arg[i];
        }
        break;
      case "int":
      case "float":
      case "boolean":
      case "function":
        obj[type] = arg;
        break;
      case "string":
        obj = arg.split(",").map((keyVal) => {
          return keyVal.split(":").map((arg) => {
            return arg.trim();
          });
        }).reduce((acc, cur) => {
          acc[cur[0]] = cur[1];
          return acc({}); // acc accumulator cur current
        });
        break;
      default:
        this.toInfo("toObject(arg)", "unable to convert", arg, type, "object", "{}", {}, (t) => {
          return t.log(t.info());
        });
    }
    return obj;
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
      switch (this.type(arg)) {
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

  head(v, action = false, pop = false) {
    var arg;
    arg = null;
    switch (this.type(v)) {
      case "array":
        switch (this.type(action)) {
          case "boolean":
            arg = v[0];
            if (action) {
              v = v.shift();
            }
        }
        break;
      case "string":
        switch (this.type(action)) {
          case "boolean":
            arg = v.charAt(0);
            if (action) {
              v = v.substring(1);
            }
            break;
          case "string" && v.startsWith(action):
            arg = action;
            if (pop) {
              v = v.substring(action.length);
            }
        }
    }
    return pop;
  }

  tail(v, action = false) {
    var pop;
    pop = null;
    switch (this.type(v)) {
      case "array":
        pop = v[v.length - 1];
        if (this.isType(action, "boolean") && action) {
          v = v.pop();
        }
        break;
      case "string":
        switch (this.type(action)) {
          case "boolean":
            pop = v.charAt(v.length - 1);
            if (action) {
              v = v.substring(0, v.length - 1);
            }
            break;
          case "string" && v.endsWith(action):
            pop = action;
            v = v.substring(0, v.length - action.length);
        }
    }
    return pop;
  }

  // Unlike the built in Array v.slice(beg,end) where beg is a zero-based index and end

    // Here beg starts at 1 and end includes the last position or is set to beg if ommitted
  //  an array slice( ["a","b","c"], 1, 2 ) returns ["a","b"]
  //  an array slice( ["a","b","c"], 2    ) returns ["b"]
  //  a string slice( ["abc"],       1, 2 ) returns   "ab"
  //  a string slice( ["abc"],       2    ) returns   "b"
  // where with Array.slice() it is open
  slice(v, beg, end = null, remove = false) {
    var pop;
    end(this.isDef(end) ? end : beg);
    pop = null;
    switch (this.type(v)) {
      case "array":
        pop = remove ? v.splice(beg - 1, end + 1) : v.slice(beg - 1, end + 1);
        break;
      case "string":
        pop = v.splice(beg - 1, end + 1);
        if (remove) {
          v = v.substring(0, beg - 1) + v.substring(end + 1);
        }
    }
    return pop;
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

  toInfo(method, text, arg, type, typeTo, retnStr, retn, closure = null) {
    var info;
    info = ""; // \n  #{method} #{text} #{@toStr(arg)} of '#{type}' to'#{typeTo}' returning #{retnStr}"
    return this.doInfo(info, closure, retn);
  }

  isInfo(pass, text, type, types, closure = null) {
    var info;
    if (pass) {
      return true;
    }
    info = ""; // "\n  #{text} of type '#{type}' not in '#{types}'"
    return this.doInfo(info, closure, pass);
  }

  inInfo(pass, result, expect, oper, spec, text, closure = null) {
    var info;
    // prefix = if pass then "-- Passed --" else "-- Failed --"
    // condit = if pass then "matches "     else "no match"
    info = ""; //"\n  #{prefix} #{result} #{condit} #{expect} with oper #{oper} and spec #{spec} #{text}"
    return this.doInfo(info, closure, pass);
  }

  doInfo(info, closure, retn) {
    this.last = info;
    this.warn += info;
    if (this["logging"] && this.isFunction(closure)) {
      // @log( "Type.doInfo()", "I an a logger" )
      closure(this);
    }
    return retn;
  }

  info() {
    return this.last;
  }

  isIn(type, key) {
    if (Type[key] != null) {
      console.log("Type.isIn(type,key)", {
        type: type,
        key: key,
        isIn: Type[key].includes(type),
        types: Type[key]
      });
      return Type[key].includes(type);
    } else {
      this.isInfo(false, `key ${key} missing for`, type, []);
      return false;
    }
  }

};

Type.remove = function(e, a) {
  var index;
  index = a.indexOf(e);
  if (index > -1) {
    a.splice(index, 1);
  }
  return a;
};

// All Type[key] arrays
Type.undefs = ["null", "undefined"];

Type.numbers = ["int", "float"];

Type.ranges = ["string", "int", "float"];

Type.values = ["string", "int", "float", "boolean"];

Type.manys = ["object", "array"];

Type.results = ["string", "int", "float", "boolean", "object", "array"];

Type.expects = Type.results.concat(["schema", "range", "enums", "amy"]);

Type.typeofs = ["string", "number", "boolean", "object", "function", "bigint", "symbol", "null", "undefined"];

Type.types = Type.typeofs.concat(["int", "float", "array", "regex", "date"]);

Type.types = Type.remove("number", Type.types); // number is now either 'int' or 'float'

export var type = new Type(); // Export a singleton instence of type

export default Type;

//# sourceMappingURL=Type.js.map
