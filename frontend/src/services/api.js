const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5050/api';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json();
}

export async function requestPrediction(input) {
  try {
    const payload = await apiRequest('/predict', { method: 'POST', body: JSON.stringify(input) });
    return payload.data;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const risk = Math.min(92, Math.round(12 + input.departureHour * 1.35 + (input.weather === 'Storm' ? 38 : input.weather === 'Rain' ? 20 : 0) + (input.month >= 6 && input.month <= 8 ? 8 : 0)));
    const probability = Math.max(8, risk);
    return {
      prediction: probability >= 50 ? 'Likely delayed' : 'Likely on time',
      probability,
      expectedDelayMinutes: Math.max(4, Math.round(probability * 0.48)),
      demo: true,
    };
  }
}

export const fetchDashboard = async () => (await apiRequest('/dashboard')).data;
export const fetchFlights = async (filters) => {
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value !== undefined));
  return apiRequest(`/flights?${query}`);
};
export const fetchAirlines = async () => (await apiRequest('/airlines')).data;
export const fetchAirports = async () => (await apiRequest('/airports')).data;
export const fetchRoutes = async () => (await apiRequest('/routes')).data;
export const fetchModelInsights = async () => (await apiRequest('/model-insights')).data;
