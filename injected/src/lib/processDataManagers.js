const removeDOMReferences = (stateInfo) => {
	let retVal = {};

	if (stateInfo) {
		for (let key in stateInfo) {
			const {value} = stateInfo[key];

			if (!(value instanceof HTMLElement)) {
				retVal[key] = value;
			}
		}
	}

	return retVal;
};

const processDataManagers = (dataManagerData = {}) => {
	let retVal = {};

	for (let key in dataManagerData) {
		const dataManager = dataManagerData[key];

		retVal[key.replace('_', '')] = removeDOMReferences(dataManager.stateInfo_);
	}

	try {
		retVal = JSON.stringify(retVal);
	} catch (e) {
		retVal = 'null';
	}

	return retVal;
};

export default processDataManagers;
