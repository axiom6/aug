var Manager;

import Data from '../appl/Data.js';

import Memory from '../../base/store/Memory.js';

import Local from '../../base/store/Local.js';

import Index from '../../base/store/Index.js';

import Rest from '../../base/store/Rest.js';

Manager = class Manager {
  constructor(mix) {
    this.mix = mix;
    this.dbName = 'test1';
    this.tables = ['Prac', 'Hues'];
    this.credUrl = 'http://admin:athena@127.0.0.1:5984'; // Admin host to couchdb
    this.baseUrl = 'http://127.0.0.1:5984'; // Admin host to couchdb
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
        default:
          //hen 'Fire'  then new Fire(   @dbName )
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
    this.subscribe('prac', 'add', store);
    this.subscribe('prac', 'get', store);
    this.subscribe('prac', 'put', store);
    this.subscribe('prac', 'del', store);
    this.subscribe('pest1', 'show', store);
    //tore.show()

    //tore.add( 'prac', @prac._id, @prac )
    store.get('prac', this.prac._id);
    //tore.put( 'prac', @prac._id, @prac )
    //tore.del( 'prac', @prac._id )
    this.subscribe('hues', 'insert', store);
    this.subscribe('hues', 'select', store);
    this.subscribe('hues', 'update', store);
    this.subscribe('hues', 'remove', store);
  }

  //tore.insert( 'hues', @hues )
  //tore.select( 'hues', (obj) -> true )
  //tore.update( 'hues', @hues )
  //tore.remove( 'hues', (obj) -> true )
  data() {
    this.prac = {
      "_id": "Involve",
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
