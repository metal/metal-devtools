import Component, {Config} from 'metal-jsx';
import {bindAll, keys} from 'lodash';

import * as constants from '../../shared/constants';
import InitialWarning from './InitialWarning';
import ResizeDivider from './ResizeDivider';
import StatePane from './StatePane';
import TreeNode from './TreeNode';

const DARK_TYPE_COLORS = {
  number: '#A1F7B5'
};

export function flattenIds(obj, retVal = []) {
  const objKeys = keys(obj);

  for (let i = 0; i < objKeys.length; i++) {
    const keyVal = obj[objKeys[i]];

    retVal.push(keyVal.id);

    if (keyVal.childComponents && keyVal.expanded) {
      retVal.concat(flattenIds(keyVal.childComponents, retVal));
    }
  }

  return retVal;
}

/**
 * Root component that renders everything in the developer tools
 */
class App extends Component {
  created() {
    bindAll(
      this,
      'handleKeys',
      'handleFreezeToggle',
      'handleResize',
      'processMessage'
    );

    this.props.port.onMessage.addListener(this.processMessage);

    this._pendingFlashRemovals = [];
  }

  attached() {
    document.addEventListener('keydown', this.handleKeys);
  }

  detached() {
    document.addEventListener('keydown', this.handleKeys);
  }

  addFlash(node) {
    if (node && node.classList) {
      node.classList.add('flash');
    }
  }

  addRootComponent(root) {
    this.state.rootComponents = {
      ...this.state.rootComponents,
      [root.id]: root
    };
  }

  checkIfRootDetached(id) {
    const roots = this.state.rootComponents;

    if (roots[id]) {
      delete roots[id];
    }

    this.state.rootComponents = roots;
  }

  flashNode(id) {
    const node = document.querySelector(`[data-nodeid="${id}"]`);

    if (node) {
      this.addFlash(node);

      if (!this.state.freezeUpdates) {
        setTimeout(() => this.removeFlash(node), 100);
      } else {
        this._pendingFlashRemovals.push(node);
      }
    }
  }

  handleFreezeToggle({target}) {
    const {checked} = target;

    this.state.freezeUpdates = checked;

    if (!checked) {
      this._pendingFlashRemovals.forEach(node => this.removeFlash(node));

      this._pendingFlashRemovals = [];
    }
  }

  handleKeys(event) {
    const {key} = event;

    const {
      props: {onComponentExpand, onSelectedChange},
      state: {rootComponents, selectedComponent}
    } = this;

    if (selectedComponent && selectedComponent.id) {
      const ids = flattenIds(rootComponents);

      const selectedIndex = ids.indexOf(selectedComponent.id);

      if (key.match('Arrow')) {
        event.preventDefault();

        if (key === 'ArrowDown' && selectedIndex !== ids.length - 1) {
          onSelectedChange(ids[selectedIndex + 1]);
        } else if (key === 'ArrowUp' && selectedIndex !== 0) {
          onSelectedChange(ids[selectedIndex - 1]);
        } else if (key === 'ArrowRight') {
          onComponentExpand(ids[selectedIndex], true);
        } else if (key === 'ArrowLeft') {
          onComponentExpand(ids[selectedIndex], false);
        }
      }
    }
  }

  handleResize({clientX}) {
    this.state.firstColumnWidth = clientX;
  }

  processMessage({data, type}) {
    switch (type) {
      case constants.DETACHED:
        this.checkIfRootDetached(data.id);
        break;
      case constants.NEW_ROOT:
        this.addRootComponent(data);
        break;
      case constants.RENDERED:
        this.flashNode(data);
        break;
      case constants.SELECTED:
        this.state.selectedComponent = data;
        break;
      case constants.UPDATE:
        this.updateRootComponent(data);
        break;
      default:
        console.log(`Unknown Message Type: ${type}`);
    }
  }

  removeFlash(node) {
    if (node && node.classList) {
      node.classList.remove('flash');
    }
  }

  resetRoots() {
    this.state.rootComponents = {};
  }

  updateRootComponent(root) {
    const roots = this.state.rootComponents;

    if (roots[root.id]) {
      roots[root.id] = root;
    }

    this.state.rootComponents = roots;
  }

  render() {
    const {
      props: {
        highlightDOM,
        inspectDOM,
        onComponentExpand,
        onSelectedChange,
        setStateFn,
        theme
      },
      state: {
        firstColumnWidth,
        freezeUpdates,
        rootComponents,
        selectedComponent
      }
    } = this;

    const rootComponentKeys = keys(rootComponents);

    return (
      <div class={`app-container ${theme}-theme`}>
        {!rootComponentKeys ||
          (rootComponentKeys &&
            !rootComponentKeys.length &&
            <InitialWarning />)}

        {rootComponentKeys &&
          !!rootComponentKeys.length &&
          <div
            class="roots-wrapper"
            style={firstColumnWidth && `flex-basis:${firstColumnWidth}px;`}
          >
            <div
              class="options"
              title="Freezes highlights by expanded components"
              style={`width: ${firstColumnWidth + 1}px;`}
            >
              <label for="freezeUpdates">{'Freeze Updates'}</label>

              <input
                checked={freezeUpdates}
                name="freezeUpdates"
                onChange={this.handleFreezeToggle}
                type="checkbox"
              />
            </div>

            {rootComponentKeys.map((key, i) =>
              <TreeNode
                componentNode={rootComponents[key]}
                depth={0}
                key={i}
                highlightDOM={highlightDOM}
                onInspectDOM={inspectDOM}
                onNodeExpand={onComponentExpand}
                onNodeSelect={onSelectedChange}
                selectedId={selectedComponent.id}
              />
            )}
          </div>}

        <ResizeDivider onResize={this.handleResize} />

        <StatePane
          component={selectedComponent}
          onInspectDOM={inspectDOM}
          setStateFn={setStateFn}
          typeColors={theme === 'dark' ? DARK_TYPE_COLORS : undefined}
        />
      </div>
    );
  }
}

App.PROPS = {
  highlightDOM: Config.func(),
  inspectDOM: Config.func(),
  onComponentExpand: Config.func(),
  onSelectedChange: Config.func(),
  port: Config.any(),
  setStateFn: Config.func(),
  theme: Config.oneOf(['dark', 'light']).value('light')
};

App.STATE = {
  firstColumnWidth: Config.number(),
  freezeUpdates: Config.value(false),
  rootComponents: Config.value({}),
  selectedComponent: Config.value({})
};

export default App;
