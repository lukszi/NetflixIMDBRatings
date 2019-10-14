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
    constructor(cache){
        this.cache = cache;
    }

    /**
     *
     * @param title {NetflixTitle}
     * @param callback
     */
    getIMDBId(title, callback){
        // Check if cache has the title
        let cachedTitle = this.cache.getByTitle(title.title);
        if(cachedTitle.IMDBInfo){
            callback(cachedTitle);
            return;
        }

        // Cache doesn't have the title, request it from API
        simpleSearch(title.title).then(foundTitles => {
            if(foundTitles.d.length>0){
                title.IMDBInfo = new IMDBInfo(foundTitles.d[0].id);
                callback(title)
            }
            else{
                callback(null, "Nothing found")
            }
        }).catch(reason => callback(null, reason));
    }

    getRating(imdbId, callback){
        // Get cached movie
        let movie = this.cache.getByIMDBId(imdbId);
        // Check if it has the info already
        if(movie && movie.IMDBInfo && movie.IMDBInfo.scrapperInfo){
            callback(movie);
            return;
        }
        // Movie doesn't have info yet, scrape and persist
        scrapper(imdbId).then(value => {
            movie.IMDBInfo.scrapperInfo = value;
            this.cache.persist();
            callback(movie);
        }).catch(reason => callback(null, reason))
    }
}

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );