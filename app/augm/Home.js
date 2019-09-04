var Util,
  indexOf = [].indexOf,
  hasProp = {}.hasOwnProperty;

Util = class Util {
  constructor() {
    this.dummy = "";
    Util.noop(Util.loadScript, Util.hasMethod, Util.dependsOn, Util.setInstance, Util.getInstance);
    Util.noop(Util.toError, Util.logJSON, Util.isNot, Util.isVal, Util.isntStr);
    Util.noop(Util.inIndex, Util.isEvent, Util.atArray, Util.atLength, Util.isStrInteger);
    Util.noop(Util.isStrCurrency, Util.isStrFloat, Util.isDefs, Util.toPosition, Util.xyScale);
    Util.noop(Util.resizeTimeout, Util.eventErrorCode, Util.toAlpha, Util.hashCode, Util.pdfCSS);
    Util.noop(Util.padStr, Util.isoDateTime, Util.toHMS, Util.toInt, Util.hex32);
    Util.noop(Util.toFloat, Util.toCap, Util.match_test, Util.svgId, Util.saveFile);
  }

  static element($elem) {
    // console.log( 'Dom.element()', $elem, Dom.isJQueryElem( $elem ) )
    if (Util.isJQueryElem($elem)) {
      return $elem.get(0);
    } else if (Util.isStr($elem)) {
      return $($elem).get(0);
    } else {
      console.error('Dom.domElement( $elem )', typeof $elem, $elem, '$elem is neither jQuery object nor selector');
      return $().get(0);
    }
  }

  static isJQueryElem($elem) {
    return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
  }

  static loadScript(path, fn) {
    var head, script;
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = path;
    script.async = false;
    if (Util.isFunc(fn)) {
      script.onload = fn;
    }
    head.appendChild(script);
  }

  static ready(fn) {
    if (!Util.isFunc(fn)) { // Sanity check
      return;
    } else if (Util.skipReady) {
      fn();
    } else if (document.readyState === 'complete') { // If document is already loaded, run method
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn, false);
    }
  }

  static isChild(key) {
    var a, b;
    a = key.charAt(0);
    b = key.charAt(key.length - 1);
    return a === a.toUpperCase() && a !== '$' && b !== '_';
  }

  // ---- Inquiry ----
  static hasMethod(obj, method, issue = false) {
    var has;
    has = typeof obj[method] === 'function';
    if (!has && issue) {
      console.log('Util.hasMethod()', method, has);
    }
    return has;
  }

  static hasGlobal(global, issue = true) {
    var has;
    has = window[global] != null;
    if (!has && issue) {
      console.error(`Util.hasGlobal() ${global} not present`);
    }
    return has;
  }

  static getGlobal(global, issue = true) {
    if (Util.hasGlobal(global, issue)) {
      return window[global];
    } else {
      return null;
    }
  }

  static hasModule(path, issue = true) {
    var has;
    has = Util.modules[path] != null;
    if (!has && issue) {
      console.error(`Util.hasModule() ${path} not present`);
    }
    return has;
  }

  static dependsOn() {
    var arg, has, j, len1, ok;
    ok = true;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      has = Util.hasGlobal(arg, false) || Util.hasModule(arg, false) || Util.hasPlugin(arg, false);
      if (!has) {
        console.error('Missing Dependency', arg);
      }
      if (has === false) {
        ok = has;
      }
    }
    return ok;
  }

  // ---- Instances ----
  static setInstance(instance, path) {
    console.log('Util.setInstance()', path);
    if ((instance == null) && (path != null)) {
      console.error('Util.setInstance() instance not defined for path', path);
    } else if ((instance != null) && (path == null)) {
      console.error('Util.setInstance() path not defined for instance', instance.toString());
    } else {
      Util.instances[path] = instance;
    }
  }

  static getInstance(path, dbg = false) {
    var instance;
    if (dbg) {
      console.log('getInstance', path);
    }
    instance = Util.instances[path];
    if (instance == null) {
      console.error('Util.getInstance() instance not defined for path', path);
    }
    return instance;
  }

  // ---- Logging -------

  // args should be the arguments passed by the original calling function
  // This method should not be called directly
  static toStrArgs(prefix, args) {
    var arg, j, len1, str;
    Util.logStackNum = 0;
    str = Util.isStr(prefix) ? prefix + " " : "";
    for (j = 0, len1 = args.length; j < len1; j++) {
      arg = args[j];
      str += Util.toStr(arg) + " ";
    }
    return str;
  }

  static toStr(arg) {
    Util.logStackNum++;
    if (Util.logStackNum > Util.logStackMax) {
      return '';
    }
    switch (typeof arg) {
      case 'null':
        return 'null';
      case 'string':
        return Util.toStrStr(arg);
      case 'number':
        return arg.toString();
      case 'object':
        return Util.toStrObj(arg);
      default:
        return arg;
    }
  }

  // Recusively stringify arrays and objects
  static toStrObj(arg) {
    var a, j, key, len1, str, val;
    str = "";
    if (arg == null) {
      str += "null";
    } else if (Util.isArray(arg)) {
      str += "[ ";
      for (j = 0, len1 = arg.length; j < len1; j++) {
        a = arg[j];
        str += Util.toStr(a) + ",";
      }
      str = str.substr(0, str.length - 1) + " ]";
    } else if (Util.isObjEmpty(arg)) {
      str += "{}";
    } else {
      str += "{ ";
      for (key in arg) {
        if (!hasProp.call(arg, key)) continue;
        val = arg[key];
        str += key + ":" + Util.toStr(val) + ", ";
      }
      str = str.substr(0, str.length - 2) + " }"; // Removes last comma
    }
    return str;
  }

  static toStrStr(arg) {
    if (arg.length > 0) {
      return arg;
    } else {
      return '""';
    }
  }

  static toOut(obj, level = 0) {
    var ind, key, out, val;
    ind = Util.indent(level * 2);
    out = "";
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (!(key.charAt(0) === key.charAt(0).toUpperCase())) {
        continue;
      }
      out += ind + key + '\n';
      if (Util.isObj(val)) {
        out += Util.toOut(val, level + 1);
      }
    }
    return out;
  }

  // Consume unused but mandated variable to pass code inspections
  static noop(...args) {
  }

  static toError() {
    var str;
    str = Util.toStrArgs('Error:', arguments);
    return new Error(str);
  }

  static alert() {
    var str;
    str = Util.toStrArgs('', arguments);
    console.log(str);
    alert(str);
  }

  static logJSON(json) {
    var obj;
    obj = JSON.parse(json);
    console.log(obj);
  }

  static jQueryHasNotBeenLoaded() {
    if (typeof jQuery === 'undefined') {
      console.error('Util JQuery has not been loaded');
      return true;
    } else {
      return false;
    }
  }

  // ------ Validators ------
  static isDef(d) {
    return d !== null && typeof d !== 'undefined';
  }

  static isNot(d) {
    return !Util.isDef(d);
  }

  static isStr(s) {
    return Util.isDef(s) && typeof s === "string" && s.length > 0;
  }

  static isntStr(s) {
    return !Util.isStr(s);
  }

  static isNum(n) {
    return !isNaN(n);
  }

  static isObj(o) {
    return Util.isDef(o) && typeof o === "object";
  }

  static isVal(v) {
    return typeof v === "number" || typeof v === "string" || typeof v === "boolean";
  }

  static isNaN(v) {
    return Util.isDef(v) && typeof v === "number" && Number.isNaN(v);
  }

  static isSym(v) {
    return typeof v === "symbol";
  }

  static isObjEmpty(o) {
    return Util.isObj(o) && Object.getOwnPropertyNames(o).length === 0;
  }

  static isFunc(f) {
    return Util.isDef(f) && typeof f === "function";
  }

  static isArray(a) {
    return Util.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  static isEvent(e) {
    return Util.isDef(e) && (e.target != null);
  }

  static inIndex(a, i) {
    return Util.isArray(a) && 0 <= i && i < a.length;
  }

  static inArray(a, e) {
    return Util.isArray(a) && a.indexOf(e) > -1;
  }

  static atArray(a, e) {
    if (Util.inArray(a, e)) {
      return a.indexOf(e);
    } else {
      return -1;
    }
  }

  static inString(s, e) {
    return Util.isStr(s) && s.indexOf(e) > -1;
  }

  static atLength(a, n) {
    return Util.isArray(a) && a.length === n;
  }

  static head(a) {
    if (Util.isArray(a)) {
      return a[0];
    } else {
      return null;
    }
  }

  static tail(a) {
    if (Util.isArray(a)) {
      return a[a.length - 1];
    } else {
      return null;
    }
  }

  static time() {
    return new Date().getTime();
  }

  static isStrInteger(s) {
    return /^\s*(\+|-)?\d+\s*$/.test(s);
  }

  static isStrFloat(s) {
    return /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s);
  }

  static isStrCurrency(s) {
    return /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s);
  }

  //@isStrEmail:(s)   -> /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)
  static isDefs() {
    var arg, j, len1;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      if (arg == null) {
        return false;
      }
    }
    return true;
  }

  static checkTypes(type, args) {
    var arg, key;
    for (key in args) {
      if (!hasProp.call(args, key)) continue;
      arg = args[key];
      // console.log( "Util.checkTypes isNum() argument #{key} is #{type}", arg, Util.isNum(arg) )
      if (!Util.checkType(type, arg)) {
        console.log(`Util.checkTypes(type,args) argument ${key} is not ${type}`, arg);
        console.trace();
      }
    }
  }

  static checkType(type, arg) {
    switch (type) {
      case "string":
        return Util.isStr(arg);
      case "number":
        return Util.isNum(arg);
      case "object":
        return Util.isObj(arg);
      case "symbol":
        return Util.isSym(arg);
      case "function":
        return Util.isFunc(arg);
      case "array":
        return Util.isArray(arg);
      default:
        return false;
    }
  }

  static copyProperties(to, from) {
    var key, val;
    for (key in from) {
      if (!hasProp.call(from, key)) continue;
      val = from[key];
      to[key] = val;
    }
    return to;
  }

  static contains(array, value) {
    return Util.isArray(array) && array.indexOf(value) !== -1;
  }

  // Screen absolute (left top width height) percent positioning and scaling

  // Percent array to position mapping
  static toPosition(array) {
    return {
      left: array[0],
      top: array[1],
      width: array[2],
      height: array[3]
    };
  }

  // Adds Percent from array for CSS position mapping
  static toPositionPc(array) {
    return {
      position: 'absolute',
      left: array[0] + '%',
      top: array[1] + '%',
      width: array[2] + '%',
      height: array[3] + '%'
    };
  }

  static xyScale(prev, next, port, land) {
    var xn, xp, xs, yn, yp, ys;
    xp = 0;
    yp = 0;
    xn = 0;
    yn = 0;
    [xp, yp] = prev.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    [xn, yn] = next.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    xs = next.width * xn / (prev.width * xp);
    ys = next.height * yn / (prev.height * yp);
    return [xs, ys];
  }

  // ----------------- Guarded jQuery dependent calls -----------------
  static resize(callback) {
    window.onresize = function() {
      return setTimeout(callback, 100);
    };
  }

  static resizeTimeout(callback, timeout = null) {
    window.onresize = function() {
      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(callback, 100);
    };
  }

  // ------ Html ------------
  static getHtmlId(name, type = '', ext = '') {
    var id;
    id = name + type + ext + Util.uniqueIdExt;
    return id.replace(/[ \.]/g, "");
  }

  static htmlId(name, type = '', ext = '', issueError = true) {
    var id;
    id = Util.getHtmlId(name, type, ext);
    if ((Util.htmlIds[id] != null) && issueError) {
      console.error('Util.htmlId() duplicate html id', id);
    }
    Util.htmlIds[id] = id;
    return id;
  }

  static clearHtmlIds() {
    return Util.htmlIds = {};
  }

  // ------ Converters ------
  static extend(obj, mixin) {
    var method, name;
    for (name in mixin) {
      if (!hasProp.call(mixin, name)) continue;
      method = mixin[name];
      obj[name] = method;
    }
    return obj;
  }

  static include(klass, mixin) {
    return Util.extend(klass.prototype, mixin);
  }

  static eventErrorCode(e) {
    var errorCode;
    errorCode = (e.target != null) && e.target.errorCode ? e.target.errorCode : 'unknown';
    return {
      errorCode: errorCode
    };
  }

  static toName(s1) {
    var s2, s3, s4, s5;
    if (s1 == null) {
      console.trace();
      return "???";
    }
    s2 = s1.replace('_', ' ');
    s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
    s4 = s3.replace(/([A-Z]+)/g, ' $1');
    s5 = s4.replace(/([0-9][A-Z])/g, ' $1');
    return s5;
  }

  static toAlpha(s1) {
    return s1.replace(/\W/g, '');
  }

  static indent(n) {
    var i, j, ref, str;
    str = '';
    for (i = j = 0, ref = n; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      str += ' ';
    }
    return str;
  }

  static hashCode(str) {
    var hash, i, j, ref;
    hash = 0;
    for (i = j = 0, ref = str.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return hash;
  }

  static lastTok(str, delim) {
    return str.split(delim).pop();
  }

  static firstTok(str, delim) {
    if (Util.isStr(str) && (str.split != null)) {
      return str.split(delim)[0];
    } else {
      console.error("Util.firstTok() str is not at string", str);
      return '';
    }
  }

  static pdfCSS(href) {
    var link;
    if (!window.location.search.match(/pdf/gi)) {
      return;
    }
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  /*
  parse = document.createElement('a')
  parse.href =  "http://example.com:3000/dir1/dir2/file.ext?search=test#hash"
  parse.protocol  "http:"
  parse.hostname  "example.com"
  parse.port      "3000"
  parse.pathname  "/dir1/dir2/file.ext"
  parse.segments  ['dir1','dir2','file.ext']
  parse.fileExt   ['file','ext']
  parse.file       'file'
  parse.ext        'ext'
  parse.search    "?search=test"
  parse.hash      "#hash"
  parse.host      "example.com:3000"
  */
  static parseURI(uri) {
    var a, j, len1, name, nameValue, nameValues, parse, value;
    parse = {};
    parse.params = {};
    a = document.createElement('a');
    a.href = uri;
    parse.href = a.href;
    parse.protocol = a.protocol;
    parse.hostname = a.hostname;
    parse.port = a.port;
    parse.segments = a.pathname.split('/');
    parse.fileExt = parse.segments.pop().split('.');
    parse.file = parse.fileExt[0];
    parse.ext = parse.fileExt.length === 2 ? parse.fileExt[1] : '';
    parse.dbName = parse.file;
    parse.fragment = a.hash;
    parse.query = Util.isStr(a.search) ? a.search.substring(1) : '';
    nameValues = parse.query.split('&');
    if (Util.isArray(nameValues)) {
      for (j = 0, len1 = nameValues.length; j < len1; j++) {
        nameValue = nameValues[j];
        name = '';
        value = '';
        [name, value] = nameValue.split('=');
        parse.params[name] = value;
      }
    }
    return parse;
  }

  static quicksort(array) {
    var a, head, large, small;
    if (array.length === 0) {
      return [];
    }
    head = array.pop();
    small = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a <= head) {
          results.push(a);
        }
      }
      return results;
    })();
    large = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a > head) {
          results.push(a);
        }
      }
      return results;
    })();
    return (Util.quicksort(small)).concat([head]).concat(Util.quicksort(large));
  }

  static pad(n) {
    if (n < 10) {
      return '0' + n;
    } else {
      return n;
    }
  }

  static padStr(n) {
    if (n < 10) {
      return '0' + n.toString();
    } else {
      return n.toString();
    }
  }

  // Return and ISO formated data string
  static isoDateTime(dateIn) {
    var date, pad;
    date = dateIn != null ? dateIn : new Date();
    console.log('Util.isoDatetime()', date);
    console.log('Util.isoDatetime()', date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes, date.getUTCSeconds);
    pad = function(n) {
      return Util.pad(n);
    };
    return date.getFullYear()(+'-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + 'Z');
  }

  static toHMS(unixTime) {
    var ampm, date, hour, min, sec, time;
    date = new Date();
    if (Util.isNum(unixTime)) {
      date.setTime(unixTime);
    }
    hour = date.getHours();
    ampm = 'AM';
    if (hour > 12) {
      hour = hour - 12;
      ampm = 'PM';
    }
    min = ('0' + date.getMinutes()).slice(-2);
    sec = ('0' + date.getSeconds()).slice(-2);
    time = `${hour}:${min}:${sec} ${ampm}`;
    return time;
  }

  // Generate four random hex digits
  static hex4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  // Generate a 32 bits hex
  static hex32() {
    var hex, i, j;
    hex = this.hex4();
    for (i = j = 1; j <= 4; i = ++j) {
      Util.noop(i);
      hex += this.hex4();
    }
    return hex;
  }

  // Return a number with fixed decimal places
  static toFixed(arg, dec = 2) {
    var num;
    num = (function() {
      switch (typeof arg) {
        case 'number':
          return arg;
        case 'string':
          return parseFloat(arg);
        default:
          return 0;
      }
    })();
    return num.toFixed(dec);
  }

  static toInt(arg) {
    switch (typeof arg) {
      case 'number':
        return Math.floor(arg);
      case 'string':
        return parseInt(arg);
      default:
        return 0;
    }
  }

  static toFloat(arg) {
    switch (typeof arg) {
      case 'number':
        return arg;
      case 'string':
        return parseFloat(arg);
      default:
        return 0;
    }
  }

  static toCap(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  static unCap(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
  }

  static toArray(objs) {
    var array, key, obj;
    if (Util.isArray(objs)) {
      return objs;
    } else {
      array = [];
      for (key in objs) {
        if (!hasProp.call(objs, key)) continue;
        obj = objs[key];
        array.push(obj);
      }
      return array;
    }
  }

  
  // Not working
  static toArray2(objects, whereIn = null, keyField = 'id') {
    var array, j, key, len1, object, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    array = [];
    if (Util.isArray(objects)) {
      for (j = 0, len1 = array.length; j < len1; j++) {
        object = array[j];
        if (!(where(object))) {
          continue;
        }
        if ((object['id'] != null) && keyField !== 'id') {
          object[keyField] = object['id'];
        }
        array.push(object);
      }
    } else {
      for (key in objects) {
        if (!hasProp.call(objects, key)) continue;
        object = objects[key];
        if (!(where(key, object))) {
          continue;
        }
        object[keyField] = key;
        array.push(object);
      }
    }
    return array;
  }

  static toObjects(rows, whereIn = null, keyField = 'id') {
    var j, key, len1, objects, row, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    objects = {};
    if (Util.isArray(rows)) {
      for (j = 0, len1 = rows.length; j < len1; j++) {
        row = rows[j];
        if (!(where(row))) {
          continue;
        }
        if ((row['id'] != null) && keyField !== 'id') {
          row[keyField] = row['id'];
        }
        objects[row[keyField]] = row;
      }
    } else {
      for (key in rows) {
        row = rows[key];
        if (!(where(row))) {
          continue;
        }
        row[keyField] = key;
        objects[key] = row;
      }
    }
    return objects;
  }

  static lenObject(object, where = function() {
      return true;
    }) {
    var key, len, obj;
    len = 0;
    for (key in object) {
      if (!hasProp.call(object, key)) continue;
      obj = object[key];
      if (where(key)) {
        len = len + 1;
      }
    }
    return len;
  }

  // Beautiful Code, Chapter 1.
  // Implements a regular expression matcher that supports character matches,
  // '.', '^', '$', and '*'.

  // Search for the regexp anywhere in the text.
  static match(regexp, text) {
    if (regexp[0] === '^') {
      return Util.match_here(regexp.slice(1), text);
    }
    while (text) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      text = text.slice(1);
    }
    return false;
  }

  // Search for the regexp at the beginning of the text.
  static match_here(regexp, text) {
    var cur, next;
    cur = "";
    next = "";
    [cur, next] = [regexp[0], regexp[1]];
    if (regexp.length === 0) {
      return true;
    }
    if (next === '*') {
      return Util.match_star(cur, regexp.slice(2), text);
    }
    if (cur === '$' && !next) {
      return text.length === 0;
    }
    if (text && (cur === '.' || cur === text[0])) {
      return Util.match_here(regexp.slice(1), text.slice(1));
    }
    return false;
  }

  // Search for a kleene star match at the beginning of the text.
  static match_star(c, regexp, text) {
    while (true) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      if (!(text && (text[0] === c || c === '.'))) {
        return false;
      }
      text = text.slice(1);
    }
  }

  static match_test() {
    console.log(Util.match_args("ex", "some text"));
    console.log(Util.match_args("s..t", "spit"));
    console.log(Util.match_args("^..t", "buttercup"));
    console.log(Util.match_args("i..$", "cherries"));
    console.log(Util.match_args("o*m", "vrooooommm!"));
    return console.log(Util.match_args("^hel*o$", "hellllllo"));
  }

  static match_args(regexp, text) {
    return console.log(regexp, text, Util.match(regexp, text));
  }

  static svgId(name, type, svgType, check = false) {
    if (check) {
      return this.id(name, type, svgType);
    } else {
      return name + type + svgType;
    }
  }

  static css(name, type = '') {
    return name + type;
  }

  static icon(name, type, fa) {
    return name + type + ' fa fa-' + fa;
  }

  // json - "application/json;charset=utf-8"
  // svg
  static mineType(fileType) {
    var mine;
    mine = (function() {
      switch (fileType) {
        case 'json':
          return "application/json";
        case 'adoc':
          return "text/plain";
        case 'html':
          return "text/html";
        case 'svg':
          return "image/svg+xml";
        default:
          return "text/plain";
      }
    })();
    mine += ";charset=utf-8";
    return mine;
  }

  static saveFile(stuff, fileName, fileType) {
    var blob, downloadLink, url;
    blob = new Blob([stuff], {
      type: this.mineType(fileType)
    });
    url = window['URL'].createObjectURL(blob);
    downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

// Static class variables have to be declared outside of class declarion to avoid function wrapper
Util.htmlIds = {}; // Object of unique Html Ids

Util.myVar = 'myVar';

Util.skipReady = false;

Util.modules = [];

Util.instances = [];

Util.logStackNum = 0;

Util.logStackMax = 100;

Util.fills = {};

Util.uniqueIdExt = '';

var Util$1 = Util;

var Data,
  hasProp$1 = {}.hasOwnProperty;

Data = class Data {
  static refine(data, type) {
    var akey, area, base, bkey, ckey, comp, disp, dkey, ikey, item, pkey, prac;
    if (type === 'None') {
      return data;
    }
    data.comps = {};
    for (ckey in data) {
      comp = data[ckey];
      if (!(Util$1.isChild(ckey))) {
        continue;
      }
      // console.log( 'Data.refine comp', comp )
      data.comps[ckey] = comp;
      if (comp['name'] == null) {
        comp['name'] = ckey;
      }
      comp.pracs = {};
      for (pkey in comp) {
        prac = comp[pkey];
        if (!(Util$1.isChild(pkey))) {
          continue;
        }
        // console.log( '  Data.refine prac', prac )
        comp.pracs[pkey] = prac;
        prac.comp = comp;
        if (prac['name'] == null) {
          prac['name'] = pkey;
        }
        prac.disps = {};
        for (dkey in prac) {
          disp = prac[dkey];
          if (!(Util$1.isChild(dkey))) {
            continue;
          }
          prac.disps[dkey] = disp;
          disp.prac = prac;
          if (disp['name'] == null) {
            disp['name'] = dkey;
          }
          disp.areas = {};
          for (akey in disp) {
            area = disp[akey];
            if (!(Util$1.isChild(akey))) {
              continue;
            }
            disp.areas[akey] = area;
            area.disp = disp;
            if (area['name'] == null) {
              area['name'] = akey;
            }
            area.items = {};
            for (ikey in area) {
              item = area[ikey];
              if (!(Util$1.isChild(ikey))) {
                continue;
              }
              area.items[ikey] = item;
              item.area = area;
              if (item['name'] == null) {
                item['name'] = ikey;
              }
              item.bases = {};
              for (bkey in item) {
                base = item[bkey];
                if (!(Util$1.isChild(bkey))) {
                  continue;
                }
                item.bases[bkey] = base;
                base.item = item;
                if (base['name'] == null) {
                  base['name'] = bkey;
                }
              }
            }
          }
        }
      }
    }
    return data;
  }

  // ---- Read JSON with batch async
  static batchRead(batch, callback, create = null) {
    var key, obj;
    for (key in batch) {
      if (!hasProp$1.call(batch, key)) continue;
      obj = batch[key];
      this.batchJSON(obj, batch, callback, create);
    }
  }

  static batchComplete(batch) {
    var key, obj;
    for (key in batch) {
      if (!hasProp$1.call(batch, key)) continue;
      obj = batch[key];
      if (!obj['data']) {
        return false;
      }
    }
    return true;
  }

  // "Access-Control-Request-Headers": "*", "Access-Control-Request-Method": "*"
  static batchJSON(obj, batch, callback, refine = null) {
    var opt, url;
    url = obj.type === 'Font' ? obj.url : Data.toUrl(obj.url);
    // console.log( 'Data.batchJSON', obj.url, url )
    opt = {
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch(url, opt).then((response) => {
      return response.json();
    }).then((data) => {
      obj['data'] = Util$1.isFunc(refine) ? refine(data, obj.type) : data;
      if (Data.batchComplete(batch)) {
        return callback(batch);
      }
    }).catch((error) => {
      return console.error("Data.batchJSON()", {
        url: url,
        error: error
      });
    });
  }

  static asyncJSON(urla, callback) {
    var url;
    url = Data.toUrl(urla);
    // console.log( 'Data.asyncJSON', urla, url )
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      return callback(data);
    }).catch((error) => {
      return console.error("Data.asyncJSON()", {
        url: url,
        error: error
      });
    });
  }

  static planeData(batch, plane) {
    return batch[plane].data[plane];
  }

  static toUrl(url) {
    if (window.location.href.includes('localhost')) {
      return Data.local + url;
    } else {
      return Data.hosted + url;
    }
  }

  
  // ------ Quick JSON read ------
  static read(url, callback) {
    if (Util$1.isObj(url)) {
      Data.readFile(url, callback);
    } else {
      Data.asynsJson(url, callback);
    }
  }

  static readFile(fileObj, doJson) {
    var fileReader;
    fileReader = new FileReader();
    fileReader.onerror = function(e) {
      return console.error('Store.readFile', fileObj.name, e.target.error);
    };
    fileReader.onload = function(e) {
      return doJson(JSON.parse(e.target.result));
    };
    fileReader.readAsText(fileObj);
  }

  static saveFile(data, fileName) {
    var downloadLink, htmlBlob, htmlUrl;
    htmlBlob = new Blob([data], {
      type: "text/html;charset=utf-8"
    });
    htmlUrl = window['URL'].createObjectURL(htmlBlob);
    downloadLink = document.createElement("a");
    downloadLink.href = htmlUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

//ata.parse   = Util.parseURI( window.location.href )
//ata.hosted1 = Data.parse.hostname + '/app/data/'
// console.log('Data.hosted', Data.hosted, window.location.href )
Data.local = "app/data/";

Data.hosted = '/app/data/';

Data.cssDir = 'css/'; // /css in /pub

var Data$1 = Data;

//

var script = {

  props: { comp:String, btns:Object, klass:String, back:String, active:String, choicea:Array },

  data() { return { idx:-1, name:'-',
    colors: { primary:'#007bff', secondary:'#6c757d', success:'#28a745', info:'#17a2b8',
              warning:'#ffc107', danger:   '#dc3545', light:  '#f8f9fa', dark:'#343a40' } } },

  methods: {
    pubBtn: function (btn) {
      this.idx  = ++this.idx % this.choicea.length;
      this.name              = btn.name;
      this.choicea[this.idx] = btn.name;
      this.publish( this.comp, btn.name ); },
    aspect: function() {  // Only call in mounted
      let w = this.$refs['Btns']['clientWidth' ];
      let h = this.$refs['Btns']['clientHeight'];
      return h/w; },
    styleBlock: function(p) {
      let sy = 1.0;
      let p2 = p[2]===0 ? p[3] : p[2];
      return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',
      fontSize:(p[3]*0.1)+'em' } },
    styleBtn: function (btn) {
      let back = this.colors[btn.back] ? this.colors[btn.back] : this.back;
      return this.name===btn.name ? { color:'black', backgroundColor:this.active }
                                  : { color:'black', backgroundColor:back }; },
    classCheck: function (btn) {
      let    checked = this.name === btn.name || this.choicea.indexOf(btn.name) !== -1;
      return checked ? 'check far fa-check-square' : 'check far fa-square'; },
    classIcons: function (btn) {
      return 'icons ' + btn.icon },
    titleRef: function (btn) {
      return 'Title' + btn.name },
    img: function (btn) {
      return Data$1.cssDir + btn.img },
    adjustWidths: function() {
       let names = Object.keys(this.btns);
       for( let name of names ) {
         let btn = this.btns[name];
         if( btn.pos[2]===0 ) {
           let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth'];
           btn.elem   = this.$refs[btn.name][0];
           let wb     = btn.elem['clientWidth'];
           btn.pos[2] = btn.pos[3]*2.4*wt/wb;
           // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
           btn.elem.style.width = btn.pos[2]+'%'; } }
    } },

  mounted: function () {
    this.asp = this.aspect();
    this.adjustWidths();
    // console.log( 'Btns.choicea', this.choicea );
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Btns", staticClass: "btns" },
    [
      _vm._l(_vm.btns, function(btn) {
        return [
          _c(
            "div",
            { ref: btn.name, refInFor: true, style: _vm.styleBlock(btn.pos) },
            [
              _c("div", { staticClass: "btn-center" }, [
                _c(
                  "div",
                  {
                    staticClass: "btn",
                    style: _vm.styleBtn(btn),
                    on: {
                      click: function($event) {
                        return _vm.pubBtn(btn)
                      }
                    }
                  },
                  [
                    btn.check
                      ? _c("span", { class: _vm.classCheck(btn) })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.icon
                      ? _c("i", { class: _vm.classIcons(btn) })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.img
                      ? _c("img", {
                          staticClass: "image",
                          attrs: { src: _vm.img(btn), alt: "" }
                        })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.title
                      ? _c(
                          "span",
                          {
                            ref: _vm.titleRef(btn),
                            refInFor: true,
                            staticClass: "title"
                          },
                          [_vm._v(_vm._s(btn.title))]
                        )
                      : _vm._e()
                  ]
                )
              ])
            ]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-d531ee10_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.btns {\n  font-size: 1.4rem;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 35fr 65fr;\n  grid-template-areas: \"icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n", map: {"version":3,"sources":["Btns.vue","/Users/ax/Documents/prj/aug/vue/elem/Btns.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;AACX;AACA;EACE,aAAa;EACb,WAAW;EACX,YAAY;AACd;AACA;EACE,aAAa;EACb,gCAAgC;EAChC,kCAAkC;EAClC,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,+BAA+B;EAC/B,eAAe;ECCjB,mBAAA;EDCE,uBAAuB;ACCzB;ADCA;ECCA,gBAAA;EDCE,oBAAoB;ECCtB,kBAAA;ADCA;ACCA;EACA,gBAAA;EACA,oBAAA;EDCE,kBAAkB;ACCpB;AACA;EACA,gBAAA;EACA,oBAAA;EDCE,kBAAkB;ECCpB,kBAAA;EDCE,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,uBAAuB;AACzB","file":"Btns.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.btns {\n  font-size: 1.4rem;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 35fr 65fr;\n  grid-template-areas: \"icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n","\n<template>\n  <div ref=\"Btns\"                   class=\"btns\">\n    <template v-for=\"btn in btns\">\n      <div        :ref=\"btn.name\"  :style=\"styleBlock(btn.pos)\">\n        <div                        class=\"btn-center\">\n          <div class=\"btn\" :style=\"styleBtn(btn)\" @click=\"pubBtn(btn)\">\n            <span v-if=\"btn.check\" :class=\"classCheck(btn)\"></span>\n            <i    v-if=\"btn.icon\"  :class=\"classIcons(btn)\"></i>\n            <img  v-if=\"btn.img\"    class=\"image\" :src=\"img(btn)\" alt=\"\"/>\n            <span v-if=\"btn.title\"  class=\"title\" :ref=\"titleRef(btn)\">{{btn.title}}</span>\n          </div>\n        </div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Data from '../../pub/base/util/Data.js'\n\n  export default {\n\n    props: { comp:String, btns:Object, klass:String, back:String, active:String, choicea:Array },\n\n    data() { return { idx:-1, name:'-',\n      colors: { primary:'#007bff', secondary:'#6c757d', success:'#28a745', info:'#17a2b8',\n                warning:'#ffc107', danger:   '#dc3545', light:  '#f8f9fa', dark:'#343a40' } } },\n\n    methods: {\n      pubBtn: function (btn) {\n        this.idx  = ++this.idx % this.choicea.length;\n        this.name              = btn.name;\n        this.choicea[this.idx] = btn.name;\n        this.publish( this.comp, btn.name ); },\n      aspect: function() {  // Only call in mounted\n        let w = this.$refs['Btns']['clientWidth' ];\n        let h = this.$refs['Btns']['clientHeight'];\n        return h/w; },\n      styleBlock: function(p) {\n        let sy = 1.0\n        let p2 = p[2]===0 ? p[3] : p[2];\n        return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',\n        fontSize:(p[3]*0.1)+'em' } },\n      styleBtn: function (btn) {\n        let back = this.colors[btn.back] ? this.colors[btn.back] : this.back;\n        return this.name===btn.name ? { color:'black', backgroundColor:this.active }\n                                    : { color:'black', backgroundColor:back }; },\n      classCheck: function (btn) {\n        let    checked = this.name === btn.name || this.choicea.indexOf(btn.name) !== -1;\n        return checked ? 'check far fa-check-square' : 'check far fa-square'; },\n      classIcons: function (btn) {\n        return 'icons ' + btn.icon },\n      titleRef: function (btn) {\n        return 'Title' + btn.name },\n      img: function (btn) {\n        return Data.cssDir + btn.img },\n      adjustWidths: function() {\n         let names = Object.keys(this.btns)\n         for( let name of names ) {\n           let btn = this.btns[name];\n           if( btn.pos[2]===0 ) {\n             let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth']\n             btn.elem   = this.$refs[btn.name][0]\n             let wb     = btn.elem['clientWidth']\n             btn.pos[2] = btn.pos[3]*2.4*wt/wb\n             // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }\n             btn.elem.style.width = btn.pos[2]+'%' } }\n      } },\n\n    mounted: function () {\n      this.asp = this.aspect();\n      this.adjustWidths();\n      // console.log( 'Btns.choicea', this.choicea );\n    }\n\n  }\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .btns { font-size:@theme-btn-size; font-weight:bold; position:absolute; left:0; top:0; right:0; bottom:0; }\n  \n  .btn-center { display:grid;  width:100%; height:100%; } // A surrounding div for centering button\n\n  .grid1x3() { display:grid; grid-template-columns:35fr 65fr; grid-template-areas:\"icons label\"; }\n\n  .btn { .grid1x3(); justify-self:center; align-self:center;\n    width:80%; height:80%; font-size:inherit; font-family:@theme-font-family;\n    cursor:pointer; border-radius:16px; border: solid @theme-back 1px; }\n\n  .btn .check { grid-area:icons; justify-self:center; align-self:center; }\n  .btn .icons { grid-area:icons; justify-self:center; align-self:center; } // font-family: \"font-awesome\" serif;\n  .btn .image { grid-area:icons; justify-self:center; align-self:center; .image-radius; max-height:1.0em; }\n  .btn .title { grid-area:label; justify-self:left;   align-self:center; text-align:left; }\n\n  .image-radius { border-radius:8px; border:solid @theme-back 1px; }\n\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Btns = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


let Logo = {
  name: 'logo',
  methods:{
    pubNav: function( dir ) {
      this.nav().dir( dir ); } },
  mounted: function () {
    this.nav().set( { $router:this.$router } ); }
};

/* script */
const __vue_script__$1 = Logo;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "logo" }, [
    _c("div", { ref: "navd", staticClass: "navd" }, [
      _c(
        "div",
        {
          ref: "west",
          staticClass: "west",
          on: {
            click: function($event) {
              return _vm.pubNav("west")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-left" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "north",
          staticClass: "north",
          on: {
            click: function($event) {
              return _vm.pubNav("north")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-up" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "next",
          staticClass: "next",
          on: {
            click: function($event) {
              return _vm.pubNav("next")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-plus-circle" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "prev",
          staticClass: "prev",
          on: {
            click: function($event) {
              return _vm.pubNav("prev")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-minus-circle" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "east",
          staticClass: "east",
          on: {
            click: function($event) {
              return _vm.pubNav("east")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-right" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          ref: "south",
          staticClass: "south",
          on: {
            click: function($event) {
              return _vm.pubNav("south")
            }
          }
        },
        [_c("i", { staticClass: "fas fa-angle-down" })]
      )
    ])
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-488112f2_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.logo {\n  background-color: black;\n}\n.navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 20%;\n  top: 0;\n  width: 60%;\n  height: 100%;\n}\n.navd .west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .north {\n  position: absolute;\n  left: 33%;\n  top: 0;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .next {\n  position: absolute;\n  left: 33%;\n  top: 33%;\n  width: 17%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .prev {\n  position: absolute;\n  left: 50%;\n  top: 33%;\n  width: 16%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .east {\n  position: absolute;\n  left: 66%;\n  top: 33%;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .south {\n  position: absolute;\n  left: 33%;\n  top: 66%;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd div {\n  display: grid;\n}\n.navd div i {\n  justify-self: center;\n  align-self: center;\n}\n", map: {"version":3,"sources":["Logo.vue","/Users/ax/Documents/prj/aug/vue/dash/Logo.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;ECCA,uBAAA;EDCE,iBAAiB;ACCnB;ADCA;ECCA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;ADCA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,UAAU;EACV,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,MAAM;EACN,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,SAAS;EACT,QAAQ;EACR,UAAU;EACV,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;AACpB","file":"Logo.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.logo {\n  background-color: black;\n}\n.navd {\n  background-color: black;\n  color: wheat;\n  position: relative;\n  left: 20%;\n  top: 0;\n  width: 60%;\n  height: 100%;\n}\n.navd .west {\n  position: absolute;\n  left: 0;\n  top: 33%;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .north {\n  position: absolute;\n  left: 33%;\n  top: 0;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .next {\n  position: absolute;\n  left: 33%;\n  top: 33%;\n  width: 17%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .prev {\n  position: absolute;\n  left: 50%;\n  top: 33%;\n  width: 16%;\n  height: 33%;\n  font-size: 1.2rem;\n}\n.navd .east {\n  position: absolute;\n  left: 66%;\n  top: 33%;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd .south {\n  position: absolute;\n  left: 33%;\n  top: 66%;\n  width: 33%;\n  height: 33%;\n  font-size: 1.3rem;\n}\n.navd div {\n  display: grid;\n}\n.navd div i {\n  justify-self: center;\n  align-self: center;\n}\n","\n<template>\n  <div class=\"logo\">\n    <!--d-navd id=\"navd\"></d-navd-->\n    <div   class=\"navd\"  ref=\"navd\">\n      <div class=\"west\"  ref=\"west\"  @click=\"pubNav('west' )\"><i class=\"fas fa-angle-left\"  ></i></div>\n      <div class=\"north\" ref=\"north\" @click=\"pubNav('north')\"><i class=\"fas fa-angle-up\"    ></i></div>\n      <div class=\"next\"  ref=\"next\"  @click=\"pubNav('next')\" ><i class=\"fas fa-plus-circle\" ></i></div>\n      <div class=\"prev\"  ref=\"prev\"  @click=\"pubNav('prev')\" ><i class=\"fas fa-minus-circle\"></i></div>\n      <div class=\"east\"  ref=\"east\"  @click=\"pubNav('east' )\"><i class=\"fas fa-angle-right\" ></i></div>\n      <div class=\"south\" ref=\"south\" @click=\"pubNav('south')\"><i class=\"fas fa-angle-down\"  ></i></div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Logo = {\n    name: 'logo',\n    methods:{\n      pubNav: function( dir ) {\n        this.nav().dir( dir ); } },\n    mounted: function () {\n      this.nav().set( { $router:this.$router } ); }\n  };\n\n  export default Logo;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .logo { background-color:@theme-back; }\n  \n  .navd { background-color:@theme-back; color:@theme-color;\n             position:relative; left:20%; top:0;   width:60%; height:100%;\n    .west  { position:absolute; left:0;   top:33%; width:33%; height: 33%; font-size:@theme-dirs-size; }\n    .north { position:absolute; left:33%; top:0;   width:33%; height: 33%; font-size:@theme-dirs-size; }\n    .next  { position:absolute; left:33%; top:33%; width:17%; height: 33%; font-size:@theme-navd-size; }\n    .prev  { position:absolute; left:50%; top:33%; width:16%; height: 33%; font-size:@theme-navd-size; }\n    .east  { position:absolute; left:66%; top:33%; width:33%; height: 33%; font-size:@theme-dirs-size; }\n    .south { position:absolute; left:33%; top:66%; width:33%; height: 33%; font-size:@theme-dirs-size; }\n    div    { display:grid;\n      i    { justify-self:center; align-self:center; } } }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Logo$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var script$1 = {
  data() {
    return {} },
  methods: {
    click:  function( obj )  {
      this.publish(  'Menu', obj    ); },
    onMenu: function( obj )  {
      console.log(  'Menu.onMenu()', obj ); } },
  mounted: function () {
    this.subscribe( 'Menu', 'Menu.vue', this.onMenu ); } };

/* script */
const __vue_script__$2 = script$1;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "menu" }, [
    _c(
      "div",
      { staticClass: "navh" },
      [
        _c("router-link", { attrs: { to: { name: "Home" } } }, [
          _c("i", { staticClass: "fas fa-home" }),
          _vm._v("Home")
        ])
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "search",
        on: {
          click: function($event) {
            return _vm.click("Search")
          }
        }
      },
      [
        _c("label", { attrs: { for: "search" } }, [_vm._v("Search")]),
        _vm._v(" "),
        _c("i", { staticClass: "fas fa-search" }),
        _vm._v(" "),
        _c("input", {
          staticClass: "input",
          attrs: {
            placeholder: " Search",
            id: "search",
            type: "text",
            size: "16"
          }
        })
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "contact",
        on: {
          click: function($event) {
            return _vm.click("Contact")
          }
        }
      },
      [_c("i", { staticClass: "fas fa-user" }), _vm._v("Contact")]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "signon",
        on: {
          click: function($event) {
            return _vm.click("Signon")
          }
        }
      },
      [_c("i", { staticClass: "fas fa-sign-in-alt" }), _vm._v("Sign On")]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "settings" }, [
      _c("i", { staticClass: "fas fa-cog" }),
      _c("span", [_vm._v("Settings")]),
      _vm._v(" "),
      _c("ul", [
        _c(
          "li",
          {
            on: {
              click: function($event) {
                return _vm.click("Preferences")
              }
            }
          },
          [
            _c("i", { staticClass: "fas fa-cog" }),
            _c("span", [_vm._v("Preferences")])
          ]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            on: {
              click: function($event) {
                return _vm.click("Connection")
              }
            }
          },
          [
            _c("i", { staticClass: "fas fa-cog" }),
            _c("span", [_vm._v("Connection")])
          ]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            on: {
              click: function($event) {
                return _vm.click("Privacy")
              }
            }
          },
          [
            _c("i", { staticClass: "fas fa-cog" }),
            _c("span", [_vm._v("Privacy")])
          ]
        )
      ])
    ])
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-09f20d87_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.menu {\n  grid-template-columns: 5fr 40fr 25fr 10fr 10fr 10fr;\n  grid-template-rows: 10fr;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  display: grid;\n  background: black;\n  color: wheat;\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n}\n.menu .navh {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.menu .navh i {\n  margin-right: 0.3em;\n}\n.menu .navh a {\n  color: wheat;\n  text-decoration: none;\n}\n.menu .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.menu .search label {\n  color: black;\n}\n.menu .search .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: wheat;\n  color: black;\n}\n.menu .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.menu .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.menu .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.menu .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7rem;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.menu .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background-color: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.menu .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.menu .settings ul li span {\n  display: inline-block;\n}\n.menu .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.menu .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.menu div i {\n  margin-right: 0.3em;\n}\n", map: {"version":3,"sources":["Menu.vue","/Users/ax/Documents/prj/aug/vue/dash/Menu.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;ACCnB;ADCA;ECCA,iBAAA;AACA;ADCA;ECCA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,mDAAA;EACA,wBAAA;EACA,qEAAA;EACA,aAAA;EACA,iBAAA;EACA,YAAA;EACA,+BAAA;EACA,iBAAA;ADCA;AACA;EACE,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,YAAY;AACd;AACA;EACE,+BAA+B;EAC/B,iBAAiB;EACjB,gBAAgB;EAChB,4BAA4B;EAC5B,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,mBAAmB;EACnB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,oBAAoB;EACpB,mBAAmB;EACnB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,aAAa;EACb,iBAAiB;EACjB,gBAAgB;EAChB,iBAAiB;EACjB,UAAU;EACV,gBAAgB;EAChB,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,YAAY;EACZ,YAAY;EACZ,gCAAgC;EAChC,4BAA4B;AAC9B;AACA;EACE,eAAe;EACf,4BAA4B;EAC5B,uBAAuB;EACvB,YAAY;EACZ,+BAA+B;EAC/B,gCAAgC;AAClC;AACA;EACE,qBAAqB;EACrB,oBAAoB;AACtB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,iBAAiB;EACjB,gBAAgB;AAClB;AACA;EACE,gBAAgB;EAChB,YAAY;AACd;AACA;EACE,mBAAmB;AACrB","file":"Menu.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.menu {\n  grid-template-columns: 5fr 40fr 25fr 10fr 10fr 10fr;\n  grid-template-rows: 10fr;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  display: grid;\n  background: black;\n  color: wheat;\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n}\n.menu .navh {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.menu .navh i {\n  margin-right: 0.3em;\n}\n.menu .navh a {\n  color: wheat;\n  text-decoration: none;\n}\n.menu .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.menu .search label {\n  color: black;\n}\n.menu .search .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: wheat;\n  color: black;\n}\n.menu .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.menu .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.menu .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.menu .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7rem;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.menu .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background-color: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.menu .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.menu .settings ul li span {\n  display: inline-block;\n}\n.menu .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.menu .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.menu div i {\n  margin-right: 0.3em;\n}\n","\n<template>\n  <div class=\"menu\">    <!-- <i class=\"fas fa-home\"></i> -->\n    <div class=\"navh\"><router-link :to=\"{ name:'Home'}\"><i class=\"fas fa-home\"></i>Home</router-link></div>\n    <div class=\"search\"   @click=\"click('Search')\">\n      <label for=\"search\">Search</label>\n      <i class=\"fas fa-search\"></i>\n      <input class=\"input\" placeholder=\" Search\" id=\"search\" type=\"text\" size=\"16\">\n    </div>\n    <div class=\"contact\"  @click=\"click('Contact')\" ><i class=\"fas fa-user\"       ></i>Contact</div>\n    <div class=\"signon\"   @click=\"click('Signon')\"  ><i class=\"fas fa-sign-in-alt\"></i>Sign On</div>\n    <div class=\"settings\"><i class=\"fas fa-cog\"></i><span>Settings</span>\n      <ul>\n        <li @click=\"click('Preferences')\"><i class=\"fas fa-cog\"></i><span>Preferences</span></li>\n        <li @click=\"click('Connection')\" ><i class=\"fas fa-cog\"></i><span>Connection</span></li>\n        <li @click=\"click('Privacy')\"    ><i class=\"fas fa-cog\"></i><span>Privacy</span></li>\n      </ul>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  export default {\n    data() {\n      return {} },\n    methods: {\n      click:  function( obj )  {\n        this.publish(  'Menu', obj    ); },\n      onMenu: function( obj )  {\n        console.log(  'Menu.onMenu()', obj ); } },\n    mounted: function () {\n      this.subscribe( 'Menu', 'Menu.vue', this.onMenu ) } };\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid1x5() { display:grid; grid-template-columns:5fr 40fr 25fr 10fr 10fr 10fr; grid-template-rows:@theme-north;\n    grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\"; }\n  \n  .menu {  .grid1x5(); display:grid; background:@theme-back; color:@theme-color;\n    font-family:@theme-font-family; font-weight:bold;    // Using because Navb sensistive to width\n    .navh     { grid-area:ghome;     justify-self:start; align-self:center;\n      i { margin-right:0.3em; }\n      a { color:@theme-color; text-decoration:none; }}\n    .search   { grid-area:gsearch;   justify-self:start; align-self:center;\n      label { color:@theme-back; }\n      .input{ font-family:@theme-font-family; font-weight:bold;  font-size:0.9em;\n        border-radius:0 12px 12px 0; background:@theme-color; color:@theme-back; } }\n    .contact  { grid-area:gcontact;  justify-self:start; align-self:center; }\n    .signon   { grid-area:gsignon;   justify-self:start; align-self:center; }\n    .settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;\n      ul { display:none; align-self:start; list-style:none; font-size:0.7rem; z-index:3;\n        background:@theme-back-menu;\n        position:absolute; left:10px; top:12px; width:200px; height:auto;\n        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;\n        li { display:inline; border-radius:0 18px 18px 0;  background-color:@theme-back; color:@theme-color;\n             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em;\n          i {    display:inline-block; margin-right:0.25em; }\n          span { display:inline-block; } } } }\n    .settings:hover {\n      ul { display:grid; align-self:start; background:@theme-back-item;\n        li:hover { background:@theme-back-item-hover; color:@theme-color-item-hover; } } }\n     div i { margin-right:0.3em; } }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Menu = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    browser,
    undefined
  );

//
//
//
//
//

var script$2 = {};

/* script */
const __vue_script__$3 = script$2;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "find" })
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Find = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


let Tocs = {
  
  data() { return {  comp:'None', prac:'None', disp:'None', komps:{} } },
  
  methods: {
    
    isPrac: function(prac) {
      return this.prac === prac;  },
    onComp: function(comp) {
      if( this.comp !== comp ) {
          this.comp  =  comp; } },
    onPrac: function(prac) {
      this.prac = prac; },
    onDisp: function(prac,disp) {
      this.prac = prac; this.disp = disp; },
    onPage: function (obj) {
      console.log( 'Tocs.onPage()', obj ); },
    onNone: function (obj) {
      console.log( 'Tocs.onNone()', obj ); },
    onNav:  function (obj) {
      switch( obj.level ) {
        case 'Comp' : this.onComp(obj.comp);          break;
        case 'Prac' : this.onPrac(obj.prac);          break;
        case 'Disp' : this.onDisp(obj.prac,obj.disp); break;
        default     : this.onNone(obj); } },
    doComp: function(comp) {
      this.comp = comp;
      let obj   = { level:'Comp', comp:comp, prac:'All', disp:'All', page:this.nav().page };
      this.nav().pub(obj);
      this.nav().routeLevel('Comp'); },
    doPrac: function(prac) {
      this.prac = prac;
      let obj   = { level:'Prac', prac:prac, disp:'All' };
      this.nav().pub(obj);
      this.nav().routeLevel('Prac'); },
    doDisp: function(prac,disp) {
      this.prac = prac;
      this.disp = disp;
      let obj   = { level:'Disp', prac:prac, disp:disp };
      this.nav().pub(obj);
      this.nav().routeLevel('Disp'); },
    doSelect: function(select) {
      this.publish( 'Select',   select ); },
    stylePrac: function( prac, hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; },
    styleDisp: function( disp, hsv ) {
      if( this.disp!==disp ) {
        return { color:'black', backgroundColor:this.toRgbaHsv(hsv) }; }
      else {
        return { color:'white', backgroundColor:'black' }; } },
    filterPracs: function(pracs,komp) {
      let filt = {};
      for( let key in pracs ) {
        let prac = pracs[key];
        if( prac.row !== 'Dim' || komp === 'Prin' ) {
          filt[key] = prac; } }
      return filt;
    } },
  
  mounted: function () {
    this.komps = this.kompsTocs();
    for( let key in this.komps ) {
      let komp = this.komps[key];
      if( komp.ikw ) {  // this.komps.hasOwnProperty(key) &&
          komp.pracs = this.filterPracs( this.pracs(komp.comp), komp.comp );
          this.subscribe( key, 'Tocs.vue', (obj) => {
          //this.onComp(key);
            if( obj.disp==='All' ) { this.onPrac(obj.prac); }
            else                   { this.onDisp(obj.prac,obj.disp); } } ); } }
    this.subscribe( 'Nav', 'Tocs.vue', (obj) => {
        this.onNav(obj); } ); }
  };

/* script */
const __vue_script__$4 = Tocs;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "tocs" }, [
    _c(
      "ul",
      [
        _vm._l(_vm.komps, function(komp) {
          return [
            _c("li", { key: komp.name }, [
              _c(
                "div",
                {
                  on: {
                    click: function($event) {
                      return _vm.doComp(komp.name)
                    }
                  }
                },
                [
                  _c("div", [
                    _c("i", { class: komp.icon }),
                    _vm._v(_vm._s(komp.name))
                  ])
                ]
              ),
              _vm._v(" "),
              _vm.comp === komp.name
                ? _c(
                    "ul",
                    [
                      _vm._l(_vm.komps[komp.name].pracs, function(prac) {
                        return [
                          _c(
                            "li",
                            {
                              key: prac.name,
                              style: _vm.stylePrac(prac.name, prac.hsv),
                              on: {
                                click: function($event) {
                                  return _vm.doPrac(prac.name)
                                }
                              }
                            },
                            [
                              _c("i", { class: prac.icon }),
                              _vm._v(" "),
                              komp.link
                                ? _c(
                                    "router-link",
                                    { attrs: { to: { name: prac.name } } },
                                    [_vm._v(_vm._s(prac.name))]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              !komp.link
                                ? _c("span", [_vm._v(_vm._s(prac.name))])
                                : _vm._e(),
                              _vm._v(" "),
                              _c(
                                "ul",
                                {
                                  directives: [
                                    {
                                      name: "show",
                                      rawName: "v-show",
                                      value: _vm.isPrac(prac.name),
                                      expression: "isPrac(prac.name)"
                                    }
                                  ]
                                },
                                [
                                  _vm._l(prac.disps, function(disp) {
                                    return [
                                      _c(
                                        "li",
                                        {
                                          key: disp.name,
                                          style: _vm.styleDisp(
                                            disp.name,
                                            disp.hsv
                                          ),
                                          on: {
                                            click: function($event) {
                                              $event.stopPropagation();
                                              return _vm.doDisp(
                                                prac.name,
                                                disp.name
                                              )
                                            }
                                          }
                                        },
                                        [
                                          _c("i", { class: disp.icon }),
                                          _vm._v(_vm._s(disp.name))
                                        ]
                                      )
                                    ]
                                  })
                                ],
                                2
                              )
                            ],
                            1
                          )
                        ]
                      })
                    ],
                    2
                  )
                : _vm._e()
            ])
          ]
        })
      ],
      2
    )
  ])
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-5fc9dfac_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tocs {\n  font-family: Roboto, sans-serif;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25rem;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li i {\n  margin-right: 0.4rem;\n}\n.tocs ul li div {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 1.5rem;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3rem;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 1.25rem;\n  padding: 0;\n  margin: 0 0 0 0.2rem;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25rem;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n", map: {"version":3,"sources":["Tocs.vue","/Users/ax/Documents/prj/aug/vue/dash/Tocs.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,+BAA+B;AACjC;AACA;EACE,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,qBAAqB;EACrB,iBAAiB;EACjB,4BAA4B;EAC5B,mCAAmC;AACrC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,UAAU;EACV,SAAS;AACX;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,mCAAmC;AACrC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,oBAAoB;AACtB;AACA;EACE,4BAA4B;EAC5B,YAAY;ECCd,mCAAA;ADCA;ACCA;EACA,qBAAA;AACA;AACA;EACA,kCAAA;EACA,uBAAA;AACA","file":"Tocs.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tocs {\n  font-family: Roboto, sans-serif;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25rem;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li i {\n  margin-right: 0.4rem;\n}\n.tocs ul li div {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 1.5rem;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3rem;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 1.25rem;\n  padding: 0;\n  margin: 0 0 0 0.2rem;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2rem 0.2rem 0.2rem 0.2rem;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25rem;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n","\n<template><div class=\"tocs\">\n  <ul>\n    <template v-for=\"komp in komps\">\n    <li :key=\"komp.name\">\n      <div   v-on:click=\"doComp(komp.name)\">\n        <!--router-link :to=\"{ name:'Comp' }\"><i :class=\"komp.icon\"></i>{{komp.name}}</router-link-->\n        <div><i :class=\"komp.icon\"></i>{{komp.name}}</div>\n      </div>\n      <ul  v-if=\"comp===komp.name\"><template v-for=\"prac in komps[komp.name].pracs\" >\n        <li v-on:click=\"doPrac(prac.name)\" :style=\"stylePrac(prac.name,prac.hsv)\" :key=\"prac.name\">\n          <i :class=\"prac.icon\"></i>\n          <router-link v-if=\" komp.link\" :to=\"{ name:prac.name }\">{{prac.name}}</router-link>\n          <span        v-if=\"!komp.link\">{{prac.name}}</span>\n          <ul v-show=\"isPrac(prac.name)\"><template v-for=\"disp in prac.disps\">\n            <li v-on:click.stop=\"doDisp(prac.name,disp.name)\" :style=\"styleDisp(disp.name,disp.hsv)\" :key=\"disp.name\">\n              <i :class=\"disp.icon\"></i>{{disp.name}}</li>\n          </template></ul>\n        </li>\n      </template></ul>\n    </li>\n  </template>\n  </ul>\n</div></template>\n\n<script type=\"module\">\n  \n  let Tocs = {\n    \n    data() { return {  comp:'None', prac:'None', disp:'None', komps:{} } },\n    \n    methods: {\n      \n      isPrac: function(prac) {\n        return this.prac === prac;  },\n      onComp: function(comp) {\n        if( this.comp !== comp ) {\n            this.comp  =  comp; } },\n      onPrac: function(prac) {\n        this.prac = prac; },\n      onDisp: function(prac,disp) {\n        this.prac = prac; this.disp = disp; },\n      onPage: function (obj) {\n        console.log( 'Tocs.onPage()', obj ); },\n      onNone: function (obj) {\n        console.log( 'Tocs.onNone()', obj ); },\n      onNav:  function (obj) {\n        switch( obj.level ) {\n          case 'Comp' : this.onComp(obj.comp);          break;\n          case 'Prac' : this.onPrac(obj.prac);          break;\n          case 'Disp' : this.onDisp(obj.prac,obj.disp); break;\n          default     : this.onNone(obj); } },\n      doComp: function(comp) {\n        this.comp = comp;\n        let obj   = { level:'Comp', comp:comp, prac:'All', disp:'All', page:this.nav().page }\n        this.nav().pub(obj);\n        this.nav().routeLevel('Comp'); },\n      doPrac: function(prac) {\n        this.prac = prac;\n        let obj   = { level:'Prac', prac:prac, disp:'All' }\n        this.nav().pub(obj);\n        this.nav().routeLevel('Prac'); },\n      doDisp: function(prac,disp) {\n        this.prac = prac;\n        this.disp = disp;\n        let obj   = { level:'Disp', prac:prac, disp:disp }\n        this.nav().pub(obj);\n        this.nav().routeLevel('Disp'); },\n      doSelect: function(select) {\n        this.publish( 'Select',   select ); },\n      stylePrac: function( prac, hsv ) {\n        if( prac===false ) {} // Consume arg\n        return { backgroundColor:this.toRgbaHsv(hsv) }; },\n      styleDisp: function( disp, hsv ) {\n        if( this.disp!==disp ) {\n          return { color:'black', backgroundColor:this.toRgbaHsv(hsv) }; }\n        else {\n          return { color:'white', backgroundColor:'black' }; } },\n      filterPracs: function(pracs,komp) {\n        let filt = {}\n        for( let key in pracs ) {\n          let prac = pracs[key];\n          if( prac.row !== 'Dim' || komp === 'Prin' ) {\n            filt[key] = prac; } }\n        return filt;\n      } },\n    \n    mounted: function () {\n      this.komps = this.kompsTocs();\n      for( let key in this.komps ) {\n        let komp = this.komps[key];\n        if( komp.ikw ) {  // this.komps.hasOwnProperty(key) &&\n            komp.pracs = this.filterPracs( this.pracs(komp.comp), komp.comp );\n            this.subscribe( key, 'Tocs.vue', (obj) => {\n            //this.onComp(key);\n              if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n              else                   { this.onDisp(obj.prac,obj.disp); } } ); } }\n      this.subscribe( 'Nav', 'Tocs.vue', (obj) => {\n          this.onNav(obj); } ); }\n    }\n  \n   export default Tocs;\n   \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .tocs { font-family:@theme-font-family;\n    ul { padding:0; margin:0; list-style:none; align-self:start; display:grid;\n      li  { background-color:@theme-back-tocs-comp; padding-left:0.25rem; align-self:start;   // Comp\n            border-radius:0 24px 24px 0; margin:0.2rem 0.2rem 0.2rem 0.2rem;\n         i   { margin-right: 0.4rem; }\n         div { color:@theme-color; text-decoration:none; }\n         ul { font-size:@theme-tocs-size*0.60; font-weight:bold; padding:0; margin:0;\n           li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;            // Prac\n             i { margin-right: 0.3rem; }\n             a { color:@theme-high; }\n             ul { font-size:@theme-tocs-size*0.50; padding:0; margin:0 0 0 0.2rem;\n               li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2rem 0.2rem 0.2rem 0.2rem;       // Disp\n                 i { margin-right: 0.25rem; } }\n               li:hover { background-color:@theme-back!important; color:@theme-color-tocs-disp!important; } } } } } } }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Tocs$1 = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

/**
 *
 * Author: Gianluca Guarini
 * Contact: gianluca.guarini@gmail.com
 * Website: http://www.gianlucaguarini.com/
 * Twitter: @gianlucaguarini
 *
 * Copyright (c) Gianluca Guarini
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/

//

var script$3 = {

  data() { return { touch:null, elem:null, rviews:this.views() }; },
  
  methods:{
    show:function() {
      return this.$route.name===null } },
  
  mounted: function () {
    this.$nextTick( function() {  // Enable touch events inside all views
      // this.touch = new Touch();
      // this.elem  = this.$refs['View'];
      // this.touch.onNav( this.elem, this.nav() );
    } ); }
    
  };

/* script */
const __vue_script__$5 = script$3;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "View" },
    [
      _vm._l(_vm.rviews, function(view) {
        return [_c("router-view", { attrs: { name: view } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

//
//
//
//
//

var script$4 = {};

/* script */
const __vue_script__$6 = script$4;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "side" })
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Side = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
    undefined
  );

//
//
//
//
//

var script$5 = {};

/* script */
const __vue_script__$7 = script$5;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "pref" })
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Pref = normalizeComponent_1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    undefined,
    undefined
  );

//
//
//
//
//

var script$6 = {};

/* script */
const __vue_script__$8 = script$6;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "foot" })
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = undefined;
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Foot = normalizeComponent_1(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    undefined,
    undefined
  );

//
//
//
//
//

var script$7 = {};

/* script */
const __vue_script__$9 = script$7;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "trak" })
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return
    inject("data-v-52d499cd_0", { source: "\n.trak {\n}\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/vue/dash/Trak.vue"],"names":[],"mappings":";AAUA;AAAA","file":"Trak.vue","sourcesContent":["\n<template>\n  <div class=\"trak\"></div>\n</template>\n\n<script>\n  export default {}\n</script>\n\n<style type=\"module\">\n     .trak { }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  

  
  var Trak = normalizeComponent_1(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    browser,
    undefined
  );

//

let Dash = {
    name: 'dash',
    components: {
      'd-logo':Logo$1, 'd-menu':Menu, 'd-find':Find,
      'd-tocs':Tocs$1, 'd-view':View, 'd-side':Side,
      'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };

/* script */
const __vue_script__$a = Dash;

/* template */
var __vue_render__$a = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "dash" },
    [
      _c("d-logo", { attrs: { id: "logo" } }),
      _vm._v(" "),
      _c("d-menu", { attrs: { id: "menu" } }),
      _vm._v(" "),
      _c("d-find", { attrs: { id: "find" } }),
      _vm._v(" "),
      _c("d-tocs", { attrs: { id: "tocs" } }),
      _vm._v(" "),
      _c("d-view", { attrs: { id: "view" } }),
      _vm._v(" "),
      _c("d-side", { attrs: { id: "side" } }),
      _vm._v(" "),
      _c("d-pref", { attrs: { id: "pref" } }),
      _vm._v(" "),
      _c("d-foot", { attrs: { id: "foot" } }),
      _vm._v(" "),
      _c("d-trak", { attrs: { id: "trak" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-729eeae4_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11fr 85fr 4fr;\n  grid-template-rows: 10fr 85fr 5fr;\n  grid-template-areas: \"logo menu find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #menu {\n  grid-area: menu;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 2.5rem;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  font-size: 1.5rem;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;ECCA,iBAAA;ADCA;ACCA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;ADCA;ECCA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,+BAAA;EDCE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,oCAAoC;EACpC,iCAAiC;EACjC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;EACvB,iBAAiB;AACnB","file":"Dash.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11fr 85fr 4fr;\n  grid-template-rows: 10fr 85fr 5fr;\n  grid-template-areas: \"logo menu find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #menu {\n  grid-area: menu;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 2.5rem;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  font-size: 1.5rem;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n  font-size: 1.5rem;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-menu id=\"menu\"></d-menu>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from '../dash/Logo.vue';\n  import Menu from '../dash/Menu.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from '../dash/Tocs.vue';\n  import View from '../dash/View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-menu':Menu, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  .dash { font-family:@theme-font-family;\n   position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n   grid-template-columns: @theme-west  @theme-center @theme-east;\n   grid-template-rows:    @theme-north @theme-middle @theme-south;\n   grid-template-areas:\n     \"logo menu find\"\n     \"tocs view side\"\n     \"pref foot trak\";\n  \n  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; .theme-logo; }\n  #menu { grid-area:menu; justify-self:stretch; align-self:stretch; display:grid; .theme-menu; }\n  #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; .theme-find; }\n  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; .theme-tocs; }\n  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; .theme-view; }\n  #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; .theme-side; }\n  #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; .theme-pref; }\n  #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; .theme-foot; }\n  #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; .theme-trak; } }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//
//


let Math$1 = {

  data() { return { comp:'Math',
    maths:[
      { title:'MathML', key:'ML' },
      { title:'MathEQ', key:'EQ' } ] } },

  mounted: function () {} 

};

/* script */
const __vue_script__$b = Math$1;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Math", staticClass: "math" },
    [
      _vm.comp === "Math" ? _c("h1", [_vm._v("Mathematics")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.maths, function(math) {
        return [_c("router-view", { attrs: { name: _vm.comp + math.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;

  /* style */
  const __vue_inject_styles__$b = function (inject) {
    if (!inject) return
    inject("data-v-1abe94d8_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.math {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.math h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Math.vue","/Users/ax/Documents/prj/aug/vue/math/Math.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;ECCzB,iBAAA;ADCA;ACCA;EACA,uBAAA;EDCE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Math.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.math {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.math h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n<template>\n  <div class=\"math\" ref=\"Math\">\n    <h1 v-if=\"comp==='Math'\">Mathematics</h1>\n    <template v-for=\"math in maths\">\n      <router-view :name=\"comp+math.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  let Math = {\n\n    data() { return { comp:'Math',\n      maths:[\n        { title:'MathML', key:'ML' },\n        { title:'MathEQ', key:'EQ' } ] } },\n\n    mounted: function () {} \n\n  }\n\n  export default Math;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .math {   position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* style inject SSR */
  

  
  var Math$2 = normalizeComponent_1(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//


let Geom = {

  data() { return { comp:'Geom',
    geoms:[
      { title:'Geom2D', key:'2D' },
      { title:'Geom3D', key:'3D' },
      { title:'Geom4D', key:'4D' } ] } },

  mounted: function () {}

};

/* script */
const __vue_script__$c = Geom;

/* template */
var __vue_render__$c = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Geom", staticClass: "geom" },
    [
      _vm.comp === "Geom" ? _c("h1", [_vm._v("Geometric Algebra")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.geoms, function(geom) {
        return [_c("router-view", { attrs: { name: _vm.comp + geom.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$c = [];
__vue_render__$c._withStripped = true;

  /* style */
  const __vue_inject_styles__$c = function (inject) {
    if (!inject) return
    inject("data-v-1ff515c3_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.geom {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.geom h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Geom.vue","/Users/ax/Documents/prj/aug/vue/geom/Geom.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;ECCA,uBAAA;EDCE,iBAAiB;ACCnB;AACA;EDCE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Geom.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.geom {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.geom h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n\n\n<template>\n  <div class=\"geom\" ref=\"Geom\">\n    <h1 v-if=\"comp==='Geom'\">Geometric Algebra</h1>\n    <template v-for=\"geom in geoms\">\n      <router-view :name=\"comp+geom.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Geom = {\n\n    data() { return { comp:'Geom',\n      geoms:[\n        { title:'Geom2D', key:'2D' },\n        { title:'Geom3D', key:'3D' },\n        { title:'Geom4D', key:'4D' } ] } },\n\n    mounted: function () {}\n\n  }\n\n  export default Geom;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .geom {   position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n  \n</style>;"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$c = undefined;
  /* module identifier */
  const __vue_module_identifier__$c = undefined;
  /* functional template */
  const __vue_is_functional_template__$c = false;
  /* style inject SSR */
  

  
  var Geom$1 = normalizeComponent_1(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//


var script$8 = {

  props: { comp:String, pages:Object },
  
  data() { return { page:"" } },
  
  methods: {
    onPage: function (page) {
      // console.log( 'Tabs.onPage()', { page:page, tabs:this.page } );
      this.page = page; },
    doPage: function (page) {
      this.nav().pub( { page:page.name } ); },
    clPage: function (name) {
      return this.page===name ? 'tab-active' : 'tab'; } },

  beforeMount: function() {
    this.onPage(this.nav().page); },

  mounted: function() {
      this.subscribe(  "Nav", 'Tabs', (obj) => {
        this.onPage(obj.page); } ); }
  };

/* script */
const __vue_script__$d = script$8;

/* template */
var __vue_render__$d = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "tabs" },
    [
      _vm._l(_vm.pages, function(page) {
        return [
          _c(
            "div",
            {
              class: _vm.clPage(page.name),
              on: {
                click: function($event) {
                  return _vm.doPage(page)
                }
              }
            },
            [_vm._v(_vm._s(page.name))]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$d = [];
__vue_render__$d._withStripped = true;

  /* style */
  const __vue_inject_styles__$d = function (inject) {
    if (!inject) return
    inject("data-v-4436d754_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;ACCnB;ADCA;ECCA,iBAAA;AACA;AACA;EACA,uBAAA;EACA,iBAAA;AACA;AACA;EACA,uBAAA;EDCE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,UAAU;EACV,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Tabs.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5rem;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"tabs\">\n    <template v-for=\"page in pages\">\n      <div :class=\"clPage(page.name)\" @click=\"doPage(page)\">{{page.name}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { comp:String, pages:Object },\n    \n    data() { return { page:\"\" } },\n    \n    methods: {\n      onPage: function (page) {\n        // console.log( 'Tabs.onPage()', { page:page, tabs:this.page } );\n        this.page = page; },\n      doPage: function (page) {\n        this.nav().pub( { page:page.name } ); },\n      clPage: function (name) {\n        return this.page===name ? 'tab-active' : 'tab'; } },\n\n    beforeMount: function() {\n      this.onPage(this.nav().page); },\n\n    mounted: function() {\n        this.subscribe(  \"Nav\", 'Tabs', (obj) => {\n          this.onPage(obj.page); } ); }\n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .tabs { position:absolute; left:0; top:0; width:100%; height:5%;\n          background-color:@theme-back; font-size:@theme-tab-size;\n    .tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;\n      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;\n      border-top:@theme-color solid thin; border-right:@theme-color solid thin;\n                  background-color:@theme-back;  color:@theme-color;}\n    .tab:hover  {         background-color:@theme-color; color:@theme-back; }\n    .tab-active { .tab(); background-color:@theme-color; color:@theme-back; } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$d = undefined;
  /* module identifier */
  const __vue_module_identifier__$d = undefined;
  /* functional template */
  const __vue_is_functional_template__$d = false;
  /* style inject SSR */
  

  
  var Tabs = normalizeComponent_1(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d,
    __vue_scope_id__$d,
    __vue_is_functional_template__$d,
    __vue_module_identifier__$d,
    browser,
    undefined
  );

//

let Note = {
  
  components:{ 'n-tabs':Tabs },

  data() {
    return { comp:'Note', tab:'Standard', pages:[
        { title:'Standard', key:'Stand' },
        { title:'Embed',    key:'Embed' },
        { title:'Maths',    key:'Maths' },
        { title:'Ganja',    key:'Ganja' },
      ] } },
  
  methods: {
    
    name: function(page) {
      return this.comp+page.key; } },
  
};

/* script */
const __vue_script__$e = Note;

/* template */
var __vue_render__$e = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "note" },
    [
      _c("n-tabs", { attrs: { comp: _vm.comp, pages: _vm.pages } }),
      _vm._v(" "),
      _vm.comp === "Note" ? _c("h1", [_vm._v("Notebooks")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.pages, function(page) {
        return [
          _c("router-view", { attrs: { name: _vm.name(page), id: page.key } })
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$e = [];
__vue_render__$e._withStripped = true;

  /* style */
  const __vue_inject_styles__$e = function (inject) {
    if (!inject) return
    inject("data-v-39ba7dcc_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.note {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.note h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Note.vue","/Users/ax/Documents/prj/aug/vue/note/Note.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;ECCA,iBAAA;AACA;AACA;EDCE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Note.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.note {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.note h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n\n<template>\n  <div class=\"note\">\n    <n-tabs :comp=\"comp\" :pages=\"pages\"></n-tabs>  <!-- init=\"Stand\" -->\n    <h1 v-if=\"comp==='Note'\">Notebooks</h1>\n    <template v-for=\"page in pages\">\n      <router-view :name=\"name(page)\" :id=\"page.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Tabs  from '../elem/Tabs.vue';\n  \n  let Note = {\n    \n    components:{ 'n-tabs':Tabs },\n\n    data() {\n      return { comp:'Note', tab:'Standard', pages:[\n          { title:'Standard', key:'Stand' },\n          { title:'Embed',    key:'Embed' },\n          { title:'Maths',    key:'Maths' },\n          { title:'Ganja',    key:'Ganja' },\n        ] } },\n    \n    methods: {\n      \n      name: function(page) {\n        return this.comp+page.key; } },\n    \n  }\n  \n  export default Note;\n  \n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  .note { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$e = undefined;
  /* module identifier */
  const __vue_module_identifier__$e = undefined;
  /* functional template */
  const __vue_is_functional_template__$e = false;
  /* style inject SSR */
  

  
  var Note$1 = normalizeComponent_1(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//


let Data$2 = {

  data() { return { comp:'Data', datas:[
    { title:'Tables', key:'Tables' },
    { title:'Pivots', key:'Pivots' } ] } },

  methods: {
    isData: function() {
      return this.comp === 'Data'; } },

  mounted: function () {}

};

/* script */
const __vue_script__$f = Data$2;

/* template */
var __vue_render__$f = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Data", staticClass: "data" },
    [
      _c("h1", { attrs: { "v-if": _vm.isData() } }, [_vm._v("Data")]),
      _vm._v(" "),
      _vm._l(_vm.datas, function(dat) {
        return [_c("router-view", { attrs: { name: dat.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$f = [];
__vue_render__$f._withStripped = true;

  /* style */
  const __vue_inject_styles__$f = function (inject) {
    if (!inject) return
    inject("data-v-2441a2ee_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.data {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Data.vue","/Users/ax/Documents/prj/aug/vue/data/Data.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;ECCzB,iBAAA;ADCA;ACCA;EACA,uBAAA;EDCE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,eAAe;AACjB","file":"Data.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.data {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 2rem;\n}\n","\n\n<template>\n  <div class=\"data\" ref=\"Data\">\n    <h1 :v-if=\"isData()\">Data</h1>\n    <template v-for=\"dat in datas\">\n      <router-view :name=\"dat.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Data = {\n\n    data() { return { comp:'Data', datas:[\n      { title:'Tables', key:'Tables' },\n      { title:'Pivots', key:'Pivots' } ] } },\n\n    methods: {\n      isData: function() {\n        return this.comp === 'Data'; } },\n\n    mounted: function () {}\n\n  }\n\n  export default Data;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .data {   position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:@theme-h1-size; } }\n  \n</style>;"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$f = undefined;
  /* module identifier */
  const __vue_module_identifier__$f = undefined;
  /* functional template */
  const __vue_is_functional_template__$f = false;
  /* style inject SSR */
  

  
  var Data$3 = normalizeComponent_1(
    { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
    browser,
    undefined
  );

//

 let Home = {
  
  components:{ 'h-btns':Btns },

data() { return { comp:'Draw', key:'Axes', btns:{
  Axes:    { title:'Axes',    key:'Axes',    obj:null, pos:[ 5,10,0,10], back:'primary',   check:true              },
  Chord:   { title:'Chord',   key:'Chord',   obj:null, pos:[30,10,0,20], back:'secondary', img:'brew/AutoDrip.jpg' },
  Cluster: { title:'Cluster', key:'Cluster', obj:null, pos:[50,10,0,10], back:'success',   icon:'fas fa-circle'    },
  Link:    { title:'Link',    key:'Link',    obj:null, pos:[ 5,25,0,20], back:'info',      check:true              },
  Radar:   { title:'Radar',   key:'Radar',   obj:null, pos:[ 5,40,0,10], back:'warning',   icon:'fas fa-circle'    },
  Radial:  { title:'Radial',  key:'Radial',  obj:null, pos:[ 5,55,0,20], back:'danger',    img:'brew/AutoDrip.jpg' },
  Tree:    { title:'Tree',    key:'Tree',    obj:null, pos:[40,40,0,30], back:'light',     icon:'fas fa-circle'    },
  Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, pos:[60,60,0,30], back:'success',   img:'brew/AutoDrip.jpg' }
  } } },

 mounted: function () {
     this.publish( 'Tocs', 'Close' ); }
 
};

Home.Dash = Dash$1;
Home.Math = Math$2;
Home.Geom = Geom$1;
Home.Note = Note$1;
Home.Data = Data$3;

/* script */
const __vue_script__$g = Home;

/* template */
var __vue_render__$g = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "home" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "elem" },
      [
        _c("h-btns", {
          attrs: {
            comp: "Home",
            btns: _vm.btns,
            init: "Axes",
            back: "#3B5999",
            active: "tan"
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _vm._m(1)
  ])
};
var __vue_staticRenderFns__$g = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "head" }, [
      _c("div", [
        _c("h1", [_vm._v("Welcome to Augmentation Home Page")]),
        _vm._v(" "),
        _c("h2", [_vm._v("Choose an Application Component on the Left")])
      ])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "foot" }, [
      _c("div", [_c("h1", [_vm._v("Axiom Architectures")])])
    ])
  }
];
__vue_render__$g._withStripped = true;

  /* style */
  const __vue_inject_styles__$g = function (inject) {
    if (!inject) return
    inject("data-v-138fcd7a_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.home {\n  display: grid;\n  grid-template-columns: 100fr;\n  grid-template-rows: 10fr 80fr 10fr;\n  grid-template-areas: \"head\" \"elem\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.head h1 {\n  font-size: 2rem;\n}\n.elem {\n  grid-area: elem;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n}\n.elem h1 {\n  font-size: 2rem;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.foot h1 {\n  font-size: 2rem;\n}\n", map: {"version":3,"sources":["Home.vue","/Users/ax/Documents/prj/aug/pub/app/augm/Home.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,aAAa;EACb,4BAA4B;EAC5B,kCAAkC;ECCpC,yCAAA;EDCE,kBAAkB;ECCpB,OAAA;EACA,MAAA;EDCE,QAAQ;ECCV,SAAA;EACA,uBAAA;EDCE,YAAY;ACCd;AACA;EACA,eAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,kBAAA;EDCE,aAAa;ECCf,qBAAA;EACA,mBAAA;AACA;ADCA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,YAAY;AACd;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB","file":"Home.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.home {\n  display: grid;\n  grid-template-columns: 100fr;\n  grid-template-rows: 10fr 80fr 10fr;\n  grid-template-areas: \"head\" \"elem\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.head h1 {\n  font-size: 2rem;\n}\n.elem {\n  grid-area: elem;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n}\n.elem h1 {\n  font-size: 2rem;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.foot h1 {\n  font-size: 2rem;\n}\n","\n<template>\n  <div class=\"home\">\n    <div class=\"head\">\n      <div>\n        <h1>Welcome to Augmentation Home Page</h1>\n        <h2>Choose an Application Component on the Left</h2>\n      </div>\n    </div>\n    <div class=\"elem\">\n      <h-btns comp=\"Home\" :btns=\"btns\" init=\"Axes\" back=\"#3B5999\" active=\"tan\"></h-btns>\n    </div>\n    <div class=\"foot\">\n      <div>\n        <h1>Axiom Architectures</h1>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Btns from '../../../vue/elem/Btns.vue';\n  \n   let Home = {\n    \n    components:{ 'h-btns':Btns },\n\n  data() { return { comp:'Draw', key:'Axes', btns:{\n    Axes:    { title:'Axes',    key:'Axes',    obj:null, pos:[ 5,10,0,10], back:'primary',   check:true              },\n    Chord:   { title:'Chord',   key:'Chord',   obj:null, pos:[30,10,0,20], back:'secondary', img:'brew/AutoDrip.jpg' },\n    Cluster: { title:'Cluster', key:'Cluster', obj:null, pos:[50,10,0,10], back:'success',   icon:'fas fa-circle'    },\n    Link:    { title:'Link',    key:'Link',    obj:null, pos:[ 5,25,0,20], back:'info',      check:true              },\n    Radar:   { title:'Radar',   key:'Radar',   obj:null, pos:[ 5,40,0,10], back:'warning',   icon:'fas fa-circle'    },\n    Radial:  { title:'Radial',  key:'Radial',  obj:null, pos:[ 5,55,0,20], back:'danger',    img:'brew/AutoDrip.jpg' },\n    Tree:    { title:'Tree',    key:'Tree',    obj:null, pos:[40,40,0,30], back:'light',     icon:'fas fa-circle'    },\n    Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, pos:[60,60,0,30], back:'success',   img:'brew/AutoDrip.jpg' }\n    } } },\n\n   mounted: function () {\n       this.publish( 'Tocs', 'Close' ); }\n   \n  }\n\n  import Dash from '../../../vue/dash/Dash.vue';\n  import Math from '../../../vue/math/Math.vue';\n  import Geom from '../../../vue/geom/Geom.vue';\n  import Note from '../../../vue/note/Note.vue';\n  import Data from '../../../vue/data/Data.vue';\n\n  Home.Dash = Dash;\n  Home.Math = Math;\n  Home.Geom = Geom;\n  Home.Note = Note;\n  Home.Data = Data;\n  \n  export default Home;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../../pub/css/themes/theme.less';\n  \n  .grid3x1() { display:grid; grid-template-columns:100fr; grid-template-rows:10fr 80fr 10fr;\n      grid-template-areas:\"head\" \"elem\" \"foot\"; }\n  \n  .home { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;\n    background-color:@theme-back; color:@theme-color; }\n\n  .head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;\n          justify-self:stretch; align-self:stretch;\n    h1 { font-size:@theme-h1-size; } }\n  \n  .elem { grid-area:elem; position:relative; left:0; top:0; right:0; height:100%;\n    h1 { font-size:@theme-h1-size; } }\n\n  .foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;\n          justify-self:stretch; align-self:stretch;\n    h1 { font-size:@theme-h1-size; } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$g = undefined;
  /* module identifier */
  const __vue_module_identifier__$g = undefined;
  /* functional template */
  const __vue_is_functional_template__$g = false;
  /* style inject SSR */
  

  
  var Home$1 = normalizeComponent_1(
    { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
    __vue_inject_styles__$g,
    __vue_script__$g,
    __vue_scope_id__$g,
    __vue_is_functional_template__$g,
    __vue_module_identifier__$g,
    browser,
    undefined
  );

export default Home$1;
