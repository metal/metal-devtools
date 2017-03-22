/* global IncrementalDOM */

jest.unmock('../JSONEditor');

import JSONEditor from '../JSONEditor';

describe('JSONEditor', () => {
	test('should render', () => {
		const component = new JSONEditor(
			{
				value: {}
			}
		);

		expect(component).toMatchSnapshot();
	});

	test('should return jsx element', () => {
		const component = new JSONEditor(
			{value: {}}
		);

		const initSpyVal = IncrementalDOM;

		IncrementalDOM = {
			elementVoid: jest.fn()
		};

		expect(component.arrowRenderer(true)).toMatchSnapshot();
		expect(component.arrowRenderer(false)).toMatchSnapshot();

		IncrementalDOM = initSpyVal;
	});

	test('should return changed data', () => {
		const spy = jest.fn();

		const component = new JSONEditor(
			{
				onChange: spy,
				value: {
					baz: {
						qux: 'test'
					},
					foo: 'bar'
				}
			}
		);

		const newVal = {
			baz: {
				qux: 'bar'
			},
			foo: 'bar'
		};

		expect(component.handleOnChange(newVal)).toMatchSnapshot();
		expect(spy).toHaveBeenCalled();
	});
});
