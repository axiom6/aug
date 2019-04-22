var Connect;

import Util from '../util/Util.js';

Connect = (function() {
  class Connect {
    // @migrateComplete = false
    // @StatusEnum  = ['Beg','In','End']
    // @MsgTypeEnum = ['Convey','Flow','Conduit']
    // @DirEnum     = ['West','East','North','South','Prev','Next']
    constructor(ui, stream1, view, page, practice) {
      this.ui = ui;
      this.stream = stream1;
      this.view = view;
      this.page = page;
      this.practice = practice;
      this.name = this.practice.name;
      this.msgs = {};
    }

    ready() {
      [this.west, this.east, this.north, this.south, this.prev, this.next] = this.adjacentConnects();
      // console.log( { name:@name, west:@west.name, east:@east.name, north:@north.name, south:@south.name, prev:@prev.name, next:@next.name } )
      this.subscribe();
    }

    subscribe() {
      this.stream.subscribe('Select', 'Connect', (select) => {
        return this.onSelect(select);
      });
      this.stream.subscribe('Content', 'Connect', (content) => {
        return this.onContent(content);
      });
      this.stream.subscribe('Connect', 'Connect', (connect) => {
        return this.onConnect(connect);
      });
      return this.stream.subscribe('Test', 'Connect', (test) => {
        return this.onTest(test);
      });
    }

    adjacentConnects() {
      var connect, connects, dir, i, len, pane, prac, ref;
      connects = [];
      if (this.practice.column == null) { // Somehow studies are getting mixed in
        return connects;
      }
      ref = ['east', 'west', 'north', 'south'];
      for (i = 0, len = ref.length; i < len; i++) {
        dir = ref[i];
        prac = this.practice[dir];
        pane = prac.name !== 'None' ? this.view.getPaneOrGroup(prac.name, false) : this.view.$empty;
        connect = pane.name !== 'Empty' && (pane.page != null) ? pane.page.connect : {
          name: 'None'
        };
        connects.push(connect);
      }
      return connects;
    }

    onSelect(select) {
      if (select.name !== this.name) {
        return;
      }
    }

    onContent(content) {
      if (content.content !== 'Connect' || content.practice !== this.name) {
        return;
      }
    }

    onTest(topic) {
      switch (topic) {
        case 'Populate':
          this.stream.publish('Content', {
            content: "Connect",
            name: "All"
          });
          Connect.testPopulate(this.stream);
          break;
        case 'Migrate':
          this.stream.publish('Content', {
            content: "Connect",
            name: "All"
          });
          Connect.testMigrate(this.ui.prac);
      }
    }

    // Messaage subscriptions
    onConnect(msg) {
      // console.log( 'onConnect', @isSrc(msg), @isMsg(msg), @name, msg )
      if (!this.isSrc(msg) || !this.isMsg(msg)) {
        return;
      }
      msg.dir = this.dir(msg);
      switch (msg.type) {
        case 'Convey':
          this.onConvey(msg);
          break;
        case 'Flow':
          this.onFlow(msg);
          break;
        case 'Conduit':
          this.onConduit(msg);
          break;
        default:
          console.error('Connect.onConnect() unknown msg type', msg.type);
      }
      if (msg.status !== 'Beg') {
        console.error('Connect.onConnect() msg not processed', msg.name, msg.id);
      }
    }

    onConvey(convey) {
      if (!this.isConvey(convey)) {
        return;
      }
      if (convey.src === 'To' + this.name) {
        this.onItem(convey, convey.dir);
      } else if (convey.src === this.west.name) {
        this.onItem(convey, 'West');
      } else if (convey.src === this.east.name) {
        this.onItem(convey, 'East');
      }
      this.msgs[convey.id] = convey;
      return convey.status = 'Beg';
    }

    onFlow(flow) {
      if (!this.isFlow(flow)) {
        return;
      }
      if (flow.src === 'To' + this.name) {
        this.onItem(flow, flow.dir);
      } else if (flow.src === this.north.name) {
        this.onItem(flow, 'North');
      } else if (flow.src === this.south.name) {
        this.onItem(flow, 'South');
      }
      this.msgs[flow.id] = flow;
      return flow.status = 'Beg';
    }

    onConduit(conduit) {
      if (!this.isConduit(conduit)) {
        return;
      }
      if (conduit.src === 'To' + this.name) {
        this.onItem(conduit, conduit.dir);
      } else if (conduit.src === this.prev.name) {
        this.onItem(conduit, 'Prev');
      } else if (conduit.src === this.next.name) {
        this.onItem(conduit, 'Next');
      }
      this.msgs[conduit.id] = conduit;
      return conduit.status = 'Beg';
    }

    // Message pushes to direction
    toWest(id) {
      return this.migrate(id, 'West');
    }

    toEast(id) {
      return this.migrate(id, 'East');
    }

    toNorth(id) {
      return this.migrate(id, 'North');
    }

    toSouth(id) {
      return this.migrate(id, 'South');
    }

    toPrev(id) {
      return this.migrate(id, 'Prev');
    }

    toNext(id) {
      return this.migrate(id, 'Next');
    }

    migrate(id, dir) {
      var msg;
      if (!this.canMigrate(id, dir)) {
        return;
      }
      msg = this.msgs[id];
      this.rmItem(msg);
      msg.dir = dir;
      msg.src = this.name;
      this.connect(dir).onConnect(msg);
      return delete this.msgs[msg.id];
    }

    canMigrate(id, dir) {
      var msg;
      msg = this.msgs[id];
      return (msg != null) && this.dirOk(msg, dir) && this.isConnected(dir); // and msg.status is 'End' - will check status later
    }

    
    // --- UI Connect content ---
    onItem(msg, dir) {
      var elem$, htmlId;
      htmlId = this.page.contents.connect.htmlId + dir;
      elem$ = this.page.contents.connect.$.find('#' + htmlId);
      elem$.append(`<li id="${htmlId + msg.id}">${msg.name}</li>`);
      msg.dir = dir;
    }

    rmItem(msg) {
      var $, htmlId;
      htmlId = this.page.contents.connect.htmlId + msg.dir + msg.id;
      $ = this.page.contents.connect.$.find('#' + htmlId);
      $.remove();
    }

    dir(msg) {
      var dir;
      dir = msg.dir;
      if (msg.src.substring(0, 2) === 'To') {
        switch (this.practice.column) {
          case 'Embrace':
            dir = 'West';
            break;
          case 'Encourage':
            dir = 'East';
            break;
          case 'Innovate':
            switch (this.practice.row) {
              case 'Learn':
                dir = 'North';
                break;
              case 'Do':
                dir = 'Next';
                break;
              case 'Share':
                dir = 'South';
                break;
              default:
                dir = msg.dir;
            }
            break;
          default:
            dir = msg.dir;
        }
      }
      return dir;
    }

    // --- Verifiers ---

    // Quick check for onConnect() subscription so no error messages
    isSrc(msg) {
      if ((msg == null) || (msg.src == null) || (msg.type == null)) {
        return false;
      }
      if (msg.src === 'To' + this.name) {
        return true;
      }
      switch (msg.type) {
        case 'Convey':
          return msg.src === this.west.name || msg.src === this.east.name;
        case 'Flow':
          return msg.src === this.north.name || msg.src === this.south.name;
        case 'Conduit':
          return msg.src === this.prev.name || msg.src === this.next.name;
        default:
          return false;
      }
    }

    isMsg(msg) {
      var ok;
      ok = (msg != null) && (msg.id != null) && (msg.name != null) && this.isType(msg.type) && this.isDir(msg.dir) && this.isStatus(msg.status);
      if (msg == null) {
        console.error('Connect.isMsg()', 'msg      null');
      }
      if ((msg != null) && (msg.id == null)) {
        console.error('Connect.isMsg()', 'msg.id   null');
      }
      if ((msg != null) && (msg.name == null)) {
        console.error('Connect.isMsg()', 'msg.name null');
      }
      return ok;
    }

    isConvey(convey) {
      return convey.type === 'Convey' && (this.msgs[convey.id] == null);
    }

    isFlow(flow) {
      return flow.type === 'Flow' && (this.msgs[flow.id] == null);
    }

    isConduit(conduit) {
      return conduit.type === 'Conduit' && (this.msgs[conduit.id] == null);
    }

    isType(type) {
      var ok;
      ok = Util.contains(Connect.MsgTypeEnum, type);
      if (!ok) {
        console.error(`Connect.isType() enum ${type} not`, Connect.MsgTypeEnum);
      }
      return ok;
    }

    isDir(dir) {
      var ok;
      ok = Util.contains(Connect.DirEnum, dir);
      if (!ok) {
        console.error(`Connect.isDir() enum ${dir} not`, Connect.DirEnum);
      }
      return ok;
    }

    isStatus(status) {
      var ok;
      ok = Util.contains(Connect.StatusEnum, status);
      if (!ok) {
        console.error(`Connect.isStatus() enum ${status} not`, Connect.StatusEnum);
      }
      return ok;
    }

    isConnected(dir) {
      return this.connect(dir).name !== 'None';
    }

    dirOk(msg, dir) {
      switch (dir) {
        case 'West':
        case 'East':
          return msg.type === 'Convey';
        case 'North':
        case 'South':
          return msg.type === 'Flow';
        case 'Prev':
        case 'Next':
          return msg.type === 'Conduit';
        default:
          return false;
      }
    }

    connect(dir) {
      switch (dir) {
        case 'West':
          return this.west;
        case 'East':
          return this.east;
        case 'North':
          return this.north;
        case 'South':
          return this.south;
        case 'Prev':
          return this.prev;
        case 'Next':
          return this.next;
        default:
          console.error('Connect.toConnect() unknown direction', dir);
          return this.west;
      }
    }

    // --- Class Tests
    static msg(id, name, type, src, status = 'Beg') {
      var dir, msg;
      dir = 'West';
      msg = {
        id: id,
        name: name,
        type: type,
        src: src,
        dir: dir,
        status: status
      };
      Connect.msgs.push(msg);
      return msg;
    }

    static testPopulate(stream) {
      var msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8, msg9;
      msg1 = Connect.msg(1, 'Person', 'Convey', 'ToCollaborate');
      stream.publish('Connect', msg1);
      msg2 = Connect.msg(2, 'Entitle', 'Flow', 'ToConcept');
      stream.publish('Connect', msg2);
      msg3 = Connect.msg(3, 'Channel', 'Convey', 'ToDiscover');
      stream.publish('Connect', msg3);
      msg4 = Connect.msg(4, 'Trace', 'Convey', 'ToAdapt');
      stream.publish('Connect', msg4);
      msg5 = Connect.msg(5, 'Screen', 'Flow', 'ToTechnology');
      stream.publish('Connect', msg5);
      msg6 = Connect.msg(6, 'Review', 'Convey', 'ToBenefit');
      stream.publish('Connect', msg6);
      msg7 = Connect.msg(7, 'Config', 'Convey', 'ToChange');
      stream.publish('Connect', msg7);
      msg8 = Connect.msg(8, 'Support', 'Flow', 'ToFacilitate');
      stream.publish('Connect', msg8);
      msg9 = Connect.msg(9, 'Comply', 'Convey', 'ToGovern');
      return stream.publish('Connect', msg9);
    }

    static testMigrate(prac) {
      if (Connect.migrateComplete) {
        return;
      }
      prac.migrateConnectMsg(1, 'East');
      prac.migrateConnectMsg(2, 'South');
      prac.migrateConnectMsg(3, 'West');
      prac.migrateConnectMsg(4, 'East');
      //rac.migrateConnectMsg( 5, 'South' )
      prac.migrateConnectMsg(6, 'West');
      prac.migrateConnectMsg(7, 'East');
      prac.migrateConnectMsg(8, 'North');
      prac.migrateConnectMsg(9, 'West');
      return Connect.migrateComplete = true;
    }

  };

  Muse.Connect = Connect;

  Connect.id = 0;

  Connect.msgs = [];

  Util.noop(Connect.toWest, Connect.toEast, Connect.toNorth, Connect.toSouth, Connect.toPrev, Connect.toNext);

  return Connect;

}).call(this);

export default Connect;
