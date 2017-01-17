class RootManager {
	constructor() {
		this._listeners = {};
		this._roots = [];
	}

	addRoot(component) {
		this._roots.push(component);

		this.emit('addRoot', component);
	};

	getRoots() {
		return this._roots;
	};

	hasRoots() {
		return this._roots && !!this._roots.length;
	};

	reloadRoots() {
		this.emit('reloadRoots');
	};

	removeAllRoots() {
		this._roots = [];

		this.emit('removeAllRoots');
	};

	removeRoot(component) {
		this._roots = this._roots.filter(
			rootComponent => component !== rootComponent
		);

		this.emit('removeRoot');
	};

	on(evt, fn) {
		if (!this._listeners[evt]) {
			this._listeners[evt] = [];
		}
		this._listeners[evt].push(fn);
	};

	emit(evt, data) {
		if (this._listeners[evt]) {
			this._listeners[evt].map(fn => fn(data));
		}
	};
}

export default RootManager;
