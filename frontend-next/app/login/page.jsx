'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginPortal from '../../../frontend/src/components/LoginPortal';

const SESSION_KEY = 'astra_active_session';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (user) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch (_) {}
    }
    if (user?.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/user');
    }
  };

  return (
    <LoginPortal
      onLoginSuccess={handleLoginSuccess}
      openSecOpsModal={() => {}}
    />
  );
}
