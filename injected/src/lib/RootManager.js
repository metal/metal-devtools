import Messenger from './Messenger';
import processDataManagers from './processDataManagers';

export const __METAL_DEV_TOOLS_COMPONENT_KEY__ = '__METAL_DEV_TOOLS_COMPONENT_KEY__';

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

class RootManager {
	constructor() {
		this.setInspected = this.setInspected.bind(this);
		this._traverseTree = this._traverseTree.bind(this);

		this._closestSelectedId = null;
		this._componentMap = {};
		this._listeners = {};
		this._inspectedNode = null;
		this._mask = null;
		this._maskDimensions = null;
		this._previousSelectedId = '';
		this._roots = [];
	}

	createOverlayMask() {
		this._mask = document.createElement('div');
		this._maskDimensions = document.createElement('span');

		applyStyles(this._maskDimensions, maskDimensionStyles);
		applyStyles(this._mask, maskStyles);

		this._mask.setAttribute('id', '__METAL_DEV_TOOLS_MASK__');

		this._mask.appendChild(this._maskDimensions);
		document.body.appendChild(this._mask);
	}

	getComponentNode(id) {
		if (this._componentMap[id] && this._componentMap[id].element) {
			return this._componentMap[id].element;
		}
	}

	getDataManagers(id) {
		let retVal = null;

		if (this.hasComponent(id)) {
			retVal = this._componentMap[id].__DATA_MANAGER_DATA__;
		}

		return retVal;
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

	addRoot(component) {
		this._roots.push(component);

		this._executeAsync(
			() => {
				Messenger.informNewRoot(this._traverseTree(component, component));
			}
		);
	}

	processComponentObj(component) {
		return {
			data: component && component.__DATA_MANAGER_DATA__ ? processDataManagers(component.__DATA_MANAGER_DATA__) : null,
			id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
			name: component.name || component.constructor.name,
		};
	}

	reloadRoots(informNew) {
		this._executeAsync(
			() => this._roots.forEach(
				root => {
					if (informNew) {
						Messenger.informNewRoot(this._traverseTree(root, root));
					}
					else {
						this._handleComponentUpdated(root);
					}
				}
			)
		);
	}

	selectComponent(id) {
		this.setInspected(null);

		this._closestSelectedId = null;
		this._previousSelectedId = id;

		Messenger.informSelected(
			this.processComponentObj(this._componentMap[id])
		);
	}

	setComponentState(id, newState, dataManagerName) {
		const dataManagers = this.getDataManagers(id);

		if (dataManagers) {
			const dataManager = dataManagers[`${dataManagerName}_`];

			if (dataManager) {
				dataManager.setState(JSON.parse(newState));
			}
		}
	}

	setInspected(node) {
		this._inspectedNode = node;
	}

	_attachComponentListeners(component, rootComponent) {
		if (!component[__METAL_DEV_TOOLS_COMPONENT_KEY__]) {
			const id = `${__METAL_DEV_TOOLS_COMPONENT_KEY__}${componentId++}`;

			component[__METAL_DEV_TOOLS_COMPONENT_KEY__] = id;

			this._componentMap[id] = component;

			component.on(
				'detached',
				() => {
					this._checkIfRootDetached(id);

					Messenger.informDetached({id});
				}
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

	_executeAsync(fn) {
		setTimeout(fn, 0);
	}

	_handleComponentUpdated(rootComponent) {
		const rootId = rootComponent[__METAL_DEV_TOOLS_COMPONENT_KEY__];

		if (!updateScheduled[rootId]) {
			updateScheduled[rootId] = true;

			this._executeAsync(
				() => {
					Messenger.informUpdate(
						this._traverseTree(rootComponent, rootComponent)
					);

					this._updateCurrentSelected(this._closestSelectedId);

					this._closestSelectedId = null;

					updateScheduled[rootId] = false;
				}
			);
		}
	}

	_checkIfRootDetached(id) {
		for (let i = 0; i < this._roots.length; i++) {
			const root = this._roots[i];

			if (root[__METAL_DEV_TOOLS_COMPONENT_KEY__] === id) {
				this._roots.splice(i, 1);

				return;
			}
		}
	}

	_traverseTree(component, rootComponent) {
		if (!component) {
			return {};
		}

		this._attachComponentListeners(component, rootComponent);

		const renderer = component.__METAL_IC_RENDERER_DATA__;

		let containsInspected = false;

		if (this._inspectedNode && component.element && component.element.contains) {
			containsInspected = component.element.contains(this._inspectedNode);

			if (containsInspected) {
				this._closestSelectedId = component[__METAL_DEV_TOOLS_COMPONENT_KEY__];
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

	_updateCurrentSelected(id) {
		if (!id) {
			id = this._previousSelectedId;
		}

		if (id) {
			Messenger.informSelected(
				this.processComponentObj(this._componentMap[id])
			);
		}
	}
}

export default RootManager;
