var Main;

import Util from '../../pub/util/Util.js';

import Data from '../../pub/util/Data.js';

import Stream from '../../pub/util/Stream.js';

Main = (function() {
  class Main {
    static begin(onReady) {
      Main.onReady = onReady;
      Data.asyncJSON("Info.json", Main.init);
    }

    static init(data) {
      var infoSpec, subjects;
      Main.Spec = data;
      subjects = ["Ready", "Select", "Choice", "Test"];
      subjects = subjects.concat(Main.NavbSubjects);
      infoSpec = {
        subscribe: false,
        publish: false,
        subjects: ["Select", "Choice", "Test"]
      };
      Main.stream = new Stream(subjects, infoSpec);
      Main.onReady();
    }

  };

  Data.local = "http://localhost:63342/aug/pub/muse/";

  Data.hosted = "https://ui-48413.firebaseapp.com/";

  Main.vueMixin = {
    created: function() {
      console.log('Main.vueMixin.created() globally');
    },
    methods: {
      subscribe: function(subject, source, onMethod) {
        Main['stream'].subscribe(subject, source, onMethod);
      },
      publish: function(subject, object) {
        Main['stream'].publish(subject, object);
      }
    }
  };

  Main.NavbSubjects = ["Search", "Contact", "Settings", "SignOn"];

  Main.NavbSpecs = [
    {
      type: "NavBarLeft"
    },
    {
      type: "Item",
      name: "Home",
      icon: "fa-home",
      topic: 'SelectView',
      subject: "Select"
    },
    {
      type: "NavBarEnd"
    },
    {
      type: "NavBarRight"
    },
    {
      type: "Search",
      name: "Search",
      icon: "fa-search",
      size: "10",
      topic: 'Search',
      subject: "Search"
    },
    {
      type: "Contact",
      name: "Contact",
      icon: "fa-user",
      topic: "http://twitter.com/TheTomFlaherty",
      subject: "Contact"
    },
    {
      type: "Dropdown",
      name: "Settings",
      icon: "fa-cog",
      items: [
        {
          type: "Item",
          name: "Preferences",
          topic: "Preferences",
          subject: "Settings"
        },
        {
          type: "Item",
          name: "Connection",
          topic: "Connection",
          subject: "Settings"
        },
        {
          type: "Item",
          name: "Privacy",
          topic: "Privacy",
          subject: "Settings"
        }
      ]
    },
    {
      type: "SignOn",
      name: "SignOn",
      icon: "fa-sign-in",
      size: "10",
      topic: 'SignOn',
      subject: "SignOn"
    },
    {
      type: "NavBarEnd"
    }
  ];

  Util.noop(Main.NavbSpecs);

  return Main;

}).call(this);

export default Main;
