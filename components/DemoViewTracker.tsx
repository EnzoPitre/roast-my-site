'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/components/Analytics';

export function DemoViewTracker() {
  useEffect(() => {
    trackEvent('demo_viewed', {});
  }, []);
  return null;
}
