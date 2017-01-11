const getComponentById = (components = [], id) => {
	let selectedComponent;

	if (!components) {
		return {};
	}

	components.some(
		component => {
			if (component.id === id) {
				selectedComponent = component;
			}
			else {
				selectedComponent = getComponentById(component.childComponents, id);
			}

			return selectedComponent;
		}
	);

	return selectedComponent;
};

export default getComponentById;
