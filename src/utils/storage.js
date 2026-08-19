const STORAGE_KEY = 'zikr_saved_lyrics';

export const getSavedLyricIds = () => {
  try {
    const ids = localStorage.getItem(STORAGE_KEY);
    return ids ? JSON.parse(ids) : [];
  } catch (error) {
    console.error('Error reading saved lyrics from localStorage', error);
    return [];
  }
};

export const saveLyricId = (id) => {
  try {
    const ids = getSavedLyricIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  } catch (error) {
    console.error('Error saving lyric to localStorage', error);
  }
};

export const unsaveLyricId = (id) => {
  try {
    let ids = getSavedLyricIds();
    ids = ids.filter((item) => item !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Error unsaving lyric from localStorage', error);
  }
};

export const isLyricSaved = (id) => {
  const ids = getSavedLyricIds();
  return ids.includes(id);
};
