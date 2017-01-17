import RootManagerClass from './lib/RootManager';

if (!window.__METAL_DEV_TOOLS_HOOK__) {
	const RootManager = new RootManagerClass();

	window.__METAL_DEV_TOOLS_HOOK__ = (component) => RootManager.addRoot(component);

	window.__METAL_DEV_TOOLS_HOOK__.getRoots = RootManager.getRoots.bind(RootManager);
	window.__METAL_DEV_TOOLS_HOOK__.hasRoots = RootManager.hasRoots.bind(RootManager);
	window.__METAL_DEV_TOOLS_HOOK__.on = RootManager.on.bind(RootManager);
	window.__METAL_DEV_TOOLS_HOOK__.reloadRoots = RootManager.reloadRoots.bind(RootManager);
	window.__METAL_DEV_TOOLS_HOOK__.removeRoot = RootManager.removeRoot.bind(RootManager);
}
