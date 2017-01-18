import Component, {Config} from 'metal-jsx';
import {bindAll, keys, values} from 'lodash';

import InitialWarning from './InitialWarning';
import ResizeDivider from './ResizeDivider';
import StatePane from './StatePane';
import TreeNode from './TreeNode';

class App extends Component {
	created() {
		bindAll(
			this,
			'handleResize',
			'processMessage',
			'selectedChange'
		);

		this.props.port.onMessage.addListener(this.processMessage);
	}

	handleResize({clientX}) {
		this.state.firstColumnWidth = clientX;
	}

	processMessage(message) {
		const {id, selectedId} = message;

		if (id) {
			this.setRootComponents(message);
		}
		else if (selectedId) {
			this.selectedChange(selectedId);
		}
	}

	resetRoots() {
		this.state.rootComponents = {};
	}

	selectedChange(id) {
		this.state.selectedId = id;
	}

	setRootComponents(component) {
		const {id, remove} = component;

		let retVal = this.state.rootComponents;

		if (remove) {
			delete retVal[id];
		}
		else if (id) {
			retVal = {
				...retVal,
				[id]: component
			};
		}

		this.state.rootComponents = retVal;
	}

	render() {
		const {firstColumnWidth, rootComponents, selectedId} = this.state;

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
										onNodeClick={this.selectedChange}
										selectedId={selectedId}
									/>
								)
							)
						}
					</div>
				}

				<ResizeDivider onResize={this.handleResize}/>

				<StatePane components={values(rootComponents)} id={selectedId} />
			</div>
		);
	}
}

App.PROPS = {
	port: Config.any()
};

App.STATE = {
	firstColumnWidth: Config.number(),
	rootComponents: Config.value({}),
	selectedId: Config.value('')
};

export default App;
