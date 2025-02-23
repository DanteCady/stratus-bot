import {
	Dashboard,
	ListAlt,
	Person,
	Dns,
	People,
	Layers,
	Bolt,
	LocalShipping,
	Settings,
	Cloud,
} from '@mui/icons-material';

export const navigationMenuItems = [
	{ text: 'Dashboard', icon: Dashboard, path: '/dashboard' },
	{ text: 'Tasks', icon: ListAlt, path: '/tasks' },
	{ text: 'Profiles', icon: Person, path: '/profiles' },
	{ text: 'Proxies', icon: Dns, path: '/proxies' },
	{ text: 'Accounts', icon: People, path: '/accounts' },
	// { text: 'Harvesters', icon: Layers, path: '/harvesters' },
	// { text: 'Account Gen', icon: Bolt, path: '/account-generator' },
	// { text: 'Tracking', icon: LocalShipping, path: '/tracking' },
	// { text: 'Settings', icon: Settings, path: '/settings' },
];

export const bottomMenuItems = [
	{
		title: 'Backend Status',
		icon: Cloud,
		path: '/#',
		action: true,
	},
];
