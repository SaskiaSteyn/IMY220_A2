class Poll {
 

    // Constructor 
    constructor(kittyMap) {
        this.kittyMap = kittyMap;
    }
 
    // Function
    vote(name) {
        this.kittyMap[name]++;
    }

    getVotes() {
        return this.kittyMap;
    }
}

module.exports = Poll;