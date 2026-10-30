/**
 * Image URL normalization and fallback utilities for Netlify & Vite production builds.
 */

export const DEFAULT_FALLBACK_IMAGE = '/images/hero_bakery.jpg';

export const BAKERY_IMAGES = {
  hero: '/images/hero_bakery.jpg',
  redVelvet: '/images/cake_red_velvet.jpg',
  croissant: '/images/pastry_croissants.jpg',
  brownies: '/images/brownies_fudge.jpg',
  cupcakes: '/images/cupcakes_assorted.jpg',
  cookies: '/images/cookies_chocochip.jpg',
  hampers: '/images/hampers_bakery.jpg',
  cheesecake: '/images/cheesecake_basque.jpg',
  cinnamonRolls: '/images/cinnamon_rolls.jpg',
};

/**
 * Normalizes any image URL.
 * Converts legacy `/src/assets/images/xyz` to publicly accessible `/images/xyz`
 * so that both local Vite dev and Netlify production builds can load images without 404s.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  const clean = url.trim();

  // If already a root public path or valid absolute URL
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }

  // Convert /src/assets/images/... to /images/...
  if (clean.startsWith('/src/assets/images/')) {
    const filename = clean.replace('/src/assets/images/', '');
    // If filename has a clean alias in public/images
    if (filename.startsWith('hero_bakery')) return '/images/hero_bakery.jpg';
    if (filename.startsWith('cake_red_velvet')) return '/images/cake_red_velvet.jpg';
    if (filename.startsWith('pastry_croissants')) return '/images/pastry_croissants.jpg';
    if (filename.startsWith('brownies_fudge')) return '/images/brownies_fudge.jpg';
    if (filename.startsWith('cupcakes_assorted')) return '/images/cupcakes_assorted.jpg';
    if (filename.startsWith('cookies_chocochip')) return '/images/cookies_chocochip.jpg';
    if (filename.startsWith('hampers_bakery')) return '/images/hampers_bakery.jpg';
    if (filename.startsWith('cheesecake_basque')) return '/images/cheesecake_basque.jpg';
    if (filename.startsWith('cinnamon_rolls')) return '/images/cinnamon_rolls.jpg';
    return `/images/${filename}`;
  }

  if (clean.startsWith('src/assets/images/')) {
    const filename = clean.replace('src/assets/images/', '');
    return `/images/${filename}`;
  }

  // If already starts with /images/
  if (clean.startsWith('/images/')) {
    return clean;
  }

  // Fallback default
  return clean;
}

/**
 * Image error handler that replaces a broken image with a guaranteed valid local bakery image.
 */
export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (!target.dataset.fallbackApplied) {
    target.dataset.fallbackApplied = 'true';
    target.src = DEFAULT_FALLBACK_IMAGE;
  }
}
