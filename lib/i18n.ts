export type RouteKey = 'home' | 'howItWorks' | 'pricing' | 'blog' | 'dashboard' | 'legal' | 'privacy' | 'terms' | 'contact' | 'demo' | 'compare' | 'about' | 'changelog' | 'testimonials' | 'hallOfShame';

type RouteMap = {
  [K in RouteKey]: {
    en: string;
    fr: string;
  };
};

export const routeMap: RouteMap = {
  home: { en: '/', fr: '/' },
  howItWorks: { en: '/how-it-works', fr: '/comment-ca-marche' },
  pricing: { en: '/pricing', fr: '/tarifs' },
  blog: { en: '/blog', fr: '/blog' },
  dashboard: { en: '/dashboard', fr: '/dashboard' },
  legal: { en: '/legal', fr: '/mentions-legales' },
  privacy: { en: '/privacy', fr: '/confidentialite' },
  terms: { en: '/terms', fr: '/cgu' },
  contact: { en: '/contact', fr: '/contact' },
  demo: { en: '/demo', fr: '/demo' },
  compare: { en: '/compare', fr: '/compare' },
  about: { en: '/about', fr: '/about' },
  changelog: { en: '/changelog', fr: '/changelog' },
  testimonials: { en: '/testimonials', fr: '/testimonials' },
  hallOfShame: { en: '/hall-of-shame', fr: '/hall-of-shame' },
};

export function getRouteKey(pathname: string, lang: 'en' | 'fr'): RouteKey | null {
  // Normalize pathname by removing trailing slash if present (except root)
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  
  // If we are at the root or /[lang] exactly
  if (normalizedPath === '' || normalizedPath === '/' || normalizedPath === `/${lang}`) {
    return 'home';
  }

  // Remove the /[lang] prefix to match against routeMap values
  const prefix = `/${lang}`;
  const pathWithoutLang = normalizedPath.startsWith(prefix) ? normalizedPath.slice(prefix.length) : normalizedPath;
  const pathToCheck = pathWithoutLang === '' ? '/' : pathWithoutLang;

  for (const [key, paths] of Object.entries(routeMap)) {
    if (paths[lang] === pathToCheck) {
      return key as RouteKey;
    }
  }

  // If we are deep within blog e.g. /en/blog/my-post
  if (pathToCheck.startsWith('/blog/')) {
    return 'blog';
  }
  
  // Return home as fallback? Or null for 404s
  return null;
}

export function getAlternatePath(pathname: string, currentLang: 'en' | 'fr'): string {
  const targetLang = currentLang === 'en' ? 'fr' : 'en';
  const key = getRouteKey(pathname, currentLang);
  
  if (!key) {
    // Fallback: simply replace language prefix
    return pathname.replace(`/${currentLang}`, `/${targetLang}`);
  }

  // Handle nested dynamic blog paths: map the root path but keep the slug
  const prefix = `/${currentLang}`;
  const pathWithoutLang = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  
  if (key === 'blog' && pathWithoutLang.length > 5) { // /blog/...
    return `/${targetLang}${pathWithoutLang}`;
  }

  // Dashboard fallback for dynamic roasts /dashboard/[id]
  if (pathWithoutLang.startsWith('/roast/')) {
    return `/${targetLang}${pathWithoutLang}`;
  }

  const newPath = routeMap[key][targetLang];
  return `/${targetLang}${newPath === '/' ? '' : newPath}`;
}
