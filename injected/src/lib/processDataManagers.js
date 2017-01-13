import processConfig from './processConfig';

export default (dataManagerData) => {
	const dataManagerKeys = Object.keys(dataManagerData || {});

	const data = {};

	if (dataManagerKeys && dataManagerKeys.length) {
		dataManagerKeys.forEach(
			key => {
				const dataManager = dataManagerData[key];

				data[key.replace('_', '')] = processConfig(
					dataManager.stateInfo_,
					['children', 'events', 'storeState'],
					[HTMLElement]
				);
			}
		);
	}

	return data;
};
