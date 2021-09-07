'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: 'Pym Phekasut',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-08-07T16:33:06.386Z',
    '2021-08-16T14:43:26.374Z',
    '2021-08-17T18:49:59.371Z',
    '2021-08-18T12:01:20.894Z',
  ],
  currency: 'AUD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Neeranut Phekasut',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const  movements =[200, 450, -400, 3000, -650, -130, 70, 1300];

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////////////////////Display /////////////////////////////////

const formatMovementDate = function(date, locale) {
  const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  //console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  
    // const day = `${date.getDate()}`.padStart(2,0)
    // const month = `${date.getMonth()+ 1}`.padStart(2, 0);
    // const years = date.getFullYear();
    // return  `${day}/${month}/${years}`;

    return new Intl.DateTimeFormat(locale).format(date);

}

const formatCur = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}
//Display movements
const displayMovements = function(acc, sort = false) {

  containerMovements.innerHTML = '';

  //Ascending sort 
  const movs = sort ? acc.movements.slice().sort((a, b) =>
  a - b) : acc.movements; //if sort is false : movements will be used


  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'

    const date = new Date(acc.movementsDates[i])
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    
    const html = ` 
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov} </div>
  </div>`;

  //afterbegin/beforeend
  containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

//Display balance in currency > acc = currentaccount 
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// 0 is initial value of sum
const calcDisplaySummary = function(acc) {
  //income
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  //`${incomes.toFixed(2)} AUD`;

  //expense
  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  //`${Math.abs(out).toFixed(2)} AUD`;

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * acc.interestRate/100)
  .filter((int, i, arr) => {
    //console.log(arr);
    return int > 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(Math.abs(interest), acc.locale, acc.currency);
  //`${Math.abs(interest).toFixed(2)} AUD`;
}


const eurToUsd = 1.1;

//Pipeline
const totalDepositsUSD = movements
.filter(mov => mov > 0)
.map(mov => mov * eurToUsd)
.reduce((acc, mov) => acc + mov, 0);
//console.log(totalDepositsUSD);

// // //Showing account user//
const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
    })
  };
  createUsernames(accounts); 
  // console.log(accounts);

  const updateUI = function(acc) {
    //Display movements
    displayMovements(acc);
    //Display balance
    calcDisplayBalance(acc);
    //Display summary
    calcDisplaySummary(acc);
  };

const startLogOutTimer = function() {
    const tick = function() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

  //In each call, print the remaining time ti UI
  labelTimer.textContent = `${min}:${sec}`;


  //When 0 second, stop timer and log out user
  if(time === 0){
    clearInterval(timer);
    labelWelcome.textContent = 'log in to get started'; //Only first name
      containerApp.style.opacity = 0;
   }

   // Decrease 1s
  time--;
  };
  //Set time to 5 minutes
  let time = 120;

  //Call the timer every second 
  tick();
  const timer = setInterval(tick, 1000);
  return timer;

}


/////////////////////////////Implemtaing userlogin/////////////////////////////
//Event handler
let currentAccount, timer; //parent scope

// //FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function(event){
  //Prevent foem from summitting
  event.preventDefault();

 currentAccount = accounts
 .find(acc => acc.username === inputLoginUsername.value);

 //console.log(currentAccount);

 if(currentAccount?.pin === Number(inputLoginPin.value)) {

    //Display UI welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`; //Only first name
      containerApp.style.opacity = 100;

    //Create current date and time
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric', //2-digit
      //weekday: 'long'
    }

// const locale = navigator.language;
// console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(
  currentAccount.locale, option).format(now);

    // const day = `${now.getDate()}`.padStart(2,0)
    // const month = `${now.getMonth()+ 1}`.padStart(2, 0);
    // const years = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();
    // labelDate.textContent = `${day}/${month}/${years}, ${hour}:${min}`

    // Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Time
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    //Update UI
    updateUI(currentAccount);

  }
});

//Transfer money
btnTransfer.addEventListener('click', function(event){
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  
  inputTransferAmount.value = inputTransferTo.value = '';

  //summary balance after transferred
  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && 
    receiverAcc.username !== currentAccount.username) {
      //doing transfer
     currentAccount.movements.push(-amount);
     receiverAcc.movements.push(amount);

     //Add transfer date 
     currentAccount.movementsDates.push(new Date().toISOString());
     receiverAcc.movementsDates.push(new Date().toISOString());


     updateUI(currentAccount);

     //Reset timer
     clearInterval(timer);
     timer = startLogOutTimer();
    }
});


btnLoan.addEventListener('click', function(event){
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  //if result is true || (some)
  if(amount > 0 && currentAccount.movements.some(mov =>  mov >= amount * 0.1)) {
    setTimeout(function() {//Add movement
    currentAccount.movements.push(amount);

    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }, 2500);
}
  inputLoanAmount.value = '';
});


btnClose.addEventListener('click', function(event) {
  event.preventDefault();
  
  if(inputCloseUsername.value === currentAccount.username && 
    Number(inputClosePin.value) === currentAccount.pin) {
      
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      //console.log(index);

    //delete account
      accounts.splice(index, 1);

    //Hide UI
      containerApp.style.opacity = 0;

      inputCloseUsername.value = inputClosePin.value = '';
    }
});

let sorted = false; //setting click sort:unsort
btnSort.addEventListener('click', function(event){
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted) //true is set to sort parameter
  sorted = !sorted;
});

// labelBalance.addEventListener('click', function() {
// [...document.querySelectorAll('.movements__row')].forEach(function(row, i) {
//    if(i % 2 === 0) row.style.backgroundColor = 'grey';
//    if( i % 3 === 0) row.style.backgroundColor = 'orange';
//    });
// });

