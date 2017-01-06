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
		this.state.selectedComponent = node;
	}

	render() {
		const {rootComponents, selectedComponent} = this.state;

		const rootComponentKeys = Object.keys(rootComponents);

		const props = JSON.parse(selectedComponent.props) || {};
		const state = JSON.parse(selectedComponent.state) || {};

		const propKeys = Object.keys(props);
		const stateKeys = Object.keys(state);

		return (
			<div class="container">
				{rootComponentKeys && !rootComponentKeys.length &&
						`If you do not see your components here, try refreshing the page while keeping this panel open.`
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
					<h1>Component Data:</h1>
					{!!stateKeys.length &&
						<div>
							<h2>State:</h2>

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
					}

					{!!propKeys.length &&
						<div>
							<h2>Props:</h2>

							<ul>
								{
									propKeys.map(
										key => (
											<li>
												<b>{`${key}: `}</b>
												<span>{this.processValue(props[key])}</span>
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
	rootComponents: Config.value({}),
	selectedComponent: Config.value(
		{
			props: 'null',
			state: 'null'
		}
	)
}

export default App;
