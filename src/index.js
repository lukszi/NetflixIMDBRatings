import {NetflixTitleReader} from "./netflix/reader.js";
import {IMDBHelper} from "./IMDBHelper.js";
import {TitleCache as Cache} from "./cache";

unsafeWindow.titleInfos = {};
let imdb;
let cache = new Cache();
let reader;

$(document).ready(function () {
    cache.addLoadCallback(function (cache) {
        imdb = new IMDBHelper(cache);
        reader = new NetflixTitleReader(cache);
        cache.callbackFNs.add.push(titleAdd);
        cache.callbackFNs.update.push(titleUpdate)
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
    imdb.getRating(title.IMDBInfo.id, () => {
    });
    console.log("added ", title);
}

/**
 *
 * @param title {NetflixTitle}
 */
function titleUpdate(title) {
    console.log("updated ", title);
}


function titleChangeCB(titles) {
    // Parse all of these titles to
    titles.forEach(function (title) {
        console.log(title);
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