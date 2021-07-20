var Log, NUMBER, Person, Swan, aVar, addClass, addWord, all, assert, cholesterol, closedOverArgument, copy, countdown, currentUser, draw, drawMove, drawPath, email, end, error, fibonacci, footprints, getFibonacciNumbers, grade, healthy, incrementer, k, l, len, len1, m, makeIncrement, makeMostRecent, max, middle, min, mind, mostRecentTweedle, movement, n, numbers, objectType, octoberTwilight, partial15lines, partial3lines, partialFree, path, paths, perfectSquares, popular, print, removeWord, removeWordShouldRemoveOneWord, say, score, send, session, sleep, solipsism, speed, sqrt, start, stillSky, swirl, t, test, test1, test2, tim, tree, trees, type, u, unwanted, user, water, world, yeti,
  splice = [].splice;

Log = {
  logPrefix: "(App)",
  log: function(...args) {
    if (this.logPrefix) {
      args.unshift(this.logPrefix);
    }
    return typeof console !== "undefined" && console !== null ? console.log(...args) : void 0;
  }
};

// Execute function immediately
type = (function() {
  var classToType, k, len, name, ref;
  classToType = {};
  ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
  for (k = 0, len = ref.length; k < len; k++) {
    name = ref[k];
    classToType["[object " + name + "]"] = name.toLowerCase();
  }
  // Return a function
  return function(obj) {
    var strType;
    strType = Object.prototype.toString.call(obj);
    return classToType[strType] || "object";
  };
})();

type = (function() {
  var classToType, k, len, name, ref;
  classToType = {};
  ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
  for (k = 0, len = ref.length; k < len; k++) {
    name = ref[k];
    classToType["[object " + name + "]"] = name.toLowerCase();
  }
  return function(obj) {
    var strType;
    strType = Object.prototype.toString.call(obj);
    return classToType[strType] || "object";
  };
})();

// Returns the sort of types we'd expect:
type(""); // "string"

type(new String()); // "string"

type([]); // "array"

type(/\d/); // "regexp"

type(new Date()); // "date"

type(true); // "boolean"

type(null); // "null"

type({}); // "object"

aVar = "";

if (typeof aVar !== "undefined") {
  objectType = type(aVar);
}

// Or more succinctly with the existential operator:
objectType = type(aVar != null);

// Returns 8, not 10!
parseInt('010') === 8;

// Always pass a base to the function to make it work correctly:

// Use base 10 for the correct result
parseInt('010', 10) === 10;

"use strict";

(function() {
  "use strict";
  return console.log(arguments.callee);
})();

// ------ Testing ------
assert = require('assert');

({addWord, removeWord} = require('./word_utils'));

(removeWordShouldRemoveOneWord = function() {
  var actualOutput, expectedOutput, input;
  input = "product special";
  expectedOutput = "product";
  actualOutput = removeWord(input, "special");
  return assert.equal(expectedOutput, actualOutput);
})();

// coffee word_utils.spec.coffee
//AssertionError: "product ial" == "product special"
addClass = function(selector, newClass) {
  var element;
  element = document.querySelector(selector);
  if (element.className != null) {
    return element.className = `${element.className} ${newClass}`;
  } else {
    return element.className = newClass;
  }
};

(function() {
  var name;
  name = 'Ren';
  if (name) {
    return false;
  }
})();

(function() {
  var name;
  name = 'Stimpy';
  if (name) {
    return false;
  }
})();

makeIncrement = function() {
  var n;
  n = 0;
  return function() {
    n = n + 1;
    return n;
  };
};

incrementer = makeIncrementer();

incrementer();

// 1
incrementer();

import fs from 'path';

