export const CONFIG = {
  backendUrl: import.meta.env.VITE_BACKEND_URL as string,
  appUrl: (import.meta.env.VITE_APP_URL as string) || "", // optional external app
};
