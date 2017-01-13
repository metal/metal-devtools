export default (stateInfo, keyBlackList = [], instanceBlackList = []) => {
	let retVal = {};

	if (stateInfo) {
		const keys = Object.keys(stateInfo);

		keys.forEach(
			key => {
				const {value} = stateInfo[key];

				if (keyBlackList.indexOf(key) === -1 && !instanceBlackList.some(type => value instanceof type)) {
					retVal[key] = value;
				}
			}
		);
	}

	try {
		retVal = JSON.stringify(retVal);
	} catch (e) {
		retVal = 'null';
	}

	return retVal;
};
