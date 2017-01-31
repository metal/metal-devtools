import EventEmitter from 'events';
import Messenger from './Messenger';
import processDataManagers from './processDataManagers';

const __METAL_DEV_TOOLS_COMPONENT_KEY__ = '__METAL_DEV_TOOLS_COMPONENT_KEY__';

let componentId = 0;
let updateScheduled = {};

class RootManager extends EventEmitter {
	constructor() {
		super();

		this._componentMap = {};
		this._listeners = {};
		this._mask;
		this._maskDimensions;
		this._messenger = new Messenger();
		this._roots = [];

		this._handleInitialRoots = this._handleInitialRoots.bind(this);
		this._handleNewRoot = this._handleNewRoot.bind(this);
		this._handleRemoveRoot = this._handleRemoveRoot.bind(this);
		this._traverseTree = this._traverseTree.bind(this);

		this.on('addRoot', this._handleNewRoot);
		this.on('loadRoots', this._handleInitialRoots);
		this.on('removeRoot', this._handleRemoveRoot);
	}

	createOverlayMask() {
		const div = document.createElement('div');
		this._maskDimensions = document.createElement('span');

		this._maskDimensions.style.background = 'rgba(0, 0, 0, 0.65)';
		this._maskDimensions.style.color = '#FFFFFF';
		this._maskDimensions.style.padding = '2px';
		this._maskDimensions.style['font-size'] = '11px';

		div.append(this._maskDimensions);

		div.setAttribute('id', '__METAL_DEV_TOOLS_MASK__');

		div.style.background = 'rgba(111, 168, 220, 0.65)';
		div.style.position = 'fixed';
		div.style['z-index'] = 10000;
		div.style['align-items'] = 'flex-end';

		this._mask = div;

		document.body.append(div);
	}

	getComponentNode(id) {
		if (this._componentMap[id] && this._componentMap[id].element) {
			return this._componentMap[id].element;
		}
	}

	hasComponent(id) {
		return !!this._componentMap[id];
	}

	hasRoots() {
		return this._roots && !!this._roots.length;
	}

	highlightNode(id) {
		if (!this._mask) {
			this.createOverlayMask();
		}

		if (this._componentMap[id]) {
			const {element} = this._componentMap[id];

			const {height, left, top, width} = element.getBoundingClientRect();

			this._maskDimensions.innerHTML = `${width}px x ${height}px`;
			this._mask.style.display = 'flex';
			this._mask.style.height = height ? `${height}px` : 'initial';
			this._mask.style.left = `${left}px`;
			this._mask.style.top = `${top}px`;
			this._mask.style.width = width ? `${width}px` : 'initial';
		}
		else {
			this._mask.style.display = 'none';
		}
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
