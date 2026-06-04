const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || '/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || window.location.origin,
};

export default config;
