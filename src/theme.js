import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: { main: '#0070F3' },
		secondary: { main: '#6C63FF' },
		background: {
			default: '#F1F5F9', // Main content background
			paper: '#FFFFFF', // Cards / UI elements
			sidebar: '#E2E8F0', // Sidebar background (NEW, slightly darker)
		},
		text: { primary: '#111827', secondary: '#4B5563' },
		accent: { main: '#10B981' },
		red: { main: '#FF0000' },
	},
});

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: { main: '#7A4FD9' },
		secondary: { main: '#6C63FF' },
		background: {
			default: '#0D0F1F', // Main content background
			paper: '#1C1E30', // Cards / UI elements
			sidebar: '#161826', // Sidebar background (NEW, slightly darker)
		},
		text: { primary: '#EAEAEA', secondary: '#A1A1A1' },
		accent: { main: '#F49E4C' },
		red: { main: '#FF0000' },
	},
});

export { lightTheme, darkTheme };
