// cd   pub/base/test
// node --experimental-modules -r esm Run.js
// let cmds = process.argv.slice(2);
var testStore;

import TestStore from './TestStore.js';

console.log("---------------------------- Begin ----------------------------");

testStore = new TestStore();

testStore.testRest();
