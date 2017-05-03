import Component, {Config} from 'metal-jsx';
import {bindAll, isPlainObject, keys} from 'lodash';

import NodeName from './NodeName';
import JSONEditor from './JSONEditor';

class StatePane extends Component {
  created() {
    bindAll(this, 'inspectComponent', 'handleStateChange');
  }

  handleStateChange(data, type) {
    const {component, setStateFn} = this.props;

    setStateFn(component.id, data, type);
  }

  inspectComponent() {
    const {component, onInspectDOM} = this.props;

    onInspectDOM(component.id);
  }

  render() {
    const {component: {data = null, name}, typeColors} = this.props;

    const dataExists = isPlainObject(data);

    return (
      <div class="state-pane-container">
        <div class="header">
          {'Component: '}

          {name &&
            <span>
              <NodeName name={name} />

              <a
                class="see-in-dom"
                href="javascript:;"
                onClick={this.inspectComponent}
              >
                {'(Click to See Element)'}
              </a>
            </span>}
        </div>

        {dataExists &&
          keys(data).map(dataKey => {
            const stateObj = data[dataKey];

            return (
              <div class="category" key={`${name}-${dataKey}`}>
                <div class="name">{`${dataKey}:`}</div>

                <JSONEditor
                  onChange={this.handleStateChange}
                  type={dataKey}
                  typeColors={typeColors}
                  value={stateObj}
                />
              </div>
            );
          })}

        {!dataExists &&
          <div>
            <i>{'No Component Data'}</i>
          </div>}
      </div>
    );
  }
}

StatePane.PROPS = {
  component: Config.any(),
  onInspectDOM: Config.func(),
  setStateFn: Config.func(),
  typeColors: Config.object()
};

export default StatePane;
