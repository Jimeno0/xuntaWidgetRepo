define(['dojo/text!./templates/SubWidget.html', 'dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin'], function (template, declare, _WidgetBase, _TemplatedMixin) {
  return declare([_WidgetBase, _TemplatedMixin], {
    // description:
    //    Search Subwidget

    templateString: template,
    baseClass: 'sub-widget',

    // Properties to be sent into constructor

    postCreate: function postCreate() {
      // summary:
      //    Overrides method of same name in dijit._Widget.
      // tags:
      //    private
      console.log('widgets.wrapperXunta.SubWidget::postCreate', arguments);

      this.setupConnections();

      this.inherited(arguments);
    },
    setupConnections: function setupConnections() {
      // summary:
      //    wire events, and such
      //
      console.log('widgets.wrapperXunta.SubWidget::setupConnections', arguments);
    }
  });
});
