import Component, {Config} from 'metal-jsx';
import {isPlainObject, keys} from 'lodash';

// import FlashStateValue from './FlashStateValue';
import NodeName from './NodeName';
import JSONEditor from './JSONEditor';

class StatePane extends Component {
	created() {
		this.inspectComponent = this.inspectComponent.bind(this);
	}

	inspectComponent() {
		const {component, onInspectDOM} = this.props;

		onInspectDOM(component.id);
	}

	render() {
		const {data = null, name} = this.props.component;

		const dataExists = isPlainObject(data);

		return (
			<div class="state-pane-container">
				<div class="header">
					{'Component: '}

					{name &&
						<span>
							<NodeName name={name} />

							<a class="see-in-dom" href="javascript:;" onClick={this.inspectComponent}>{'(Click to See Element)'}</a>
						</span>
					}
				</div>

				{dataExists &&
					keys(data).map(
						dataKey => {
							const stateObj = data[dataKey];

							return (
								<div class="category" key={`${name}-${dataKey}`}>
									<div class="name">{`${dataKey}:`}</div>

									<JSONEditor type={dataKey} value={stateObj}/>
								</div>
							);
						}
					)
				}

				{!dataExists &&
					<div>
						<i>{'No Component Data'}</i>
					</div>
				}
			</div>
		);
	}
}

StatePane.PROPS = {
	component: Config.any(),
	onInspectDOM: Config.func()
};

export default StatePane;
