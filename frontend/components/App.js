import Component, {Config} from 'metal-jsx';
import {bindAll, keys} from 'lodash';

import * as constants from '../../shared/constants';
import InitialWarning from './InitialWarning';
import ResizeDivider from './ResizeDivider';
import StatePane from './StatePane';
import TreeNode from './TreeNode';

class App extends Component {
	created() {
		bindAll(this, 'handleFreezeToggle', 'handleResize', 'processMessage');

		this.props.port.onMessage.addListener(this.processMessage);

		this._pendingFlashRemovals = [];
	}

	addFlash(node) {
		if (node && node.classList) {
			node.classList.add('flash');
		}
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
			this.addFlash(node);

			if (!this.state.freezeUpdates) {
				setTimeout(() => this.removeFlash(node), 100);
			} else {
				this._pendingFlashRemovals.push(node);
			}
		}
	}

	handleFreezeToggle({target}) {
		const {checked} = target;

		this.state.freezeUpdates = checked;

		if (!checked) {
			this._pendingFlashRemovals.forEach(node => this.removeFlash(node));

			this._pendingFlashRemovals = [];
		}
	}

	handleResize({clientX}) {
		this.state.firstColumnWidth = clientX;
	}

	processMessage({data, type}) {
		switch (type) {
			case constants.DETACHED:
				this.checkIfRootDetached(data.id);
				break;
			case constants.NEW_ROOT:
				this.addRootComponent(data);
				break;
			case constants.RENDERED:
				this.flashNode(data);
				break;
			case constants.SELECTED:
				this.state.selectedComponent = data;
				break;
			case constants.UPDATE:
				this.updateRootComponent(data);
				break;
			default:
				console.log(`Unknown Message Type: ${type}`);
		}
	}

	removeFlash(node) {
		if (node && node.classList) {
			node.classList.remove('flash');
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
			props: {highlightDOM, inspectDOM, onSelectedChange, setStateFn},
			state: {
				firstColumnWidth,
				freezeUpdates,
				rootComponents,
				selectedComponent
			}
		} = this;

		const rootComponentKeys = keys(rootComponents);

		return (
			<div class="app-container">
				{!rootComponentKeys ||
					(rootComponentKeys &&
						!rootComponentKeys.length &&
						<InitialWarning />)}

				{rootComponentKeys &&
					!!rootComponentKeys.length &&
					<div
						class="roots-wrapper"
						style={firstColumnWidth && `flex-basis:${firstColumnWidth}px;`}
					>
						<div
							class="options"
							title="Freezes highlights by expanded components"
							style={`width: ${firstColumnWidth + 1}px;`}
						>
							<label for="freezeUpdates">{'Freeze Updates'}</label>

							<input
								checked={freezeUpdates}
								name="freezeUpdates"
								onChange={this.handleFreezeToggle}
								type="checkbox"
							/>
						</div>

						{rootComponentKeys.map((key, i) => (
							<TreeNode
								componentNode={rootComponents[key]}
								depth={0}
								key={i}
								highlightDOM={highlightDOM}
								onInspectDOM={inspectDOM}
								onNodeSelect={onSelectedChange}
								selectedId={selectedComponent.id}
							/>
						))}
					</div>}

				<ResizeDivider onResize={this.handleResize} />

				<StatePane
					component={selectedComponent}
					onInspectDOM={inspectDOM}
					setStateFn={setStateFn}
				/>
			</div>
		);
	}
}

App.PROPS = {
	highlightDOM: Config.func(),
	inspectDOM: Config.func(),
	onSelectedChange: Config.func(),
	port: Config.any(),
	setStateFn: Config.func()
};

App.STATE = {
	firstColumnWidth: Config.number(),
	freezeUpdates: Config.value(false),
	rootComponents: Config.value({}),
	selectedComponent: Config.value({})
};

export default App;
