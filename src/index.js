import {NetflixObserver} from "./NetflixObserver";
import {clearCache, TitleCache} from "./TitleCache";
import {ImdbFetcher} from "./ImdbFetcher";

// clearCache()

async function main(){
    const body = document.querySelector("body");

    // Setup IMDB Info fetcher and Cache
    const apiKey = "b1b5d454" // Not mine, found that online
    const cache = new TitleCache();
    const imdb = new ImdbFetcher(apiKey);
    const netflixObserver = new NetflixObserver(cache, imdb);
    // Required to keep the this context in the mutationObserved method
    const observerCallback = (mutations, observer) => netflixObserver.mutationObserved(mutations, observer);

    // Setup MutationObserver
    const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true,
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(body, observerOptions);
    await netflixObserver.scanForMovieCards();
}

main();