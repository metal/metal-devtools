function getComponentById(components = [], id) {
	for (let i = 0; i < components.length; i++) {
		const component = components[i];

		if (component.id === id) {
			return component;
		}

		if (component.childComponents) {
			const componentFound = getComponentById(component.childComponents, id);

			if (componentFound) {
				return componentFound;
			}
		}
	}
}

export default getComponentById;
