import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './AppSoy.soy';

class AppSoy extends Component {};

Soy.register(AppSoy, templates);

export default AppSoy;
