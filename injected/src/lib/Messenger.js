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
				data,
				type: 'detached'
			},
			'*'
		);
	}

	_informUpdate(data) {
		window.postMessage(
			{
				data,
				type: 'update'
			},
			'*'
		);
	}

	_sendSelectedToFrontend(data) {
		window.postMessage(
			{
				data,
				type: 'selected'
			},
			'*'
		);
	}

	_sendRootToFrontend(data) {
		window.postMessage(
			{
				data,
				type: 'newRoot'
			},
			'*'
		);
	}
}

export default Messenger;
