const ITERABLE_KEY = '@@__IMMUTABLE_ITERABLE__@@';

// Copied pattern from MDN, https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
function clone(objectToBeCloned) {
	if (!(objectToBeCloned instanceof Object)) {
		return objectToBeCloned;
	}

	let objectClone;

	if (objectToBeCloned && objectToBeCloned[ITERABLE_KEY]) {
		objectToBeCloned = objectToBeCloned.toJS();
	}

	const Constructor = objectToBeCloned.constructor;
	switch (Constructor) {
		case RegExp:
			objectClone = new Constructor(objectToBeCloned);
			break;
		case Date:
			objectClone = new Constructor(objectToBeCloned.getTime());
			break;
		case HTMLElement:
			objectClone = new Constructor(objectToBeCloned.tagName);
			break;
		case Function:
			if (objectToBeCloned.name) {
				objectClone = `${objectToBeCloned.name}()`;
			}
			else {
				objectClone = 'function()';
			}
			break;
		default:
			objectClone = new Constructor();
	}

	for (let prop in objectToBeCloned) {
		if (objectToBeCloned[prop]) {
			const {value} = objectToBeCloned[prop];

			objectClone[prop] = clone(value);
		}
	}

	return objectClone;
}

const processDataManagers = (dataManagerData = {}) => {
	let retVal = {};

	try {
		for (let key in dataManagerData) {
			const dataManager = dataManagerData[key];

			retVal[key.replace('_', '')] = clone(dataManager.stateInfo_);
		}
	} catch (err) {
		console.log('%c Metal-Devtools Extension:\n', 'background: #222; color: #BADA55', err);
		console.log('%c Data:', 'background: #222; color: #BADA55', dataManagerData);
	}

	return retVal;
};

export default processDataManagers;
