var Manager;

import Data from '../appl/Data.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Fire from '../../base/store/Fire.js';

import Rest from '../../base/store/Rest.js';

Manager = class Manager {
  constructor(mix) {
    this.mix = mix;
    this.dbName = 'Test';
    this.tables = ['Prac', 'Hues'];
    this.baseUrl = 'http:localhost:3000'; // Placeholder
    this.stream = Data.stream;
    this.prac = null;
    this.hues = null;
    this.kit = null;
  }

  test(name) {
    var store;
    store = (function() {
      switch (name) {
        case 'Local':
          return new Local(this.dbName);
        case 'Index':
          return this.openIndex(this.dbName, ['Hues']); // 'Prac',
        case 'Rest':
          return new Rest(this.dbName, this.baseUrl);
        //hen 'Pouch' then new Pouch(  @dbName )
        case 'Fire':
          return new Fire(this.dbName);
        default:
          return new Memory(this.dbName);
      }
    }).call(this);
    if (name !== 'Index') {
      this.suite(store);
    }
  }

  openIndex(dbName, tables) {
    var idb;
    idb = new Index(dbName, ['Prac', 'Hues']);
    idb.openDB(idb.dbName, idb.dbVersion, tables).then((db) => {
      idb.db = db;
      this.suite(idb);
    }).catch((error) => {
      idb.onerror(tables, 'openDB', error);
    });
    return idb;
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
    console.log('Manager.suite()', store.source);
    this.data();
    this.subscribe('Prac', 'add', store);
    this.subscribe('Prac', 'get', store);
    this.subscribe('Prac', 'put', store);
    this.subscribe('Prac', 'del', store);
    store.add('Prac', this.prac.id, this.prac);
    store.get('Prac', this.prac.id);
    store.put('Prac', this.prac.id, this.prac);
    //tore.del( 'Prac', @prac.id )
    this.subscribe('Hues', 'insert', store);
    this.subscribe('Hues', 'select', store);
    this.subscribe('Hues', 'update', store);
    this.subscribe('Hues', 'remove', store);
    store.insert('Hues', this.hues);
    store.select('Hues', function(obj) {
      return true;
    });
    store.update('Hues', this.hues);
    //tore.remove( 'Hues', (obj) -> true )
    this.subscribe('Test', 'show', store);
    store.show();
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
    this.hues = this.mix.data('Hues');
    // console.log( 'Manager.data(@pracs)', @mix, @hues )
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
