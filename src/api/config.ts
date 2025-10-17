export const API_BASE_URL = 'https://www.sankavollerei.com/anime';

export const API_ENDPOINTS = {
  home: '/home',
  schedule: '/schedule',
  animeList: '/complete-anime/page',
  search: '/search',
  genre: '/genre',
  detail: '/detail',
  batch: '/batch',
  episodeStream: '/episode/stream',
};

export type ApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};
