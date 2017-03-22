jest.unmock('../installInitialHook');

import InitialHookClass from '../lib/InitialHook';

describe('installInitialHook', () => {
	afterEach(() => {
		delete window.__METAL_DEV_TOOLS_HOOK__;
	});

	test('should do nothing if __METAL_DEV_TOOLS_HOOK__ already exists', () => {
		window.__METAL_DEV_TOOLS_HOOK__ = true;

		require('../installInitialHook').default();

		expect(InitialHookClass).not.toHaveBeenCalled();
	});

	test('should set global __METAL_DEV_TOOLS_HOOK__ methods', () => {
		window.__METAL_DEV_TOOLS_HOOK__ = undefined;

		require('../installInitialHook').default();

		expect(InitialHookClass).toHaveBeenCalled();
		expect(window.__METAL_DEV_TOOLS_HOOK__).toBeTruthy();
		expect(window.__METAL_DEV_TOOLS_HOOK__.getAll).toBeTruthy();
		expect(window.__METAL_DEV_TOOLS_HOOK__.hasRoots).toBeTruthy();
	});
});
