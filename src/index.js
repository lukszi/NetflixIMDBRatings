import {NetflixObserver} from "./NetflixObserver";
import {TitleCache} from "./TitleCache";
import {ImdbFetcher} from "./ImdbFetcher";

async function main(){
    const body = document.querySelector("body");

    // Setup IMDB Info fetcher and Cache
    const cache = new TitleCache()
    await cache.waitForLoad
    const imdb = new ImdbFetcher();
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
}

main();