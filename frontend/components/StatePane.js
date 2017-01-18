import Component, {Config} from 'metal-jsx';
import {isPlainObject, keys} from 'lodash';

import FlashStateValue from './FlashStateValue';
import getComponentById from '../lib/getComponentById';
import NodeName from './NodeName';

class StatePane extends Component {
	getSelectedComponent() {
		const {components, id} = this.props;

		return id ? getComponentById(components, id) : {};
	}

	render() {
		const {data, name} = this.getSelectedComponent();

		const dataExists = isPlainObject(data);

		return (
			<div class="state-pane-container">
				<div class="header">
					{'Component: '}

					{name &&
						<NodeName name={name} />
					}
				</div>

				{dataExists &&
					keys(data).map(
						dataKey => {
							const stateObj = JSON.parse(data[dataKey]);

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
	components: Config.array().value([]),
	id: Config.string()
};

export default StatePane;
