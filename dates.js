"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2024-01-18T21:31:17.178Z",
    "2024-01-23T07:42:02.383Z",
    "2024-02-28T09:15:04.904Z",
    "2024-02-01T10:17:24.185Z",
    "2024-03-11T14:11:59.604Z",
    "2024-03-13T17:01:17.194Z",
    "2024-03-17T12:36:17.929Z",
    "2024-03-18T10:51:36.790Z",
  ],
  currency: "IND",
  locale: "en-IN", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "IND",
  locale: "en-IN",
};

const accounts = [account1, account2];
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
//FUNCTIONS
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days Ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
const indToUsd = 0.012;
// const totalDeposits = movements
//   //.filter((mov) => mov > 0)
//   .map((mov) => mov * indToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// balanceElement.textContent = totalDeposits.toFixed(4);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements
    .map((mov) => mov * indToUsd)
    .reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
  // labelBalance.textContent=acc.
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  //`₹${Math.floor(incomes).toFixed(1)}`;
  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );
  //`₹${Math.abs(Math.floor(outcomes)).toFixed(1)}`;
  const intrest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((mov, i, arr) => {
      return mov >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(intrest, acc.locale, acc.currency);
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserNames(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const balanceElement = document.querySelector(".balance__value");

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get Started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 120;

  //set timer to 5 min

  //call timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
  //in each call,print remaining time to ui

  //when 0 seconds,stop timer and log out user
};
//EVENT HANDLER
let currentAccount, timer;

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// //EXPERIMENT
// const now = new Date();
// const options = {
//   hour: "numeric",
//   minute: "numeric",
//   day: "numeric",
//   month: "long",
//   year: "numeric",
//   weekday: "long",
// };
// const locale = navigator.language;
// console.log(locale);
// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  //console.log("LOGIN");
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    //current date and time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      //weekday: "long",
    };
    const locale = navigator.language;
    console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //UPDATE UI
    updateUI(currentAccount);
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//PIPELINE
// const indToUsd = 0.012;
// const totalDeposits = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * indToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// balanceElement.textContent = totalDeposits.toFixed(4);

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if ((inputTransferAmount.value = inputTransferTo.value = ""))
    inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(+amount);
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      //ADD Movement
      currentAccount.movements.push(amount);
      //Add loan dates
      currentAccount.movementsDates.push(new Date().toISOString());
      //UPDATE UI
      updateUI(currentAccount);
      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

//console.log(totalDeposits);

//console.log(accounts);

//console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
//let arr = ["a", "b", "c", "d", "e"];
// console.log(arr.slice(2));
// console.log(arr.slice(1, -1));
// console.log(arr.slice(1, -2));
//splice
//console.log(arr.splice(2));
//console.log(arr);
//arr.splice(1, 2);
//console.log(arr);
//Reverse
//const arr2 = ["j", "i", "h", "g", "f"];
//console.log(arr2.reverse());
//concat
// const letters = arr.concat(arr2);
// console.log(letters);
//Join
// console.log(letters.join(" - "));
// const arr = [23, 11, 64];
// console.log(arr.at(0));
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1));
// console.log(arr.at(-1));
// console.log("munna".at(1));
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const [i, movement] of movements) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You Withdrew ${Math.abs(movement)}`);
//   }
// }
// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1} You Withdrew ${Math.abs(movement)}`);
//   }
// });
// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// //set
// const currenciesUnique = new Set(["USD", "GBP", "EUR", "USD", "GBP", "EUR"]);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });
// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrrected = dogsJulia.slice();
//   dogsJuliaCorrrected.splice(0, 1);
//   dogsJuliaCorrrected.splice(-2);
//   const dogsKateCorrrected = dogsKate.slice();
//   dogsKateCorrrected.splice(-2);
//   const dogs = dogsJuliaCorrrected.concat(dogsKateCorrrected);
//   console.log(dogs);

//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult,and is ${dog} year's old`);
//     } else {
//       console.log(
//         `Dog number is less than 3 : {i},and the puppy is ${dog} years old`
//       );
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
//const eurToUsd = 1.1;
//const movementsUsd = movements.map(function (mov) {
//return mov * eurToUsd;
//});
// console.log(movements);
// console.log(movementsUsd);
// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementsUsd = movements.map((mov) => mov * eurToUsd);
// console.log(movements);
// console.log(movementsUsd);
// const movementsDescriptions = movements.map((mov, i) => {
//   `Movement ${i + 1} You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(
//     mov
//   )}`;
// if (mov > 0) {
//   return `Movement ${i + 1} You deposited ${mov}`;
// } else {
//   return `Movement ${i + 1} You Withdrew ${Math.abs(mov)}`;
// }
//});
//console.log(movementsDescriptions);
//filter method
//const deposits = movements.filter((mov) => mov > 0);
// console.log(movements);
//console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);
//const withdrawels=[];
//for (const mov of movements) if (mov < 0) withdrawels.push(mov);
//console.log(withdrawels);
// const withdrawels = movements.filter((mov) => mov < 0);
// console.log(withdrawels);
// console.log(movements);

