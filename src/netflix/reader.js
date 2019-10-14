export class NetflixTitleReader {
    /**
     *
     * @param cache {TitleCache}
     */
    constructor(cache) {
        this.cache = cache;
        this.readTitles();
        this.createChangeObserver();
    }

    /**
     * call the readTitles method every time new titles are loaded
     */
    createChangeObserver() {
        // let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        let observer = new window.MutationObserver((mutations) => {
            for (let i in mutations) {
                // Filter for mutations that add new titles
                if (mutations[i].type === "childList" && mutations[i].addedNodes.length > 0) {
                    console.log("Observer invoked");
                    this.readTitles();
                    break;
                }
            }
        });
        observer.observe(document, {subtree: true, attributes: false, childList: true});
    }

    /**
     * Finds all titles on the page not in the currentTitles list yet
     * @returns {Array.<NetflixTitle>}
     */
    readTitles() {
        let titles = [];
        findAllTitleCardContainers().forEach(($titleCardContainer) => {
            let ptrackContents = $titleCardContainer.find(".ptrack-content");
            for (let i = 0; i < ptrackContents.length; i++) {
                let ptrackContent = ptrackContents[i];
                let ptrackContentChildren = $(ptrackContent).children();
                for (let j = 0; j < ptrackContentChildren.length; j++) {
                    let $textField = $(ptrackContentChildren[i]);
                    // Get title from the card
                    let title = $textField.attr("aria-label");
                    // Check if title exists
                    if (title !== undefined) {
                        this.cache.add(new NetflixTitle(title, $titleCardContainer));
                    }
                }
            }
        });
        return titles;
    }
}

/**
 * Class that contains all
 */
export class NetflixTitle {
    constructor(title, $container) {
        this.title = title;
        this.$containers = [$container];
        /**
         *
         * @type {IMDBInfo}
         */
        this.IMDBInfo = null;
    }

    /**
     *  Checks if this title still exists in DOM
     */
    isStale() {
        return this.$containers.reduce(function (hasStaleElements, $container) {
            if (hasStaleElements) {
                return true;
            }
            return $container.closest("body").length === 0;
        }, false);
    };

    /**
     * Remove all stale containers
     */
    clearStaleContainers() {
        for (let i = 0; i < this.$containers.length; i++) {
            if (this.$containers[i].closest("body").length === 0) {
                this.$containers.splice(i, 1);
                --i;
            }
        }
    }
}

/**
 * finds all title cards on the page
 *
 * @returns {Array} all title cards currently on the website
 */
function findAllTitleCardContainers() {
    let titleCardContainer = [];
    $(".title-card-container").each(function () {
        titleCardContainer.push($(this))
    });
    return titleCardContainer
}
