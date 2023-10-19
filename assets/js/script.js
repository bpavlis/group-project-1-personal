var indexScore = document.querySelector(".index-score");
var contentContainer = document.querySelector("#content-container");
var cardContainer = document.querySelector("#cards-container");
var cardOne = document.querySelector("#cardOne");
var cardTwo = document.querySelector("#cardTwo");
var cardOneBtn = document.querySelector("#cardOneBtn");
var cardTwoBtn = document.querySelector("#cardTwoBtn");
var cardOneImg = document.querySelector("#cardOneImg");
var cardTwoImg = document.querySelector("#cardTwoImg");
var cardOnePlayer = document.querySelector("#name1");
var cardTwoPlayer = document.querySelector("#name2");
var cardOneValue = document.querySelector("#value1");
var cardTwoValue = document.querySelector("#value2");
var players;
var indPlayers = [];
var initialBox;


var scoreBoard = document.querySelector("#scoreboard"); //scoreboard as a whole
var finalScore = document.querySelector("#score"); // user score
var saveButton = document.querySelector("#save-button");

async function getPlayers(teamId) {
    const resp = await fetch(`https://v1.american-football.api-sports.io/players?team=${teamId}&season=2022`, {
        method: "GET",
        headers: {
            "x-rapidapi-key": "bfee43a677f63e42621ac14b3735636a"
            // samiye: d52a11a4ff1c64263398d6e91826d199
            //grant: 8a595064b007930f5bae0de0827aeeb9
            //leah: d561b7308ece78af36ebe4724aa26c96
            //ben: 585f72dcc62f7fb3e27e941dab0f429f
            //katy: c50b729f3197bab6789dbfca58ae1053
            //gary: bfee43a677f63e42621ac14b3735636a
        }
    })
    return await resp.json()
}
start();

async function start() {
    // var players = await Promise.all([...Array(4)].map((num, index) => getPlayers(index + 1)))
    players = await Promise.all([32, 16, 15, 7].map((num) => getPlayers(num)))
    console.log(players);
    indPlayers = [...players[0].response, ...players[1].response, ...players[2].response, ...players[3].response];
    // console.log(indPlayers);
    populatePlayers();
}

function parseArr(arr) {
    var newArr = arr.filter(player => {
        return player.salary !== null
    });
    var newArr1 = newArr.filter(player => {
        return player.salary[0] === "$" || player.salary[0] === "(";
    })
    newArr1.forEach(player => {
        let str = "";
        for (let digit of player.salary) {

            if (!isNaN(parseInt(digit))) {
                str += digit;
            }
        }
        var num = parseInt(str);
        player.salNum = num;

    })

    indPlayers = newArr1;
}


var randomPlayer1 = "";
var randomPlayer2 = "";
var cardOneSal = "";
var cardTwoSal = "";
var pointTally = 0;
var wrongAns = 0;
console.log(randomPlayer1, randomPlayer2)


function populatePlayers() {
    parseArr(indPlayers);
    // console.log(indPlayers);
    randomPlayer1 = Math.floor(Math.random() * indPlayers.length);
    randomPlayer2 = Math.floor(Math.random() * indPlayers.length);
    cardOneSal = indPlayers[randomPlayer1].salNum;
    cardTwoSal = indPlayers[randomPlayer2].salNum;
    const ranPlay1 = indPlayers[randomPlayer1].name;
    const ranPlay2 = indPlayers[randomPlayer2].name;
    cardOneValue.textContent = `Salary: ${indPlayers[randomPlayer1].salary}`
    cardOneImg.src = indPlayers[randomPlayer1].image
    cardTwoImg.src = indPlayers[randomPlayer2].image
    cardOnePlayer.textContent = ranPlay1;
    cardTwoPlayer.textContent = ranPlay2;
}

cardOneBtn.addEventListener("click", function () {
    if (cardOneSal > cardTwoSal) {
        pointTally++;
    } else if (cardOneSal < cardTwoSal) {
        wrongAns++;
    } else if (cardOneSal === cardTwoSal) {
        pointTally++;
    }

    if (wrongAns === 3) {
        endGame();
        return
    }
    console.log(wrongAns + " wrong guesses");
    console.log(pointTally + " correct guesses");
    populatePlayers();
})


cardTwoBtn.addEventListener("click", function () {
    if (cardOneSal < cardTwoSal) {
        pointTally++;
    } else if (cardOneSal > cardTwoSal) {
        wrongAns++;
        console.log(wrongAns + " wrong guesses");

    } else if (cardOneSal === cardTwoSal) {
        pointTally++;
    }

    if (wrongAns === 3) {
        endGame();
        return
    }

    console.log(pointTally + " correct guesses");
    populatePlayers();

})


function endGame() {
    console.log("the endGame function is working!")
    var scoreText = `You got three wrong, so the game has ended! Your score is ${pointTally}!`;
    var initialDiv = document.querySelector("#initials");
    initialBox = document.createElement("input");

    contentContainer.setAttribute("class", "hide");




    scoreBoard.removeAttribute("class");
    finalScore.textContent = scoreText.toString();
    initialDiv.appendChild(initialBox);

    initialBox.setAttribute("placeholder", "YOUR NAME HERE!");
    initialBox.setAttribute("class", "save-initials");

}


saveButton.addEventListener("click", function () {
    let userName = initialBox.value.trim();
    console.log("initials = ", userName);

    let highScores = JSON.parse(localStorage.getItem("score")) || [];
    console.log("high score = ", highScores);
    let newScore = {
        points: pointTally,
        name: userName
    }
    highScores.push(newScore);
    localStorage.setItem("score", JSON.stringify(highScores));
    window.location.href = "score.html";
});



//https://v1.american-football.api-sports.io/players?team=1&season=2022

