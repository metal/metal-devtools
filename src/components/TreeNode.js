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

		this.props.componentNode._expanded = newVal;
	}

	render() {
		const {
			childComponents,
			_expanded,
			name
		} = this.props.componentNode;

		const expanded = _expanded || this.state.expanded_;

		const arrow = (expanded) ? expandedArrow : collapsedArrow;

		const hasChildren = childComponents && childComponents.length > 0;

		const empty = hasChildren ? '' : 'empty';

		return(
			<div class="tree">
				<div class="tree-node" onClick={this.toggleExpanded}>
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
						(child, i) => <TreeNode componentNode={child} key={`${name}-${i}`} />
					)
				}
			</div>
		)
	}
}

TreeNode.PROPS = {
	componentNode: Config.value({}),
	expanded: Config.value(false)
};

TreeNode.STATE = {
	expanded_: Config.value(false)
};

export default TreeNode;
