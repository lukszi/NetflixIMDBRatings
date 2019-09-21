import {NetflixTitleReader} from "./netflix/reader.js";
import { IMDBHelper } from "./IMDBHelper.js";

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
};

String.prototype.deleteAt=function(index) {
    return this.substr(0, index) + this.substr(index + 1);
};

unsafeWindow.titleInfos = {};
let imdb = new IMDBHelper();

$(document).ready(function(){
        // Get all movie titles on the currently loaded site
        let titles = NetflixTitleReader.readTitles();
        // console.log(titles);
        // Parse all of these titles to
        titles.forEach(function(title){
            imdb.getIMDBId(title, function (err, res, inf) {
                console.log("Getting info on title: ", title);
                if(err){
                    console.error(err);
                }
                console.log(res);
                console.log(inf);
            });
            //getTitleInfos(title);
        });
        // console.log(titleInfos);
    }
);

function sanitizeTitle(title){
    title = title.replace(/ /g,"_");
    for (let i = 0; i < title.length; i++) {
        let c = title.charAt(i);
        if(c.match("[a-z0-9A-Z]") || c === '_' || c=== '-' ){
            // console.log(c, " matches")
            continue;
        }
        if(c === '-'){
            title = title.substr(0,i);
            break;
        }
        title = title.replaceAt(i, '_');
    }
    return title;
}

function getTitleInfos(title){
    // Prepare the url
    let searchUrl = 'https://sg.media-imdb.com/suggests/'+title.charAt(0).toLowerCase()+'/'+title.replace(/:/g," ").replace(/&/," ")+'.json';

    // Generate callback function javascript
    let titleWithUnderscores = sanitizeTitle(title);
    let jsonpCallback = 'imdb$' + titleWithUnderscores;
    let evalString = 'function '+jsonpCallback +'(results){let title = "' + title + '"; let titleInfo = {title: title}; titleInfo.info = results; titleInfos[title] = titleInfo; console.log(results)}';

    // Execute callback function javascript
    $.globalEval(evalString);
    $.ajax({
        url: searchUrl,
        dataType: 'jsonp',
        cache: true,
        jsonp: false,
        jsonpCallback: jsonpCallback
    })
}
