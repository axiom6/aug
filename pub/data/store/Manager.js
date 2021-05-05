var Manager;

import Data from '../appl/Data.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Fire from '../../base/store/Fire.js';

import Couch from '../../base/store/Couch.js';

Manager = class Manager {
  constructor(mix) {
    this.subscribe = this.subscribe.bind(this);
    this.mix = mix;
    this.dbName = 'test1';
    this.credsUrl = 'http://admin:athena@127.0.0.1:5984'; // Admin host to couchdb
    this.couchUrl = 'http://127.0.0.1:5984'; // Admin host to couchdb
    this.stream = Data.stream;
    this.prac = null;
    this.hues = null;
    this.kit = null;
    this.lastSource = null;
  }

  test(name) {
    var store;
    store = (function() {
      switch (name) {
        case 'Local':
          return new Local(this.dbName);
        case 'Index':
          return new Index(this.dbName);
        case 'Fire':
          return new Fire(this.dbName);
        case 'Couch':
          return new Couch(this.dbName, this.couchUrl);
        default:
          return new Memory(this.dbName);
      }
    }).call(this);
    store.openTable('prac');
    store.openTable('hues');
    if (name === 'Index') {
      this.openIndex(store);
    }
    if (name !== 'Index') {
      this.suite(store);
    }
  }

  openIndex(idb) {
    idb.openDB(idb.dbName, idb.dbVersion).then((db) => {
      idb.db = db;
      this.suite(idb);
    }).catch((error) => {
      idb.onerror(idb.tables, 'openDB', error);
    });
  }

  subscribe(table, op, store) {
    var onSubscribe;
    onSubscribe = (obj) => {
      var whereD, whereS;
      console.log('Mgr', {
        table: table,
        op: op,
        source: store.source,
        obj: obj
      });
      whereS = function(obj) {
        return true;
      };
      whereD = function(obj) {
        return obj.column === 'Embrace';
      };
      switch (op) {
        case 'add':
          return store.get(table, obj.id);
        case 'put':
          return store.del(table, obj.id);
        case 'insert':
          return store.select(table, whereS);
        case 'update':
          return store.remove(table, whereD);
      }
    };
    if (this.lastSource != null) {
      store.unsubscribe(table, op, this.lastSource);
    }
    store.subscribe(table, op, store.source, onSubscribe);
  }

  suite(store) {
    console.log('Manager.suite()', store.source);
    this.data();
    this.subscribe('prac', 'add', store);
    this.subscribe('prac', 'get', store);
    this.subscribe('prac', 'put', store);
    this.subscribe('prac', 'del', store);
    this.subscribe('hues', 'insert', store);
    this.subscribe('hues', 'select', store);
    this.subscribe('hues', 'update', store);
    this.subscribe('hues', 'remove', store);
    this.subscribe('Tables', 'show', store);
    this.subscribe('prac', 'open', store);
    this.subscribe('prac', 'drop', store);
    //tore.drop( 'demo')
    //tore.open( 'hues')
    store.show();
    store.add('prac', this.prac.id, this.prac);
    //tore.get( 'prac', @prac.id )         # Called after add
    store.put('prac', this.prac.id, this.prac);
    //tore.del( 'prac', @prac.id )         # Called after put
    store.insert('hues', this.hues);
    //tore.select( 'hues', (obj) -> true ) # Called after insert
    this.hues['Green'].column = 'Embrace';
    this.hues['Orange'].column = 'Embrace';
    this.hues['Violet'].column = 'Embrace';
    store.update('hues', this.hues);
    //here = (obj) -> obj.column is 'Embrace'  # Called after update
    //tore.remove( 'hues', where )
    this.lastSource = store.source;
  }

  data() {
    this.prac = {
      "_id": "Involve",
      "id": "Involve",
      "table": "prac",
      "type": "pane",
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

};

export default Manager;
