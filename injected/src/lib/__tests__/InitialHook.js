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

		expect(Hook._roots).toMatchSnapshot();
	});

	test('should add to components array', () => {
		const Hook = new InitialHook();

		Hook.add('foo');
		Hook.add('bar');
		Hook.add('baz');

		expect(Hook.getAll()).toMatchSnapshot();
		expect(Hook.getAll()).toMatchSnapshot();
	});

	test('should check if components exist', () => {
		const Hook = new InitialHook();

		expect(Hook.hasRoots()).toBeFalsy();

		Hook.add('foo');

		expect(Hook.hasRoots()).toBeTruthy();
	});
});
