/*global window, Backbone, Freelancer, $, document, _ */

window.Freelancer = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($rootEl) {
    new Freelancer.Routers.AppRouter({
      $rootEl: $rootEl
    });
    Backbone.history.start();
  }
};

$(document).ready(function(){
  if(typeof $('#content')[0] !== "undefined"){
    Freelancer.initialize($('#content'));    
  }
});

Backbone.Collection.prototype.getOrFetch = function(id) {
  var collection = this;
  var model = this.get(id);

  if(model) {
    return model;
  } else {
    model = new this.model({
      id: id
    });
    model.fetch({
      success: function() {
        collection.add(model);
      }
    });
    return model;
  }
};

Backbone.View.prototype.spinner = function(selector) {
  var $target;
  if(selector) {
    $target = this.$el.find(selector)
  } else {
    $target = this.$el
  }
  $target.html('<div id="canvasloader"></div>')
  
  var cl = new CanvasLoader('canvasloader');
  cl.setColor('#F5302F'); // default is '#000000'
  cl.setShape('spiral'); // default is 'oval'
  cl.setDiameter(58); // default is 40
  cl.setDensity(95); // default is 40
  cl.setRange(1); // default is 1.3
  cl.setSpeed(4); // default is 2
  cl.setFPS(49); // default is 24
  cl.show(); // Hidden by default
};

Backbone.CompositeView = Backbone.View.extend({
  addSubview: function (selector, subview) {
    this.subviews(selector).push(subview);
    this.attachSubview(selector, subview);
  },


  attachSubview: function (selector, subview) {
    this.$(selector).first().append(subview.render().$el);
    subview.delegateEvents();
  },

  attachSubviews: function () {
    var view = this;
    _(this.subviews()).each(function (subviews, selector) {
      view.$(selector).empty();
      _(subviews).each(function (subview) {
        view.attachSubview(selector, subview);
      });
    });
  },

  remove: function () {
    Backbone.View.prototype.remove.call(this);
    _(this.subviews()).each(function (subviews) {
      _(subviews).each(function (subview) { subview.remove(); });
    });
  },

  removeSubview: function (selector, subview) {
    subview.remove();

    var subviews = this.subviews(selector);
    subviews.splice(subviews.indexOf(subview), 1);
  },
  
  removeSubviews: function(selector) {
    if(this._subviews && this._subviews[selector]) {
      this._subviews[selector].forEach(function(subview) {
        subview.remove();
      });
    }
  },

  subviews: function (selector) {
    this._subviews = this._subviews || {};

    if (!selector) {
      return this._subviews;
    } else {
      this._subviews[selector] = this._subviews[selector] || [];
      return this._subviews[selector];
    }
  }
});
