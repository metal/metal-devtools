import RootManagerClass from './lib/RootManager';

/**
 * Checks for `__METAL_DEV_TOOLS_HOOK__` hook on window object. It initializes
 * the `RootManagerClass` and links the methods from that class to the hook
 * object. Also moves all components on the initial hook to this manager.
 */
const hook = () => {
  const {__METAL_DEV_TOOLS_HOOK__} = window;

  if (__METAL_DEV_TOOLS_HOOK__) {
    if (__METAL_DEV_TOOLS_HOOK__._managerExists) {
      __METAL_DEV_TOOLS_HOOK__.reloadRoots(true);
    } else {
      const RootManager = new RootManagerClass();

      __METAL_DEV_TOOLS_HOOK__
        .getAll()
        .forEach(root => RootManager.addRoot(root));

      window.__METAL_DEV_TOOLS_HOOK__ = component =>
        RootManager.addRoot(component);

      window.__METAL_DEV_TOOLS_HOOK__._managerExists = true;
      /* eslint-disable max-len*/
      window.__METAL_DEV_TOOLS_HOOK__.expandComponent = RootManager.expandComponent.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.getComponentNode = RootManager.getComponentNode.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.hasComponent = RootManager.hasComponent.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.hasRoots = RootManager.hasRoots.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.highlightNode = RootManager.highlightNode.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.reloadRoots = RootManager.reloadRoots.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.selectComponent = RootManager.selectComponent.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.setComponentState = RootManager.setComponentState.bind(
        RootManager
      );
      window.__METAL_DEV_TOOLS_HOOK__.setInspected = RootManager.setInspected.bind(
        RootManager
      );
      /* eslint-enable max-len*/
    }
  }
};

hook();

export default hook;
