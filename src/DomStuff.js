/**
 * Fetches all movie cards from a row
 *
 * @param {HTMLDivElement} row
 * @return {HTMLDivElement[]} all movie cards in the given row, ie divs with the class "title-card-container"
 */
export function getCardsFromRow(row){
    // I have not yet implemented bigRows TODO: Implement bigRows
    if(!row.querySelector(".rowContainer_title_card")){
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
 * Creates a span Containing the given titles rating
 *
 * @param {Title} title
 * @return {HTMLSpanElement} Span with the corresponding rating
 */
function createTitleSpan(title) {
    let span = document.createElement("span");
    span.classList.add("imdb-title-span")
    span.textContent = title.rating ? title.rating.toString() : "N/a";
    span.style.position = "absolute";
    span.style.zIndex = "2";
    span.style.fontSize = "200%"
    return span;
}

/**
 *
 * @param {Title} title
 * @param {HTMLDivElement} card
 */
export function addTitleInformationToCard(title, card) {
    // Skip cards that already have a rating on them
    if(card.querySelector(".imdb-title-span")){
        return;
    }
    let titleCard = card.querySelector(".ptrack-content").parentElement;
    titleCard.insertBefore(createTitleSpan(title), titleCard.children[0]);
}