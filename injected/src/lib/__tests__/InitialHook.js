jest.unmock('../InitialHook');

import InitialHook from '../InitialHook';

describe('InitialHook', () => {
	test('should initialize', () => {
		const Hook = new InitialHook();

		expect(Hook).toBeTruthy();
	});

	test('should add to components array', () => {
		const Hook = new InitialHook();

		Hook.add('foo');

		expect(Hook._components).toContain('foo');
	});

	test('should add to components array', () => {
		const Hook = new InitialHook();

		Hook.add('foo');
		Hook.add('bar');
		Hook.add('baz');

		expect(Hook.getAll()).toContain('foo', 'bar', 'baz');
		expect(Hook.getAll()).toEqual(Hook._components);
	});

	test('should check if components exist', () => {
		const Hook = new InitialHook();

		expect(Hook.hasComponents()).toBeFalsy();

		Hook.add('foo');

		expect(Hook.hasComponents()).toBeTruthy();
	});
});
