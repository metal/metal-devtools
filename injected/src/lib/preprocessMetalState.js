export const KEYS_BLACKLIST = ['children'];

export default object => {
	const newObj = {};

	for (let stateKey in object) {
		const {value} = object[stateKey];

		if (KEYS_BLACKLIST.indexOf(stateKey) === -1) {
			newObj[stateKey] = value;
		}
	}

	return newObj;
};
