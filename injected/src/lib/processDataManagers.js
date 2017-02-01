const STATE_KEY_BLACKLIST = ['children', 'events', 'storeState'];
const INSTANCE_BLACKLIST = [HTMLElement];

const removeDOMReferences = (stateInfo) => {
	let retVal = {};

	if (stateInfo) {
		for (let key in stateInfo) {
			const {value} = stateInfo[key];

			if (STATE_KEY_BLACKLIST.indexOf(key) === -1 && !INSTANCE_BLACKLIST.some(type => value instanceof type)) {
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
		console.log('%c Metal-Devtools Extension:\n', 'background: #222; color: #BADA55', e);

		retVal = 'null';
	}

	return retVal;
};

export default processDataManagers;
