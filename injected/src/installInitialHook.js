import InitialHookClass from './lib/InitialHook';

/**
 * Adds `__METAL_DEV_TOOLS_HOOK__` hook to window object. This allows us to
 * initialize `InitialHookClass` and add methods to the hook object.
 */
const hook = () => {
  if (!window.__METAL_DEV_TOOLS_HOOK__) {
    const InitialHook = new InitialHookClass();

    window.__METAL_DEV_TOOLS_HOOK__ = InitialHook.add.bind(InitialHook);

    window.__METAL_DEV_TOOLS_HOOK__.getAll = InitialHook.getAll.bind(
      InitialHook
    );
    window.__METAL_DEV_TOOLS_HOOK__.hasRoots = InitialHook.hasRoots.bind(
      InitialHook
    );
  }
};

hook();

export default hook;
