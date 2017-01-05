import Component, {Config} from 'metal-jsx';

const collapsedArrow = '+';
const expandedArrow = '-';

class TreeNode extends Component {
	created() {
		this.toggleExpanded = this.toggleExpanded.bind(this);
	}

	toggleExpanded() {
		const newVal = !this.state.expanded_;

		this.state.expanded_ = newVal;

		this.props.onNodeClick(this.props.componentNode);

		this.props.componentNode._expanded = newVal;
	}

	render() {
		const {componentNode, onNodeClick, selectedComponent} = this.props;

		const {
			childComponents,
			_expanded,
			id,
			name
		} = componentNode;

		const expanded = _expanded || this.state.expanded_;

		const arrow = (expanded) ? expandedArrow : collapsedArrow;

		const hasChildren = childComponents && childComponents.length > 0;

		const empty = hasChildren ? '' : 'empty';

		const selected = id === selectedComponent ? 'selected' : '';

		return(
			<div class="tree">
				<div class={`tree-node ${selected}`} onClick={this.toggleExpanded}>
					{hasChildren &&
						<div class="toggle">
							{arrow}
						</div>
					}

					<div class={`component-info ${empty}`}>
						<span>{'<'}</span>

						{name}

						<span>{'>'}</span>
					</div>
				</div>

				{hasChildren && expanded &&
					childComponents.map(
						(child, i) => (
							<TreeNode
								componentNode={child}
								key={`${name}-${i}`}
								onNodeClick={onNodeClick}
								selectedComponent={selectedComponent}
							/>
						)
					)
				}

				{hasChildren && expanded &&
					<div class={`component-info ${selected}`}>
						<span>{'  </'}</span>

						{name}

						<span>{'>'}</span>
					</div>
				}
			</div>
		)
	}
}

TreeNode.PROPS = {
	componentNode: Config.value({}),
	expanded: Config.value(false),
	onNodeClick: Config.func(),
	selectedComponent: Config.any()
};

TreeNode.STATE = {
	expanded_: Config.value(false)
};

export default TreeNode;
