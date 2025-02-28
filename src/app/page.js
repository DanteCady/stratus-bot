import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Home() {
	console.log('🔄 Attempting to fetch session...');

	let session;
	try {
		session = await getServerSession(authOptions);
		console.log('✅ Session fetched:', session);
	} catch (error) {
		console.error('❌ Error fetching session:', error);
	}

	if (session) {
		console.log('✅ User is authenticated, redirecting to /dashboard');
		return redirect('/dashboard');
	} else {
		console.log('🚀 User NOT logged in, redirecting to /auth/login');
		return redirect('/auth/login');
	}
}
