import Messenger from './Messenger';

/**
 * `Hook` is the initial class added to the page before any of the sites JS is
 * loaded. This is the minimal ammount of code we want to inject and its purpose
 * is that it would gather any root components that are attached to the page.
 */
class Hook {
  constructor() {
    this._roots = [];

    this._firstAdd = false;
  }

  add(component) {
    if (!this._firstAdd) {
      Messenger.informMetalDetected();

      this._firstAdd = true;
    }

    this._roots.push(component);
  }

  getAll() {
    return this._roots;
  }

  hasRoots() {
    return this._roots && !!this._roots.length;
  }
}

export default Hook;
