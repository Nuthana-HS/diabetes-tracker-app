'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const parsedUser = JSON.parse(user);
      // Send doctors to doctor dashboard, patients to regular dashboard
      router.push(parsedUser.role === 'doctor' ? '/doctor/dashboard' : '/dashboard');
    } else {
      // Not logged in, go to login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          Loading Diabetes Tracker...
        </p>
      </div>
    </div>
  );
}