/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from AppSoy.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace AppSoy.
 * @public
 */

goog.module('AppSoy.incrementaldom');

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

var $templateAlias1 = Soy.getTemplate('ParentSoy.incrementaldom', 'render');


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
      itext('Soy example');
    ie_close('h1');
    $templateAlias1({childrenArr: []}, null, opt_ijData);
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'AppSoy.render';
}

exports.render.params = [];
exports.render.types = {};
templates = exports;
return exports;

});

class AppSoy extends Component {}
Soy.register(AppSoy, templates);
export { AppSoy, templates };
export default templates;
/* jshint ignore:end */
