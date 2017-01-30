import EventEmitter from 'events';

import Messenger from './Messenger';
import processDataManagers from './processDataManagers';

const __METAL_DEV_TOOLS_COMPONENT_KEY__ = '__METAL_DEV_TOOLS_COMPONENT_KEY__';

let componentId = 0;
let updateScheduled = {};

class RootManager extends EventEmitter {
	constructor() {
		super();

		this._messenger = new Messenger();
		this._listeners = {};
		this._roots = [];
		this._componentMap = [];

		this._handleInitialRoots = this._handleInitialRoots.bind(this);
		this._handleNewRoot = this._handleNewRoot.bind(this);
		this._handleRemoveRoot = this._handleRemoveRoot.bind(this);
		this._traverseTree = this._traverseTree.bind(this);

		this.on('addRoot', this._handleNewRoot);
		this.on('loadRoots', this._handleInitialRoots);
		this.on('removeRoot', this._handleRemoveRoot);
	}

	hasRoots() {
		return this._roots && !!this._roots.length;
	}

	_attachComponentListeners(component, rootComponent) {
		if (!component[__METAL_DEV_TOOLS_COMPONENT_KEY__]) {
			const id = `${__METAL_DEV_TOOLS_COMPONENT_KEY__}${componentId++}`;

			component[__METAL_DEV_TOOLS_COMPONENT_KEY__] = id;

			this._componentMap[id] = component;

			component.on(
				'rendered',
				() => this._handleComponentUpdated(rootComponent)
			);

			component.on(
				'detached',
				() => this._messenger.emit('detached', {id})
			);
		}
	}

	_handleComponentUpdated(rootComponent) {
		const rootId = rootComponent[__METAL_DEV_TOOLS_COMPONENT_KEY__];

		if (!updateScheduled[rootId]) {
			updateScheduled[rootId] = true;

			setTimeout(
				() => {
					this._messenger.emit(
						'update',
						this._traverseTree(rootComponent, rootComponent)
					);

					updateScheduled[rootId] = false;
				},
				0
			);
		}
	}

	_handleInitialRoots() {
		this._roots.forEach(
			root => {
				this._messenger.emit('root', this._traverseTree(root, root));
			}
		);
	}

	_handleNewRoot(component) {
		this._roots.push(component);
	}

	_handleRemoveRoot(component) {
		this._roots = this._roots.filter(
			rootComponent => component !== rootComponent
		);
	}

	_traverseTree(component, rootComponent) {
		if (!component) {
			return {};
		}

		this._attachComponentListeners(component, rootComponent);

		const renderer = component.__METAL_IC_RENDERER_DATA__;

		let containsInspected = false;

		if (window.__METAL_DEV_TOOLS_HOOK__.$0 && component.element && component.element.contains) {
			containsInspected = component.element.contains(window.__METAL_DEV_TOOLS_HOOK__.$0);

			if (window.__METAL_DEV_TOOLS_HOOK__.$0 === component.element) {
				this._messenger.emit('selected', {id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__]});
			}
		}

		return {
			containsInspected,
			data: processDataManagers(component.__DATA_MANAGER_DATA__),
			id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
			name: component.name || component.constructor.name,
			childComponents: renderer && renderer.childComponents && renderer.childComponents.map(
				childComponent => this._traverseTree(childComponent, rootComponent)
			)
		};
	}
}

export default RootManager;
