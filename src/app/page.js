'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		router.push('/auth/login'); // Redirect to login page
	}, []);

	return null; // No need to render anything
}