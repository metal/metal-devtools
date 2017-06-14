export const KEYS_BLACKLIST = ['children'];

/**
 * This function filters the state object and removes and state key that is
 * blacklisted.
 */
export default object => {
  const newObj = {};

  for (const stateKey in object) {
    if (Object.prototype.hasOwnProperty.call(object, stateKey)) {
      const {value} = object[stateKey];

      if (stateKey === 'children') {
        newObj[stateKey] = value.map(({tag}) => tag);
      } else {
        newObj[stateKey] = value;
      }
    }
  }

  return newObj;
};
