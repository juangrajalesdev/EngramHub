import axios from 'axios';

// The Vite development proxy handles CORS. See vite.config.ts for the proxy rules.
const API_BASE_URL = '/api/engram';

export const engramApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 5 seconds timeout
});

// Interceptor to handle connection errors when Engram CLI might not be running
engramApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      // Display a user-friendly message or a banner
      console.error('Engram CLI might not be running. Please ensure it is active.');
      // Optionally, you could dispatch an action to show a toast or error message in the UI
      // For now, we re-throw to allow component-level error handling if needed
      throw error;
    }
    return Promise.reject(error);
  }
);

// --- Type Definitions ---
export interface Observation {
  ID: number;
  Title: string;
  Project: string | null;
  Type: string; // e.g., 'bugfix', 'decision', 'discovery'
  Author: string | null;
  CreatedAt: string; // ISO 8601 format
  Content: string; // Markdown content
  Snippet: string; // FTS5 snippet for search results
}

export interface TimelineResponse {
  Observations: Observation[];
  Total: number;
  Limit: number;
}

export interface SearchResponse {
  Observations: Observation[];
  // Add other relevant fields if the /search endpoint returns them
}

export interface SyncStatus {
  LocalPending: number;
  RemotePending: number;
}

export interface EngramSession {
  // Define structure based on your actual /sessions endpoint response.
  // Using an explicit placeholder to satisfy TypeScript for now.
  ID?: string;
  Status?: string;
  [key: string]: any;
}

export interface EngramStats {
  // Define structure based on your actual /stats endpoint response.
  TotalObservations?: number;
  [key: string]: any;
}

// --- API Functions ---

export const getTimeline = async (params?: { project?: string; limit?: number; observation_id?: number }) => {
  try {
    const response = await engramApi.get<TimelineResponse>('/observations/recent', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching timeline:', error);
    throw error;
  }
};

export const searchObservations = async (query: string, params?: { project?: string }) => {
  try {
    const response = await engramApi.get<SearchResponse>('/search', {
      params: { ...params, q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching observations:', error);
    throw error;
  }
};

export const getSyncStatus = async () => {
  try {
    const response = await engramApi.get<SyncStatus>('/sync/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching sync status:', error);
    throw error;
  }
};

// --- Engram Base Endpoints (PRD2 tests) ---

export const getSessions = async () => {
  try {
    const response = await engramApi.get<EngramSession[]>('/sessions');
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const response = await engramApi.get<EngramStats>('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Assuming these endpoints exist and return a simple success/status message
export const exportSync = async () => {
  try {
    const response = await engramApi.post<{ message: string; chunkId?: string }>('/sync/export');
    return response.data;
  } catch (error) {
    console.error('Error exporting sync:', error);
    throw error;
  }
};

export const importSync = async () => {
  try {
    const response = await engramApi.post<{ message: string; importedCount?: number }>('/sync/import');
    return response.data;
  } catch (error) {
    console.error('Error importing sync:', error);
    throw error;
  }
};
