export const KEYS_BLACKLIST = ['children'];

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
