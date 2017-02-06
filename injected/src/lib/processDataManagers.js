const KEYS_BLACKLIST = ['children'];
const ITERABLE_KEY = '@@__IMMUTABLE_ITERABLE__@@';

// Copied pattern from MDN, https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
function clone(objectToBeCloned) {
	if (!(objectToBeCloned instanceof Object)) {
		return objectToBeCloned;
	}

	let objectClone;

	try {
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
				objectClone = `<${objectToBeCloned.tagName} />`;
				break;
			case Function:
				if (objectToBeCloned.name) {
					objectClone = `function ${objectToBeCloned.name}()`;
				}
				else if (objectToBeCloned.__jsxDOMWrapper) {
					objectClone = '<JSXElement />';
				}
				else {
					objectClone = 'function()';
				}
				break;
			default:
				objectClone = new Constructor();
		}
	} catch (err) {
		console.log('%c metal-devtools extension: (`clone`)\n', 'background: rgb(136, 18, 128); color: #DDD', err);
		console.log('%c Args:', 'background: rgb(136, 18, 128); color: #DDD', objectToBeCloned);
	}

	if (objectClone instanceof Object) {
		for (let prop in objectToBeCloned) {
			if (objectToBeCloned[prop]) {
				objectClone[prop] = clone(objectToBeCloned[prop]);
			}
		}
	}

	return objectClone;
}

const preprocessMetalState = (object) => {
	const newObj = {};

	for (let stateKey in object) {
		const {value} = object[stateKey];

		if (KEYS_BLACKLIST.indexOf(stateKey) === -1) {
			newObj[stateKey] = value;
		}
	}

	return newObj;
};

const processDataManagers = (dataManagerData = {}) => {
	let retVal = {};

	try {
		for (let key in dataManagerData) {
			retVal[key.replace('_', '')] = clone(
				preprocessMetalState(dataManagerData[key].stateInfo_)
			);
		}
	} catch (err) {
		console.log('%c metal-devtools extension: (`processDataManagers`)\n', 'background: rgb(136, 18, 128); color: #DDD', err);
		console.log('%c Args:', 'background: rgb(136, 18, 128); color: #DDD', dataManagerData);
	}

	return retVal;
};

export default processDataManagers;
