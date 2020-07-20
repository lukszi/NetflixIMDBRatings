import {mutationObserved} from "./observer";

const body = document.querySelector("body");

const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
};
const observer = new MutationObserver(mutationObserved);
observer.observe(body, observerOptions);