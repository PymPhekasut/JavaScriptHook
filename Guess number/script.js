'use strict';


// console.log(document.querySelector('.message').textContent);

// document.querySelector('.message').textContent = 'Correct Number!';

// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;

// document.querySelector('.guess').value = 20;
// console.log(document.querySelector('.guess').value);

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20; 
let highScore = 0;


document.querySelector('.check').addEventListener
('click', function() {
    const guess = Number(document.querySelector('.guess').value);
    console.log(guess, typeof guess);

    const displayMessage = function(message) {
        document.querySelector('.message').textContent = message;
    }
    //when no imput
    if (!guess) {
       // document.querySelector('.message').textContent = '⛔ No Number!';
        displayMessage('⛔ No Number!');

        //when player wins
    } else if (guess === secretNumber) {
        displayMessage('🎉 Correct Number!');
        //document.querySelector('.message').textContent = '🎉 Correct Number!';
        
        document.querySelector('.number').textContent = secretNumber;
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30 rem';

        //setting current high score
        if(score > highScore) {
            highScore = score;
            document.querySelector('.highscore').textContent = highScore;
        }

        //when guess is wrong
    }else if (guess !== secretNumber) {
        if(score > 1) {
            //document.querySelector('.message').textContent = 
            //guess > secretNumber ? '🎈 Too High!' : '📉 Too Low!';
            displayMessage(guess > secretNumber ? '🎈 Too High!' : '📉 Too Low!');
            score--;
            document.querySelector('.score').textContent = score;
        } else {
            displayMessage('🧨 You lost a game!');
           // document.querySelector('.message').textContent = '🧨 You lost a game!';
            document.querySelector('.score').textContent = 0;
        }
    }
    //     //When guess is too high
    // } else if (guess > secretNumber) {
    //     if(score > 1) {
    //         document.querySelector('.message').textContent = 
    //         '🎈 Too High!';
    //         score--;
    //         document.querySelector('.score').textContent = score;
    //     } else {
    //         document.querySelector('.message').textContent = 
    //         '🧨 You lost a game!';
    //         document.querySelector('.score').textContent = 0;
    //     }
    //     //When guess is too low
    // } else if (guess < secretNumber) {
    //     if(score > 1) {
    //         document.querySelector('.message').textContent = 
    //         '📉 Too Low!';
    //         score--;
    //         document.querySelector('.score').textContent = score;
    //     } else {
    //         document.querySelector('.message').textContent = 
    //         '🧨 You lost a game!';
    //         document.querySelector('.score').textContent = 0;
    //     }

    // }
});

document.querySelector('.again').addEventListener('click', function() {
    score = 20; 
    secretNumber = Math.trunc(Math.random() * 20) + 1;

    displayMessage('Start guessing...');    
    document.querySelector('.score').textContent = score;
    document.querySelector('.number').textContent = '?';
    document.querySelector('.guess').value = ''; //empty value input

    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15 rem';
})