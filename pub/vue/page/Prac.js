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

var Build,
  hasProp$2 = {}.hasOwnProperty;

Build = class Build {
  // ---- Class Methods for Practices ----
  static create(data, type) {
    switch (type) {
      case 'Pack':
        return Build.createPacks(data);
      case 'Prac':
        return Build.createPracs(data);
      default:
        return data;
    }
  }

  static createPacks(data) {
    var key, pack;
    for (key in data) {
      pack = data[key];
      if (!(Util$1.isChild(key))) {
        continue;
      }
      if (pack['name'] == null) {
        pack['name'] = key;
      }
      Build.createPracs(pack);
    }
    return data;
  }

  static createPracs(data) {
    var base, bkey, ikey, item, pkey, pract, skey, study, tkey, topic;
    for (pkey in data) {
      pract = data[pkey];
      if (!(Util$1.isChild(pkey))) {
        continue;
      }
      if (pract['name'] == null) {
        pract['name'] = pkey;
      }
      for (skey in pract) {
        study = pract[skey];
        if (!(Util$1.isChild(skey))) {
          continue;
        }
        if (study['name'] == null) {
          study['name'] = skey;
        }
        for (tkey in study) {
          topic = study[tkey];
          if (!(Util$1.isChild(tkey))) {
            continue;
          }
          if (topic['name'] == null) {
            topic['name'] = tkey;
          }
          for (ikey in topic) {
            item = topic[ikey];
            if (!(Util$1.isChild(ikey))) {
              continue;
            }
            if (item['name'] == null) {
              item['name'] = ikey;
            }
            for (bkey in item) {
              base = item[bkey];
              if (Util$1.isChild(bkey)) {
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

  static colPractices(batch) {
    var cols, i, len, plane, ref;
    cols = batch.Cols.data['Cols'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      plane = ref[i];
      batch[plane].data['Cols'] = cols;
    }
  }

  static rowPractices(batch) {
    var i, len, plane, ref, rows;
    rows = batch.Rows.data['Rows'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      plane = ref[i];
      batch[plane].data['Rows'] = rows;
    }
  }

  static copyAtt(src, des) {
    var key, obj;
    for (key in src) {
      if (!hasProp$2.call(src, key)) continue;
      obj = src[key];
      if (!Util$1.isChild(key)) {
        des[key] = obj;
      }
    }
    return des;
  }

  // for dir in [ 'west', 'north', 'east', 'south'   ]
  // Call after all practices and studies have been read in
  // Not used because we store studies with practices in /pract
  static expandStudys(groups, studies) {
    var gkey, group, pkey, pract, skey, study;
    for (gkey in groups) {
      group = groups[gkey];
      if (Util$1.isChild(gkey)) {
        for (pkey in group) {
          pract = group[pkey];
          if (Util$1.isChild(pkey)) {
            for (skey in pract) {
              study = pract[skey];
              if (Util$1.isChild(skey)) {
                if (studies[skey] != null) {
                  pract[skey] = studies[skey];
                }
              }
            }
          }
        }
      }
    }
  }

  // Call after all practices and topics have been read in
  static expandTopics(groups, topics, log = false) {
    var gkey, group, pkey, pract, skey, study, tkey, topic;
    for (gkey in groups) {
      group = groups[gkey];
      if (!(Util$1.isChild(gkey))) {
        continue;
      }
      if (log) {
        console.log(gkey);
      }
      for (pkey in group) {
        pract = group[pkey];
        if (!(Util$1.isChild(pkey))) {
          continue;
        }
        if (log) {
          console.log("  ", pkey);
        }
        for (skey in pract) {
          study = pract[skey];
          if (!(Util$1.isChild(skey))) {
            continue;
          }
          if (log) {
            console.log("    ", skey);
          }
          for (tkey in study) {
            topic = study[tkey];
            if (Util$1.isChild(tkey)) {
              if (topics[tkey] != null) {
                if (log) {
                  console.log("      ", tkey, "match");
                }
                if (topics[tkey]['name'] == null) {
                  topics[tkey]['name'] = tkey;
                }
                study[tkey] = topics[tkey];
              } else {
                if (log) {
                  console.log("      ", tkey);
                }
              }
            }
          }
        }
      }
    }
  }

  // Build instance
  constructor(batch1, plane1) {
    this.batch = batch1;
    this.plane = plane1;
    //@Spec   = @batch.Muse.data
    this.None = {
      name: "None"
    };
    Util$1.noop(this.toGroups, this.setAdjacents, Build.copyAtt);
  }

  getSpecs(plane) {
    if (this.batch[plane] != null) {
      return this.batch[plane].data;
    } else {
      console.error(`Build.getSpecs() ${plane}.json has not been input`);
      return null;
    }
  }

  toGroups(groups) {
    var group, key;
    for (key in groups) {
      group = groups[key];
      group['key'] = key;
      group['name'] = group.name != null ? group.name : key;
      group['border'] = group['border'] != null ? group['border'] : '0';
    }
    return groups;
  }

  toStudies(prac) {
    var skey, studies, study;
    studies = {};
    for (skey in prac) {
      study = prac[skey];
      if (Util$1.isChild(skey)) {
        studies[skey] = study;
      }
    }
    return this.toOrder(studies);
  }

  toOrder(studies, dirs = ['north', 'west', 'east', 'south']) {
    var dir, i, len, ordered, skey, study;
    ordered = {};
    for (i = 0, len = dirs.length; i < len; i++) {
      dir = dirs[i];
      for (skey in studies) {
        study = studies[skey];
        if (study.dir === dir) {
          ordered[skey] = study;
        }
      }
    }
    return ordered;
  }

  combine() {
    var arg, i, key, len, obj, val;
    obj = {};
    for (i = 0, len = arguments.length; i < len; i++) {
      arg = arguments[i];
      for (key in arg) {
        if (!hasProp$2.call(arg, key)) continue;
        val = arg[key];
        obj[key] = val;
      }
    }
    return obj;
  }

  west(col) {
    switch (col) {
      case 'Embrace':
        return 'Encourage';
      case 'Innovate':
        return 'Embrace';
      case 'Encourage':
        return 'Innovate';
      default:
        return 'None';
    }
  }

  east(col) {
    switch (col) {
      case 'Embrace':
        return 'Innovate';
      case 'Innovate':
        return 'Encourage';
      case 'Encourage':
        return 'Embrace';
      default:
        return 'None';
    }
  }

  north(row) {
    switch (row) {
      case 'Learn':
        return 'Share';
      case 'Do':
        return 'Learn';
      case 'Share':
        return 'Do';
      default:
        return 'None';
    }
  }

  south(row) {
    switch (row) {
      case 'Learn':
        return 'Do';
      case 'Do':
        return 'Share';
      case 'Share':
        return 'Learn';
      default:
        return 'None';
    }
  }

  prev(plane) {
    switch (plane) {
      case 'Info':
        return 'Wise';
      case 'Know':
        return 'Info';
      case 'Wise':
        return 'Know';
      default:
        return 'None';
    }
  }

  next(plane) {
    switch (plane) {
      case 'Info':
        return 'Know';
      case 'Know':
        return 'Wise';
      case 'Wise':
        return 'Info';
      default:
        return 'None';
    }
  }

  adjacentPractice(prac, dir) {
    var adj, col, key, pln, pracs, row;
    if ((prac == null) || (prac.name == null) || prac.name === 'None' || (prac.column == null)) {
      // console.log( 'adjacentPractice', { prac:prac, dir:dir } )
      return this.None;
    }
    col = "";
    row = "";
    pln = "";
    [col, row, pln] = (function() {
      switch (dir) {
        case 'west':
        case 'nw':
        case 'sw':
          return [this.west(prac.column), prac.row, prac.plane];
        case 'east':
        case 'sw':
        case 'se':
          return [this.east(prac.column), prac.row, prac.plane];
        case 'north':
          return [prac.column, this.north(prac.row), prac.plane];
        case 'south':
          return [prac.column, this.south(prac.row), prac.plane];
        case 'prev':
          return [prac.column, prac.row, this.prev(prac.plane)];
        case 'next':
          return [prac.column, prac.row, this.next(prac.plane)];
        default:
          return ["None", "None", "None"];
      }
    }).call(this);
    if ([col, row, pln] === ["None", "None", "None"]) {
      //console.log( 'adjacentPractice[col,row,pln]', [col,row,pln] )
      return this.None;
    }
    //racs = @getPractices( pln )
    pracs = this.batch[pln].data[pln].pracs;
    for (key in pracs) {
      if (!hasProp$2.call(pracs, key)) continue;
      adj = pracs[key];
      if (Util$1.isChild(key)) {
        if (adj.column === col && adj.row === row && adj.plane === pln) {
          return adj;
        }
      }
    }
    return this.None;
  }

  adjacentStudies(practice, dir) {
    var adjPrac;
    adjPrac = this.adjacentPractice(practice, dir);
    if (adjPrac.name !== 'None') {
      return this.toStudies(adjPrac);
    } else {
      return {};
    }
  }

  connectName(practice, dir, reverse) {
    var adjacent;
    adjacent = this.adjacentPractice(practice, dir);
    if (adjacent.name !== 'None') {
      return this.centerBegEnd(practice.name, adjacent.name, reverse);
    } else {
      return 'None' + '\n' + 'None';
    }
  }

  centerBegEnd(beg, end, reverse) {
    var b, e;
    b = end.length > beg.length ? Util$1.indent((end.length - beg.length) / 2) + beg : beg;
    e = beg.length > end.length ? Util$1.indent((beg.length - end.length) / 2) + end : end;
    // console.log( 'Build.centerBegEnd()', { beg:beg, end:end, blen:beg.length, elen:end.length, b:b, e:e,be:b+'\n'+e })
    if (!reverse) {
      return b + '\n' + e;
    } else {
      return e + '\n' + b;
    }
  }

  setAdjacents(practice) {
    practice.west = this.adjacentPractice(practice, 'west');
    practice.east = this.adjacentPractice(practice, 'east');
    practice.north = this.adjacentPractice(practice, 'north');
    practice.south = this.adjacentPractice(practice, 'south');
    practice.prev = this.adjacentPractice(practice, 'prev');
    practice.next = this.adjacentPractice(practice, 'next');
  }

  getPractices(plane) {
    if ((this.batch[plane] != null) && (this.batch[plane].data[plane] != null)) {
      return this.batch[plane].data[plane];
    } else {
      console.error('Build.getPractices()', plane);
      return {};
    }
  }

  getPractices2(plane) {
    Main.Batch[compk].data[compk].pracs;
    if ((this.batch[plane] != null) && (this.batch[plane].data[plane] != null)) {
      return this.batch[plane].data[plane];
    } else {
      console.error('Build.getPractices()', plane);
      return {};
    }
  }

  getPractice(row, column, plane = this.plane) {
    var pkey, prac, practices;
    practices = this.getPractices(plane);
    for (pkey in practices) {
      if (!hasProp$2.call(practices, pkey)) continue;
      prac = practices[pkey];
      if (Util$1.isChild(pkey) && prac.column === column && prac.row === row) {
        return prac;
      }
    }
    console.error('Prac.getPractice() practice not found for', {
      column: column,
      row: row,
      plane: plane
    });
    return null; // Landmine
  }

  getPracticeStudy(row, column, dir, plane = this.plane) {
    var practice, study;
    practice = this.getPractice(row, column, plane);
    study = this.getDir(practice, dir);
    return study;
  }

  getDir(practice, dir) {
    var skey, study;
    for (skey in practice) {
      if (!hasProp$2.call(practice, skey)) continue;
      study = practice[skey];
      if (Util$1.isChild(skey)) {
        if (study.dir === dir) {
          return study;
        }
      }
    }
    return null;
  }

  getDim(cname, dir) {
    var col, dim, key;
    col = this.getCol(cname);
    for (key in col) {
      dim = col[key];
      if (Util$1.isChild(key)) {
        if (dim.dir === dir) {
          return key;
        }
      }
    }
    return this.None;
  }

  getCol(cname) {
    return this.batch.Cols.data['Cols'][cname];
  }

  logPlanes() {
    var i, keyBase, keyItem, keyPlane, keyPractice, keyStudy, keyTopic, len, objBase, objItem, objPractice, objStudy, objTopic, practices, ref;
    console.log('----- Beg Log Planes  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      keyPlane = ref[i];
      console.log("Plane: ", keyPlane);
      practices = this.getPractices(keyPlane);
      for (keyPractice in practices) {
        if (!hasProp$2.call(practices, keyPractice)) continue;
        objPractice = practices[keyPractice];
        if (!(Util$1.isChild(keyPractice))) {
          continue;
        }
        console.log("  Practice: ", keyPractice);
        for (keyStudy in objPractice) {
          if (!hasProp$2.call(objPractice, keyStudy)) continue;
          objStudy = objPractice[keyStudy];
          if (!(Util$1.isChild(keyStudy))) {
            continue;
          }
          console.log("    Study: ", keyStudy);
          for (keyTopic in objStudy) {
            if (!hasProp$2.call(objStudy, keyTopic)) continue;
            objTopic = objStudy[keyTopic];
            if (!(Util$1.isChild(keyTopic))) {
              continue;
            }
            console.log("      Topic: ", keyTopic);
            for (keyItem in objTopic) {
              if (!hasProp$2.call(objTopic, keyItem)) continue;
              objItem = objTopic[keyItem];
              if (!(Util$1.isChild(keyItem))) {
                continue;
              }
              console.log("        Item: ", keyItem);
              for (keyBase in objItem) {
                if (!hasProp$2.call(objItem, keyBase)) continue;
                objBase = objItem[keyBase];
                if (Util$1.isChild(keyBase)) {
                  console.log("          Base: ", keyBase);
                }
              }
            }
          }
        }
      }
    }
    console.log('----- End Log Planes ------');
  }

  logBatch(batch) {
    var batKey, batObj, i, j, keyPractice, keyStudy, len, len1, objPractice, objStudy, packKey, packObj, ref, ref1;
    console.log('----- Beg Log Batch  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      batKey = ref[i];
      console.log("Batch File: ", batKey);
      batObj = batch[batKey].data;
      ref1 = ['Info', 'Know', 'Wise', 'Cols', 'Rows'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        packKey = ref1[j];
        packObj = batObj[packKey];
        console.log("  Pack: ", packKey, packObj);
        for (keyPractice in packObj) {
          if (!hasProp$2.call(packObj, keyPractice)) continue;
          objPractice = packObj[keyPractice];
          if (!(Util$1.isChild(keyPractice))) {
            continue;
          }
          console.log("    Practice: ", keyPractice);
          for (keyStudy in objPractice) {
            if (!hasProp$2.call(objPractice, keyStudy)) continue;
            objStudy = objPractice[keyStudy];
            if (Util$1.isChild(keyStudy)) {
              console.log("      Study: ", keyStudy);
            }
          }
        }
      }
    }
    console.log('----- End Log Batch ------');
  }

  logByConduit() {
    var col, dir, i, infod, infop, j, k, knowd, knowp, len, len1, len2, ref, ref1, ref2, row, wised, wisep;
    console.log('----- Beg Log By Conduit  ------');
    ref = ['Learn', 'Do', 'Share'];
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      ref1 = ['Embrace', 'Innovate', 'Encourage'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        col = ref1[j];
        infop = this.getPractice(row, col, 'Info');
        knowp = this.getPractice(row, col, 'Know');
        wisep = this.getPractice(row, col, 'Wise');
        console.log(infop.name, knowp.name, wisep.name);
        ref2 = ['west', 'north', 'east', 'south'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          dir = ref2[k];
          infod = this.getDir(infop, dir);
          knowd = this.getDir(knowp, dir);
          wised = this.getDir(wisep, dir);
          console.log('    ', infod.name, knowd.name, wised.name);
        }
      }
    }
    console.log('----- End Log By Conduit  ------');
  }

  logByColumn() {
    var cname, dim, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, plane, ref, ref1, ref2, share, sprac;
    console.log('----- Beg Log By Column  ------');
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      cname = ref[i];
      console.log(cname);
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        dim = this.getDim(cname, dir);
        console.log('  ', dir, dim.name, 'Learn', 'Do', 'Share');
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          plane = ref2[k];
          lprac = this.getPractice('Learn', cname, plane);
          dprac = this.getPractice('Do', cname, plane);
          sprac = this.getPractice('Share', cname, plane);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          console.log('    ', plane + ':', dim.name, learn.name, doit.name, share.name);
        }
      }
    }
    console.log('----- End Log By Column  ------');
  }

  logAsTable() {
    var cname, dim, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, obj, plane, ref, ref1, ref2, share, sprac;
    console.log('----- Beg Log As Table  ------');
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      cname = ref[i];
      console.log(col);
      obj = {};
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        dim = this.getDim(cname, dir);
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          plane = ref2[k];
          lprac = this.getPractice('Learn', cname, plane);
          dprac = this.getPractice('Do', cname, plane);
          sprac = this.getPractice('Share', cname, plane);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          obj[plane] = {
            Dimension: dim.name,
            Learn: learn.name,
            Do: doit.name,
            Share: share.name
          };
        }
      }
      // data.push( [ pln, prin, learn.name, doit.name, share.name ] )
      // console.table( data, ['Plane','Principle','Learn', 'Do', 'Share'])
      console.table(obj);
    }
    console.log('----- End Log As Table  ------');
  }

  saveAsHtml(name) {
    var col, dim, dir, doit, dprac, htm, i, j, k, learn, len, len1, len2, lprac, plane, ref, ref1, ref2, share, sprac;
    htm = `<!DOCTYPE html>\n<html lang="en">\n  <head><meta charset="utf-8">\n    <title>${name}</title>`;
    htm += `\n    <link href="${name}.css" rel="stylesheet" type="text/css"/>\n  </head>\n  <body>\n`;
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      col = ref[i];
      htm += `    <div class="col">${col}</div>\n`;
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        dim = this.getDim(col, dir);
        htm += "    <table>\n      <thead>\n        ";
        htm += `<tr><th>Plane</th><th>${dim}</th><th>Learn</th><th>Do</th><th>Share</th></tr>\n      </thead>\n      <tbody>\n`;
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          plane = ref2[k];
          lprac = this.getPractice('Learn', col, plane);
          dprac = this.getPractice('Do', col, plane);
          sprac = this.getPractice('Share', col, plane);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          htm += `        <tr><td>${plane}:</td><td>${dim}</td><td>${learn.name}</td><td>${doit.name}</td><td>${share.name}</td></tr>\n`;
        }
        htm += "      </tbody>\n    </table>\n";
      }
    }
    htm += "  </body>\n</html>\n";
    Data$1.saveHtml(name, htm);
  }

};

