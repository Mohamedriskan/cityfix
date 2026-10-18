/**
 * Migrate/clean legacy LocalStorage keys.
 * Demo data is no longer served from LocalStorage (it is now DB-backed).
 * This purges stale seeds on boot so the app starts clean.
 */
export const migrateStorage = () => {
  const legacyKeys = [
    'cityfix_issues',
    'cityfix_notifications',
    'cityfix_conversations',
    'cityfix_users',
  ];
  try {
    legacyKeys.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error cleaning legacy storage:', error);
  }
};