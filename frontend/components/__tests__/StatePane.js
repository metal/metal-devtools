jest.unmock('../../lib/processStateValues');
jest.unmock('../NodeName');
jest.unmock('../ResizeDivider');
jest.unmock('../StatePane');
jest.unmock('../FlashStateValue');
jest.unmock('../JSONEditor');

import StatePane from '../StatePane';

describe('StatePane', () => {
	test('should render', () => {
		const component = new StatePane({
			component: {
				data: {
					one: {foo: 'bar'},
					two: {}
				},
				id: 'foo',
				name: 'fooComponent'
			}
		});

		expect(component).toMatchSnapshot();
	});

	test('should call onInspectDOM prop', () => {
		const id = 'foo';
		const spy = jest.fn();

		const component = new StatePane({
			component: {
				data: {
					one: {foo: 'bar'},
					two: {}
				},
				id: 'foo',
				name: 'fooComponent'
			},
			onInspectDOM: spy
		});

		component.inspectComponent();

		expect(spy).toBeCalledWith(id);
	});

	test('should call `setStateFn` prop', () => {
		const spy = jest.fn();

		const component = new StatePane({
			component: {
				id: 'foo'
			},
			setStateFn: spy
		});

		const data = {foo: 'bar'};

		component.handleStateChange(data, 'state');

		expect(spy).toHaveBeenCalledWith('foo', data, 'state');
	});
});
