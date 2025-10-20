import { API_BASE_URL, API_ENDPOINTS, ApiResponse } from '@/api/config';

export interface AnimeItem {
  title: string;
  slug: string;
  poster: string;
  episode_count?: number;
  status?: string;
  current_episode?: number;
  release_day?: string;
  latest_release_date?: string;
  rating?: string;
  genres?: string[];
}

export interface AnimeDetail extends AnimeItem {
  synopsis?: string;
  type?: string;
  total_episodes?: number;
  duration?: string;
  studio?: string;
  episodes?: EpisodeItem[];
}

export interface EpisodeItem {
  episode: number;
  title?: string;
  slug: string;
  release_date?: string;
}

export interface VideoSource {
  quality: string;
  url: string;
  type: 'stream' | 'download';
}

export interface EpisodeStreamData {
  episode: number;
  title: string;
  stream_url?: string;
  download_links: VideoSource[];
  iframe_url?: string;
}

// Fetch home page anime (ongoing, completed, etc.)
export const fetchHomeAnime = async (): Promise<{
  ongoing: AnimeItem[];
  completed: AnimeItem[];
  popular: AnimeItem[];
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.home}`);
    const data: ApiResponse<any> = await response.json();
    
    return {
      ongoing: data.data?.ongoing_anime || [],
      completed: data.data?.completed_anime || [],
      popular: data.data?.popular_anime || [],
    };
  } catch (error) {
    console.error('Error fetching home anime:', error);
    return { ongoing: [], completed: [], popular: [] };
  }
};

// Search anime
export const searchAnime = async (query: string): Promise<AnimeItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.search}/${encodeURIComponent(query)}`);
    const data: ApiResponse<any> = await response.json();
    return data.data?.search_results || [];
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

// Get anime detail
export const fetchAnimeDetail = async (slug: string): Promise<AnimeDetail | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.detail}/${slug}`);
    const data: ApiResponse<any> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching anime detail:', error);
    return null;
  }
};

// Get episode stream
export const fetchEpisodeStream = async (episodeSlug: string): Promise<EpisodeStreamData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.episodeStream}/${episodeSlug}`);
    const data: ApiResponse<any> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching episode stream:', error);
    return null;
  }
};

// Fetch complete anime list with pagination
export const fetchAnimeList = async (page: number = 1): Promise<AnimeItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.animeList}/${page}`);
    const data: ApiResponse<any> = await response.json();
    return data.data?.anime_list || [];
  } catch (error) {
    console.error('Error fetching anime list:', error);
    return [];
  }
};

// Fetch schedule
export const fetchSchedule = async (): Promise<{ [day: string]: AnimeItem[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.schedule}`);
    const data: ApiResponse<any> = await response.json();
    return data.data?.schedule || {};
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return {};
  }
};
