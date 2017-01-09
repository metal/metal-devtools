import Component, {Config} from 'metal-jsx';
import {Iterable, fromJS} from 'immutable';
import {isBoolean, isNull, isObject} from 'lodash';

import TreeNode from './TreeNode';

class App extends Component {
	created() {
		this.selectedChange = this.selectedChange.bind(this);
	}

	attached() {
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
		this.state.selectedComponent = node;
	}

	render() {
		const {rootComponents, selectedComponent} = this.state;

		const rootComponentKeys = Object.keys(rootComponents);

		const dataKeys = Object.keys(selectedComponent.data || {});

		return (
			<div class="container">
				{rootComponentKeys && !rootComponentKeys.length &&
					<div class="warn">
						<div>
							{'If you do not see your components here, try refreshing the page while keeping this panel open.'}
							<br />
							<i>{'Or there may be no Metal.js components on the page.'}</i>
						</div>
					</div>
				}

				{rootComponentKeys && !!rootComponentKeys.length &&
					<div class="nodes">
						{
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
				}

				<div class="config">
					<h1>Component Data:</h1>

					{!!dataKeys.length &&
						dataKeys.map(
							dataKey => {
								const state = JSON.parse(selectedComponent.data[dataKey]);
								const stateKeys = Object.keys(state || {});

								return (
									<div>
										<h2>{`${dataKey}:`}</h2>

										<ul>
											{
												stateKeys.map(
													key => (
														<li>
															<b>{`${key}: `}</b>
															<span>{this.processValue(state[key])}</span>
														</li>
													)
												)
											}
										</ul>
									</div>
								);
							}
						)
					}

					{!dataKeys.length &&
						<div>
							<i>{'No Component Data'}</i>
						</div>
					}
				</div>
			</div>
		);
	}
}

App.PROPS = {
	port: Config.any()
};

App.STATE = {
	rootComponents: Config.value({}),
	selectedComponent: Config.value({})
};

export default App;
