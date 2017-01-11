function createHookObject(injectedWindow) {
	if (!injectedWindow.__METAL_DEV_TOOLS_HOOK__) {
		window.__METAL_DEV_TOOLS_HOOK__ = {
			_listeners: {},
			_roots: [],
			addRoot: function(component) {
				this._roots.push(component);

				this.emit('addRoot', component);
			},
			removeAllRoots: function() {
				this._roots = [];

				this.emit('removeAllRoots');
			},
			removeRoot: function(component) {
				this._roots = this._roots.filter(
					rootComponent => component !== rootComponent
				);

				this.emit('removeRoot');
			},
			on: function(evt, fn) {
				if (!this._listeners[evt]) {
					this._listeners[evt] = [];
				}
				this._listeners[evt].push(fn);
			},
			emit: function(evt, data) {
				if (this._listeners[evt]) {
					this._listeners[evt].map(fn => fn(data));
				}
			}
		};
	}
}

const script = document.createElement('script');

script.textContent = ';(' + createHookObject.toString() + '(window))';

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
