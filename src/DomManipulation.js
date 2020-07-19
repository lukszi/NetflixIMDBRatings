/**
 *
 * @param {HTMLDivElement} row
 * @return {HTMLDivElement[]}
 */
export function getCardsFromRow(row){
    let rowContainer_title_card = getChildWithClass(row, "rowContainer_title_card");
    if(!rowContainer_title_card){
        console.log("Detected bigRow, please implement")
        return null;
    }
    let ptrack_container = getChildWithClass(rowContainer_title_card, "ptrack-container")
    let row_content = getChildWithClass(ptrack_container, "rowContent")
    let slider = getChildWithClass(row_content, "slider")
    let sliderMask = getChildWithClass(slider, "sliderMask")
    let sliderContent = getChildWithClass(sliderMask, "sliderContent")
    return Array.from(sliderContent.children).filter(/** @param {HTMLDivElement} child **/child => getChildWithClass(child, "title-card-container") !== undefined);
}

/**
 *
 * @param {HTMLDivElement} element
 * @param {String} className
 * @return {HTMLDivElement}
 */
function getChildWithClass(element, className) {
    return Array.from(element.children).find(/** @param {HTMLDivElement} child **/child => Array.from(child.classList).includes(className))
}