jest.unmock('../RootManager');

import Component from 'metal-jsx';

import RootManagerClass from '../RootManager';
import Messenger from '../Messenger';
import processDataManagers from '../processDataManagers';

class MyComponent extends Component {
	render() {
		return <div><Child /></div>;
	}
}

class Child extends Component {
	render() {
		return <div></div>;
	}
}

describe('RootManager', () => {
	let RootManager;

	afterEach(() => {
		if (jest.isMockFunction(Messenger)) {
			Messenger.mockClear();
			Messenger.mockReset();
		}
	});

	beforeEach(() => {
		RootManager = new RootManagerClass();
	});

	test('should create a div mask', () => {
		expect(document.getElementById('__METAL_DEV_TOOLS_MASK__')).toBeFalsy();

		RootManager.createOverlayMask();

		expect(document.getElementById('__METAL_DEV_TOOLS_MASK__')).toBeTruthy();

		document.body.innerHTML = '';
	});

	test('should get component node if it exists', () => {
		const id = 123;

		RootManager._componentMap = {
			[id]: {
				element: 'foo'
			}
		};

		expect(RootManager.getComponentNode(id)).toBe('foo');
	});

	test('should check if component exists', () => {
		const id = 123;

		expect(RootManager.getComponentNode(id)).toBeFalsy();

		RootManager._componentMap = {
			[id]: {
				element: 'foo'
			}
		};

		expect(RootManager.getComponentNode(id)).toBe('foo');
	});

	test('should check if component exists', () => {
		RootManager._componentMap = {foo: 'bar'};

		expect(RootManager.hasComponent('foo')).toBeTruthy();
	});

	test('should check if roots exists', () => {
		expect(RootManager.hasRoots()).toBeFalsy();

		RootManager._roots = ['foo'];

		expect(RootManager.hasRoots()).toBeTruthy();
	});

	describe('highlightNode', () => {
		test('should call `createOverlayMask` if it doesnt exist', () => {
			RootManager.createOverlayMask = jest.fn(() => {
				RootManager._mask = document.createElement('div');
			});

			RootManager.highlightNode();

			expect(RootManager.createOverlayMask).toHaveBeenCalled();
		});

		test('should call `applyStyles` for mask node', () => {
			RootManager.getComponentNode = jest.fn(() => {
				return {
					getBoundingClientRect: () => (
						{
							height: 10,
							left: 11,
							top: 12,
							width: 13
						}
					)
				};
			});

			const mask = document.createElement('div');

			RootManager._mask = mask;
			RootManager._maskDimensions = document.createElement('div');

			RootManager.highlightNode();

			expect(mask.style.display).toEqual('flex');
			expect(mask.style.height).toEqual('10px');
			expect(mask.style.left).toEqual('11px');
			expect(mask.style.top).toEqual('12px');
			expect(mask.style.width).toEqual('13px');
		});
	});

	test('should add to roots array, call `_executeAsync` and call `informNewRoot`', () => {
		RootManager._executeAsync = jest.fn(fn => fn());
		RootManager._traverseTree = jest.fn();

		RootManager.addRoot({foo: 'bar'});

		expect(RootManager._roots[0]).toMatchObject({foo: 'bar'});
		expect(RootManager._executeAsync).toHaveBeenCalled();
		expect(Messenger.informNewRoot).toHaveBeenCalled();
	});

	test('should call `_executeAsync` and informNewRoot', () => {
		RootManager._executeAsync = jest.fn(fn => fn());
		RootManager._handleComponentUpdated = jest.fn();

		RootManager._roots = [1, 2, 3];

		RootManager.reloadRoots();

		expect(RootManager._executeAsync).toHaveBeenCalled();
		expect(RootManager._handleComponentUpdated).toHaveBeenCalled();
	});

	test('should call `_executeAsync` and Messenger.informNewRoot', () => {
		RootManager._executeAsync = jest.fn(fn => fn());
		RootManager._traverseTree = jest.fn();

		RootManager._roots = [1, 2, 3];

		Messenger.informNewRoot = jest.fn();

		RootManager.reloadRoots(true);

		expect(RootManager._executeAsync).toHaveBeenCalled();
		expect(Messenger.informNewRoot).toHaveBeenCalled();
		expect(RootManager._traverseTree).toHaveBeenCalled();

	});

	test('should process metal component object and call `processDataManagers`', () => {
		processDataManagers.mockImplementation(() => {
			return {};
		});

		const component1 = {
			__DATA_MANAGER_DATA__: {},
			__METAL_DEV_TOOLS_COMPONENT_KEY__: 'foo1',
			name: 'Foo1'
		};

		expect(RootManager.processComponentObj(component1)).toMatchObject({
			data: {},
			id: 'foo1',
			name: 'Foo1'
		});

		const component2 = {
			__DATA_MANAGER_DATA__: {},
			__METAL_DEV_TOOLS_COMPONENT_KEY__: 'foo2',
			constructor: {
				name: 'Foo2'
			}
		};

		expect(RootManager.processComponentObj(component2)).toMatchObject({
			data: {},
			id: 'foo2',
			name: 'Foo2'
		});
	});

	test('should set previousSelectedId and call `informSelected`', () => {
		RootManager.processComponentObj = jest.fn();

		const id = 1;

		RootManager.selectComponent(id);

		expect(RootManager._previousSelectedId).toEqual(id);
		expect(RootManager.processComponentObj).toHaveBeenCalled();
		expect(Messenger.informSelected).toHaveBeenCalled();
	});

	test('should execute fn in setTimeout', () => {
		const fn = jest.fn();

		RootManager._executeAsync(fn);

		jest.runAllTimers();

		expect(fn).toHaveBeenCalled();
	});

	test('should handle component updating', () => {
		RootManager._executeAsync = jest.fn(fn => fn());
		RootManager._traverseTree = jest.fn();
		RootManager._updateCurrentSelected = jest.fn();

		const id = 'foo';

		RootManager.addRoot({__METAL_DEV_TOOLS_COMPONENT_KEY__: id});

		RootManager._handleComponentUpdated(id);

		expect(RootManager._executeAsync).toHaveBeenCalled();
		expect(RootManager._traverseTree).toHaveBeenCalled();
		expect(RootManager._updateCurrentSelected).toHaveBeenCalled();
		expect(Messenger.informUpdate).toHaveBeenCalled();
	});

	test('should check if it was a root detaching', () => {
		const id = 'foo';

		RootManager.addRoot({__METAL_DEV_TOOLS_COMPONENT_KEY__: id});

		RootManager._checkIfRootDetached('bar');
		expect(RootManager._roots).toHaveLength(1);


		RootManager._checkIfRootDetached(id);
		expect(RootManager._roots).toHaveLength(0);
	});

	test('should handle updating selected', () => {
		RootManager.processComponentObj = jest.fn();

		const id = 'foo';

		RootManager._updateCurrentSelected(id);

		expect(Messenger.informSelected).toHaveBeenCalled();
		expect(RootManager.processComponentObj).toHaveBeenCalled();
	});

	test('should handle updating selected, if no id provided use _previousSelectedId', () => {
		RootManager.processComponentObj = jest.fn();

		RootManager._previousSelectedId = 'foo';

		RootManager._updateCurrentSelected();

		expect(Messenger.informSelected).toHaveBeenCalled();
		expect(RootManager.processComponentObj).toHaveBeenCalled();
	});

	test('should return if component is falsy', () => {
		expect(RootManager._traverseTree()).toEqual({});
	});

	test('should handle traversing tree', () => {
		RootManager._attachComponentListeners = jest.fn();
		RootManager.selectComponent = jest.fn();

		const component = new MyComponent();
		const id = 'foo';

		component['__METAL_DEV_TOOLS_COMPONENT_KEY__'] = id;
		RootManager._inspectedNode = component.element;

		const retVal = RootManager._traverseTree(component, component);

		expect(RootManager._attachComponentListeners).toHaveBeenCalled();
		expect(RootManager._closestSelectedId).toBeTruthy();
		expect(retVal).toEqual({
			containsInspected: true,
			id,
			name: 'MyComponent',
			childComponents: [
				{
					containsInspected: false,
					id: undefined,
					name: 'Child',
					childComponents: undefined
				}
			]
		});
	});

	test('should attach component listeners', () => {
		RootManager._checkIfRootDetached = jest.fn();
		RootManager._handleComponentUpdated = jest.fn();

		const component = {
			on: (str, fn) => {
				fn();
			}
		};

		RootManager._attachComponentListeners(component);

		expect(RootManager._checkIfRootDetached).toHaveBeenCalled();
		expect(RootManager._handleComponentUpdated).toHaveBeenCalled();
		expect(Messenger.informDetached).toHaveBeenCalled();
		expect(Messenger.informRendered).toHaveBeenCalled();
	});

	test('should return data managers', () => {
		const id = '123';
		const state = {foo: 'bar'};

		RootManager._componentMap = {
			[id]: {
				__DATA_MANAGER_DATA__: state
			}
		};
		const retVal = RootManager.getDataManagers(id);

		expect(retVal).toEqual(state);
	});

	test('should call `setState` on data manager', () => {
		const dataManagerName = 'state';
		const id = 1;

		const spy = jest.fn();

		const newState = JSON.stringify({foo: 'bar'});

		RootManager.getDataManagers = jest.fn(
			() => (
				{
					[`${dataManagerName}_`]: {
						setState: spy
					},
				}
			)
		);

		RootManager.setComponentState(id, newState, dataManagerName);

		expect(RootManager.getDataManagers).toHaveBeenCalledWith(id);
		expect(spy).toHaveBeenCalledWith({foo: 'bar'});
	});
});
