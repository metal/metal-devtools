class Hook {
	constructor() {
		this._components = [];
	}

	add(component) {
		this._components.push(component);
	}

	getAll() {
		return this._components;
	}

	hasComponents() {
		return this._components && !!this._components.length;
	}
}

export default Hook;
