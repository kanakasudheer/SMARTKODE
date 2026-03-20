const STORAGE_KEY = 'levelup_data';

export const loadUserData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveUserData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const initializeUser = () => {
  const defaultData = {
    isLoggedIn: false,
    username: '',
    avatar: '🎮',
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    completedMissions: [],
    badges: [],
    weakTopics: [],
    theme: 'dark' // Gaming apps usually default to dark
  };
  const existing = loadUserData();
  if (!existing) {
    saveUserData(defaultData);
    return defaultData;
  }
  
  // Streak check logic
  const today = new Date().toDateString();
  if (existing.lastActiveDate && existing.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (existing.lastActiveDate !== yesterday.toDateString()) {
      existing.streak = 0; // Streak broken
    }
  }

  // Ensure new fields exist for returning players
  if (existing.isLoggedIn === undefined) existing.isLoggedIn = false;
  if (!existing.username) existing.username = '';
  if (!existing.avatar) existing.avatar = '🎮';

  return existing;
};
