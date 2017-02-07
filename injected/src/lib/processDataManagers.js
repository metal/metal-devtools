import preprocessMetalState from './preprocessMetalState';
import cloneObj from './cloneObj';

export default (dataManagerData = {}) => {
	let retVal = {};

	try {
		for (let key in dataManagerData) {
				retVal[key.replace('_', '')] = cloneObj(
				preprocessMetalState(dataManagerData[key].stateInfo_)
			);
		}
	} catch (err) {
		console.log('%c metal-devtools extension: (`processDataManagers`)\n', 'background: rgb(136, 18, 128); color: #DDD', err);
		console.log('%c Args:', 'background: rgb(136, 18, 128); color: #DDD', dataManagerData);
	}

	return retVal;
};
