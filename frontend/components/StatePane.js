import Component, {Config} from 'metal-jsx';
import {isPlainObject, keys} from 'lodash';

import NodeName from './NodeName';
import FlashItem from './FlashItem';

import getComponentById from '../lib/getComponentById';

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
								<div class="category">
									<div class="name">{`${dataKey}:`}</div>

									<ul class="data">
										{
											keys(stateObj).map(
												stateObjKey => (
													<li>
														<b class="key">{`${stateObjKey}: `}</b>
														<FlashItem elementClasses="value" value={stateObj[stateObjKey]} />
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
