import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './ChildSoy.soy';

class ChildSOY extends Component {};

Soy.register(ChildSOY, templates);
