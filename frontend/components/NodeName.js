export const OPENING = 0;
export const NORMAL_CLOSING = 1;
export const SELF_CLOSING = 2;

export default ({name, type = OPENING}) => (
	<span class="node-name-container">
		{type === NORMAL_CLOSING ? '</' : '<'}

		<span class="name">{name}</span>

		{type === SELF_CLOSING ? ' />' : '>'}
	</span>
);
