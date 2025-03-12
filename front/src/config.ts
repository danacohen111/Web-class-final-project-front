let configPromise: Promise<{ GEMINI_API_KEY: string; BASE_URL: string }>;

if (import.meta.env.MODE === 'production') {
  configPromise = import('./config.prod');
} else {
  configPromise = import('./config.dev');
}

export const config = await configPromise;
export const { GEMINI_API_KEY, BASE_URL } = config;