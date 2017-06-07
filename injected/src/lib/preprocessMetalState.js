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

      if (KEYS_BLACKLIST.indexOf(stateKey) === -1) {
        newObj[stateKey] = value;
      }
    }
  }

  return newObj;
};
