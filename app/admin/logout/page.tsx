"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.replace('/admin/login');
    };

    logout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Saindo...</p>
    </div>
  );
}
