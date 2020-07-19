import {mutationObserved} from "./observer";


const observer = new MutationObserver(mutationObserved)

const body = document.querySelector("body")
const observerOptions = {
    childList: true,
    attributes: true,
    subtree: true
}
console.log("run")
observer.observe(body, observerOptions)