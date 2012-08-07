// Example 1 is a really simple standalone example
// with all the JavaScript embeded into one file.
// The example1.html file contains all the templates,
// as well as all the required JavaScript modules.

// Create a global namespace
window.EXAMPLE1 = {
  Models: {},
  Collections: {},
  Views: {},
  init: function() {
    // display the shop model
    var shopModel = new EXAMPLE1.Models.Shop({ name: "Ben's Shop" });
    EXAMPLE1.Shop = new EXAMPLE1.Views.ShopShow({ model: shopModel });
    EXAMPLE1.Shop.render();
    // display the items collection
    var item1 = new EXAMPLE1.Models.Item({ name: "car", price: "10.00" });
    var item2 = new EXAMPLE1.Models.Item({ name: "boat", price: "12.00" });
    var itemsCollection = new EXAMPLE1.Collections.Items([ item1, item2 ]);
    EXAMPLE1.Items = new EXAMPLE1.Views.ItemsIndex({ collection: itemsCollection });
    EXAMPLE1.Items.render();
  },
};

// start the Backbone application when
// the page has finished loading
$(document).ready(function(){
  EXAMPLE1.init();
});


// MODELS

EXAMPLE1.Models.Shop = Backbone.Model.extend({});
EXAMPLE1.Models.Item = Backbone.Model.extend({});


// VIEWS


EXAMPLE1.Views.ShopShow = Backbone.View.extend({
  // set's the root element tag to be an <h3>
  // otherwise this view will default to
  // a <div>
  tagName: 'h3',
  // set's the id of this element
  // thus:  <h3 id='shop'>...</h3>
  id: 'shop',

  initialize: function() {
    // a change to the shop model will cause backbone
    // to re-render this view
    this.model.on('change', this.render, this);
    // use JQuery to get the template markup,
    // and then set it to the underscore templating system
    this.template = _.template($('#shop-template').html());
  },

  render: function() {
    // underscore templating needs JSON in order to merge in
    // template data
    var renderedContent = this.template( this.model.toJSON() );
    // this.$el is the same as $(this.el)
    var new_html = this.$el.html( renderedContent );
    // use JQuery to replace the #shop id with this rendered html
    $('#shop').replaceWith( new_html );
    // always return this for chaining templates
    return this;
  },

});


// View that renders a list of items
EXAMPLE1.Views.ItemsIndex = Backbone.View.extend({
  tagName: 'ul',
  id: 'items',

  initialize: function() {
    // this.collection.on('change', this.render, this);
  },

  render: function() {
    // uses underscore each method to iterate over each
    // item in the collection applying the appendItem
    // function
    this.collection.each( this.appendItem, this );
    // use JQuery to replace the #shop id with this rendered html
    $('#items').replaceWith( this.el );
    return this;
  },

  appendItem: function(item) {
    // get the item view
    var view = new EXAMPLE1.Views.Item({ model: item });
    // render the item view and append it to this 
    // item index view
    this.$el.append( view.render().el );
  },

});


// View that renders a single item
EXAMPLE1.Views.Item = Backbone.View.extend({
  tagName: 'li',

  initialize: function() {
    this.template = _.template($('#item-template').html());
  },

  render: function() {
    this.$el.html( this.template({ model: this.model }) );
    return this;
  },

});



// COLLECTIONS

EXAMPLE1.Collections.Items = Backbone.Collection.extend({
  model: EXAMPLE1.Models.Item,
});

