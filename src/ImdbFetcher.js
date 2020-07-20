import {Title} from "./Title";

export class ImdbFetcher {
    /**
     * dummy fetcher
     * @param {string} title the rating will be fetched for
     * @return {Title} Information about the title
     */
    fetch(title) {
        return new Title(title, 5, "tt0903747");
    }
}