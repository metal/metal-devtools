import Component from 'metal-jsx';

class InitialWarning extends Component {
  render() {
    return (
      <div class="initial-warning-container">
        <div>
          {`If you do not see your components here, try refreshing the
						page while keeping this panel open.`}
          <br />
          <i>
            {`Or there may be no Metal.js components on the page. metal@^2.6.2
							required. `}
            <a
              href="https://github.com/bryceosterhaus/metal-devtools"
              target="blank_"
            >
              {'Repo'}
            </a>
          </i>
        </div>
      </div>
    );
  }
}

export default InitialWarning;
