import Component, {Config} from 'metal-jsx';
import JSONEditor from 'metal-json-editor';

import {keys, isEqual} from 'lodash';

class MetalJSONEditor extends Component {
  arrowRenderer(expanded) {
    return <span class={expanded ? 'arrow down' : 'arrow right'} />;
  }

  handleOnChange(newValue) {
    const {onChange, type, value} = this.props;

    const changedData = {};

    keys(value).forEach(key => {
      const keyVal = value[key];
      const newKeyValue = newValue[key];

      if (!isEqual(keyVal, newKeyValue)) {
        changedData[key] = newKeyValue;
      }
    });

    onChange(changedData, type);
  }

  render() {
    const {typeColors, value} = this.props;

    return (
      <JSONEditor
        arrowRenderer={this.arrowRenderer.bind(this)}
        data={value}
        onChange={this.handleOnChange.bind(this)}
        typeColors={typeColors}
      />
    );
  }
}

MetalJSONEditor.PROPS = {
  config: Config.object(),
  onChange: Config.func(),
  type: Config.string(),
  typeColors: Config.object(),
  value: Config.object()
};

export default MetalJSONEditor;
