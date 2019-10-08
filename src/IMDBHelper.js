// import simpleSearch from '../node_modules/imdb-scrapper/index.js';
const { simpleSearch, scrapper } = require("../node_modules/imdb-scrapper/index.js");

export class IMDBInfo {
    constructor(id){
        this.id = id;
        this.rating = null;
        this.scrapperInfo = null;
    }
}

export class IMDBHelper{
    constructor(){
        this.cacheLoaded = false;
        this.cache = {};
        (async () => {
            this.cache = await GM_getValue("movieCache", {});
            this.cacheLoaded = true;
        })();
    }

    /**
     *
     * @param title {NetflixTitle}
     * @param callback
     */
    getIMDBId(title, callback){
        // Check if cache has the title
        if(this.cache[title.title]){
            callback(this.cache[title.title]);
            return;
        }

        // Cache doesn't have the title, request it from API
        simpleSearch(title.title).then(foundTitles => {
            if(foundTitles.d.length>0){
                this.cache[title.title] = foundTitles.d[0];
                if(this.cacheLoaded){
                    GM_setValue("movieCache", this.cache)
                }
                callback(this.cache[title.title].id)
            }
            else{
                callback(null, "Nothing found")
            }
        }).catch(reason => callback(null, reason));
    }

    getRating(imdbId, callback){
        // Get cached movie
        let movie = Object.filter(this.cache,cachedMovie => {return cachedMovie.id === imdbId});
        movie = movie[Object.keys(movie)[0]];
        // Check if it has the info already
        if(movie.scrapperInfo){
            callback(movie.scrapperInfo);
            return;
        }

        // Movie doesn't have info yet, scrape and persist
        scrapper(imdbId).then(value => {
            movie.scrapperInfo = value;
            GM_setValue("movieCache", this.cache);
            callback(movie.scrapperInfo);
        }).catch(reason => callback(null, reason))
    }
}
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );