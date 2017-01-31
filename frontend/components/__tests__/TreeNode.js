jest.unmock('../TreeNode');
jest.unmock('../NodeName');

import TreeNode from '../TreeNode';

const eventObj = {
	preventDefault: jest.fn(),
	stopPropagation: jest.fn()
};

describe('TreeNode', () => {
	it('should render', () => {
		const component = new TreeNode(
			{
				componentNode: {
					childComponents: [{}]
				}
			}
		);

		expect(snap(component)).toMatchSnapshot();
	});

	it('should show when expanded', () => {
		const component = new TreeNode(
			{
				componentNode: {
					childComponents: [{}]
				}
			}
		);

		component.state.expanded = true;

		expect(snap(component)).toMatchSnapshot();
	});

	it('should show when highlighted', () => {
		const component = new TreeNode(
			{
				componentNode: {
					childComponents: [{}]
				}
			}
		);

		component.state.highlight = true;

		expect(snap(component)).toMatchSnapshot();
	});

	it('should set showMenu to false', () => {
		const component = new TreeNode();

		component.state.showMenu = true;

		expect(component.state.showMenu).toBe(true);

		component.debounceOverlay();

		jest.runAllTimers();

		expect(component.state.showMenu).toBe(false);
	});

	it('should call onNodeClick prop', () => {
		const spy = jest.fn();

		const component = new TreeNode({
			onNodeClick: spy
		});

		component.focusNode();

		expect(spy).toBeCalled();
	});

	it('should set showMenu to true', () => {
		const component = new TreeNode();

		expect(component.state.showMenu).toBe(false);

		component.handleContextMenu(eventObj);

		expect(component.state.showMenu).toBe(true);
	});

	it('should call onInspectDOM prop', () => {
		const spy = jest.fn();

		const component = new TreeNode({
			onInspectDOM: spy
		});

		component.handleInspect();

		expect(spy).toBeCalled();
	});

	it('should toggle expanded and call onNodeClick prop', () => {
		const spy = jest.fn();

		const component = new TreeNode({
			onNodeClick: spy
		});

		component.toggleExpanded(eventObj);
		expect(component.state.expanded).toBe(true);
		expect(spy).toHaveBeenCalledTimes(1);

		component.toggleExpanded(eventObj);
		expect(component.state.expanded).toBe(false);
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('should call highlightDOM prop and set highlight value', () => {
		const spy = jest.fn();

		const component = new TreeNode({
			highlightDOM: spy
		});

		const posFun = component.toggleHighlight(true);
		posFun();
		expect(component.state.highlight).toBe(true);
		expect(spy).toHaveBeenCalledTimes(1);

		const negFun = component.toggleHighlight(false);
		negFun();
		expect(component.state.highlight).toBe(false);
		expect(spy).toHaveBeenCalledTimes(2);
	});

	it('should call highlightDOM prop and set highlight value', () => {
		const component = new TreeNode();

		component._firstRender = true;

		component.syncComponentNode({}, {});

		expect(component._firstRender).toBe(false);

		const {element} = component.refs.nodeName;

		element.classList.add = jest.fn();
		element.classList.remove = jest.fn();

		component.syncComponentNode({}, {data: 'two'});

		jest.runAllTimers();

		expect(element.classList.add).toBeCalled();
		expect(element.classList.remove).toBeCalled();
	});

	it('should call highlightDOM prop and set highlight value', () => {
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
