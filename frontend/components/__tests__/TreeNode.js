jest.unmock('../TreeNode');
jest.unmock('../NodeName');

import TreeNode from '../TreeNode';

const eventObj = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn()
};

describe('TreeNode', () => {
  test('should render', () => {
    const component = new TreeNode({
      componentNode: {
        childComponents: [{}]
      }
    });

    expect(component).toMatchSnapshot();
  });

  test('should show when expanded', () => {
    const component = new TreeNode({
      componentNode: {
        childComponents: [{}]
      }
    });

    component.state.expanded = true;

    expect(component).toMatchSnapshot();
  });

  test('should show when highlighted', () => {
    const component = new TreeNode({
      componentNode: {
        childComponents: [{}]
      }
    });

    component.state.highlight = true;

    expect(component).toMatchSnapshot();
  });

  test('should set showMenu to false', () => {
    const component = new TreeNode();

    component.state.showMenu = true;

    expect(component.state.showMenu).toBe(true);

    component.debounceOverlay();

    jest.runAllTimers();

    expect(component.state.showMenu).toBe(false);
  });

  test('should call onNodeSelect prop', () => {
    const spy = jest.fn();

    const component = new TreeNode({
      onNodeSelect: spy
    });

    component.focusNode();

    expect(spy).toBeCalled();
  });

  test('should set showMenu to true', () => {
    const component = new TreeNode();

    expect(component.state.showMenu).toBe(false);

    component.handleContextMenu(eventObj);

    expect(component.state.showMenu).toBe(true);
  });

  test('should call onInspectDOM prop', () => {
    const spy = jest.fn();

    const component = new TreeNode({
      onInspectDOM: spy
    });

    component.handleInspect();

    expect(spy).toBeCalled();
  });

  test('should toggle expanded and call onNodeSelect prop', () => {
    const spy = jest.fn();

    const component = new TreeNode({
      onNodeSelect: spy
    });

    component.toggleExpanded(eventObj);
    expect(component.state.expanded).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);

    component.toggleExpanded(eventObj);
    expect(component.state.expanded).toBe(false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('should call highlightDOM prop and set highlight value', () => {
    const spy = jest.fn();

    const component = new TreeNode({
      highlightDOM: spy
    });

    component.toggleHighlight(true);
    expect(component.state.highlight).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);

    component.toggleHighlight(false);
    expect(component.state.highlight).toBe(false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('should call toggleHighlight with true', () => {
    const component = new TreeNode();

    component.toggleHighlight = jest.fn();

    component.addHighlight();

    expect(component.toggleHighlight).toBeCalledWith(true);
  });

  test('should call toggleHighlight with false', () => {
    const component = new TreeNode();

    component.toggleHighlight = jest.fn();

    component.removeHighlight();

    expect(component.toggleHighlight).toBeCalledWith(false);
  });

  test('should call highlightDOM prop and set highlight value', () => {
    const id = 'foo';

    const div = document.createElement('div');

    div.scrollIntoView = jest.fn();

    const component = new TreeNode({
      componentNode: {
        containsInspected: true,
        id
      },
      element: div,
      selectedId: id
    });

    component.rendered();

    expect(component.element.scrollIntoView).toBeCalled();
    expect(component.props.componentNode.containsInspected).toBeUndefined();
  });
});
