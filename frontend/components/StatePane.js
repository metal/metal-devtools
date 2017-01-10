import Component, {Config} from 'metal-jsx';

import processStateValue from '../lib/processStateValues';
import getComponentById from '../lib/getComponentById';

class StatePane extends Component {
	getSelectedComponent() {
		const {components, id} = this.props;

		return id ? getComponentById(components, id) : {};
	}

	render() {
		const dataManagers = this.getSelectedComponent().data || {};

		const dataManagerKeys = Object.keys(dataManagers);

		const dataManagersLength = dataManagerKeys.length;

		return (
			<div class="state-pane-container">
				<h1>Component Data:</h1>

				{!!dataManagersLength &&
					dataManagerKeys.map(
						dataManagerKey => {
							const data = JSON.parse(dataManagers[dataManagerKey]);
							const dataKeys = Object.keys(data || {});

							return (
								<div>
									<h2>{`${dataManagerKey}:`}</h2>

									<ul>
										{
											dataKeys.map(
												key => (
													<li>
														<b>{`${key}: `}</b>
														<span>{processStateValue(data[key])}</span>
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

				{!dataManagersLength &&
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
