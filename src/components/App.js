import Component, {Config} from 'metal-jsx';
import {Iterable, fromJS} from 'immutable';
import {isBoolean, isNull, isObject} from 'lodash';

import TreeNode from './TreeNode';

const port = chrome.extension.connect({name: 'metal-devtools'});

class App extends Component {
	created() {
		this.selectedChange = this.selectedChange.bind(this);
	}

	attached() {
		port.onMessage.addListener(
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

	processValue(value) {
		let retVal = value;

		if (isObject(value)) {
			if (Iterable.isIterable(value)) {
				value = fromJS(value);
			}

			retVal = [<pre>{JSON.stringify(value, null, 2)}</pre>];
		}
		else if (isBoolean(value)) {
			retVal = value.toString();
		}
		else if (value === '') {
			retVal = '\'\'';
		}
		else if (isNull(value)) {
			retVal = 'null';
		}

		return retVal;
	}

	selectedChange(node) {
		this.setState({
			componentInfo: {
				props: JSON.parse(node.props) || {},
				state: JSON.parse(node.state) || {},
			},
			selectedComponent: node.id
		});
	}

	render() {
		const {componentInfo, rootComponents, selectedComponent} = this.state;

		const rootComponentKeys = Object.keys(rootComponents);

		const propKeys = Object.keys(componentInfo.props);
		const stateKeys = Object.keys(componentInfo.state);

		return (
			<div class="container">
				{rootComponentKeys && !rootComponentKeys.length &&
					<div>
						{`If you do not see your components here, try refreshing the page while keeping the devtools open.`}
					</div>
				}

				<div class="nodes">
					{rootComponentKeys && !!rootComponentKeys.length &&
						rootComponentKeys.map(
							(key, i) => (
								<TreeNode
									componentNode={rootComponents[key]}
									key={i}
									selectedComponent={selectedComponent}
									onNodeClick={this.selectedChange}
								/>
							)
						)
					}
				</div>

				<div class="config">
					{!!stateKeys.length &&
						<div>
							<h3>State:</h3>

							<ul>
								{
									stateKeys.map(
										key => (
											<li>
												<b>{`${key}: `}</b>
												{this.processValue(componentInfo.state[key])}
											</li>
										)
									)
								}
							</ul>
						</div>
					}

					{!!propKeys.length &&
						<div>
							<h3>Props:</h3>

							<ul>
								{
									propKeys.map(
										key => (
											<li>
												<b>{`${key}: `}</b>
												{this.processValue(componentInfo.props[key])}
											</li>
										)
									)
								}
							</ul>
						</div>
					}
				</div>
			</div>
		)
	}
}

App.STATE = {
	componentInfo: Config.value({state: {}, props: {}}),
	rootComponents: Config.value({}),
	selectedComponent: Config.any()
}

export default App;
