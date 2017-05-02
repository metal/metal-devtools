jest.unmock('../preprocessMetalState');

import preprocessMetalState, {KEYS_BLACKLIST} from '../preprocessMetalState';

describe('preprocessMetalState', () => {
  test('should set value to the `value` key on the obj', () => {
    const data = {
      foo: {
        value: 'bar'
      }
    };

    const newData = preprocessMetalState(data);

    expect(newData).toEqual({foo: 'bar'});
  });

  test('should ignore all keys from blacklist', () => {
    const data = {};

    KEYS_BLACKLIST.forEach(key => {
      data[key] = {value: true};
    });

    const newData = preprocessMetalState(data);

    expect(newData).toEqual({});
  });
});
