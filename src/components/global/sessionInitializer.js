'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useAppStore from '@/store/appStore';

export default function SessionInitializer() {
    const { data: session } = useSession();
    const fetchUserData = useAppStore((state) => state.fetchUserData);

    useEffect(() => {
        if (session?.user) {
            console.log('🟢 Session detected, fetching user data...');
            fetchUserData();
        }
    }, [session, fetchUserData]);

    return null; // ✅ This component runs logic but renders nothing
}
