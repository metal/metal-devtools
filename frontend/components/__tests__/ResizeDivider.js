jest.unmock('../ResizeDivider');

import ResizeDivider from '../ResizeDivider';

describe('ResizeDivider', () => {
	test('should render', () => {
		const component = new ResizeDivider({onResize: jest.fn()});

		expect(snap(component)).toMatchSnapshot();
	});

	test('should call onResize prop with specific arg', () => {
		const spy = jest.fn();
		const component = new ResizeDivider({onResize: spy});

		const arg = {clientX: 100};

		component.doDrag(arg);

		expect(spy).toBeCalledWith(arg);
	});

	test('should add event listeners on body', () => {
		const spy = jest.fn();

		document.body.addEventListener = spy;

		const component = new ResizeDivider({onResize: spy});

		component.initDrag();

		expect(spy).toHaveBeenCalledTimes(2);

		document.body.addEventListener.mockClear();
	});

	test('should remove event listeners on body', () => {
		const spy = jest.fn();

		document.body.removeEventListener = spy;

		const component = new ResizeDivider({onResize: spy});

		component.stopDrag();

		expect(spy).toHaveBeenCalledTimes(2);

		document.body.removeEventListener.mockClear();
	});
});
