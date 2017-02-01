import * as messageTypes from '../../../shared/messageTypes';

const BACKEND = 'backend';

class Messenger {
	static postWindowMessage(data) {
		try {
			window.postMessage(
				data,
				'*'
			);
		} catch (err) {
			console.log('%c Metal-Devtools Extension:\n', 'background: #222; color: #BADA55', err);
			console.log('%c Data:', 'background: #222; color: #BADA55', data);
		}
	}

	static informDetached(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.DETACHED
				},
				from: BACKEND
			}
		);
	}

	static informNewRoot(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.NEW_ROOT
				},
				from: BACKEND
			}
		);
	}

	static informRendered(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.RENDERED
				},
				from: BACKEND
			}
		);
	}

	static informSelected(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.SELECTED
				},
				from: BACKEND
			}
		);
	}

	static informUpdate(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.UPDATE
				},
				from: BACKEND
			}
		);
	}
}

export default Messenger;
