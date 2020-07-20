import {getCardsFromRow, getTitleFromCard} from "./DomManipulation";

export class NetflixObserver{
    /**
     *
     * @param {TitleCache} cache
     * @param {ImdbFetcher} fetcher
     */
    constructor(cache, fetcher) {
        this.cache = cache;
        this.fetcher = fetcher;
    }

    /**
     *
     * @param {MutationRecord[]} mutationList
     * @param {MutationObserver} observer
     */
    mutationObserved(mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch (mutation.type) {
                case 'childList':
                    /* One or more children have been added to and/or removed
                       from the tree.
                       (See mutation.addedNodes and mutation.removedNodes.) */
                    this._processChildListMutation(mutation);
                    break;
                case 'attributes':
                    /* An attribute value changed on the element in
                       mutation.target.
                       The attribute name is in mutation.attributeName, and
                       its previous value is in mutation.oldValue. */
                    break;
            }
        });
    }

    /**
     *
     * @param {MutationRecord} mutation
     */
    _processChildListMutation(mutation) {
        if (containsMovieRow(mutation)) {
            let rows = getMovieRows(mutation);
            for (let row of rows) {
                let cards = getCardsFromRow(row);
                if(!cards)
                    continue;
                this._processCards(cards)
            }
        }

        /**
         * Tests if any one Node in a mutation is a netflix movieRow
         *
         * @param {MutationRecord} mutation
         * @return {boolean}
         */
        function containsMovieRow(mutation) {
            let classList = Array.from(mutation.addedNodes).flatMap(addedNode => Array.from(addedNode.classList));
            return classList.includes("lolomoRow");
        }

        /**
         *
         * @param {MutationRecord} mutation
         * @return {HTMLDivElement[]}
         */
        function getMovieRows(mutation) {
            return Array.from(mutation.addedNodes).filter(addedNode => Array.from(addedNode.classList).includes("lolomoRow"));
        }
    }

    /**
     *
     * @param {HTMLDivElement[]} cards
     */
    _processCards(cards) {
        for(const card of cards){
            let title = getTitleFromCard(card)
        }
    }
}