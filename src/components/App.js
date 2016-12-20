import Component, {Config} from 'metal-jsx';

import TreeNode from './TreeNode';

const port = chrome.extension.connect({name: 'metal-devtools'});

class App extends Component {
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

	render() {
		const {rootComponents} = this.state;

		return (
			<div>
				{
					Object.keys(rootComponents).map(
						(key, i) => <TreeNode componentNode={rootComponents[key]} key={i} />
					)
				}
			</div>
		)
	}
}

App.STATE = {
	rootComponents: Config.value({})
}

export default App;
