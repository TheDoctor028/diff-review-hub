export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  useMockData: import.meta.env.VITE_USE_MOCK_DATA == "true",
} as const;
