# metal-dev-tools

![Screenshot](screenshot.png)

### Installation

* Clone Repo
* run `npm install`
* run `npm run build` or `npm run watch` for developing
* Go to Chrome and open extensions pane
* Click on "Load unpacked extension" and select this project

### Modifying Metal.js
Unfortunately in order to currently get this working we need to modify Metal.js. To do so
go to `node_modules/metal-component/lib/Component.js` and replace `Component.render` with

```js
key: 'render',
value: function render(Ctor, opt_configOrElement, opt_element) {
	var config = opt_configOrElement;
	var element = opt_element;
	if ((0, _metal.isElement)(opt_configOrElement)) {
		config = null;
		element = opt_configOrElement;
	}
	var instance = new Ctor(config, false);

	// This is the devtool specific code added
		if (window.__METAL_DEV_TOOLS_HOOK__) {
			window.__METAL_DEV_TOOLS_HOOK__(instance);
		}

	instance.renderComponent(element);
	return instance;
}
```
