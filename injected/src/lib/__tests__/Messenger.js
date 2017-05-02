jest.unmock('../Messenger');
jest.unmock('../../../../shared/constants');

import Messenger from '../Messenger';
import * as constants from '../../../../shared/constants';

describe('Messenger', () => {
  window.postMessage = jest.fn();

  afterEach(() => {
    if (jest.isMockFunction(window.postMessage)) {
      window.postMessage.mockReset();
    }
  });

  test('postWindowMessage', () => {
    const data = {foo: 'bar'};

    Messenger.postWindowMessage(data);

    expect(window.postMessage).toHaveBeenCalledWith(data, '*');
  });

  test('postWindowMessage error', () => {
    window.postMessage = () => {
      throw Error();
    };

    const initialLog = console.log;

    console.log = jest.fn();

    Messenger.postWindowMessage();

    expect(console.log).toHaveBeenCalledTimes(2);

    window.postMessage = jest.fn();
    console.log = initialLog;
  });

  describe('inform methods', () => {
    beforeAll(() => {
      Messenger.postWindowMessage = jest.fn();
    });

    afterEach(() => {
      if (jest.isMockFunction(Messenger.postWindowMessage)) {
        Messenger.postWindowMessage.mockReset();
      }
    });

    test('informDetached', () => {
      const data = {foo: 'bar'};

      Messenger.informDetached(data);

      expect(Messenger.postWindowMessage).toHaveBeenCalledWith({
        from: constants.METAL_DEVTOOLS_BACKEND,
        message: {
          data,
          type: constants.DETACHED
        }
      });
    });

    test('informNewRoot', () => {
      const data = {foo: 'bar'};

      Messenger.informNewRoot(data);

      expect(Messenger.postWindowMessage).toHaveBeenCalledWith({
        from: constants.METAL_DEVTOOLS_BACKEND,
        message: {
          data,
          type: constants.NEW_ROOT
        }
      });
    });

    test('informRendered', () => {
      const data = {foo: 'bar'};

      Messenger.informRendered(data);

      expect(Messenger.postWindowMessage).toHaveBeenCalledWith({
        from: constants.METAL_DEVTOOLS_BACKEND,
        message: {
          data,
          type: constants.RENDERED
        }
      });
    });

    test('informSelected', () => {
      const data = {foo: 'bar'};

      Messenger.informSelected(data);

      expect(Messenger.postWindowMessage).toHaveBeenCalledWith({
        from: constants.METAL_DEVTOOLS_BACKEND,
        message: {
          data,
          type: constants.SELECTED
        }
      });
    });

    test('informUpdate', () => {
      const data = {foo: 'bar'};

      Messenger.informUpdate(data);

      expect(Messenger.postWindowMessage).toHaveBeenCalledWith({
        from: constants.METAL_DEVTOOLS_BACKEND,
        message: {
          data,
          type: constants.UPDATE
        }
      });
    });
  });
});
