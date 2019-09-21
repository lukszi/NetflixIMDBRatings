import {NetflixTitleReader} from "./netflix/reader.js";
import {IMDBHelper} from "./IMDBHelper.js";

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

String.prototype.deleteAt = function (index) {
    return this.substr(0, index) + this.substr(index + 1);
};

unsafeWindow.titleInfos = {};
let imdb = new IMDBHelper();

$(document).ready(function () {
        // Get all movie titles on the currently loaded site
        let titles = NetflixTitleReader.readTitles();
        // console.log(titles);
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
);