"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch('/api/auth/logout');
      router.push('/admin/login');
    };

    logout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Saindo...</p>
    </div>
  );
}