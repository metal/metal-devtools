import Messenger from './Messenger';

class Hook {
	constructor() {
		this._roots = [];

		this._firstAdd = false;
	}

	add(component) {
		if (!this._firstAdd) {
			Messenger.informMetalDetected();

			this._firstAdd = true;
		}

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