//reduce method
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + cur;
// }, 0);
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// //Maximum value using reduce
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
//   //console.log(humanAges);
//   const adults = humanAges.filter((age) => age >= 18);
//   console.log(adults);
//   console.log(humanAges);
//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );
//   return average;
// };
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);
// const indToUsd = 0.012;
// const totalDeposits = movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * indToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

//console.log(totalDeposits);
//document.querySelector(".balance__value");
// const balanceElement = document.querySelector(".balance__value");
// const indToUsd = 0.012;
// //PIPELINE
// const totalDeposits = movements
//   //.filter((mov) => mov > 0)
//   .map((mov) => mov * indToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// balanceElement.textContent = totalDeposits.toFixed(4);
// console.log(totalDeposits);
//const calcAverageHumanAge = function (ages) {
// const humanAges = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
// console.log(humanAges);
// const adults = humanAges.filter((age) => age >= 18);
// console.log(adults);
// console.log(humanAges);
// const average = adults.reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// return average;

// const calcAverageHumanAge = (ages) =>
//   ages
//     .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter((age) => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);
// const firstWithdrawel = movements.find((mov) => mov < 0);
// console.log(movements);
// console.log(firstWithdrawel);

// console.log(accounts);
// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(account);
// console.log(movements);
// console.log(movements.includes(-130));
// console.log(movements.some((mov) => mov === -130));
//const anyDeposits = movements.some((mov) => mov > 0);
//console.log(anyDeposits);

//  const indToUsd = 0.012;
//  const totalDeposits = acc.movements
//    .filter((mov) => mov > 0)
//    .map((mov) => mov * indToUsd)
//    .reduce((acc, mov) => acc + mov, 0);
//  balanceElement.textContent = totalDeposits.toFixed(4);
//  updateUI(totalDeposits);

//  //const updateUI = function (acc) {
//    //Display movements
//    displayMovements(acc.movements);
//    //Display balance
//    calcDisplayBalance(acc);
//   // Display summary
//    calcDisplaySummary(acc);
// // };

//  //const calcDisplayBalance = function (acc) {
//    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
//    labelBalance.textContent = `${acc.balance} USD`;
//  //};
//FLAT
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[[1, 2], 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(3));
// const accountMovements = accounts.map((acc) => acc.movements);
// // console.log(accountMovements);
// const allMovements = accountMovements.flat();
// // console.log(allMovements);
// const overalBalance = accounts
//   .map((acc) => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(allMovements);
// console.log(overalBalance);

// const overalBalance2 = accounts
//   .flatmap((acc) => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(allMovements);
// console.log(overalBalance2);
//SORT
//Strings
// const owners = ["Jonas", "Zach", "Adam", "Martha"];
// console.log(owners.sort());
// console.log(movements);

//return <0 A,B
//return >0 B,A
//ASCENDING
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
// console.log(movements);
// movements.sort((a, b) => b - a);
// console.log(movements);
// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));
// const x = new Array(7);
// x.fill(1, 3, 5);
// console.log(x);
// arr.fill(23, 2, 6);
// console.log(arr);
// //Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);
// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);
// const rand = Array.from(
//   { length: 100 },
//   (i) =>
//     //Math.random(i < 6).toFixed(1)
//     Math.trunc(Math.random() * 6) + 1
// );
//console.log(rand);
labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.replace("₹", ""))
  );
  console.log(movementsUI);

  //const movementsUI2 =[...document.querySelectorAll(".movements__value")];
});

const bankDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
//console.log(bankDepositSum);
const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// .filter((mov) => mov >= 1000).length;
// console.log(numDeposits1000);
// let a = 10;
// console.log(a++);
// const { deposits, withdrawals } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       //cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? "deposits" : "withdrawals"] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);
//TITLE
// const convertTitleCase = function (title) {
//   const captilaize = (str) => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ["a", "an", "and", "the", "but", "or", "on", "in", "with"];
//   const titleCase = title
//     .toLowerCase()
//     .split(" ")
//     .map((word) => (exceptions.includes(word) ? word : captilaize(word)))
//     .join(" ");
//   return captilaize(titleCase);
// };
// console.log(convertTitleCase("here is or a nice title"));
// console.log(convertTitleCase("Another nice title"));
// console.log(convertTitleCase("and Finishing another nice title"));
// const dogs = [
//   { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
//   { weight: 8, curFood: 200, owners: ["Matilda"] },
//   { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
//   { weight: 32, curFood: 340, owners: ["Michael"] },
// ];

