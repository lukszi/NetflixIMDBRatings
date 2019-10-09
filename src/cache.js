/**
 * Cache for all {NetflixTitle} entries
 */
export class TitleCache {
    constructor() {
        this.cacheLoaded = false;
        this.titles = [];
        this.callbackFNs = {add: [], update: [], cacheLoaded: []};
        this.cache = {};

        // Load the cache from persistence
        (async () => {
            this.cache = await GM_getValue("cache", []);
            this.cacheLoaded = true;

            // Call the callbacks
            this.callbackFNs.cacheLoaded.forEach(callback => callback(this));
            // Remove all cacheLoaded callbacks since they only should be called on the inital load
            this.callbackFNs.cacheLoaded = [];
        })();
    }

    /**
     * Persists the cache
     */
    persist() {
        this.checkCacheValidity();
        (async () => {
            this.cache = await GM_setValue("cache", this.titles);
        })();
    }

    /**
     * Adds a title to the cache
     *
     * @param title { NetflixTitle }
     */
    add(title) {
        this.checkCacheValidity();

        // Check if a title is in cache already
        let cachedTitle = this.getByTitle(title.title);
        if (cachedTitle) {
            // replace title if it is stale
            if (cachedTitle.isStale()) {
                cachedTitle.clearStaleContainers();
                cachedTitle.$containers.concat(title.$containers);

                // Call all update callbacks
                this.callbackFNs.update.forEach(callback => callback(title));
            }
            return false;
        } else {
            this.cache.put(title);

            // Call all add callbacks
            this.callbackFNs.add.forEach(callback => callback(title));
            return true;
        }
    }

    addLoadCallback(callback){
        if(this.cacheLoaded){
            console.log("Calling callback now");
            callback(this);
        }
        else{
            console.log("Adding callback to queue");
            this.callbackFNs.cacheLoaded.push(callback);
        }
    }

    /**
     * @param title {string} name of the title to be retrieved
     * @return {NetflixTitle} returns the found title or null
     */
    getByTitle(title) {
        this.checkCacheValidity();

        let filtered = this.cache.filter(tempTitle => tempTitle.title === title);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }

    /**
     * @param id {string} IMDB id of the title to be retrieved
     * @return {NetflixTitle} returns the found title or null
     */
    getByIMDBId(id) {
        this.checkCacheValidity();

        let filtered = this.cache.filter(tempTitle => tempTitle.IMDBInfo.id === id);
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }

    /**
     * Checks if cache has been loaded otherwise throws an exception
     */
    checkCacheValidity() {
        if (!this.cacheLoaded) {
            throw "Trying to add a title to the cache while cache has not loaded yet";
        }
    }
}