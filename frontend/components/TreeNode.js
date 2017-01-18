import Component, {Config} from 'metal-jsx';
import {bindAll, isEqual} from 'lodash';

import NodeName, {OPENING, NORMAL_CLOSING, SELF_CLOSING} from './NodeName';

class TreeNode extends Component {
	created() {
		bindAll(
			this,
			'focusNode',
			'toggleExpanded'
		);

		this._firstRender = true;
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
			this.refs.nodeName.element.classList.add('flash');

			setTimeout(
				() => {
					this.refs.nodeName.element.classList.remove('flash');
				},
				100
			);
		}
		else if (this._firstRender) {
			this._firstRender = false;
		}
	}

	rendered() {
		if (this.props.componentNode.containsInspected) {
			this.state.expanded_ = true;

			delete this.props.componentNode.containsInspected;
		}
	}

	render() {
		const {componentNode, depth, onNodeClick, selectedId} = this.props;

		const {childComponents, containsInspected, id, name} = componentNode;

		const {expanded_, highlight_} = this.state;

		const hasChildren = childComponents && childComponents.length > 0;

		const selected = id === selectedId ? 'selected' : '';

		const highlight = highlight_ ? 'highlight' : '';

		const style = `padding-left: ${depth * 24 + 12}px`;

		const expanded = containsInspected || expanded_;

		return(
			<div class="tree-container">
				<div
					class={`node-wrapper ${selected} ${highlight} ${hasChildren ? 'expandable' : ''}`}
					onClick={expanded ? this.focusNode : this.toggleExpanded}
					onMouseEnter={this.toggleHighlight(true)}
					onMouseLeave={this.toggleHighlight(false)}
					style={style}
				>
					{hasChildren &&
						<div class={expanded ? 'arrow down' : 'arrow right'} onClick={this.toggleExpanded} />
					}

					<NodeName ref="nodeName" name={name} type={hasChildren ? OPENING : SELF_CLOSING} />
				</div>

				{hasChildren && expanded &&
					childComponents.map(
						(child, i) => (
							<TreeNode
								componentNode={child}
								depth={this.props.depth + 1}
								key={`${name}-${i}`}
								onNodeClick={onNodeClick}
								selectedId={selectedId}
							/>
						)
					)
				}

				{hasChildren && expanded &&
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
	selectedId: Config.string()
};

TreeNode.STATE = {
	expanded_: Config.value(false),
	highlight_: Config.value(false)
};

export default TreeNode;
