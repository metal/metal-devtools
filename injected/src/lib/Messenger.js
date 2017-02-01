import EventEmitter from 'events';

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
					type: 'detached'
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
					type: 'update'
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
					type: 'rendered'
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
					type: 'selected'
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
					type: 'newRoot'
				},
				from: 'backend'
			}
		);
	}
}

export default Messenger;
