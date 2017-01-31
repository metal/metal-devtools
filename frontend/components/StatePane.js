import Component, {Config} from 'metal-jsx';
import {isPlainObject, keys} from 'lodash';

import FlashStateValue from './FlashStateValue';
import NodeName from './NodeName';

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

		const dataObj = JSON.parse(data);

		const dataExists = isPlainObject(dataObj);

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
					keys(dataObj).map(
						dataKey => {
							const stateObj = dataObj[dataKey];

							return (
								<div class="category" key={`${name}-${dataKey}`}>
									<div class="name">{`${dataKey}:`}</div>

									<ul class="data">
										{
											keys(stateObj).map(
												stateObjKey => (
													<li key={`${name}-${dataKey}-${stateObjKey}`}>
														<b class="key">{`${stateObjKey}: `}</b>
														<FlashStateValue elementClasses="value" value={stateObj[stateObjKey]} />
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