/*
getPrevNextPlanes:( plane ) ->

isPractice:( key, plane=@plane ) ->
@getPractices(plane)[key]?

logAdjacentPractices:() ->
@setAdjacents( @None )
for key, plane of @Planes
practices = @getPractices( key )
for own pkey, p of practices  when Util.isChild(pkey)
  @setAdjacents( p )
 * console.log( { p:key, column:p.column, west:p.west.name, east:p.east.name, north:p.north.name, south:p.south.name, prev:p.prev.name, next:p.next.name } )
return

 */
var Build$1 = Build;

//

  var script = {
    
    props: { pcomp:{ type:String, default:'None' } },
    
    data() { return {
      comp:'None', prac:'All', disp:'All', tab:'Practices', practices:{},
      rows: {
        Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
        Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cogs" },
        Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
    
    methods: {
      isPrac: function (prac) {
        return this.prac===prac || this.prac==='All' },
      isDisp: function (disp) {
        return this.disp===disp || this.disp==='All' },
      isRows: function () {
        return this.prac==='All' },
      pubTab: function (tab) {
        this.tab = tab; },
      classTab: function (tab) {
        return this.tab===tab ? 'tab-active' : 'tab' },
      pubPrac: function (prac) {
        this.publish( this.comp, { prac:prac, disp:'All' } ); },
      pubDisp: function (prac,disp) {
        this.publish( this.comp, { prac:prac, disp:disp  } ); },
      onPrac: function (prac) {
        this.prac = prac; this.disp='All'; },
      onDisp: function (prac,disp) {
        this.prac = prac; this.disp=disp; },
      onNavd: function (dir) {
        console.log( 'Prac.onNavd() Beg', this.prac, dir );
        if( this.prac !== 'All') {
          let prc = this.pracs(this.comp)[this.prac];
          let adj = this.build.adjacentPractice(prc,dir);
          console.log( 'Prac.onNavd() Adj', adj.name, dir, adj.plane );
          if( adj.name !== 'None' ) {
            if( adj.plane !== this.comp ) {
              this.publish( 'Tocs', adj.plane ); }
            else {
              this.onPrac(adj.name); } } } },
      onTabs: function (tab) {
        if( tab==='Practices' && this.tab==='Practices' && this.prac!=='All' ) {
          this.onPrac('All'); }
        this.tab = tab; },
      pracDir: function(dir) {
        return this.prac==='All' ? dir : 'fullPracDir'; },
      dispDir: function(dir) {
        return this.disp==='All' ? dir : 'fullDispDir'; },
      areaDir: function() {
        return this.prac==='All' ? 'none' : 'area' },
      style: function( hsv ) {
        return { backgroundColor:this.toRgbaHsv(hsv) }; },
      elems: function() { // Add DON elements. Must be called within $nextTick for $refs
        this.infoElem = this.$refs['Info'];
        let pracs = this.conns(this.comp); // We access conns because col practices have been filtered out
        for( let pkey in pracs ) {
          let prac = pracs[pkey];
          prac.elem = this.$refs[prac.name][0];
          this.touch.events( prac.elem );
          let disps = this.disps(this.comp,prac.name);
          for( let dkey in disps ) {
            let disp = disps[dkey];
            disp.elem = this.$refs[disp.name][0]; } } }  // this.touch.events( disp.elem );
      },

    beforeMount: function() {
      this.comp = this.$route.name.substring(0,4);  },
      // console.log( 'Prac.beforeMount()', this.$route.name, this.comp, this.pcomp  );

    mounted: function () {
    //this.touch     = new Touch();
    //console.log( 'Prac batch',  this.batch() );
      this.build     = new Build$1( this.batch(), this.comp );
      this.practices = this.pracs(this.comp); // 'Cols'
      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
         if( obj.disp==='All' ) { this.onPrac(obj.prac); }
         else                   { this.onDisp(obj.prac,obj.disp); } } );
      this.subscribe(  "Navd",    this.comp+'.vue', (obj) => {
        this.onNavd(obj); } );
      this.subscribe(  "Tabs",    this.comp+'.vue', (obj) => {
        this.onTabs(obj); } );
      this.$nextTick( function() {
        this.onTabs('Practices');
        /*this.elems();*/ } ); }
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
    { ref: "Info", staticClass: "comp", attrs: { title: "Info" } },
    [
      _vm._l(_vm.practices, function(prac) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isPrac(prac.name),
                  expression: "isPrac(prac.name)"
                }
              ],
              key: prac.name,
              ref: prac.name,
              refInFor: true,
              class: _vm.pracDir(prac.dir),
              attrs: { title: prac.name }
            },
            [
              _c(
                "div",
                { staticClass: "prac" },
                [
                  _c(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.isDisp(prac.name),
                          expression: "isDisp(prac.name)"
                        }
                      ],
                      class: _vm.dispDir("cen"),
                      style: _vm.style(prac.hsv)
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "disp",
                          on: {
                            click: function($event) {
                              return _vm.pubPrac(prac.name)
                            }
                          }
                        },
                        [
                          _c("i", { class: prac.icon }),
                          _vm._v(" "),
                          _c("span", { staticClass: "name" }, [
                            _vm._v(_vm._s(prac.name))
                          ]),
                          _vm._v(" "),
                          _c("span", { staticClass: "desc" }, [
                            _vm._v(_vm._s(prac.desc))
                          ])
                        ]
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _vm._l(prac.disps, function(disp) {
                    return [
                      _c(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: _vm.isDisp(disp.name),
                              expression: "isDisp(disp.name)"
                            }
                          ],
                          ref: disp.name,
                          refInFor: true,
                          class: _vm.dispDir(disp.dir),
                          style: _vm.style(disp.hsv),
                          attrs: { title: disp.name }
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "disp",
                              on: {
                                click: function($event) {
                                  return _vm.pubDisp(prac.name, disp.name)
                                }
                              }
                            },
                            [
                              _c("i", { class: disp.icon }),
                              _vm._v(" "),
                              _c("span", { staticClass: "name" }, [
                                _vm._v(_vm._s(disp.name))
                              ]),
                              _vm._v(" "),
                              _c("span", { staticClass: "desc" }, [
                                _vm._v(_vm._s(disp.desc))
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _vm._l(disp.areas, function(area) {
                            return [
                              _c("div", { class: _vm.areaDir() }, [
                                _c("i", { class: area.icon }),
                                _vm._v(" "),
                                _c("span", { staticClass: "name" }, [
                                  _vm._v(_vm._s(area.name))
                                ]),
                                _vm._v(" "),
                                _c("span", { staticClass: "desc" }, [
                                  _vm._v(_vm._s(area.desc))
                                ])
                              ])
                            ]
                          })
                        ],
                        2
                      )
                    ]
                  })
                ],
                2
              )
            ]
          )
        ]
      }),
      _vm._v(" "),
      _vm._l(_vm.rows, function(row) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isRows(),
                  expression: "isRows()"
                }
              ],
              key: row.name,
              class: row.dir
            },
            [
              _c("div", { staticClass: "row" }, [
                _c("div", [
                  _c("i", { class: row.icon }),
                  _vm._v(_vm._s(row.name))
                ])
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
    inject("data-v-66e0f250_0", { source: ".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.comp {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 2rem;\n  background-color: black;\n  color: black;\n  display: grid;\n  grid-template-columns: 7fr 31fr 31fr 31fr;\n  grid-template-rows: 7fr 12fr 27fr 27fr 27fr;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2rem;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .prac div {\n  font-size: 1.4rem;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6fr 22fr 72fr;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.5rem;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2rem;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.6rem;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.6rem;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2rem;\n  display: block;\n}\n", map: {"version":3,"sources":["Prac.vue","/Users/ax/Documents/prj/aug/vue/page/Prac.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;EACT,eAAe;EACf,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,yCAAyC;EACzC,2CAA2C;EAC3C,6GAA6G;EAC7G,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,eAAe;EACf,YAAY;EACZ,iBAAiB;EACjB,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,cAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EDCE,mBAAmB;ACCrB;ADCA;ECCA,aAAA;EACA,eAAA;EDCE,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EDCE,aAAa;ECCf,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EACA,gBAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;ADCA;ACCA;EDCE,sBAAsB;ECCxB,mBAAA;EACA,UAAA;EACA,WAAA;EACA,eAAA;EACA,iBAAA;EACA,aAAA;EACA,kCAAA;EDCE,+BAA+B;ECCjC,gEAAA;ADCA;ACCA;EACA,aAAA;EACA,gBAAA;EACA,qBAAA;EACA,mBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EACA,eAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EACA,cAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,mBAAA;ADCA;ACCA;EACA,aAAA;EACA,eAAA;EACA,qBAAA;EDCE,mBAAmB;EACnB,mBAAmB;ACCrB;ADCA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,eAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,iBAAiB;AACnB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,mCAAmC;EACnC,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,oCAAoC;EACpC,qCAAqC;EACrC,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB,UAAU;EACV,YAAY;EACZ,iBAAiB;AACnB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,eAAe;AACjB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;EAC5B,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,iBAAiB;AACnB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,iBAAiB;EACjB,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;AACvB;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,iBAAiB;EACjB,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;AAC9B;AACA;EACE,4BAA4B;EAC5B,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,iBAAiB;AACnB;AACA;;;EAGE,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,iBAAiB;EACjB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,cAAc;AAChB","file":"Prac.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.comp {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n  font-size: 2rem;\n  background-color: black;\n  color: black;\n  display: grid;\n  grid-template-columns: 7fr 31fr 31fr 31fr;\n  grid-template-rows: 7fr 12fr 27fr 27fr 27fr;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.5rem;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2rem;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .prac div {\n  font-size: 1.4rem;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.6rem;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5rem 0.5rem 0.5rem 0.5rem;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6fr 22fr 72fr;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.5rem;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 2.5rem;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5rem;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2rem;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6rem;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1.6rem;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 1.6rem !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 1.6rem !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 1.6rem !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1.6rem;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.6rem;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.6rem;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2rem;\n  display: block;\n}\n","\n<template>\n  <div class=\"comp\" ref=\"Info\" title=\"Info\" >\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" :class=\"pracDir(prac.dir)\" :key=\"prac.name\"\n        :ref=\"prac.name\" :title=\"prac.name\">\n        <div class=\"prac\">\n          <div v-show=\"isDisp(prac.name)\" :class=\"dispDir('cen')\" :style=\"style(prac.hsv)\">\n            <div class=\"disp\" @click=\"pubPrac(prac.name)\">\n              <i   :class=\"prac.icon\"></i>\n              <span class=\"name\">{{prac.name}}</span>\n              <span class=\"desc\">{{prac.desc}}</span>\n            </div>\n          </div>\n          <template  v-for=\"disp in prac.disps\">\n            <div v-show=\"isDisp(disp.name)\" :class=\"dispDir(disp.dir)\" :style=\"style(disp.hsv)\"\n              :ref=\"disp.name\" :title=\"disp.name\">\n            <div class=\"disp\" @click=\"pubDisp(prac.name,disp.name)\">\n              <i   :class=\"disp.icon\"></i>\n              <span class=\"name\">{{disp.name}}</span>\n              <span class=\"desc\">{{disp.desc}}</span>\n            </div>\n            <template v-for=\"area in disp.areas\">\n              <div :class=\"areaDir()\">\n                <i :class=\"area.icon\"></i>\n                <span class=\"name\">{{area.name}}</span>\n                <span class=\"desc\">{{area.desc}}</span>\n              </div>\n            </template>\n          </div>\n          </template>\n        </div>\n      </div>\n    </template>\n    <template v-for=\"row in rows\">\n      <div v-show=\"isRows()\" :class=\"row.dir\" :key=\"row.name\"><div class=\"row\">\n        <div><i :class=\"row.icon\"></i>{{row.name}}</div></div></div>\n    </template>\n  </div>  \n</template>\n\n<script type=\"module\">\n  \n//import Touch from '../../pub/base/util/Touch.js';\n  import Build from '../../pub/ikw/cube/Build.js';\n\n  export default {\n    \n    props: { pcomp:{ type:String, default:'None' } },\n    \n    data() { return {\n      comp:'None', prac:'All', disp:'All', tab:'Practices', practices:{},\n      rows: {\n        Learn:{ name:'Learn', dir:'le', icon:\"fas fa-graduation-cap\" },\n        Do:{    name:'Do',    dir:'do', icon:\"fas fas fa-cogs\" },\n        Share:{ name:'Share', dir:'sh', icon:\"fas fa-share-alt-square\" } } } },\n    \n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      isDisp: function (disp) {\n        return this.disp===disp || this.disp==='All' },\n      isRows: function () {\n        return this.prac==='All' },\n      pubTab: function (tab) {\n        this.tab = tab },\n      classTab: function (tab) {\n        return this.tab===tab ? 'tab-active' : 'tab' },\n      pubPrac: function (prac) {\n        this.publish( this.comp, { prac:prac, disp:'All' } ); },\n      pubDisp: function (prac,disp) {\n        this.publish( this.comp, { prac:prac, disp:disp  } ); },\n      onPrac: function (prac) {\n        this.prac = prac; this.disp='All'; },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp=disp; },\n      onNavd: function (dir) {\n        console.log( 'Prac.onNavd() Beg', this.prac, dir );\n        if( this.prac !== 'All') {\n          let prc = this.pracs(this.comp)[this.prac]\n          let adj = this.build.adjacentPractice(prc,dir);\n          console.log( 'Prac.onNavd() Adj', adj.name, dir, adj.plane );\n          if( adj.name !== 'None' ) {\n            if( adj.plane !== this.comp ) {\n              this.publish( 'Tocs', adj.plane ) }\n            else {\n              this.onPrac(adj.name) } } } },\n      onTabs: function (tab) {\n        if( tab==='Practices' && this.tab==='Practices' && this.prac!=='All' ) {\n          this.onPrac('All'); }\n        this.tab = tab; },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'fullPracDir'; },\n      dispDir: function(dir) {\n        return this.disp==='All' ? dir : 'fullDispDir'; },\n      areaDir: function() {\n        return this.prac==='All' ? 'none' : 'area' },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; },\n      elems: function() { // Add DON elements. Must be called within $nextTick for $refs\n        this.infoElem = this.$refs['Info']\n        let pracs = this.conns(this.comp); // We access conns because col practices have been filtered out\n        for( let pkey in pracs ) {\n          let prac = pracs[pkey];\n          prac.elem = this.$refs[prac.name][0];\n          this.touch.events( prac.elem );\n          let disps = this.disps(this.comp,prac.name)\n          for( let dkey in disps ) {\n            let disp = disps[dkey];\n            disp.elem = this.$refs[disp.name][0]; } } }  // this.touch.events( disp.elem );\n      },\n\n    beforeMount: function() {\n      this.comp = this.$route.name.substring(0,4);  },\n      // console.log( 'Prac.beforeMount()', this.$route.name, this.comp, this.pcomp  );\n\n    mounted: function () {\n    //this.touch     = new Touch();\n    //console.log( 'Prac batch',  this.batch() );\n      this.build     = new Build( this.batch(), this.comp );\n      this.practices = this.pracs(this.comp); // 'Cols'\n      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {\n         if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n         else                   { this.onDisp(obj.prac,obj.disp); } } );\n      this.subscribe(  \"Navd\",    this.comp+'.vue', (obj) => {\n        this.onNavd(obj); } );\n      this.subscribe(  \"Tabs\",    this.comp+'.vue', (obj) => {\n        this.onTabs(obj); } );\n      this.$nextTick( function() {\n        this.onTabs('Practices');\n        /*this.elems();*/ } ) }\n  }\n         \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;\n               grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\"; }\n  \n  .grid4x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:13vh 29fr 29fr 29fr;\n    grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid5x4() { display:grid; grid-template-columns:7fr 31fr 31fr 31fr; grid-template-rows:7fr 12fr 27fr 27fr 27fr;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid1x3() { display:grid; grid-template-columns:6fr 22fr 72fr; grid-template-areas: \"icon name desc\"; }\n  \n  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n                  justify-items:center; align-items:center; }\n  \n  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }\n  \n  .bgc( @bg )\n    { background-color:@bg; } // top | right | bottom | left\n  \n  .comp { position:absolute; left:0; top:5%; right:0; bottom:0; font-size:@theme-prac-size;\n          background-color:@theme-back; color:@theme-color-prac;\n    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid\n      .tabs{ grid-area:tabs; display:inline; color:@theme-color; font-size:@theme-tab-size;\n             justify-self:start; align-self:center; text-align:left; }\n      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }\n      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n    \n      // Placed one level below the 9 Practices Grid   - Check on background-color:#603;\n    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:@theme-prac-size;\n      font-weight:bold;\n      .grid3x3(); // The 4 Displine plus Practiice name Grid\n                             .north { .ddir(north); }\n      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }\n                             .south { .ddir(south); }\n      .cen  { font-size:@theme-cen-size; }\n      div   { font-size:@theme-dir-size; } }\n  \n    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:@theme-disp-size;\n      i     { display:inline-block;  margin-right: 0.25rem; }\n      .name { display:inline-block; }\n      .desc { display:none; margin:0.5rem 0.5rem 0.5rem 0.5rem; text-align:left; } }\n  \n    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;\n      width:90%; height:auto; font-size:@theme-area-size;\n      i     { grid-area:icon; }\n      .name { grid-area:name; font-weight:900; }\n      .desc { grid-area:desc; } }\n  \n    .none { display:none; }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n      .disp { justify-self:center; margin:0;\n        i     { font-size:@theme-area-icon-size !important; }\n        .name { font-size:@theme-area-name-size !important; }\n        .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc\n      .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }\n  \n    .none { display:none; }\n    \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:@theme-full-size; width:100%; height:100%;\n              justify-self:center; align-self:center; display:grid; border-radius:0.5rem;\n        div {     padding-bottom:2rem;\n          .disp { padding-bottom:0;\n            i     { font-size:@theme-disp-size; }\n            .name { font-size:@theme-disp-size; }\n            .desc { font-size:@theme-disp-size; display:block; } } }  // Turns on .disp .desc\n          .area { padding-bottom:0; } } }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n       .disp { justify-self:center; margin:0;\n         i     { font-size:@theme-area-icon-size !important; }\n         .name { font-size:@theme-area-name-size !important; }\n         .desc { font-size:@theme-area-desc-size !important; display:block; } }  // Turns on .disp .desc\n       .area {   font-size:@theme-area-area-size !important; padding-bottom:0; } }\n    \n    .em, .in, .en { .prac .cen { font-size:@theme-row-size; } } // Font size columns\n  \n    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:@theme-row-size;\n      font-weight:bold; display:grid;\n      div { text-align:center; justify-self:center;  align-self:center; font-size:@theme-row-size; color:@theme-color; }\n      i { margin-bottom: 0.2rem; display:block; } }\n    \n    \n  }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Prac = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Prac;
