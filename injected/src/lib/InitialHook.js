class Hook {
	constructor() {
		this._roots = [];
	}

	add(component) {
		this._roots.push(component);
	}

	getAll() {
		return this._roots;
	}

	hasRoots() {
		return this._roots && !!this._roots.length;
	}
}

export default Hook;
