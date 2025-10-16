// Watch History Management
export interface WatchHistory {
  animeId: number;
  animeTitle: string;
  animeImage: string;
  episode: number;
  timestamp: number;
}

export const saveWatchHistory = (history: Omit<WatchHistory, 'timestamp'>) => {
  const histories = getWatchHistory();
  const existingIndex = histories.findIndex(h => h.animeId === history.animeId);
  
  const newHistory: WatchHistory = {
    ...history,
    timestamp: Date.now()
  };

  if (existingIndex !== -1) {
    histories[existingIndex] = newHistory;
  } else {
    histories.unshift(newHistory);
  }

  // Keep only last 20 items
  const trimmed = histories.slice(0, 20);
  localStorage.setItem('watchHistory', JSON.stringify(trimmed));
};

export const getWatchHistory = (): WatchHistory[] => {
  try {
    const data = localStorage.getItem('watchHistory');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const clearWatchHistory = () => {
  localStorage.removeItem('watchHistory');
};

// My List Management
export interface MyListItem {
  animeId: number;
  animeTitle: string;
  animeImage: string;
  addedAt: number;
}

export const addToMyList = (item: Omit<MyListItem, 'addedAt'>) => {
  const list = getMyList();
  const exists = list.find(i => i.animeId === item.animeId);
  
  if (!exists) {
    list.unshift({
      ...item,
      addedAt: Date.now()
    });
    localStorage.setItem('myList', JSON.stringify(list));
    return true;
  }
  return false;
};

export const removeFromMyList = (animeId: number) => {
  const list = getMyList();
  const filtered = list.filter(i => i.animeId !== animeId);
  localStorage.setItem('myList', JSON.stringify(filtered));
};

export const isInMyList = (animeId: number): boolean => {
  const list = getMyList();
  return list.some(i => i.animeId === animeId);
};

export const getMyList = (): MyListItem[] => {
  try {
    const data = localStorage.getItem('myList');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
