
const socket = io();

socket.on('connect', message => {
    console.log("I connected with ID: ", socket.id);
});

socket.on('votesUpdated', kittyVotesMapJson => {
    
    const kittyVotesMap = JSON.parse(kittyVotesMapJson);

    console.log(kittyVotesMapJson);

    var totalVotes = 0;
    for (const key in kittyVotesMap) {
        console.log(`${key}: ${kittyVotesMap[key]}`);
        document.querySelector('label[for="' + key + '"] span').innerHTML = kittyVotesMap[key];
        totalVotes += kittyVotesMap[key];
    }

    document.getElementById("total-votes").innerHTML = totalVotes;
})

socket.on('userVoted', (userId, kittyName) => {
    var currentFeed = document.getElementById("feed").innerHTML;
    document.getElementById("feed").innerHTML = "<p>User " + userId + " just voted for " + kittyName + "</p>" + currentFeed;
})

function voteForKitty(event){
    event.preventDefault();
    var selectedCat = document.querySelector('input[name="catName"]:checked').value;
    if(selectedCat === null){
        alert("Please select a kitty! ฅ^•⩊•^ฅ");
    }
    console.log(selectedCat);
    socket.emit('voting', selectedCat);
}
