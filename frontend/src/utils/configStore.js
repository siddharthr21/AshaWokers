import { create } from 'zustand';

// Backend URL configuration - injected at build time via VITE_BACKEND_URL or VITE_API_BASE_URL
export const formatBackendUrl = (url) => {
  if (!url) return 'https://ashaai-back-exeja6c4gadqgefj.centralindia-01.azurewebsites.net';
  let cleanUrl = url.trim().replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(cleanUrl) && !cleanUrl.startsWith('localhost') && !cleanUrl.startsWith('127.0.0.1')) {
    return `https://${cleanUrl}`;
  }
  return cleanUrl;
};

export const BASE_URL = formatBackendUrl(import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL);

export const useConfigStore = create((set) => ({
  supabaseUrl: null,
  supabaseAnonKey: null,
  googleMapsApiKey: null,
  ngoFormNewUrl: null,
  ngoFormExistingUrl: null,
  ngoFormRescheduleUrl: null,
  isConfigLoaded: false,
  error: null,

  fetchConfig: async () => {
    const targetUrl = formatBackendUrl(import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL);
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await fetch(`${targetUrl}/api/public-config`);
        if (!response.ok) {
          throw new Error(`Failed to fetch public configuration (HTTP ${response.status})`);
        }
        
        const config = await response.json();
        
        set({
          supabaseUrl: config.supabaseUrl,
          supabaseAnonKey: config.supabaseAnonKey,
          googleMapsApiKey: config.googleMapsApiKey,
          ngoFormNewUrl: config.ngoFormNewUrl,
          ngoFormExistingUrl: config.ngoFormExistingUrl,
          ngoFormRescheduleUrl: config.ngoFormRescheduleUrl,
          isConfigLoaded: true,
          error: null,
        });
        return;
      } catch (error) {
        console.warn(`[ConfigStore] Load attempt ${attempts}/${maxAttempts} failed:`, error);
        if (attempts >= maxAttempts) {
          console.error('[ConfigStore] All configuration load attempts failed:', error);
          set({ error: error.message, isConfigLoaded: false });
        } else {
          // Wait 1.5s before retry (allows Azure F1 app to wake up from cold start)
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }
  }
}));
