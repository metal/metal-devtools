import Component from 'metal-jsx';

class InitialWarning extends Component {
	render() {
		return (
			<div class="initial-warning-container">
				<div>
					{'If you do not see your components here, try refreshing the page while keeping this panel open.'}
					<br />
					<i>{'Or there may be no Metal.js components on the page.'}</i>
				</div>
			</div>
		);
	}
}

export default InitialWarning;
