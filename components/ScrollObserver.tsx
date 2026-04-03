'use client';

import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2, // Trigger when 20% visible
        ...options,
      }
    );

    const node = ref.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [options]);

  return ref;
}

// Wrapper component for easier array mapping
export function RevealWrapper({ 
  children, 
  className = '', 
  animation = 'reveal-up',
  delayClass = '',
}: { 
  children: React.ReactNode, 
  className?: string, 
  animation?: 'reveal-up' | 'reveal-left' | 'reveal-right',
  delayClass?: string
}) {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref} className={`${animation} ${delayClass} ${className}`}>{children}</div>;
}
