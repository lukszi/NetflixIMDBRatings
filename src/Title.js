const cacheMaxAge = 7;

export class Title
{
    /**
     *
     * @param {string} name
     * @param{number} rating
     * @param {string} IMDBId
     * @param {Date} requestDate
     */
    constructor(name, rating, IMDBId,  requestDate = Date.now()) {
        this.name = name;
        this.rating = rating;
        this.IMDBId = IMDBId;
        this.requestDate = requestDate;
    }

    /**
     * Check if this object contains data on a title that is too old
     *
     * @return {boolean} true if Information ist older than cacheMaxAge
     */
    isStale(){
        let diffInTime = this.requestDate.getTime() - Date.now().getTime();
        let diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays > cacheMaxAge;
    }
}