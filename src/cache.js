const cacheMaxAge = 7;

/**
 * Caches already found values
 */
export class TitleCache {
    async constructor() {
        await this.load();
    }

    /**
     *
     * Initializes the TitleCache from the storage
     */
    async load(){
        // Clear cache
        this.cache = [];
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
     * @param name { string } Title of the movie
     * @param IMDBId { string } IMDB id of the movie
     * @param rating { number } rating of the title
     */
    add(name, IMDBId, rating) {
        // Check if a title is in cache already
        let cachedTitle = this.getByName(name);
        if (cachedTitle) {
            // Remove if title is stale
            if (cachedTitle.isStale()) {
                this.cache.filter(title => title.name !== cachedTitle.name);
            }
            // Not adding title that isn't stale again
            else {
                return false;
            }
        }

        let title = new Title(name, rating, IMDBId);
        this.cache.push(title);
        return true;
    }

    /**
     * @param name {string} name of the name to be retrieved
     * @return {Title} returns the found name or null
     */
    getByName(name) {
        let filtered = this.cache.filter(title => title.title === name);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }

    /**
     * @param id {string} IMDB id of the title to be retrieved
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

class Title
{
    /**
     *
     * @param name {string}
     * @param rating {number}
     * @param IMDBId {string}
     * @param date {Date}
     */
    constructor(name, rating, IMDBId,  date = Date.now()) {
        this.name = name;
        this.rating = rating;
        this.IMDBId = IMDBId;
        this.date = date;
    }

    isStale(){
        let diffInTime = this.date.getTime() - Date.now().getTime();
        let diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays > cacheMaxAge;
    }
}