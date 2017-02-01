import EventEmitter from 'events';

import Messenger from './Messenger';
import processDataManagers from './processDataManagers';

const __METAL_DEV_TOOLS_COMPONENT_KEY__ = '__METAL_DEV_TOOLS_COMPONENT_KEY__';

const maskDimensionStyles = {
	background: 'rgba(0, 0, 0, 0.65)',
	color: '#FFFFFF',
	'font-size': '11px',
	padding: '2px'
};

const maskStyles = {
	'align-items': 'flex-end',
	background: 'rgba(111, 168, 220, 0.65)',
	position: 'fixed',
	'z-index': 10000
};

let componentId = 0;
let updateScheduled = {};

function applyStyles(element, styles) {
	Object.keys(styles).forEach(name => element.style[name] = styles[name]);
}

class RootManager extends EventEmitter {
	constructor() {
		super();

		this._handleInitialRoots = this._handleInitialRoots.bind(this);
		this._handleNewRoot = this._handleNewRoot.bind(this);
		this._handleRemoveRoot = this._handleRemoveRoot.bind(this);
		this._traverseTree = this._traverseTree.bind(this);

		this._componentMap = {};
		this._listeners = {};
		this._mask = null;
		this._maskDimensions = null;
		this._previousSelectedId = '';
		this._roots = [];

		this.on('addRoot', this._handleNewRoot);
		this.on('loadRoots', this._handleInitialRoots);
		this.on('removeRoot', this._handleRemoveRoot);
	}

	createOverlayMask() {
		this._mask = document.createElement('div');
		this._maskDimensions = document.createElement('span');

		applyStyles(this._maskDimensions, maskDimensionStyles);
		applyStyles(this._mask, maskStyles);

		this._mask.setAttribute('id', '__METAL_DEV_TOOLS_MASK__');

		this._mask.append(this._maskDimensions);
		document.body.append(this._mask);
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

		const element = this.getComponentNode(id);

		if (element) {
			const {height, left, top, width} = element.getBoundingClientRect();

			this._maskDimensions.innerHTML = `${width}px x ${height}px`;

			applyStyles(
				this._mask,
				{
					display: 'flex',
					height: height ? `${height}px` : 'initial',
					left: `${left}px`,
					top: `${top}px`,
					width: width ? `${width}px` : 'initial'
				}
			);
		}
		else {
			this._mask.style.display = 'none';
		}
	}

	processComponentObj(component) {
		return {
			data: processDataManagers(component.__DATA_MANAGER_DATA__),
			id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
			name: component.name || component.constructor.name,
		};
	}

	selectComponent(id) {
		this._previousSelectedId = id;

		Messenger.informSelected(
			this.processComponentObj(this._componentMap[id])
		);
	}

	_attachComponentListeners(component, rootComponent) {
		if (!component[__METAL_DEV_TOOLS_COMPONENT_KEY__]) {
			const id = `${__METAL_DEV_TOOLS_COMPONENT_KEY__}${componentId++}`;

			component[__METAL_DEV_TOOLS_COMPONENT_KEY__] = id;

			this._componentMap[id] = component;

			component.on(
				'detached',
				() => Messenger.informDetached({id})
			);

			component.on(
				'rendered',
				() => Messenger.informRendered(id)
			);

			component.on(
				'stateSynced',
				() => this._handleComponentUpdated(rootComponent)
			);
		}
	}

	_handleComponentUpdated(rootComponent) {
		const rootId = rootComponent[__METAL_DEV_TOOLS_COMPONENT_KEY__];

		if (!updateScheduled[rootId]) {
			updateScheduled[rootId] = true;

			setTimeout(
				() => {
					Messenger.informUpdate(
						this._traverseTree(rootComponent, rootComponent)
					);

					this._updateCurrentSelected();

					updateScheduled[rootId] = false;
				},
				0
			);
		}
	}

	_handleInitialRoots() {
		this._roots.forEach(
			root => {
				Messenger.informNewRoot(this._traverseTree(root, root));
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
				this.selectComponent(component[__METAL_DEV_TOOLS_COMPONENT_KEY__]);
			}
		}

		return {
			containsInspected,
			id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
			name: component.name || component.constructor.name,
			childComponents: renderer && renderer.childComponents && renderer.childComponents.map(
				childComponent => this._traverseTree(childComponent, rootComponent)
			)
		};
	}

	_updateCurrentSelected() {
		Messenger.informSelected(
			this.processComponentObj(this._componentMap[this._previousSelectedId])
		);
	}
}

export default RootManager;
