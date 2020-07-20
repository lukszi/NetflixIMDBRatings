const cacheMaxAge = 7;

export class Title
{
    /**
     *
     * @param name {string}
     * @param rating {number}
     * @param IMDBId {string}
     * @param requestDate {Date}
     */
    constructor(name, rating, IMDBId,  requestDate = Date.now()) {
        this.name = name;
        this.rating = rating;
        this.IMDBId = IMDBId;
        this.requestDate = requestDate;
    }

    isStale(){
        let diffInTime = this.requestDate.getTime() - Date.now().getTime();
        let diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays > cacheMaxAge;
    }
}