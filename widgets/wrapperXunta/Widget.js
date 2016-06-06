define(['dojo/_base/declare', 'jimu/BaseWidget','./SubWidget'],
function(declare, BaseWidget,SubWidget) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    // Custom widget code goes here

    baseClass: 'wrapper-xunta',
    // this property is set by the framework when widget is loaded.
    // name: 'wrapperXunta',
    // add additional properties here

    //methods to communication with app container:
    postCreate: function() {
      this.inherited(arguments);
      this.subWidget = new SubWidget({},this.subWidgetNode);
    },

    startup: function() {
      this.inherited(arguments);
      this.subWidget.startup();
    }

    // onOpen: function(){
    //   console.log('wrapperXunta::onOpen');
    // },

    // onClose: function(){
    //   console.log('wrapperXunta::onClose');
    // },

    // onMinimize: function(){
    //   console.log('wrapperXunta::onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('wrapperXunta::onMaximize');
    // },

    // onSignIn: function(credential){
    //   console.log('wrapperXunta::onSignIn', credential);
    // },

    // onSignOut: function(){
    //   console.log('wrapperXunta::onSignOut');
    // }

    // onPositionChange: function(){
    //   console.log('wrapperXunta::onPositionChange');
    // },

    // resize: function(){
    //   console.log('wrapperXunta::resize');
    // }

    //methods to communication between widgets:

  });

});
