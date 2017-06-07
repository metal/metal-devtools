import Messenger from './Messenger';
import processDataManagers from './processDataManagers';

export const __METAL_DEV_TOOLS_COMPONENT_KEY__ =
  '__METAL_DEV_TOOLS_COMPONENT_KEY__';

const maskDimensionStyles = {
  'background': 'rgba(0, 0, 0, 0.65)',
  'color': '#FFFFFF',
  'font-size': '11px',
  'padding': '2px'
};

const maskStyles = {
  'align-items': 'flex-end',
  'background': 'rgba(111, 168, 220, 0.65)',
  'position': 'fixed',
  'z-index': 10000
};

let componentId = 0;
const updateScheduled = {};

function applyStyles(element, styles) {
  Object.keys(styles).forEach(name => (element.style[name] = styles[name]));
}

/**
 * `RootManager` is the main driving backend that interacts with Metal.js. This
 * class manages metal components, binds listeners, highlights the DOM, and
 * passes all necessary information to the devtools panel.
 */
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

  /**
   * Creates a mask on the page and highlights certain areas of the page.
   */
  createOverlayMask() {
    this._mask = document.createElement('div');
    this._maskDimensions = document.createElement('span');

    applyStyles(this._maskDimensions, maskDimensionStyles);
    applyStyles(this._mask, maskStyles);

    this._mask.setAttribute('id', '__METAL_DEV_TOOLS_MASK__');

    this._mask.appendChild(this._maskDimensions);
    document.body.appendChild(this._mask);
  }

  /**
   * Sets the components expanded value and reloads the root components.
   */
  expandComponent(id, value) {
    this._componentMap[id].expanded = value;

    this.reloadRoots();
  }

  /**
   * Returns component from internal map based on ID given.
   */
  getComponentNode(id) {
    if (this._componentMap[id] && this._componentMap[id].element) {
      return this._componentMap[id].element;
    }
  }

  /**
   * Returns data managers for a certain component.
   */
  getDataManagers(id) {
    let retVal = null;

    if (this.hasComponent(id)) {
      retVal = this._componentMap[id].__DATA_MANAGER_DATA__;
    }

    return retVal;
  }

  /**
   * Returns whether a component exists in the internal map or not.
   */
  hasComponent(id) {
    return !!this._componentMap[id];
  }

  /**
   * Returns whether there are any root components or not.
   */
  hasRoots() {
    return this._roots && !!this._roots.length;
  }

  /**
   * Shows the overlay mask and positions it to highlight a specific node.
   * The purpose is to mimic inspecting dom elements.
   */
  highlightNode(id) {
    if (!this._mask) {
      this.createOverlayMask();
    }

    const element = this.getComponentNode(id);

    if (element) {
      const {height, left, top, width} = element.getBoundingClientRect();

      this._maskDimensions.innerHTML = `${width}px x ${height}px`;

      applyStyles(this._mask, {
        display: 'flex',
        height: height ? `${height}px` : 'initial',
        left: `${left}px`,
        top: `${top}px`,
        width: width ? `${width}px` : 'initial'
      });
    } else {
      this._mask.style.display = 'none';
    }
  }

  /**
   * Adds a root component to `this._roots` and informs that there is a new
   * root.
   */
  addRoot(component) {
    this._roots.push(component);

    this._executeAsync(() => {
      Messenger.informNewRoot(this._traverseTree(component, component));
    });
  }

  /**
   * Returns an object with data about a given component.
   */
  processComponentObj(component) {
    return {
      data: component && component.__DATA_MANAGER_DATA__
        ? processDataManagers(component.__DATA_MANAGER_DATA__)
        : null,
      id: component[__METAL_DEV_TOOLS_COMPONENT_KEY__],
      name: component.constructor.name
    };
  }

  /**
   * Reloads all the root components and tells the messenger to treat them as
   * new.
   */
  reloadRoots(informNew) {
    this._executeAsync(() =>
      this._roots.forEach(root => {
        if (informNew) {
          Messenger.informNewRoot(this._traverseTree(root, root));
        } else {
          this._handleComponentUpdated(root);
        }
      })
    );
  }

  /**
   * Informs that a certain component has been selected and stores the ID of
   * that component for future reference.
   */
  selectComponent(id) {
    this.setInspected(null);

    this._closestSelectedId = null;
    this._previousSelectedId = id;

    Messenger.informSelected(this.processComponentObj(this._componentMap[id]));
  }

  /**
   * Sets a new state in the data manager
   */
  setComponentState(id, newState, dataManagerName) {
    const dataManagers = this.getDataManagers(id);

    if (dataManagers) {
      const dataManager = dataManagers[`${dataManagerName}_`];

      if (dataManager) {
        dataManager.setState(JSON.parse(newState));
      }
    }
  }

  /**
   * Sets the `_inspectedNode` value to a given node.
   */
  setInspected(node) {
    this._inspectedNode = node;
  }

  /**
   * Attaches listeners on each component. These are the events that drive the
   * data flow from metal.js to the devtools.
   */
  _attachComponentListeners(component, rootComponent) {
    if (!component[__METAL_DEV_TOOLS_COMPONENT_KEY__]) {
      const id = `${__METAL_DEV_TOOLS_COMPONENT_KEY__}${componentId++}`;

      component[__METAL_DEV_TOOLS_COMPONENT_KEY__] = id;

      this._componentMap[id] = component;

      component.on('detached', () => {
        this._checkIfRootDetached(id);

        Messenger.informDetached({id});
      });

      component.on('rendered', () => Messenger.informRendered(id));

      component.on('stateSynced', () =>
        this._handleComponentUpdated(rootComponent)
      );
    }
  }

  /**
   * Runs functions in a `setTimeout` so that they wil be asynchronous and not
   * hold up the entire applciation, such as traversing a tree of components.
   */
  _executeAsync(fn) {
    setTimeout(fn, 0);
  }

  /**
   * Informs an update and traverses the root component that the update occured.
   */
  _handleComponentUpdated(rootComponent) {
    const rootId = rootComponent[__METAL_DEV_TOOLS_COMPONENT_KEY__];

    if (!updateScheduled[rootId]) {
      updateScheduled[rootId] = true;

      this._executeAsync(() => {
        Messenger.informUpdate(
          this._traverseTree(rootComponent, rootComponent)
        );

        this._updateCurrentSelected(this._closestSelectedId);

        this._closestSelectedId = null;

        updateScheduled[rootId] = false;
      });
    }
  }

  /**
   * Checks if the component being detached is a root component. If it is, it
   * removes the root component from `_roots`
   */
  _checkIfRootDetached(id) {
    for (let i = 0; i < this._roots.length; i++) {
      const root = this._roots[i];

      if (root[__METAL_DEV_TOOLS_COMPONENT_KEY__] === id) {
        this._roots.splice(i, 1);

        return;
      }
    }
  }

  /**
   * Traverses all components in a root node and returns the new data object.
   */
  _traverseTree(component, rootComponent) {
    if (!component) {
      return {};
    }

    this._attachComponentListeners(component, rootComponent);

    const renderer = component.__METAL_IC_RENDERER_DATA__;

    const id = component[__METAL_DEV_TOOLS_COMPONENT_KEY__];

    let expanded = this._componentMap[id]
      ? this._componentMap[id].expanded
      : false;

    if (
      this._inspectedNode &&
      component.element &&
      component.element.contains
    ) {
      expanded = component.element.contains(this._inspectedNode);

      if (expanded) {
        this._closestSelectedId = id;
      }
    }

    return {
      childComponents:
        renderer &&
          renderer.childComponents &&
          renderer.childComponents.map(childComponent =>
            this._traverseTree(childComponent, rootComponent)
          ),
      expanded,
      id,
      name: component.constructor.name
    };
  }

  /**
   * Updates the currently selected component and informs that it is selected.
   */
  _updateCurrentSelected(id = this._previousSelectedId) {
    if (id) {
      Messenger.informSelected(
        this.processComponentObj(this._componentMap[id])
      );
    }
  }
}

export default RootManager;
