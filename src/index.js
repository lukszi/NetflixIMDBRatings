import {NetflixObserver} from "./NetflixObserver";
import {TitleCache} from "./TitleCache";
import {ImdbFetcher} from "./ImdbFetcher";

const body = document.querySelector("body");

// Setup IMDB Info fetcher and Cache
let cache = await new TitleCache()
let imdb = new ImdbFetcher();
const netflixObserver = new NetflixObserver(cache, imdb);

// Setup MutationObserver
const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true,
};
const observer = new MutationObserver(netflixObserver.mutationObserved);
observer.observe(body, observerOptions);