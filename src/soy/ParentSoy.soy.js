/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ParentSoy.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ParentSOY.
 * @public
 */

goog.module('ParentSOY.incrementaldom');

/** @suppress {extraRequire} */
var soy = goog.require('soy');
/** @suppress {extraRequire} */
var soydata = goog.require('soydata');
/** @suppress {extraRequire} */
goog.require('goog.i18n.bidi');
/** @suppress {extraRequire} */
goog.require('goog.asserts');
/** @suppress {extraRequire} */
goog.require('goog.string');
var IncrementalDom = goog.require('incrementaldom');
var ie_open = IncrementalDom.elementOpen;
var ie_close = IncrementalDom.elementClose;
var ie_void = IncrementalDom.elementVoid;
var ie_open_start = IncrementalDom.elementOpenStart;
var ie_open_end = IncrementalDom.elementOpenEnd;
var itext = IncrementalDom.text;
var iattr = IncrementalDom.attr;

var $templateAlias1 = Soy.getTemplate('ChildSOY.incrementaldom', 'render');


/**
 * @param {Object<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @param {Object<string, *>=} opt_ijData
 * @return {void}
 * @suppress {checkTypes}
 */
function $render(opt_data, opt_ignored, opt_ijData) {
  ie_open('div');
    itext('Go to:');
    ie_open('a', null, null,
        'href', '/metal-devtools/jsx.html');
      itext('JSX example');
    ie_close('a');
    ie_open('h1');
      itext('JSX example');
    ie_close('h1');
    ie_open('button', null, null,
        'onClick', 'addChild');
      itext('Add a Child!');
    ie_close('button');
    var childList11 = opt_data.childrenArr;
    var childListLen11 = childList11.length;
    for (var childIndex11 = 0; childIndex11 < childListLen11; childIndex11++) {
      var childData11 = childList11[childIndex11];
      $templateAlias1({index: childIndex11}, null, opt_ijData);
    }
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ParentSOY.render';
}

exports.render.params = ["childrenArr"];
exports.render.types = {"childrenArr":"any"};
templates = exports;
return exports;

});

class ParentSOY extends Component {}
Soy.register(ParentSOY, templates);
export { ParentSOY, templates };
export default templates;
/* jshint ignore:end */