// const dog = dogs.forEach(
//   (dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28))
// );
// //console.log(dog);

// //2
// const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));

// console.log(dogSarah);
// console.log(`
//      Sarah's dog is eating too ${
//        dogSarah.curFood > dogSarah.recFood ? "Too much" : "Little"
//      }
//      }
// `);

// const ownersEatTooMuch = dogs
//   .filter((dog) => dog.curFood > dog.recFood)
//   .flatMap((dog) => dog.owners);
// console.log(ownersEatTooMuch);
// const ownersEatTooLittle = dogs
//   .filter((dog) => dog.recFood > dog.curFood)
//   .flatMap((dog) => dog.owners);
// console.log(ownersEatTooLittle);

// console.log(`${ownersEatTooMuch.join(" and ")}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(" and ")}'s dogs eat too little`);

// console.log(dogs.some((dog) => dog.curFood === dog.recFood));
// const checkEatingOkay = (dog) =>
//   dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;
// console.log(dogs.some(checkEatingOkay));

// //console.log(dogs.filter(checkEatingOkay));
// const dogsCopy = dogs.slice().sort((a, b) => a.recFood - b.recFood);
// console.log(dogsCopy);
// // 1.
// dogs.forEach((dog) => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

// // 2.
// const dogSarah = dogs.find((dog) => dog.owners.includes("Sarah"));
// console.log(dogSarah);
// console.log(
//   `Sarah's dog is eating too ${
//     dogSarah.curFood > dogSarah.recFood ? "much" : "little"
//   } `
// );

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

// console.log(23 === 23.0);
// console.log(1 === 1.0);
// console.log(Number("23"));
// console.log(+23);
// //Parsing
// console.log(Number.parseInt("330px", 10));
// console.log(Number.parseInt("e23", 10));
// console.log(Number.parseFloat("2.5rem"));
// console.log(parseFloat("2.5rem"));
// console.log(Number.isNaN(+"20"));
// console.log(Number.isFinite("20"));

//floor====trunc
//round .5
//ceil +1
//floor - +1

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(Math.max(5, 18, "23.0", 11, 2));
// console.log(Math.PI * Number.parseFloat("10px") ** 2);
// console.log(Math.trunc(Math.random() * 6) + 1);
// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20));
// console.log(Math.round(23.5));
// console.log(Math.ceil(23.4));
// console.log((2.7).toFixed(0));
// console.log(+(2.345).toFixed(2));
// console.log(5 % 2);
// console.log(5 / 2);
// const isEven = (n) => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(9));
// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = "orangered";
//     if (i % 3 === 0) row.style.backgroundColor = "blue";
//   });
// });

//2,87,654
// const diameter = 567764323456747;
// console.log(diameter);
// const price = 345_99;
// console.log(price);
// const transferFee = 15_00;
// const PI = 3.1415;
// console.log(Number("2300000"));
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(98654345654567787654323678n);
// console.log(BigInt(4363426389231));
// //operations
// const huge = 109468371560543556n;
// const num = 23;
// console.log(huge * BigInt(num));
// console.log(10n / 3n);
//Date
// const now = new Date();
// console.log(now);
// console.log(new Date("Aug 02 2020 18:05:41"));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 10, 19, 15, 23, 5));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// console.log(future);
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(Date.now());
// future.setFullYear(2040);
// console.log(future);
// const future = new Date(2037, 10, 19, 15, 23, 20);
// console.log(+future);
// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
// console.log(days1);
// const num = 3884764.23;
// const options = {
//   style: "unit",
//   unit: "celsius",
//   currency: "USD",
// };
// console.log("US", new Intl.NumberFormat("en-US", options).format(num));
// console.log("Germany:", new Intl.NumberFormat("de-DE", options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language, options).format(num)
// );
//Asynchronous JS
//Set timer
// const ingredients = ["olives", "spinach"];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your Pizza 🍕 With ${ing1} and ${ing2}`),
//   2000,
//   ...ingredients
// );

// if (ingredients.includes("spinach")) clearTimeout(pizzaTimer);
// //set Timeout
// setInterval(function () {
//   const now = new Date();
//   const hours = String(now.getHours()).padStart(2, "0");
//   const minutes = String(now.getMinutes()).padStart(2, "0");
//   const seconds = String(now.getSeconds()).padStart(2, "0");
//   console.log(`${hours}:${minutes}:${seconds}`);
// }, 3000);
