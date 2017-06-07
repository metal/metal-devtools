import Component, {Config} from 'metal-jsx';
import {bindAll, debounce} from 'lodash';

import NodeName, {OPENING, NORMAL_CLOSING, SELF_CLOSING} from './NodeName';

/**
 * Component used to recursively render a tree of components
 */
class TreeNode extends Component {
  created() {
    bindAll(
      this,
      'addHighlight',
      'debounceOverlay',
      'focusNode',
      'handleContextMenu',
      'handleInspect',
      'removeHighlight',
      'toggleExpanded'
    );

    this.debounceOverlay = debounce(this.debounceOverlay, 200);

    this._firstRender = true;
  }

  addHighlight() {
    this.toggleHighlight(true);
  }

  debounceOverlay() {
    this.state.showMenu = false;
  }

  focusNode() {
    const {componentNode, onNodeSelect} = this.props;

    onNodeSelect(componentNode.id);
  }

  handleContextMenu(event) {
    event.preventDefault();

    this.state.showMenu = true;
  }

  handleInspect() {
    const {componentNode, onInspectDOM} = this.props;

    onInspectDOM(componentNode.id);
  }

  toggleExpanded(event) {
    event.stopPropagation();

    const {componentNode, onNodeExpand} = this.props;

    this.focusNode();

    onNodeExpand(componentNode.id, !componentNode.expanded);
  }

  toggleHighlight(value) {
    const {componentNode, highlightDOM} = this.props;

    if (value) {
      highlightDOM(componentNode.id);
    } else {
      highlightDOM(null);
    }

    this.state.highlight = value;
  }

  removeHighlight() {
    this.toggleHighlight(false);
  }

  render() {
    const {
      props: {
        componentNode: {childComponents = [], expanded, id, name},
        depth,
        onInspectDOM,
        onNodeExpand,
        onNodeSelect,
        selectedId
      },
      state: {highlight, showMenu}
    } = this;

    const hasChildren = childComponents && !!childComponents.length;

    const selected = id === selectedId ? 'selected' : '';

    const highlighted = highlight ? 'highlight' : '';

    const style = `padding-left: ${depth * 24 + 12}px`;

    return (
      <div class="tree-container">
        <div
          class={`node-wrapper ${selected} ${highlighted} ${hasChildren
            ? 'expandable'
            : ''}`} // eslint-disable-line
          onClick={selected && !expanded ? this.toggleExpanded : this.focusNode}
          onContextMenu={this.handleContextMenu}
          onMouseEnter={this.addHighlight}
          onMouseLeave={this.removeHighlight}
          style={style}
        >
          {hasChildren &&
            <div
              class={expanded ? 'arrow down' : 'arrow right'}
              onClick={this.toggleExpanded}
            />}

          <NodeName
            data-nodeid={id}
            ref="nodeName"
            name={name}
            type={hasChildren ? OPENING : SELF_CLOSING}
          />

          {showMenu &&
            <div class="overlay" onMouseLeave={this.debounceOverlay}>
              <ul>
                <li onClick={this.handleInspect}>{'Show in Elements Panel'}</li>
              </ul>
            </div>}
        </div>

        {hasChildren &&
          expanded &&
          childComponents.map((child, i) =>
            <TreeNode
              componentNode={child}
              depth={this.props.depth + 1}
              key={`${name}-${i}`}
              highlightDOM={this.props.highlightDOM}
              onInspectDOM={onInspectDOM}
              onNodeExpand={onNodeExpand}
              onNodeSelect={onNodeSelect}
              selectedId={selectedId}
            />
          )}

        {hasChildren &&
          expanded &&
          <div
            class={`node-wrapper ${highlighted}`}
            onClick={this.focusNode}
            onMouseEnter={this.addHighlight}
            onMouseLeave={this.removeHighlight}
            style={style}
          >
            <NodeName name={name} type={NORMAL_CLOSING} />
          </div>}
      </div>
    );
  }
}

TreeNode.PROPS = {
  componentNode: Config.value({}),
  depth: Config.number().value(0),
  highlightDOM: Config.func(),
  onInspectDOM: Config.func(),
  onNodeExpand: Config.func(),
  onNodeSelect: Config.func(),
  selectedId: Config.string()
};

TreeNode.STATE = {
  highlight: Config.value(false),
  showMenu: Config.value(false)
};

export default TreeNode;