makeMostRecent = function(file1, file2) {
  var getMostRecent, mostRecent, sourceFileWatcher;
  mostRecent = 'Nothing read yet.';
  sourceFileWatcher = function(fileName) {
    var sourceFileReader;
    sourceFileReader = function() {
      return fs.readFile(fileName, 'utf-8', function(error, data) {
        return mostRecent = data;
      });
    };
    return fs.watch(fileName, sourceFileReader);
  };
  sourceFileWatcher(file1);
  sourceFileWatcher(file2);
  getMostRecent = function() {
    return mostRecent;
  };
  return getMostRecent(); // not part of example. Used to silence code inspector
};

mostRecentTweedle = makeMostRecent('tweedle.dee', 'tweedle.dum');

closedOverArgument = function(x) {
  return function() {
    return x;
  };
};

// five = closedOverArgument 5

// nine = closedOverArgument 9

//Literate: W B Yeats The Wild Swans at Coole

//Literate: The trees are in their autumn beauty,
trees = [{}, {}];

for (k = 0, len = trees.length; k < len; k++) {
  tree = trees[k];
  tree.inAutumnBeauty = true;
}

//Literate: The woodland paths are dry,
paths = [{}, {}, {}];

for (l = 0, len1 = paths.length; l < len1; l++) {
  path = paths[l];
  path.dry = true;
}

//Literate: Under the October twilight the water Mirrors a still sky;
octoberTwilight = {};

stillSky = {};

water = {
  placeUnder: function() {}
};

water.placeUnder(octoberTwilight);

water.mirrors = stillSky;

//Literate: Upon the brimming water among the stones Are nine-and-fifty swans.
water.brimming = true;

water.stones = [{}, {}, {}, {}];

Swan = (function() {
  class Swan {};

  Swan.prototype.x = 3;

  return Swan;

}).call(this);

for (n = m = 1; m <= 59; n = ++m) {
  water.stones.push(new Swan());
}

assert('fundamental'.indexOf('fun') >= 0);

import http from 'http';

send = function(next) {
  return http.send(next());
};

email = function() {};

// Object DSL
session = {
  user: {
    name: "Mark"
  }
};

query({
  SELECT: '*',
  FROM: 'users',
  WHERE: `name LIKE '%${session.user.name}%'`
});

Person = class Person {
  constructor(options) {
    var height;
    ({name: this.name, age: this.age, height = 'average'} = options);
    this.height = height;
  }

};

tim = new Person({
  name: 'Tim',
  age: 4
});

if (tim) {
  false;
}

perfectSquares = function*() {
  var num;
  num = 0;
  while (true) {
    num += 1;
    yield num * num;
  }
};

window.ps || (window.ps = perfectSquares());

fibonacci = function*() {
  var current, previous;
  current = 0;
  previous = 0;
  [previous, current] = [1, 1];
  while (true) {
    [previous, current] = [current, previous + current];
    yield current;
  }
};

getFibonacciNumbers = function(length) {
  var ref, results;
  results = [1];
  ref = fibonacci();
  for (n of ref) {
    results.push(n);
    if (results.length === length) {
      break;
    }
  }
  return results;
};

// ----- Sleep ------
sleep = function(ms) {
  return new Promise(function(resolve) {
    return window.setTimeout(resolve, ms);
  });
};

