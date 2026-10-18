/**
 * LocalStorage utilities for the CityFix frontend prototype.
 */
const prefix = 'cityfix_';

export const storage = {
  getItem: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(prefix + key);
      if (value === null) return defaultValue;
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error reading key ${key} from LocalStorage:`, error);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing key ${key} to LocalStorage:`, error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(prefix + key);
      return true;
    } catch (error) {
      console.error(`Error deleting key ${key} from LocalStorage:`, error);
      return false;
    }
  },

  clearStorage: () => {
    try {
      // Clear only keys matching our prefix
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing CityFix LocalStorage:', error);
      return false;
    }
  }
};
