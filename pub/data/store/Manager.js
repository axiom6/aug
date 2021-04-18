var Manager;

import Data from '../appl/Data.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Fire from '../../base/store/Fire.js';

import Rest from '../../base/store/Rest.js';

Manager = class Manager {
  constructor() {
    this.dbName = 'Test';
    this.tables;
    this.mix = Data.mix;
    this.stream = Data.stream;
  }

  test(name) {
    var store;
    store = (function() {
      switch (name) {
        case 'Local':
          return new Local();
        case 'Index':
          return new Index();
        //hen 'Pouch' then new Pouch()
        case 'Fire':
          return new Fire();
        case 'Rest':
          return new Rest();
        default:
          return new Memory();
      }
    })();
    this.suite(store);
  }

  subscribe(table, op, store) {
    var onSubscribe;
    onSubscribe = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: op,
        source: store.source,
        obj: obj
      });
    };
    store.subscribe(table, op, store.source, onSubscribe);
  }

  suite(store) {
    var key, prac, ref;
    this.data();
    this.subscribe('Prac', 'add', store);
    this.subscribe('Prac', 'get', store);
    this.subscribe('Prac', 'put', store);
    this.subscribe('Prac', 'del', store);
    store.add('Prac', '0', this.prac);
    store.get('Prac', '0');
    this.prac.type = 'view';
    store.put('Prac', '0', this.prac);
    store.del('Prac', '0');
    this.subscribe('Pracs', 'insert', store);
    this.subscribe('Pracs', 'select', store);
    this.subscribe('Pracs', 'update', store);
    this.subscribe('Pracs', 'remove', store);
    store.insert('Pracs', this.pracs);
    store.select('Pracs', function(obj) {
      return true;
    });
    ref = this.pracs;
    for (key in ref) {
      prac = ref[key];
      prac.type = 'view';
    }
    store.update('Pracs', this.pracs);
    store.remove('Pracs', function(obj) {
      return true;
    });
  }

  data() {
    this.prac = {
      id: "Involve",
      type: "pane",
      "hsv": [195, 90, 60],
      "column": "Embrace",
      "row": "Learn",
      "plane": "Know",
      "icon": "fas fa-users",
      "cells": [5, 12, 7, 12],
      "dir": "nw",
      "neg": "Greed"
    };
    this.pracs = this.mix.inovObject('Info', 'Info');
    return this.kit = {
      "_id": "mittens",
      "name": "Mittens",
      "occupation": "kitten",
      "age": 3,
      "hobbies": ["playing with balls of yarn", "chasing laser pointers", "lookin' hella cute"]
    };
  }

  subscribes(table, store) {
    var onSubscribe;
    onSubscribe = {};
    onSubscribe['add'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'add',
        source: store.source,
        obj: obj
      });
    };
    onSubscribe['get'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'get',
        source: store.source,
        obj: obj
      });
    };
    onSubscribe['put'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'put',
        source: store.source,
        obj: obj
      });
    };
    onSubscribe['del'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'del',
        source: store.source,
        obj: obj
      });
    };
    onSubscribe['insert'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'insert',
        source: store.source,
        obj: obj
      });
    };
    onSubscribe['select'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'select',
        source: store.source,
        obj: obj
      });
    };
    onSubscribe['update'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'update',
        source: store.source,
        obj: obj
      });
    };
    onSubscribe['remove'] = (obj) => {
      return console.log('Mgr', {
        table: table,
        op: 'remove',
        source: store.source,
        obj: obj
      });
    };
    store.subscribe(table, 'add', store.source, onSubscribe['add']);
    store.subscribe(table, 'get', store.source, onSubscribe['get']);
    store.subscribe(table, 'put', store.source, onSubscribe['put']);
    store.subscribe(table, 'del', store.source, onSubscribe['del']);
    store.subscribe(table, 'insert', store.source, onSubscribe['insert']);
    store.subscribe(table, 'select', store.source, onSubscribe['select']);
    store.subscribe(table, 'update', store.source, onSubscribe['update']);
    store.subscribe(table, 'remove', store.source, onSubscribe['remove']);
  }

};

export default Manager;
