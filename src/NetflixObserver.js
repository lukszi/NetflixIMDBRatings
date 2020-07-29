import {addTitleInformationToCard, getCardsFromRow, getTitleNameFromCard} from "./DomStuff";

export class NetflixObserver {
    /**
     *
     * @param {TitleCache} cache
     * @param {ImdbFetcher} fetcher
     */
    constructor(cache, fetcher) {
        this.titleCache = cache;
        this.fetcher = fetcher;
    }

    /**
     * Called when a Mutation on the DOM is observed.
     *
     * @param {MutationRecord[]} mutationList
     * @param {MutationObserver} observer
     */
    async mutationObserved(mutationList, observer) {
        for(let mutation of mutationList)
        {
            switch (mutation.type) {
                case 'childList':
                    /* One or more children have been added to and/or removed
                       from the tree.
                       (See mutation.addedNodes and mutation.removedNodes.) */
                    await this._processChildListMutation(mutation);
                    if(this.titleCache.isDirty()){
                        console.log("persisting cache")
                        await this.titleCache.persist();
                    }
                    break;
                case 'attributes':
                    /* An attribute value changed on the element in
                       mutation.target.
                       The attribute name is in mutation.attributeName, and
                       its previous value is in mutation.oldValue. */
                    break;
            }
        }
    }

    /**
     * Takes a Mutation
     *
     * @param {MutationRecord} mutation
     */
    async _processChildListMutation(mutation) {
        if (mutation.type !== "childList")
            throw "NetflixObserver._processChildListMutation called with invalid mutation: '"
            + mutation.type +
            "'. Only childList mutations are Accepted"
        if (containsMovieRow(mutation)) {
            let rows = getMovieRows(mutation);
            for (let row of rows) {
                let cards = getCardsFromRow(row);
                if (!cards)
                    continue;
                await this._processCards(cards)
            }
        }

        /**
         * Tests if any one Node in a mutation is a netflix movieRow
         *
         * @param {MutationRecord} mutation
         * @return {boolean}
         */
        function containsMovieRow(mutation) {
            if(!mutation.addedNodes)
                return false;
            let classList = Array.from(mutation.addedNodes).flatMap(addedNode => addedNode.classList ? Array.from(addedNode.classList): []);
            return classList.includes("lolomoRow");
        }

        /**
         * Takes a MutationRecord and extracts all rows containing movie cards (divs with class "lolomoRow")
         *
         * @param {MutationRecord} mutation
         * @return {HTMLDivElement[]}
         */
        function getMovieRows(mutation) {
            return Array.from(mutation.addedNodes).filter(addedNode => Array.from(addedNode.classList).includes("lolomoRow"));
        }
    }

    /**
     * Takes a List of newly added movie cards and adds the IMDB ratings to them
     *
     * @param {HTMLDivElement[]} cards
     */
    async _processCards(cards) {
        for (const card of cards) {
            let titleName = getTitleNameFromCard(card)
            console.log(titleName);
            let titleInfo = this.titleCache.getByName(titleName)
            console.log(titleInfo)
            if (!titleInfo) {
                titleInfo = await this.fetcher.fetch(titleName);
                this.titleCache.add(titleInfo)
            }
            addTitleInformationToCard(titleInfo, card);
        }
    }
}