import EventEmitter from 'events';

class Messenger extends EventEmitter {
	constructor() {
		super();

		this._sendRootToFrontend = this._sendRootToFrontend.bind(this);
		this._sendSelectedToFrontend = this._sendSelectedToFrontend.bind(this);
		this._informDetached = this._informDetached.bind(this);
		this._informUpdate = this._informUpdate.bind(this);

		this.on('root', this._sendRootToFrontend);
		this.on('update', this._informUpdate);
		this.on('detached', this._informDetached);
		this.on('selected', this._sendSelectedToFrontend);
	}

	_informDetached(data) {
		window.postMessage(
			{
				message: {
					data,
					type: 'detached'
				},
				from: 'backend'
			},
			'*'
		);
	}

	_informUpdate(data) {
		window.postMessage(
			{
				message: {
					data,
					type: 'update'
				},
				from: 'backend'
			},
			'*'
		);
	}

	_sendSelectedToFrontend(data) {
		window.postMessage(
			{
				message: {
					data,
					type: 'selected'
				},
				from: 'backend'
			},
			'*'
		);
	}

	_sendRootToFrontend(data) {
		window.postMessage(
			{
				message: {
					data,
					type: 'newRoot'
				},
				from: 'backend'
			},
			'*'
		);
	}
}

export default Messenger;
