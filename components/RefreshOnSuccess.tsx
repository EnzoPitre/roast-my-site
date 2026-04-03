'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { trackEvent } from '@/components/Analytics'

export function RefreshOnSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      trackEvent('payment_completed', { roast_id: window.location.pathname.split('/').pop() });
      router.replace(window.location.pathname);
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null
}
