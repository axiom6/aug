var add, five;

import {
  test,
  tester
} from './Tester.js';


// In this context all unit tests are executed immediately when this module is either
//   dynaically  imported i.e module = import(path) - recommended
// or statically imported i.e inport module from path

// runUnitTestModulesFromPaths:( paths ) will dynamically import this module
//   with paths = ["/lib/pub/test/Tester-unitester.js"]
// For glob file patterns running in ViteJS there is
// runUnitTestModulesWithViteJS:() will dynamically import this module
//   using a glob pattern like "/src/**/*-unitester.js"  or "/pub/**/*-unitester.js"

// t = tester
test().module("Class Tester Unit tests").on();

test().describe("Test closure demo").on();

five = function() {
  return 5;
};

add = function(a, b) {
  return a + b;
};

test("five() = 5", function(t) {
  return t.eq(five(), 5);
});

test("add(2,3) = 5", function(t) {
  return t.eq(add(2, 3), 5);
});

test("type(123)", function(t) {
  return t.eq(tester.toType(123), 'number');
});

test("type('123')", function(t) {
  return t.eq(tester.toType('123'), 'string');
});

test().log(test().summary());

test().describe("Internal logic for turning tests on and off").name("test()").on();

test('not (  @testing and  @moduleOn and  @methodOn ) @method=false', function(t) {
  var isOff;
  isOff = !(t.testing && t.moduleOn && t.describeOn);
  return t.eq(isOff, false);
});

test('not (  @testing and  @moduleOn and  @methodOn ) @method=true', function(t) {
  var isOff;
  isOff = !(t.testing && t.moduleOn && t.describeOn);
  return t.eq(isOff, false);
});

test().log(test().summary());

test().describe("test(text, (t) -> ...").name("eq()").on();

test('eq({a:"a"},{a:"a"})', function(t) {
  return t.eq({
    a: "a"
  }, {
    a: "a"
  });
});

//est( 'eq({a:"a"},{a:"b"})',  (t) -> t.eq(  {a:"a"}, {a:"b"} ) )  # Noed ne
//est( 'eq({a:"a"},{b:"a"})',  (t) -> t.eq(  {a:"a"}, {b:"a"} ) )  # Noed ne
test("eq([1,2,3],[1,2,3] )", function(t) {
  return t.eq([1, 2, 3], [1, 2, 3]);
});

//est( "eq([1,2,3])",          (t) -> t.eq([1,2,3],[1,2,3,4]  ) )  # Noed ne
//est( 'eq((x)->,(y)->))',     (t) -> t.eq( (x)->, (y)->      ) )  # Need better handling of function types?
test().log(test().summary());

/*
  constructor:()
  setOptions:( options )
  test:( text, closure )
  unit:( text, result, expect )
  fits:( text, result, schema )
  eq:( result, expect )
  run:( text, result, expect, op )
  describe:( description, suite=null )
  initStatus:( result, expect, op )
  assert:( result, expect, status, op, level=0, key=null, index=null )
  examine:( pass, result, expect, status, op, info, key, index )
  isSchema:( v )
  toSchema:( expect,   op )
  parseSchema:( expect, schema )
  toRanges:( splits )
  checkValuesTypes:( result, expect, status, op, key, index )
  valuesEq:( result, expect, status, op )
  unknownsEq:( result, expect, status )
  textValue:( name, argue, key, index )
  objectsEq:( result, expect, status, op, level )
  arraysEq:( result, expect, status, op, level )
  report:( result, expect, op, status )
  status:()
  block:()
  runUnitTests:( paths )
  path:( path )
  summary:( module=null )
  injectStream:( stream )
  archiveLocal:( failed, passed )
  reviewsLocal:( reviewFailed, reviewPassed )
  isRange:(r)
  toRange:(arg)
  inRange:(arg,range)   
*/

//# sourceMappingURL=Tester-unit.js.map
