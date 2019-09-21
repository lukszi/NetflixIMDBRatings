import nameToImdb from '../node_modules/name-to-imdb/index.js';
export class IMDBHelper{
    constructor(cache ={}){
        this.cache = cache;
    }

    getIMDBId(title, callback){
        // Check if cache has the title
        if(this.cache[title]){
            callback(null ,this.cache[title].res, this.cache[title].inf);
            return;
        }

        // Cache doesn't have the title, request it from API
        nameToImdb({name:title}, (err, res, inf) => {
            // Abort on error
            if(err){
                callback(err, null, null);
                return;
            }

            // Save to cache
            this.cache[title]  = {res: res, inf: inf};

            // Callback
            callback(null ,this.cache[title].res, this.cache[title].inf);
            console.log(res); // prints "tt0121955"
            console.log(inf); // inf contains info on where we matched that name - e.g. metadata, or on imdb
        });
    }
}