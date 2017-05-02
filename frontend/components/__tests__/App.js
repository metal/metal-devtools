jest.disableAutomock();

import * as constants from '../../../shared/constants';
import App, {flattenIds} from '../App';

const fooRoot = {
  id: 'foo'
};

describe('flattenIds', () => {
  test('should flatten object into an array', () => {
    expect(
      flattenIds({
        one: {
          childComponents: [
            {
              childComponents: [
                {
                  expanded: false,
                  id: 5
                }
              ],
              expanded: true,
              id: 2
            }
          ],
          expanded: true,
          id: 1
        },
        two: {
          childComponents: [
            {
              expanded: false,
              id: 3
            }
          ],
          expanded: false,
          id: 4
        }
      })
    ).toMatchSnapshot();
  });
});

describe('App', () => {
  test('should render', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.state.rootComponents = {foo: fooRoot};

    jest.runAllTimers();

    expect(component).toMatchSnapshot();
  });

  test('should detach', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.detach();

    jest.runAllTimers();

    expect(component).toMatchSnapshot();
  });

  test('should add root to state', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    expect(component.state.rootComponents).toEqual({});

    component.addRootComponent(fooRoot);
    expect(component.state.rootComponents).toEqual({foo: fooRoot});
  });

  test('should check id detached component is a root', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.state.rootComponents = {foo: fooRoot};

    component.checkIfRootDetached('foo');
    expect(component.state.rootComponents).toEqual({});
  });

  test('should call appropriate method for each arrow key', () => {
    const component = new App({
      onComponentExpand: jest.fn(),
      onSelectedChange: jest.fn(),
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.handleKeys({key: 'ArrowDown', preventDefault: jest.fn()});
    expect(component.props.onSelectedChange).toHaveBeenCalled();

    component.handleKeys({key: 'ArrowUp', preventDefault: jest.fn()});
    expect(component.props.onSelectedChange).toHaveBeenCalled();

    component.handleKeys({key: 'ArrowLeft', preventDefault: jest.fn()});
    expect(component.props.onSelectedChange).toHaveBeenCalled();

    component.handleKeys({key: 'ArrowRight', preventDefault: jest.fn()});
    expect(component.props.onSelectedChange).toHaveBeenCalled();
  });

  test('should set column width', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.handleResize({clientX: 100});

    expect(component.state.firstColumnWidth).toEqual(100);
  });

  describe('processMessage', () => {
    test('should call `checkIfRootDetached`', () => {
      const component = new App({
        port: {
          onMessage: {
            addListener: jest.fn()
          }
        }
      });

      const spy = jest.fn();

      component.checkIfRootDetached = spy;

      component.processMessage({data: {}, type: constants.DETACHED});

      expect(spy).toBeCalled();
    });

    test('should call `updateRootComponent`', () => {
      const component = new App({
        port: {
          onMessage: {
            addListener: jest.fn()
          }
        }
      });

      const spy = jest.fn();

      component.updateRootComponent = spy;

      component.processMessage({data: {}, type: constants.UPDATE});

      expect(spy).toBeCalled();
    });

    test('should set selectedComponent', () => {
      const component = new App({
        port: {
          onMessage: {
            addListener: jest.fn()
          }
        }
      });

      component.processMessage({data: fooRoot, type: constants.SELECTED});

      expect(component.state.selectedComponent).toBe(fooRoot);
    });

    test('should call `addRootComponent`', () => {
      const component = new App({
        port: {
          onMessage: {
            addListener: jest.fn()
          }
        }
      });

      const spy = jest.fn();

      component.addRootComponent = spy;

      component.processMessage({data: {}, type: constants.NEW_ROOT});

      expect(spy).toBeCalled();
    });

    test('should emit console.log', () => {
      const component = new App({
        port: {
          onMessage: {
            addListener: jest.fn()
          }
        }
      });

      const logVal = console.log;

      console.log = jest.fn();

      component.processMessage({data: {}, type: 'bar'});

      expect(console.log).toBeCalled();

      console.log = logVal;
    });
  });

  test('should emit console.log', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    const spy = jest.fn();

    component.flashNode = spy;

    component.processMessage({data: {}, type: constants.RENDERED});

    expect(spy).toBeCalled();
  });

  test('should reset rootComponents state', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.state.rootComponents = {foo: 'bar'};

    component.resetRoots();

    expect(component.state.rootComponents).toEqual({});
  });

  test('should update component', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.state.rootComponents = {foo: fooRoot};

    component.updateRootComponent({...fooRoot, name: 'fooRoot'});

    expect(component.state.rootComponents['foo'].name).toEqual('fooRoot');
  });

  test('should add/remove `flash` class', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    component.addFlash(component.element);

    expect(component.element.classList).toContain('flash');

    component.removeFlash(component.element);

    expect(component.element.classList).not.toContain('flash');
  });

  test('should add/remove `flash` class', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    const initialStub = document.querySelector;

    document.querySelector = jest.fn(() => true);
    component.addFlash = jest.fn();
    component.removeFlash = jest.fn();

    component.flashNode('testComponent');

    jest.runAllTimers();

    expect(component.addFlash).toBeCalled();
    expect(component.removeFlash).toBeCalled();

    component.state.freezeUpdates = true;

    jest.runAllTimers();

    component.flashNode('testComponent');

    component.removeFlash.mockReset();

    expect(component.removeFlash).not.toBeCalled();

    document.querySelector = initialStub;
  });

  test('should toggle freezeUpdates', () => {
    const component = new App({
      port: {
        onMessage: {
          addListener: jest.fn()
        }
      }
    });

    expect(component.state.freezeUpdates).toEqual(false);

    component.handleFreezeToggle({target: {checked: true}});
    expect(component.state.freezeUpdates).toEqual(true);

    component._pendingFlashRemovals = [document.createElement('div')];

    component.handleFreezeToggle({target: {checked: false}});
    expect(component.state.freezeUpdates).toEqual(false);
  });
});
