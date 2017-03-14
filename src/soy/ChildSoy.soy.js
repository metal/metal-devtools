/* jshint ignore:start */
import Component from 'metal-component';
import Soy from 'metal-soy';
var templates;
goog.loadModule(function(exports) {

// This file was automatically generated from ChildSoy.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace ChildSoy.
 * @public
 */

goog.module('ChildSoy.incrementaldom');

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
  ie_open('div', null, null,
      'style', 'padding-left:32px; background-color: ' + opt_data.backgroundColor + ';');
    itext('Child #');
    var dyn0 = opt_data.index;
    if (typeof dyn0 == 'function') dyn0(); else if (dyn0 != null) itext(dyn0);
    itext(':');
    ie_open('button', null, null,
        'onClick', 'handleClick');
      itext('+');
    ie_close('button');
    ie_open('button', null, null,
        'onClick', 'randomColor');
      itext('color!');
    ie_close('button');
    if (opt_data.subTree) {
      ie_open('div');
        $templateAlias1(null, null, opt_ijData);
      ie_close('div');
    }
  ie_close('div');
}
exports.render = $render;
if (goog.DEBUG) {
  $render.soyTemplateName = 'ChildSoy.render';
}

exports.render.params = ["backgroundColor","index","subTree"];
exports.render.types = {"backgroundColor":"any","index":"any","subTree":"any"};
templates = exports;
return exports;

});

class ChildSoy extends Component {}
Soy.register(ChildSoy, templates);
export { ChildSoy, templates };
export default templates;
/* jshint ignore:end */
