import Component, {Config} from 'metal-jsx';
import {bindAll, debounce, isEqual} from 'lodash';

import NodeName, {OPENING, NORMAL_CLOSING, SELF_CLOSING} from './NodeName';

class TreeNode extends Component {
	created() {
		bindAll(
			this,
			'debounceOverlay',
			'focusNode',
			'handleContextMenu',
			'handleInspect',
			'toggleExpanded'
		);

		this.debounceOverlay = debounce(this.debounceOverlay, 200);

		this._firstRender = true;
	}

	debounceOverlay() {
		this.state.showMenu_ = false;
	}

	handleInspect() {
		const {componentNode, onInspectDOM} = this.props;

		onInspectDOM(componentNode.id);
	}

	handleContextMenu(event) {
		event.preventDefault();

		console.log('event', event);

		this.state.showMenu_ = true;
	}

	focusNode() {
		const {componentNode, onNodeClick} = this.props;

		onNodeClick(componentNode.id);
	}

	toggleExpanded(event) {
		event.stopPropagation();

		const {componentNode, onNodeClick} = this.props;

		const newVal = !this.state.expanded_;

		this.state.expanded_ = newVal;

		onNodeClick(componentNode.id);
	}

	toggleHighlight(value) {
		return () => {
			this.state.highlight_ = value;
		};
	}

	syncComponentNode(newVal = {}, oldVal = {}) {
		const newData = newVal.data || {};
		const oldData = oldVal.data || {};

		if (!this._firstRender && !isEqual(newData, oldData)) {
			const {element} = this.refs.nodeName;

			element.classList.add('flash');

			setTimeout(
				() => {
					element.classList.remove('flash');
				},
				100
			);
		}
		else if (this._firstRender) {
			this._firstRender = false;
		}
	}

	rendered() {
		const {
			componentNode: {
				containsInspected,
				id
			},
			selectedId
		} = this.props;

		if (containsInspected) {
			this.state.expanded_ = true;

			delete this.props.componentNode.containsInspected;

			if (id === selectedId) {
				this.element.scrollIntoView();
			}
		}
	}

	render() {
		const {componentNode, depth, onInspectDOM, onNodeClick, selectedId} = this.props;

		const {childComponents, id, name} = componentNode;

		const {expanded_, highlight_, showMenu_} = this.state;

		const hasChildren = childComponents && childComponents.length > 0;

		const selected = id === selectedId ? 'selected' : '';

		const highlight = highlight_ ? 'highlight' : '';

		const style = `padding-left: ${depth * 24 + 12}px`;

		return(
			<div class="tree-container">
				<div
					class={`node-wrapper ${selected} ${highlight} ${hasChildren ? 'expandable' : ''}`}
					onClick={expanded_ ? this.focusNode : this.toggleExpanded}
					onContextMenu={this.handleContextMenu}
					onMouseEnter={this.toggleHighlight(true)}
					onMouseLeave={this.toggleHighlight(false)}
					style={style}
				>
					{hasChildren &&
						<div class={expanded_ ? 'arrow down' : 'arrow right'} onClick={this.toggleExpanded} />
					}

					<NodeName ref="nodeName" name={name} type={hasChildren ? OPENING : SELF_CLOSING} />

					{showMenu_ &&
						<div class="overlay" onMouseLeave={this.debounceOverlay}>
							<ul>
								<li onClick={this.handleInspect}>{'Show in Elements Panel'}</li>
							</ul>
						</div>
					}
				</div>

				{hasChildren && expanded_ &&
					childComponents.map(
						(child, i) => (
							<TreeNode
								componentNode={child}
								depth={this.props.depth + 1}
								key={`${name}-${i}`}
								onInspectDOM={onInspectDOM}
								onNodeClick={onNodeClick}
								selectedId={selectedId}
							/>
						)
					)
				}

				{hasChildren && expanded_ &&
					<div
						class={`node-wrapper ${selected} ${highlight}`}
						onClick={this.focusNode}
						onMouseEnter={this.toggleHighlight(true)}
						onMouseLeave={this.toggleHighlight(false)}
						style={style}
					>
						<NodeName name={name} type={NORMAL_CLOSING} />
					</div>
				}
			</div>
		);
	}
}

TreeNode.PROPS = {
	componentNode: Config.value({}),
	depth: Config.number().value(0),
	onNodeClick: Config.func(),
	onInspectDOM: Config.func(),
	selectedId: Config.string()
};

TreeNode.STATE = {
	expanded_: Config.value(false),
	highlight_: Config.value(false),
	showMenu_: Config.bool(false)
};

export default TreeNode;
