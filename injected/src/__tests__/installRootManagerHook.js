jest.unmock('../installRootManagerHook');

import RootManager from '../lib/RootManager';

describe('installRootManagerHook', () => {
	afterEach(() => {
		delete window.__METAL_DEV_TOOLS_HOOK__;
	});

	test('should do nothing if __METAL_DEV_TOOLS_HOOK__ doesn\'t exist', () => {
		window.__METAL_DEV_TOOLS_HOOK__ = undefined;

		require('../installRootManagerHook').default();

		expect(RootManager).not.toHaveBeenCalled();
	});

	test('should call `reloadRoots` is manager already exists', () => {
		window.__METAL_DEV_TOOLS_HOOK__= {
			_managerExists: true,
			reloadRoots: jest.fn()
		};

		require('../installRootManagerHook').default();

		expect(window.__METAL_DEV_TOOLS_HOOK__.reloadRoots).toHaveBeenCalled();
	});

	test('should set up __METAL_DEV_TOOLS_HOOK__', () => {
		window.__METAL_DEV_TOOLS_HOOK__ = {
			getAll: jest.fn(() => ['foo'])
		};

		require('../installRootManagerHook').default();

		window.__METAL_DEV_TOOLS_HOOK__();

		expect(RootManager).toHaveBeenCalled();
		expect(window.__METAL_DEV_TOOLS_HOOK__.getComponentNode).toBeTruthy();
		expect(window.__METAL_DEV_TOOLS_HOOK__.hasComponent).toBeTruthy();
		expect(window.__METAL_DEV_TOOLS_HOOK__.hasRoots).toBeTruthy();
		expect(window.__METAL_DEV_TOOLS_HOOK__.highlightNode).toBeTruthy();
		expect(window.__METAL_DEV_TOOLS_HOOK__.selectComponent).toBeTruthy();
	});
});
