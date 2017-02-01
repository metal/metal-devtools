import Component, {Config} from 'metal-jsx';
import {bindAll, keys} from 'lodash';

import * as messageTypes from '../../shared/messageTypes';
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

	flashNode(id) {
		const node = document.querySelector(`[data-nodeid="${id}"]`);

		if (node) {
			node.classList.add('flash');

			setTimeout(
				() => {
					node.classList.remove('flash');
				},
				100
			);
		}
	}

	handleResize({clientX}) {
		this.state.firstColumnWidth = clientX;
	}

	processMessage({data, type}) {
		switch(type) {
			case messageTypes.DETACHED:
				this.checkIfRootDetached(data.id);
				break;
			case messageTypes.NEW_ROOT:
				this.addRootComponent(data);
				break;
			case messageTypes.RENDERED:
				this.flashNode(data);
				break;
			case messageTypes.SELECTED:
				this.state.selectedComponent = data;
				break;
			case messageTypes.UPDATE:
				this.updateRootComponent(data);
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
										onNodeSelect={onSelectedChange}
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
