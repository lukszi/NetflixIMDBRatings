import {Title} from "./Title";

export class ImdbFetcher {
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
        const secret_key = "b1b5d454" // Props to the absolute genius who pushed his key to a public github repo
        return `https://www.omdbapi.com/?apikey=${secret_key}&t=${encodeURI(title)}`;
    }
}