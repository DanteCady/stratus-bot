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
	{ id: 'dashboard', text: 'Dashboard', icon: Dashboard, path: '/dashboard' },
	{ id: 'tasks', text: 'Tasks', icon: ListAlt, path: '/tasks' },
	{ id: 'profiles', text: 'Profiles', icon: Person, path: '/profiles' },
	{ id: 'proxies', text: 'Proxies', icon: Dns, path: '/proxies' },
	{ id: 'accounts', text: 'Accounts', icon: People, path: '/accounts' },
	// { id: 'harvesters', text: 'Harvesters', icon: Layers, path: '/harvesters' },
	// { id: 'account-gen', text: 'Account Gen', icon: Bolt, path: '/account-generator' },
	// { id: 'tracking', text: 'Tracking', icon: LocalShipping, path: '/tracking' },
	// { id: 'settings', text: 'Settings', icon: Settings, path: '/settings' },
];

export const bottomMenuItems = [
	{
		id: 'backend-status',
		title: 'Backend Status',
		icon: Cloud,
		path: '/#',
		action: true,
	},
];
