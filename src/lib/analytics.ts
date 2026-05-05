type AnalyticsEvent = {
  name: string;
  params?: Record<string, string | number | boolean | undefined>;
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE_KEY = 'dynocore_utm';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}

export const trackEvent = ({ name, params = {} }: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;

  window.dataLayer?.push({ event: name, ...params });
  window.gtag?.('event', name, params);

  const yandexId = import.meta.env.PUBLIC_YANDEX_METRIKA_ID;
  if (yandexId && window.ym) {
    window.ym(Number(yandexId), 'reachGoal', name, params);
  }
};

export const readUtmParams = () => {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  const current = Object.fromEntries(UTM_KEYS.map((key) => [key, searchParams.get(key) ?? '']).filter(([, value]) => value));

  try {
    if (Object.keys(current).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(current));
      return current;
    }

    const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, string>) : {};
  } catch {
    return current;
  }
};