say = function(text) {
  window.speechSynthesis.cancel();
  return window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

countdown = async function(seconds) {
  var i, o, ref;
  for (i = o = ref = seconds; (ref <= 1 ? o <= 1 : o >= 1); i = ref <= 1 ? ++o : --o) {
    say(i);
    await sleep(1000); // wait one second
  }
  return say("Blastoff!");
};

countdown(3);

score = 76;

grade = (function() {
  switch (false) {
    case !(score < 60):
      return 'F';
    case !(score < 70):
      return 'D';
    case !(score < 80):
      return 'C';
    case !(score < 90):
      return 'B';
    default:
      return 'A';
  }
})();

popular = ['pepperoni', 'sausage', 'cheese'];

unwanted = ['anchovies', 'olives'];

all = [...popular, ...unwanted, 'mushrooms'];

user = {
  name: 'Werner Heisenberg',
  occupation: 'theoretical physicist'
};

currentUser = {
  ...user,
  status: 'Uncertain'
};

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

start = numbers.slice(0, 3);

middle = numbers.slice(3, -2);

end = numbers.slice(-2);

copy = numbers.slice(0);

mind = null;

world = null;

yeti = null;

if ((mind != null) && (world == null)) {
  solipsism = true;
}

speed = 0;

if (speed == null) {
  speed = 15;
}

footprints = yeti != null ? yeti : "bear";

print = function(arg) {};

try {
  allHellBreaksLoose();
  catsAndDogsLivingTogether();
} catch (error1) {
  error = error1;
  print(error);
} finally {
  cleanUp();
}

cholesterol = 127;

healthy = (200 > cholesterol && cholesterol > 60);

import './local-file.coffee';

import 'coffeescript';

import _ from 'underscore';

import * as underscore from 'underscore';

import {
  now
} from 'underscore';

import {
  now as currentTimestamp
} from 'underscore';

import {
  first,
  last
} from 'underscore';

import utilityBelt, {
  each
} from 'underscore';

if (_ && underscore && now && currentTimestamp && first && last && utilityBelt && each) {
  false;
}

export default Math;

export var square = function(x) {
  return x * x;
};

export var Mathematics = class Mathematics {
  least(x, y) {
    if (x < y) {
      return x;
    } else {
      return y;
    }
  }

};

sqrt = Math.sqrt;

Mathematics = Math;

export {
  sqrt
};

export {
  sqrt as squareRoot
};

export {
  Mathematics as default,
  sqrt as squareRoot
};

min = Math.min;

max = Math.max;

export * from 'underscore';

export {
  max,
  min
} from 'underscore';

(async function() {  // Your browser must support dynamic import to run this example.
  var ref, run;
  ({run} = (await import('./browser-compiler-modern/coffeescript.js')));
  return run((5 < (ref = new Date().getHours()) && ref < 9) ? alert('Time to make the coffee!') : alert('Time to get some work done.'));
})();

NUMBER = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i; // binary
// octal
// hex
// decimal

draw = function(ctx) { // Try changing colors below
  var ix;
  ctx.beginPath();
  ctx.strokeStyle = 'gold';
  drawMove(ctx, (function() {
    var o, results1;
    results1 = [];
    for (ix = o = 0; o < 90; ix = o += 10) {
      results1.push(ix);
    }
    return results1;
  })());
  ctx.beginPath();
  ctx.strokeStyle = 'salmon';
  return drawPath(ctx, (function() {
    var o, results1;
    results1 = [];
    for (ix = o = 0; o < 90; ix = o += 10) {
      results1.push(ix);
    }
    return results1;
  })());
};

movement = function(ctx, ax, ay, cp1x, cp1y, cp2x, cp2y, x, y) {
  ctx.moveTo(ax, ay);
  return ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
};

drawMove = function(ctx, args) {
  args.forEach(function(ix) {
    return movement(ctx, 0, 0, 30, 30, 150 + ix, 50, 110 + ix, 90);
  });
  return ctx.stroke();
};

u = void 0;

partialFree = function(func, ...a) {
  return function(...b) {
    var arg;
    return func(...((function() {
      var len2, o, results1;
      results1 = [];
      for (o = 0, len2 = a.length; o < len2; o++) {
        arg = a[o];
        results1.push(arg != null ? arg : arg = b.shift());
      }
      return results1;
    })()));
  };
};

swirl = partialFree(movement, u, u, 0, 30, 30, u, 50, u, 90);

drawPath = function(ctx, args) {
  args.forEach(function(ix) {
    return swirl(ctx, 200, 150 + ix, 110 + ix);
  });
  return ctx.stroke();
};

t = {};

t.assert = function(result, expect) {
  return result === expect;
};

test1 = function(func, ...args) {
  var expect, ref, result;
  ref = args, [...args] = ref, [expect] = splice.call(args, -1);
  result = func(args);
  return t.assert(result, expect);
};

test2 = function(func, ...args) {
  var expect, ref;
  ref = args, [...args] = ref, [expect] = splice.call(args, -1);
  return function(t) {
    var result;
    result = func(args);
    return t.assert(result, expect);
  };
};

partial15lines = function() {
  var args, func, wrapper;
  args = []; // Dumb useless declaration
  func = function() {}; // Dumb useless declaration
  [func, ...args] = arguments;
  return wrapper = function() {
    var i, j, res_args;
    i = 0;
    j = 0;
    res_args = [];
    while (i < args.length) {
      if (args[i] === _) {
        res_args.push(arguments[j]);
        j++;
      } else {
        res_args.push(args[i]);
      }
      i++;
    }
    return func.apply(null, res_args, wrapper);
  };
};

// Most succinct partiol functio
partial3lines = function(func, ...a) {
  return function(...b) {
    var arg;
    return func(...((function() {
      var len2, o, results1;
      results1 = [];
      for (o = 0, len2 = a.length; o < len2; o++) {
        arg = a[o];
        results1.push(arg != null ? arg : arg = b.shift());
      }
      return results1;
    })()));
  };
};

assert = function(result, expect) {
  return result === expect;
};

// Most succinct partiol functio
partial3lines = function(func, ...args) {
  var expect, ref, result;
  ref = args, [...args] = ref, [expect] = splice.call(args, -1);
  result = func(args);
  return assert(result, expect);
};

test = function() {
  var f, fold, g, partial;
  f = function(x, y, z) {
    return x + 2 * y + 5 * z;
  };
  g = partialFree(f, _, 1, _);
  show(`g 3, 5 => ${g(3, 5)} Expected: 30`);
  // Modified from an alexkg example
  fold = function(f, z, xs) {
    var len2, o, x;
    for (o = 0, len2 = xs.length; o < len2; o++) {
      x = xs[o];
      z = f(z, x);
    }
    return z;
  };
  max = partialFree(fold, Math.max, -2e308, _);
  show(`max [-10..10] => ${max([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])} Expected: 10`);
  // Without free vars
  partial = function(f, ...a) {
    return function(...b) {
      return f(...a, ...b);
    };
  };
  min = partial(fold, Math.min, 2e308);
  return show(`min [-10..10] => ${min([-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])} Expected: -10`);
};

partialFree = partial3lines;

test();

"g 3, 5 => 30 Expected: 30";

"max [-10..10] => 10 Expected: 10";

"min [-10..10] => -10 Expected: -10 ";

test = function(func) {
  var o, points, results1;
  results1 = [];
  for (points = o = -3; o <= 3; points = ++o) {
    results1.push(func(points));
  }
  return results1;
};

test(function(points) {
  return show(`0: You got ${points} point${points > 1 ? 's' : ''}`);
});

(function(Pi, diameter) {
  return function(radius) {
    return diameter(radius) * Pi;
  };
})(3.14159265, function(radius) {
  return radius * 2;
});

(function(I, K, V) {
  return (function(t, f) {
    if (V && f) {
      return false;
    }
  })(K, K(I));
})((function(x) {
  return x;
}), (function(x) {
  return function(y) {
    return x;
  };
}), (function(x) {
  return function(y) {
    return function(z) {
      return z(x(y));
    };
  };
}));

// ...
// implement logical operators here
// ...
/*
show = if exports? then console.log else alert
(require 'fs')['writeFileSync'] "./bezier.html",
  webpage = (require 'coffeekup').render ->
    doctype 5
    html -> meta charset: 'utf-8',
      head -> title 'Bezier path'
      body ->
        canvas id: 'drawCanvas', width: 300, height: 200
        coffeescript ->
          window.onload = ->
            canvas = document.getElementById 'drawCanvas'
            ctx = canvas.getContext '2d'
            alert 'No canvas in this browser.' unless ctx?
            draw ctx if draw? 
*/

//# sourceMappingURL=Snippets.js.map
