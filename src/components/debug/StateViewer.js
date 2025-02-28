'use client';

import useAppStore from '@/store/appStore';

export default function StateViewer() {
	const { initialized, system, userData } = useAppStore();

	if (!initialized) {
		return <div>State not initialized</div>;
	}

	return (
		<div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg max-w-md max-h-96 overflow-auto">
			<h3 className="font-bold mb-2">App State</h3>
			<pre className="text-xs">
				{JSON.stringify(
					{
						initialized,
						systemCounts: {
							shops: system.shops?.length || 0,
							sites: system.sites?.length || 0,
							regions: system.regions?.length || 0,
							modes: system.modes?.length || 0,
						},
						userDataCounts: {
							taskGroups: userData.taskGroups?.length || 0,
							profileGroups: userData.profileGroups?.length || 0,
							proxyGroups: userData.proxyGroups?.length || 0,
							tasks: userData.tasks?.length || 0,
							profiles: userData.profiles?.length || 0,
							proxies: userData.proxies?.length || 0,
						},
					},
					null,
					2
				)}
			</pre>
		</div>
	);
}
