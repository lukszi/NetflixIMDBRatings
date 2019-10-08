export class NetflixTitleReader {
    constructor(titleChangeCB){
        this.titleChangeCB = titleChangeCB;
        this.titles = [];

        this.readTitles();
        this.createChangeObserver();
    }

    /**
     * call the readTitles method every time new titles are loaded
     */
    createChangeObserver(){
        // let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        let observer = new window.MutationObserver((mutations, observer) => {
            for(let i in mutations){
                // Filter for mutations that add new titles
                if(mutations[i].type==="childList" && mutations[i].addedNodes.length>0){
                    this.readTitles(this.titles);
                    break;
                }
            }
        });
        observer.observe(document, { subtree: true, attributes: false, childList: true });
    }

    /**
     * Finds all titles on the page not in the currentTitles list yet
     * @param currentTitles {Array.<NetflixTitle>} list of titles that have already been processed
     * @returns {Array.<NetflixTitle>}
     */
    findAllNewTitles(currentTitles){
        let titles = [];
        findAllTitleCardContainers().forEach(function($titleCardContainer){
            $titleCardContainer
                .find(".ptrack-content")
                .each(function(){
                    $(this).children().each(function(){

                        // Get title from the card
                        let title = $(this).attr("aria-label");

                        // Check if title exists
                        if(title !== undefined)
                        {
                            // Check if title has been processed already
                            let processedTitle = findProcessedTitle(title, currentTitles);
                            if(processedTitle!=null){
                                // Check if processed title is stale, if so replace by active DOM-element
                                if(processedTitle.isStale()){
                                    processedTitle.$container = $titleCardContainer;
                                }
                            }
                            else{
                                // Add newly found title into the list
                                let titleInfo = new NetflixTitle(title, $titleCardContainer);
                                titles.push(titleInfo);
                            }
                        }
                    })
                })
        });
        return titles;
    }

    /**
     * Finds all current titles and calls the callback with the new titles
     */
    readTitles(currentTitles=null){
        let newTitles = this.findAllNewTitles(currentTitles);
        this.titles.concat(newTitles);
        this.titleChangeCB(newTitles);
    }
}

/**
 * Class that contains all
 */
export class NetflixTitle{
    constructor(title, $container){
        this.title = title;
        this.$container = $container;
        this.IMDBInfo = null;
    }

    /**
     *  Checks if this title still exists in DOM
     */
    isStale()
    {
        return this.$container.closest("body").length > 0;
    };
}

/**
 * TODO: Fix this description
 * returns the title in it's current form (read DOM-entry) is not in the list of processedTitles
 *
 * @param title { string } title to be looked for
 * @param processedTitles { Array.<NetflixTitle> } titles that have already been processed
 * @return { NetflixTitle } Titles that has been found or null
 */
function findProcessedTitle(title, processedTitles){
    // Filter out netflixTitles with other titles
    let found = processedTitles.filter((tempTitle) => tempTitle.title === title)[0];
    // Return found element or null
    return found.length===0?null:found[0];
}

/**
 * finds all title cards on the page
 *
 * @returns {Array} all title cards currently on the website
 */
function findAllTitleCardContainers(){
    let titleCardContainer = [];
    $(".title-card-container").each(function(){titleCardContainer.push($(this))});
    return titleCardContainer
}

function findAllRows(){
    let rows = [];
    $(".lolomoRow_title_card").each(function(){rows.push($(this))});
    return rows
}
