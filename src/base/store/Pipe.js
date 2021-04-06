var Pipe;

Pipe = class Pipe {
  constructor(stream, dbName) {
    this.stream = stream;
    this.dbName = dbName;
  }

  toSubject(table, op) {
    if (table != null) {
      return this.dbName + ':' + table + ':' + op;
    } else {
      return this.dbName + ':' + op;
    }
  }

  subscribe(table, op, source, onSubscribe) {
    var changeOp, i, len, ref;
    if (op !== 'change') {
      this.stream.subscribe(this.toSubject(table, op), source, onSubscribe);
    } else {
      ref = Pipe.changeOps;
      for (i = 0, len = ref.length; i < len; i++) {
        changeOp = ref[i];
        this.stream.subscribe(this.toSubject(table, changeOp), source, onSubscribe);
      }
    }
  }

  publish(table, op, result, id = null) {
    var obj;
    obj = id != null ? {
      [`${id}`]: result
    } : result;
    this.stream.publish(this.toSubject(table, op), obj);
  }

  results(table, op, result, id) {
    this.publish(table, op, result, id);
  }

  add(table, id, object) { // Post an object into table with id
    this.publish(table, 'add', object, id);
  }

  put(table, id, object) { // Put an object into table with id
    this.publish(table, 'put', object, id);
  }

  del(table, id) { // Delete  an object from table with id
    this.publish(table, 'del', {}, id);
  }

  // SQL tables with multiple objects (rows)
  insert(table, objects) { // Insert objects into table with unique id
    this.publish(table, 'insert', objects);
  }

  update(table, objects) { // # Update objects into table mapped by id
    this.publish(table, 'update', objects);
  }

  remove(table, where) { // Remove objects from table with where clause
    this.publish(table, 'remove', where.toString());
  }

  // Table DDL (Data Definition Language)
  open(table) { // Create a table with an optional schema
    this.publish(table, 'open', table);
  }

  drop(table) { // Drop the entire @table - good for testing
    this.publish(table, 'drop', table);
  }

};

Pipe.changeOps = ['change', 'add', 'put', 'del', 'insert', 'update', 'remove'];

export default Pipe;
