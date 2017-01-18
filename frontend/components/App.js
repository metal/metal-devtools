import Component, {Config} from 'metal-jsx';
import {values} from 'lodash';

import InitialWarning from './InitialWarning';
import Resize from './Resize';
import StatePane from './StatePane';
import TreeNode from './TreeNode';

class App extends Component {
	created() {
		this.handleResize = this.handleResize.bind(this);
		this.processMessage = this.processMessage.bind(this);
		this.selectedChange = this.selectedChange.bind(this);

		this.props.port.onMessage.addListener(this.processMessage);
	}

	handleResize({clientX}) {
		this.state.firstColumnWidth = clientX;
	}

	processMessage(message) {
		if (message.id) {
			this.setRootComponents(message);
		}
		else if (message.selectedId) {
			this.selectedChange(message.selectedId);
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

		const rootComponentKeys = Object.keys(rootComponents);

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
										selectedId={selectedId}
										onNodeClick={this.selectedChange}
									/>
								)
							)
						}
					</div>
				}

				<Resize onResize={this.handleResize}/>

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
