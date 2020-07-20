import {Title} from "./Title";

/**
 * Caches already found values
 */
export class TitleCache {
    constructor() {
        this.waitForLoad = this.load()
    }

    /**
     *
     * Initializes the TitleCache from the storage
     */
    async load() {
        // Clear cache
        this.cache = undefined;
        // Load the cache from persistence
        this.cache = await GM_getValue("cache", []);
    }

    /**
     * Persists the cache
     *
     * @return { Promise<boolean> } true if operation was successful false otherwise
     */
    async persist() {
        let cacheWithoutJquery = JSON.parse(JSON.stringify(this.cache));
        await GM_setValue("cache", cacheWithoutJquery);
        return true;
    }

    /**
     * Adds a title to the cache
     *
     * @param {Title} title
     */
    add(title) {
        // Check if a title is in cache already
        let cachedTitle = this.getByName(title.name);
        if (cachedTitle) {
            // Remove if title is stale
            if (cachedTitle.isStale()) {
                this.cache.filter(iTitle => iTitle.name !== cachedTitle.name);
            }
            // Not adding title that isn't stale again
            else {
                return false;
            }
        }

        this.cache.push(title);
        return true;
    }

    /**
     * @param {string} name of the name to be retrieved
     * @return {Title} Title with the given name or null if not yet cached.
     */
    getByName(name) {
        let filtered = this.cache.filter(title => title.title === name);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }

    /**
     * @param {string} id IMDB id of the title to be retrieved
     * @return {Title} returns the found title or null
     */
    getByIMDBId(id) {
        let filtered = this.cache.filter(tempTitle => tempTitle.IMDBId === id);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }
}