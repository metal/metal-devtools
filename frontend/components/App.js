import Component, {Config} from 'metal-jsx';
import {values} from 'lodash';

import TreeNode from './TreeNode';
import StatePane from './StatePane';
import InitialWarning from './InitialWarning';

class App extends Component {
	created() {
		this.selectedChange = this.selectedChange.bind(this);

		this.props.port.onMessage.addListener(
			(component) => {
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
		);
	}

	selectedChange(id) {
		this.state.selectedId = id;
	}

	render() {
		const {rootComponents, selectedId} = this.state;

		const rootComponentKeys = Object.keys(rootComponents);

		return (
			<div class="app-container">
				{!rootComponentKeys || (rootComponentKeys && !rootComponentKeys.length) &&
					<InitialWarning />
				}

				{rootComponentKeys && !!rootComponentKeys.length &&
					<div class="roots-wrapper">
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

				<StatePane components={values(rootComponents)} id={selectedId} />
			</div>
		);
	}
}

App.PROPS = {
	port: Config.any()
};

App.STATE = {
	rootComponents: Config.value({}),
	selectedId: Config.value('')
};

export default App;
