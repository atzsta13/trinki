// Moves data saved under the old app name (Trinki) to the current keys, once.
const OLD_PREFIX = 'trinki_';
export const STORAGE_PREFIX = 'partypenguin_';

export const migrateStorage = () => {
    try {
        Object.keys(localStorage)
            .filter(key => key.startsWith(OLD_PREFIX))
            .forEach(key => {
                const newKey = STORAGE_PREFIX + key.slice(OLD_PREFIX.length);
                if (localStorage.getItem(newKey) === null) localStorage.setItem(newKey, localStorage.getItem(key));
                localStorage.removeItem(key);
            });
    } catch {
        // Storage unavailable – nothing to migrate.
    }
};
