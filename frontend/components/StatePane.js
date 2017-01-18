import Component, {Config} from 'metal-jsx';
import {isPlainObject, keys} from 'lodash';

import processStateValue from '../lib/processStateValues';
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
				<h1>Component Data: <i>{name}</i></h1>

				{dataExists &&
					keys(data).map(
						dataKey => {
							const stateObj = JSON.parse(data[dataKey]);

							return (
								<div>
									<h2>{`${dataKey}:`}</h2>

									<ul>
										{
											keys(stateObj).map(
												stateObjKey => (
													<li>
														<b>{`${stateObjKey}: `}</b>
														<span>{processStateValue(stateObj[stateObjKey])}</span>
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
