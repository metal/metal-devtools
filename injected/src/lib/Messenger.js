import EventEmitter from 'events';

import * as messageTypes from '../../../shared/messageTypes';

class Messenger extends EventEmitter {
	constructor() {
		super();

		this._informDetached = this._informDetached.bind(this);
		this._informRendered = this._informRendered.bind(this);
		this._informUpdate = this._informUpdate.bind(this);
		this._sendRootToFrontend = this._sendRootToFrontend.bind(this);
		this._sendSelectedToFrontend = this._sendSelectedToFrontend.bind(this);

		this.on('detached', this._informDetached);
		this.on('rendered', this._informRendered);
		this.on('root', this._sendRootToFrontend);
		this.on('selected', this._sendSelectedToFrontend);
		this.on('update', this._informUpdate);
	}

	postWindowMessage(data) {
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

	_informDetached(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.DETACHED
				},
				from: 'backend'
			}
		);
	}

	_informUpdate(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.UPDATE
				},
				from: 'backend'
			}
		);
	}

	_informRendered(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.RENDERED
				},
				from: 'backend'
			}
		);
	}

	_sendSelectedToFrontend(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.SELECTED
				},
				from: 'backend'
			}
		);
	}

	_sendRootToFrontend(data) {
		this.postWindowMessage(
			{
				message: {
					data,
					type: messageTypes.NEW_ROOT
				},
				from: 'backend'
			}
		);
	}
}

export default Messenger;
