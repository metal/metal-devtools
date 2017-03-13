jest.unmock('../JSONEditor');

import jsoneditor from 'jsoneditor';

import JSONEditor from '../JSONEditor';

describe('JSONEditor', () => {
	test('should render', () => {
		const component = new JSONEditor();

		expect(component).toMatchSnapshot();
	});

	test('should return only the data that was changed', () => {
		const component = new JSONEditor({
			value: {
				baz: 'qux',
				foo: 'bar'
			}
		});

		component.getData = jest.fn(
			() => ({
				baz: 'qux',
				foo: 'boo'
			})
		);

		const retVal = component.getChangedData();

		expect(retVal).toEqual({foo: 'boo'});
	});

	test('should return the jsoneditor value', () => {
		const component = new JSONEditor();

		component.props.value = {foo: 'bar'};

		jest.runAllTimers();

		expect(component.getData()).toEqual({foo: 'bar'});
	});

	test('should return jsoneditor instance', () => {
		const component = new JSONEditor();

		expect(component.getEditor()).toBeInstanceOf(jsoneditor);
	});

	test('should call onChange prop', () => {
		const spy = jest.fn();

		const component = new JSONEditor({
			onChange: spy
		});

		component.handleChange();

		jest.runAllTimers();

		expect(spy).toHaveBeenCalled();
	});

	test('should not call render', () => {
			const component = new JSONEditor();

			component.render = jest.fn();

			component.props.value = {foo: 'bar'};

			expect(component.render).not.toHaveBeenCalled();
			expect(component.shouldUpdate()).toBe(false);
	});

	test('should set new jsoneditor value', () => {
		const component = new JSONEditor();

		component._editor.set = jest.fn();

		component.props.value = {foo: 'bar'};

		jest.runAllTimers();

		expect(component._editor.set).toHaveBeenCalled();
	});
});