//create date
// const now = new Date();
// console.log(now);
// console.log(new Date('Aug 19 2021 18:56:54'));
// console.log(new Date('December 24,2020'));

//console.log(new Date(account1.movementsDates[0]));




// //find method
//   const firstWinthdrawal =  movements.find((mov => mov < 0))
//   console.log(movements);
//   console.log(firstWinthdrawal);

//   console.log(accounts);

//   const account = accounts.find(acc => acc.owner === 'Jessica Davis');
//   console.log(account);

//console.log(movements);
// // //accumalator -> snowball
// const balance = movements.reduce(function(acc, cur, i , arr){
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + cur
// }, 0); //start iteration from 0

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// //every number add together
// console.log(balance);

// let balance2 = 0;
// for(const mov of movements) balance2 += mov;
// console.log(balance2);


// //Maximum value 
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) 
//     return acc;
//   else 
//     return mov;
// }, movements[0])

// console.log(max)


///////////////Filter ///////////////////
// const deposits = movements.filter(function(mov) {
//   return mov > 0;
// });

// console.log(movements)
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);


// const withdrawals = movements.filter(mov => mov < 0)
// console.log(withdrawals);

// const withdrawalFor = [];
// for (const mov of movements) if (mov < 0) withdrawalFor.push(mov);
// console.log (withdrawalFor)








/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


//forEach method seperate each array but can't return result
// 200
// 450
// // ..
// movements.forEach((mov) =>{
//   console.log(mov)
// })

// //Map method seperate each array into function and return result in array
// const result = movements.map((mov) => {
//   return mov*2
// });
// console.log(result);


//Filter method seperate each array to follow condition 
  
// const members = [ 
//   {name: "Eve", age: 24}, 
//   {name: "Adam", age: 48}, 
//   {name: "Chris", age: 18}, 
//   {name: "Danny", age: 30}
// ]

// const result = members.filter((member) => {
//   return member.age > 25
// })
// console.log(result);


//Find method is similar to filter but only pick first result to display
// const members = [ 
//   {name: "Eve", age: 24}, 
//   {name: "Adam", age: 48}, 
//   {name: "Chris", age: 18}, 
//   {name: "Danny", age: 30}
// ]

// const result = members.find((member) => {
//   return member.age > 25
// })
// console.log(result);

//Every&Some is return result through logical operator only TRUE(||) or FALSE (&&)

// const anyDeposit = movements.every(mov => mov >0);
// console.log(anyDeposit);

//EQUALITY
//console.log(movements.includes(-130))

//flat
// const arr = [[1,2,3], [4,5,6], 7,8]
// console.log(arr.flat());

// const overalBalance = accounts.map(acc => acc.movements)
// // .flat()
// // .reduce((acc, mov) => acc + mov, 0);
// // console.log(overalBalance);

// const overalBalance = accounts.flatMap(acc => acc.movements)
// .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);




//Reduce is to summarize all value that we need to set the initial value(0) and parameter in function
//each array will keep value in sum and plus with mov of movements
// const result = movements.reduce((sum, mov) => {
//   return sum + mov
// }, 0)

// console.log(result);

////////////////  SORTING   //////////////////
// //string
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners)

// //number 
// console.log(movements);

// //return < 0 ----- A, B
// //return > 0 ----- B, A

// //Ascending
// movements.sort((a, b) => a - b);
// console.log(movements);

// //Descending 
// // movements.sort((a, b) => {

// //   if (a >b ) 
// //   return -1;
// //   if(b > a)
// //   return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);






//convert to us dollar 


// const eurToUsd = 1.1; 

// // const movementsUSD = movements.map(function(mov){
// //   return mov * eurToUsd;
// // })

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementDescriptions = movements.map((mov, i) => 

//   `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdraw'} ${Math.abs(mov)}`
  
// );

// console.log(movementDescriptions);

/////////////////////////////////////////////////////////////////
// const checkDogs = function(dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2); //last two
//   //dogsJulia.slice(1,3)
//   const dogs = dogsJuliaCorrected.concat(dogsKate);

//   dogs.forEach(function(dog, i) {
//     if(dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`)
//     } else {
//       console.log(`Dog number ${i + 1} is a puppy, and is ${dog} years old`)
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3])



/*
/////////////////////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

//Slice
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-4));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

//Splice
arr.splice(-1);
console.log(arr)

arr.splice(1, 2)
console.log(arr)


//Reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//Concat 

const letter = arr.concat(arr2);
console.log(letter);
console.log([...arr, ...arr2]);

//Join

console.log(letter.join(' - '));
*/

/*

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdraw ${Math.abs(movement)}`)
  }
}
console.log('------------------');
//first element, index and array
movements.forEach(function(mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdraw ${Math.abs(mov)}`)
  }
})
*/

//forEach pass current array
//0: function(200)
//1: function(450)
//2: function(400)
// ...


// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// //callback function | value, kay , entire array (map)
// currencies.forEach(function(value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //Set 

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function(value, _, map) {
//   console.log(`${value}: ${value}`);
// })


// console.log(23 === 23.0);

// //Parsing
// console.log(Number.parseInt('30px'))
// console.log(Number.parseFloat('2.5rem'))

// console.log(Number.isNaN(20)) //Not a Number
// console.log(Number.isNaN(+'20X'))


// console.log(Math.sqrt(25));
// console.log(25 ** (1/2));
// console.log(8 ** (1/3));

// console.log(Math.max(5, 18, 23, 11, 2)) //turn maximum value
// console.log(Math.min(5, 18, 23, 11, 2)) //turn minimum value

// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// console.log(Math.trunc(Math.random() *6) +1);

