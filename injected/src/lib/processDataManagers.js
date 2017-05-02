import preprocessMetalState from './preprocessMetalState';
import cloneObj from './cloneObj';

export default (dataManagerData = {}) => {
  const retVal = {};

  try {
    for (const key in dataManagerData) {
      if (Object.prototype.hasOwnProperty.call(dataManagerData, key)) {
        retVal[key.replace('_', '')] = cloneObj(
          preprocessMetalState(dataManagerData[key].stateInfo_)
        );
      }
    }
  } catch (err) {
    console.log(
      '%c metal-devtools extension: (`processDataManagers`)\n',
      'background: rgb(136, 18, 128); color: #DDD',
      err
    );
    console.log(
      '%c Args:',
      'background: rgb(136, 18, 128); color: #DDD',
      dataManagerData
    );
  }

  return retVal;
};
