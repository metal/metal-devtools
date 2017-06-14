jest.unmock('../preprocessMetalState');

import preprocessMetalState from '../preprocessMetalState';

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

  test('should handle special case for children', () => {
    const data = {
      children: {
        value: [
          {
            tag: 'div'
          }
        ]
      }
    };

    const newData = preprocessMetalState(data);

    expect(newData).toEqual({children: ['div']});
  });
});
