import RootManagerClass from './lib/RootManager';

if (!window.__METAL_DEV_TOOLS_HOOK__) {
	const RootManager = new RootManagerClass();

	window.__METAL_DEV_TOOLS_HOOK__ = (component) => RootManager.emit('addRoot', component);

	window.__METAL_DEV_TOOLS_HOOK__.getComponentNode = RootManager.getComponentNode.bind(RootManager);
	window.__METAL_DEV_TOOLS_HOOK__.hasComponent = RootManager.hasComponent.bind(RootManager);
	window.__METAL_DEV_TOOLS_HOOK__.hasRoots = RootManager.hasRoots.bind(RootManager);
	window.__METAL_DEV_TOOLS_HOOK__.emit = RootManager.emit.bind(RootManager);
}
