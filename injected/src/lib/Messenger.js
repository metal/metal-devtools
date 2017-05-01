import * as constants from '../../../shared/constants';

class Messenger {
	static postWindowMessage(data) {
		try {
			window.postMessage(data, '*');
		} catch (err) {
			console.log(
				'%c metal-devtools extension:\n',
				'background: #222; color: #BADA55',
				err
			);
			console.log('%c Args:', 'background: #222; color: #BADA55', data);
		}
	}

	static informDetached(data) {
		this.postWindowMessage({
			message: {
				data,
				type: constants.DETACHED
			},
			from: constants.METAL_DEVTOOLS_BACKEND
		});
	}

	static informMetalDetected() {
		this.postWindowMessage({
			message: {
				type: constants.METAL_DETECTED
			},
			from: constants.METAL_DEVTOOLS_BACKEND
		});
	}

	static informNewRoot(data) {
		this.postWindowMessage({
			message: {
				data,
				type: constants.NEW_ROOT
			},
			from: constants.METAL_DEVTOOLS_BACKEND
		});
	}

	static informRendered(data) {
		this.postWindowMessage({
			message: {
				data,
				type: constants.RENDERED
			},
			from: constants.METAL_DEVTOOLS_BACKEND
		});
	}

	static informSelected(data) {
		this.postWindowMessage({
			message: {
				data,
				type: constants.SELECTED
			},
			from: constants.METAL_DEVTOOLS_BACKEND
		});
	}

	static informUpdate(data) {
		this.postWindowMessage({
			message: {
				data,
				type: constants.UPDATE
			},
			from: constants.METAL_DEVTOOLS_BACKEND
		});
	}
}

export default Messenger;
