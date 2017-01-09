import Component, {Config} from 'metal-jsx';

import processStateValue from '../lib/processStateValues';

class StatePane extends Component {
	render() {
		const {dataManagers} = this.props;

		const dataManagerKeys = Object.keys(dataManagers || {});

		return (
			<div class="state-pane-container">
				<h1>Component Data:</h1>

				{!!dataManagerKeys.length &&
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

				{!dataManagerKeys.length &&
					<div>
						<i>{'No Component Data'}</i>
					</div>
				}
			</div>
		);
	}
}

StatePane.PROPS = {
	dataManagers: Config.object().value({})
};

export default StatePane;
