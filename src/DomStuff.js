/**
 * Fetches all movie cards from a row
 *
 * @param {HTMLDivElement} row
 * @return {HTMLDivElement[]} all movie cards in the given row, ie divs with the class "title-card-container"
 */
export function getCardsFromRow(row){
    // I have not yet implemented bigRows, check for that
    if(!row.querySelector(".rowContainer_title_card")){
        console.log("Detected bigRow, please implement");
        return null;
    }

    return row.querySelectorAll(".title-card-container")
}

/**
 *
 * @param {HTMLDivElement} cardContainer containing a movie, must have the "title-card-container" class
 * @return {string} title of the movie displayed in the card
 */
export function getTitleNameFromCard(cardContainer){
    // Check if div has the right type
    if(!Array.from(cardContainer.classList).includes("title-card-container")){
        throw "Can't get title from a non 'title-card-container' div.";
    }

    return cardContainer.querySelector(".ptrack-content").children[0].text;
}

/**
 *
 * @param {Title} title
 * @param {HTMLDivElement} card
 */
export function addTitleInformationToCard(title, card) {
    console.log("adding title", title, "to card", card)
}