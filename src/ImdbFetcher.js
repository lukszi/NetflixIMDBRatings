import {Title} from "./Title";

export class ImdbFetcher {

    /**
     *
     * @param {string} apiKey for the omdbAPI
     */
    constructor(apiKey) {
        this._secret_key = apiKey
    }

    /**
     * dummy fetcher
     * @param {string} title the rating will be fetched for
     * @return {Title} Information about the title
     */
    async fetch(title) {
        const response = await GM.xmlHttpRequest({headers: { 'Content-Type': 'application/json' }, url: this.buildUrl(title), method: "GET"})
        const responseText = response.responseText;
        const movieData = JSON.parse(responseText)

        const imdbRating = movieData["imdbRating"];
        const imdbId = movieData["imdbID"];
        return new Title(title, imdbRating, imdbId);
    }

    /**
     *
     * @param {string} title
     */
    buildUrl(title){
        return `https://www.omdbapi.com/?apikey=${this._secret_key}&t=${encodeURI(title)}`;
    }
}