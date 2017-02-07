jest.unmock('../Messenger');
jest.unmock('../../../../shared/messageTypes');

import Messenger, {BACKEND} from '../Messenger';
import * as messageTypes from '../../../../shared/messageTypes';

describe('Messenger', () => {
	window.postMessage = jest.fn();

	afterEach(() => {
		if (jest.isMockFunction(window.postMessage)) {
			window.postMessage.mockReset();
		}
	});

	test('postWindowMessage', () => {
		const data = {foo: 'bar'};

		Messenger.postWindowMessage(data);

		expect(window.postMessage).toHaveBeenCalledWith(data, '*');
	});

	test('postWindowMessage error', () => {
		window.postMessage = () => {
			throw Error();
		};

		const initialLog = console.log;

		console.log = jest.fn();

		Messenger.postWindowMessage();

		expect(console.log).toHaveBeenCalledTimes(2);

		window.postMessage = jest.fn();
		console.log = initialLog;
	});

	describe('inform methods', () => {
		beforeAll(() => {
			Messenger.postWindowMessage = jest.fn();
		});

		afterEach(() => {
			if (jest.isMockFunction(Messenger.postWindowMessage)) {
				Messenger.postWindowMessage.mockReset();
			}
		});

		test('informDetached', () => {
			const data = {foo: 'bar'};

			Messenger.informDetached(data);

			expect(Messenger.postWindowMessage).toHaveBeenCalledWith(
				{
					message: {
						data,
						type: messageTypes.DETACHED
					},
					from: BACKEND
				}
			);
		});

		test('informNewRoot', () => {
			const data = {foo: 'bar'};

			Messenger.informNewRoot(data);

			expect(Messenger.postWindowMessage).toHaveBeenCalledWith(
				{
					message: {
						data,
						type: messageTypes.NEW_ROOT
					},
					from: BACKEND
				}
			);
		});

		test('informRendered', () => {
			const data = {foo: 'bar'};

			Messenger.informRendered(data);

			expect(Messenger.postWindowMessage).toHaveBeenCalledWith(
				{
					message: {
						data,
						type: messageTypes.RENDERED
					},
					from: BACKEND
				}
			);
		});

		test('informSelected', () => {
			const data = {foo: 'bar'};

			Messenger.informSelected(data);

			expect(Messenger.postWindowMessage).toHaveBeenCalledWith(
				{
					message: {
						data,
						type: messageTypes.SELECTED
					},
					from: BACKEND
				}
			);
		});

		test('informUpdate', () => {
			const data = {foo: 'bar'};

			Messenger.informUpdate(data);

			expect(Messenger.postWindowMessage).toHaveBeenCalledWith(
				{
					message: {
						data,
						type: messageTypes.UPDATE
					},
					from: BACKEND
				}
			);
		});
	});
});
