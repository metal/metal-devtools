import Component, {Config} from 'metal-jsx';

const collapsedArrow = '+';
const expandedArrow = '-';

class TreeNode extends Component {
	created() {
		this.handleNodeClick = this.handleNodeClick.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);
	}

	handleNodeClick() {
		this.props.onNodeClick(this.props.componentNode);
	}

	toggleExpanded() {
		const newVal = !this.state.expanded_;

		this.state.expanded_ = newVal;

		this.props.onNodeClick(this.props.componentNode);
	}

	rendered() {
		const {componentNode, selectedComponent} = this.props;

		if (componentNode.id === selectedComponent.id) {
			this.props.onNodeClick(this.props.componentNode);
		}
	}

	render() {
		const {componentNode, onNodeClick, selectedComponent} = this.props;

		const {childComponents, id, name} = componentNode;

		const {expanded_} = this.state;

		const hasChildren = childComponents && childComponents.length > 0;

		const empty = hasChildren ? '' : 'empty';

		const selected = id === selectedComponent.id ? 'selected' : '';

		return(
			<div class="tree">
				<div class={`tree-node ${selected}`} onClick={this.toggleExpanded}>
					{hasChildren &&
						<div class="toggle">
							{expanded_ ? expandedArrow : collapsedArrow}
						</div>
					}

					<div class={`component-info ${empty}`}>
						<span>{'<'}</span>

						{name}

						<span>{'>'}</span>
					</div>
				</div>

				{hasChildren && expanded_ &&
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

				{hasChildren && expanded_ &&
					<div class={`component-info`} onClick={this.handleNodeClick}>
						<span>{'  </'}</span>

						{name}

						<span>{'>'}</span>
					</div>
				}
			</div>
		);
	}
}

TreeNode.PROPS = {
	componentNode: Config.value({}),
	expanded: Config.value(false),
	onNodeClick: Config.func(),
	selectedComponent: Config.object()
};

TreeNode.STATE = {
	expanded_: Config.value(false)
};

export default TreeNode;
