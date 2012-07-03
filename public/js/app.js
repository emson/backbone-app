
// register global variables
//
// TODOS:
//    - inline editing
//
// { "msisdn":"111", "mystatus":"active" }
window.BRIJTALK = window.BRIJTALK || {};

(function ($) {

  // MODELS

  var Conference = Backbone.Model.extend({});
  var Participant = Backbone.Model.extend({
    defaults: {
      name: 'Jon Doe',
      msisdn: '00000000',
      mystatus: 'pending',
    }
  });


  // VIEWS

  var ConferenceView = Backbone.View.extend({

    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render); // 'change' will capture any model change
      this.template = _.template($('#conf-template').html());
    },

    render: function() {
      var renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    }
  });


  var ParticipantView = Backbone.View.extend({
    tagName: 'li',

    initialize: function() {
      _.bindAll(this, 'render'); // must bind 'render' to this view, a model change will then render this view
      this.model.bind('change', this.render); // 'change' will capture any model change
      this.template = _.template($('#participant-template').html());
    },

    render: function() {
      var renderedContent = this.template(this.model.toJSON());
      $(this.el).html(renderedContent);
      return this;
    }
  });


  // tagName, className and id are used to create the View's 'el' attribute
  // Also note that you can pass in an existing element and use that instead
  window.ParticipantsCollectionView = Backbone.View.extend({
    tagName: 'ul',
    id: 'participants',

    initialize: function() {
      var that = this;
      _.bindAll(this, 'render'); // must bind 'render' to this view, a model change will then render this view
      // this.collection.bind('add', function() { alert('stuff'); }); // 'change' will capture any model change
      this._views = [];
      this.collection.each( function(pv) {
        that._views.push(new ParticipantView({
          model: pv,
        }));
      });
    },

    render: function() {
      var that = this;
      // clear out this element
      $(this.el).empty();
      _(this._views).each(function(v) {
        $(that.el).append(v.render().el);
      });
      return this;
    }
  });


  // COLLECTIONS


  // populating a collection from firebug console
  //   window.Part = new Participants;
  //   Part.fetch(); // makes a GET request to /participants
  //   Part.each(function(f) { console.log(f.get('name')); });
  var ParticipantList = Backbone.Collection.extend({
    model: Participant,
    url: '/participants',
  });

  // need to create as global variable... TODO remove as GV
  window.Participants = new ParticipantList;


  // MAIN APP VIEW

  window.AppView = Backbone.View.extend({
    // bind to the app to the main element in the HTML
    el: $('#app'),

    events: {
    },

    initialize: function() {
      // _.bindAll(this, 'render'); // TODO what does bindAll do??
      Participants.bind('add', this.render); // tells AppView to render when a participant is added
      Participants.fetch();
    },

    render: function() {
      var pcv = new ParticipantsCollectionView({ collection:Participants });
      $('#participants').replaceWith(pcv.render().el);
      return this;
    }

    // callback functions
  });



  // BrijTalk PushEvents module
  BRIJTALK.PushEvents = (function(notification_callback) {
    var my = {};

    my.initialize = function initialize() {
      var pusher = new Pusher('08d965124e10dd915b5a');
      var brijtalk_channel = pusher.subscribe('brijtalk_channel');
      brijtalk_channel.bind('call_event', notification_callback);
    };

    my.initialize();
    return my;
  });


  // BrijTalk Helpers module
  BRIJTALK.Helpers = (function() {
    var my = {};

    // callback function for handling push events
    my.notification = function(json_data) {
      var msisdn = json_data.msisdn;
      // try and find a matching msisdn
      var list = window.Participants.where({ msisdn: msisdn });
      if(list.length === 0) {
        console.log('creating msisdn: ' + msisdn);
        // simply add to collection and re-render
        // don't call back to server
        window.Participants.add(json_data);

      } else {
        console.log('updating msisdn: ' + msisdn);
        list[0].set(json_data);
      }
    };

    return my;
  })(); // automatically run this module



  // instantiate PushEvents, so clients are listening for pushes
  var pushEvents = new BRIJTALK.PushEvents(BRIJTALK.Helpers.notification);


})(jQuery);


// wait for page to load
$(document).ready(function() {

  // Create the application
  window.App = new AppView;
  setTimeout("window.App.render();", 1000);

});

