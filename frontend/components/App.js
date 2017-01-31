import Component, {Config} from 'metal-jsx';
import {bindAll, keys} from 'lodash';

import InitialWarning from './InitialWarning';
import ResizeDivider from './ResizeDivider';
import StatePane from './StatePane';
import TreeNode from './TreeNode';

class App extends Component {
	created() {
		bindAll(
			this,
			'handleResize',
			'processMessage'
		);

		this.props.port.onMessage.addListener(this.processMessage);
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

	handleResize({clientX}) {
		this.state.firstColumnWidth = clientX;
	}

	processMessage({data, type}) {
		switch(type) {
			case 'detached':
				this.checkIfRootDetached(data.id);
				break;
			case 'update':
				this.updateRootComponent(data);
				break;
			case 'selected':
				this.state.selectedComponent = data;
				break;
			case 'newRoot':
				this.addRootComponent(data);
				break;
			default:
				console.log(`Unknown Message Type: ${type}`);
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
				onSelectedChange
			},
			state: {
				firstColumnWidth,
				rootComponents,
				selectedComponent
			}
		} = this;

		const rootComponentKeys = keys(rootComponents);

		return (
			<div class="app-container">
				{!rootComponentKeys || (rootComponentKeys && !rootComponentKeys.length) &&
					<InitialWarning />
				}

				{rootComponentKeys && !!rootComponentKeys.length &&
					<div class="roots-wrapper" style={firstColumnWidth && `flex-basis:${firstColumnWidth}px`}>
						{
							rootComponentKeys.map(
								(key, i) => (
									<TreeNode
										componentNode={rootComponents[key]}
										depth={0}
										key={i}
										highlightDOM={highlightDOM}
										onInspectDOM={inspectDOM}
										onNodeClick={onSelectedChange}
										selectedId={selectedComponent.id}
									/>
								)
							)
						}
					</div>
				}

				<ResizeDivider onResize={this.handleResize}/>

				<StatePane component={selectedComponent} onInspectDOM={inspectDOM} />
			</div>
		);
	}
}

App.PROPS = {
	highlightDOM: Config.func(),
	inspectDOM: Config.func(),
	onSelectedChange: Config.func(),
	port: Config.any()
};

App.STATE = {
	firstColumnWidth: Config.number(),
	rootComponents: Config.value({}),
	selectedComponent: Config.value({})
};

export default App;
