/**
 * Fetches all movie cards from a row
 *
 * @param {HTMLDivElement} row
 * @return {HTMLDivElement[]} all movie cards in the given row, ie divs with the class "title-card-container"
 */
export function getCardsFromRow(row){
    let rowContainer_title_card = getChildWithClass(row, "rowContainer_title_card");
    if(!rowContainer_title_card){
        console.log("Detected bigRow, please implement");
        return null;
    }
    let ptrack_container = getChildWithClass(rowContainer_title_card, "ptrack-container");
    let rowContent = getChildWithClass(ptrack_container, "rowContent");
    let slider = getChildWithClass(rowContent, "slider");
    let sliderMask = getChildWithClass(slider, "sliderMask");
    let sliderContent = getChildWithClass(sliderMask, "sliderContent");

    // Filter out the slider-items containing actual data
    let slider_items = Array.from(sliderContent.children)
        .filter(/** @param {HTMLDivElement} child **/child =>
            getChildWithClass(child, "title-card-container") !== undefined);

    // Get the title-card from each slider
    return slider_items.map(sliderItem => getChildWithClass(sliderItem, "title-card-container"));
}

/**
 *
 * @param {HTMLDivElement} element whose children to search
 * @param {String} className the childElement needs to have
 * @return {HTMLDivElement} first child of element with the given class
 */
function getChildWithClass(element, className) {
    return Array.from(element.children)
        .find(/** @param {HTMLDivElement} child **/child => Array.from(child.classList).includes(className));
}

/**
 *
 * @param {HTMLDivElement} cardContainer containing a movie, must have the "title-card-container" class
 * @return {string} title of the movie displayed in the card
 */
export function getTitleFromCard(cardContainer){
    // Check if div has the right type
    if(!Array.from(cardContainer.classList).includes("title-card-container")){
        throw "Can't get title from a non 'title-card-container' div.";
    }

    let titleCard = getChildWithClass(cardContainer, "title-card");
    let ptrack_content = getChildWithClass(titleCard, "ptrack-content");
    let titleHref = ptrack_content.children[0];
    return titleHref.text;
}