jest.unmock('../../lib/processStateValues');
jest.unmock('../NodeName');
jest.unmock('../ResizeDivider');
jest.unmock('../StatePane');
jest.unmock('../FlashStateValue');

import StatePane from '../StatePane';

describe('StatePane', () => {
	it('should render', () => {
		const component = new StatePane(
			{
				component: {
					data: JSON.stringify({
						one: {foo: 'bar'},
						two: {}
					}),
					id: 'foo',
					name: 'fooComponent'
				}
			}
		);

		expect(snap(component)).toMatchSnapshot();
	});

	it('should call onInspectDOM prop', () => {
		const id = 'foo';
		const spy = jest.fn();

		const component = new StatePane({
			component: {
				data: JSON.stringify({
					one: {foo: 'bar'},
					two: {}
				}),
				id: 'foo',
				name: 'fooComponent'
			},
			onInspectDOM: spy
		});

		component.inspectComponent();

		expect(spy).toBeCalledWith(id);
	});
});
