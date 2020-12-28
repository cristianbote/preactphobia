import { createGlobalStyles } from 'goober/global';

export const GlobalStyles = createGlobalStyles`

	:root {
		--color: #eee;
		--background-color: #242424;
	}

	html,
	body {
		margin: 0;
		padding: 0;
		display: flex;
		flex: 1;
		flex-direction: column;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		font: 1rem system-ui,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
		color: var(--color);
		background-color: var(--background-color);
	}

	* {
		box-sizing: border-box;
		-webkit-font-smoothing: antialiased;
	}

	a:link,
	a:visited {
		color: var(--color);
	}

	@keyframes appear {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
`;
