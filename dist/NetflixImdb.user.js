// ==UserScript==
// @name         Netflix IMDB ratings
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  A Userscript that shows IMDB Ratings in Netflix
// @author       Lukas Sz
// @match        https://www.netflix.com/*
// @grant        unsafeWindow,GM_getResourceText
// @source       https://github.com/lukszi/NetflixIMDBRatings
// @license      GPL-3.0-or-later
// @require      https://code.jquery.com/jquery-3.4.1.min.js,https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js
// ==/UserScript==

// src/netflix/reader.js
class NetflixTitleReader {
    static readTitles(){
        return findAllTitles();
    }
}

function findAllTitles(){
    let titles = [];
    findAllTitleCardContainers().forEach(function(titleCardContainer){
        titleCardContainer.find(".ptrack-content").each(function(){
            $(this).children().each(function(){
                let title = $(this).attr("aria-label");
                if(title !== undefined)
                {
                    titles.push(title);
                }
            })
        })
    });
    return titles;
}

function findAllTitleCardContainers(){
    let titleCardContainer = [];
    $(".title-card-container").each(function(){titleCardContainer.push($(this))});
    return titleCardContainer
}

function findAllRows(){
    let rows = [];
    $(".lolomoRow_title_card").each(function(){rows.push($(this))});
    return rows
}

// node_modules/name-to-imdb/index.js
var namedQueue = require('named-queue');
var helpers = require('./helpers')

var providers = {
    metadata: require('./providers/cinemeta'),
    imdbFind: require('./providers/imdbFind'),
}

var defaultProviders = ['metadata', 'imdbFind']

// Constants
var CACHE_TTL = 12*60*60*1000; // if we don't find an item, how long does it stay in the cache as 'not found' before we retry it 

// In-memory cache for matched items, to avoid flooding Google (or whatever search api we use)
var cache = { };
var cacheLastSet = { };

// Named queue, means that we're not working on one name more than once at a tim
// and a total of 3 names at once
var queue = new namedQueue(worker, 3)

// Outside API
function nameToImdb(args, cb) {
    args = typeof(args)=='string' ? { name: args } : args

    var q = { name: args.name }
    if (args.year) q.year = args.year
    if (args.type) q.type = args.type

    if (!q.name)
        return cb(new Error('empty name'))

    if (q.year && typeof(q.year)=='string') q.year = parseInt(q.year.split('-')[0])
    
    if (q.year && isNaN(q.year))
        return cb(new Error('invalid year'))

    if (q.type && !(q.type=='movie' || q.type=='series')) 
        return cb(null, null) // no match for other types

    var key = new Buffer(args.hintUrl || Object.values(q).join(':')).toString('ascii') // convert to ASCII since EventEmitter bugs with UTF8
    
    if (cache.hasOwnProperty(key) && Date.now()-cacheLastSet[key] < CACHE_TTL) {
        return cb(null, cache[key][0], { match: cache[key][1].match, isCached: true })
    }

    queue.push({ 
        id: key,
        q: q,
        providers: args.providers || defaultProviders,
    }, function(err, imdb_id, match) {
        if (err)
            return cb(err)
        
        if (imdb_id) {
            cache[key] = [imdb_id, match]
            cacheLastSet[key] = Date.now()
        }

        cb(null, imdb_id, match)
    })
};

function worker(task, cb) {
    var prov = [].concat(task.providers)

    nextProv()

    function nextProv()
    {
        var n = prov.shift()
        if (! n)
            return cb(null, null)

        var provider = providers[n]
        if (!provider)
            return cb(new Error('unknown provider: '+n))

        provider(task.q, function(err, id) {
            if (err)
                return cb(err)

            if (id)
                return cb(null, id, { match: n })
            else
                nextProv()
        })
    }
}

module.exports = nameToImdb;

// src/IMDBHelper.js
class IMDBHelper{
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

// ./src/index.js
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