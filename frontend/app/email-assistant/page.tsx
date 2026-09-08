'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailAssistantRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings?tab=email');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}