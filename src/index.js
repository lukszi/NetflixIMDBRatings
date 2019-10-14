import {NetflixTitleReader} from "./netflix/reader.js";
import {IMDBHelper} from "./IMDBHelper.js";
import {TitleCache as Cache} from "./cache";

unsafeWindow.titleInfos = {};
let imdb;
let cache = new Cache();
unsafeWindow.cache = cache;
let reader;

$(document).ready(function () {
    // Call this once when the cache is created
    cache.addLoadCallback(function (cache) {
        // Create other Objects that rely on the cache
        imdb = new IMDBHelper(cache);
        reader = new NetflixTitleReader(cache);

        // Add callback functions to the cache
        cache.callbackFNs.add.push(titleAdd);
        cache.callbackFNs.update.push(titleUpdate);
    })
        // Get all movie titles on the currently loaded site
        //let titles = reader.readTitles();
        // console.log(titles);
    }
);

/**
 *
 * @param title {NetflixTitle}
 */
function titleAdd(title) {
    imdb.getIMDBId(title, (updatedTitle, error) => {
        console.log("Added: ", title.title);
        imdb.getRating(title.IMDBInfo.id, () => {});
    });
}

/**
 *
 * @param title {NetflixTitle}
 */
function titleUpdate(title) {
    console.log("updated: ", title);
}


function titleChangeCB(titles) {
    // Parse all of these titles to
    titles.forEach(function (title) {
        imdb.getIMDBId(title, function (found, err) {
            console.log("Getting info on title: ", title);
            if (err) {
                console.error(err);
            }
            imdb.getRating(found.id, (found, err) => {
                unsafeWindow.titleInfos = imdb.cache;
            })
        });
    });
}