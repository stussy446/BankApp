'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${movement}₤</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => (acc += cur), 0);

  labelBalance.textContent = `${acc.balance} EURO`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const calcDisplaySummary = function (account) {
  const depositTotal = account.movements
    .filter(movement => movement > 0)
    .reduce((acc, cur) => (acc += cur), 0);

  const withdrawalTotal = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, cur) => (acc += cur), 0);

  labelSumIn.textContent = `${depositTotal}₤`;
  labelSumOut.textContent = `${withdrawalTotal}₤`;

  const interest = account.movements
    .filter(movement => movement > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, int) => (acc += int));

  labelSumInterest.innerHTML = `${interest}₤`;
};

createUsernames(accounts);

/*
-----------------------------------------
Event Handler to handle logging in
-----------------------------------------
*/
let currentAccount;

const updateUI = function () {
  displayMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // find user
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 1;

    updateUI();
  }
});

/*
-----------------------------------------
Event Handler to handle transferring
-----------------------------------------
*/
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  if (
    currentAccount.balance - amount >= 0 &&
    transferTo?.username != currentAccount.use
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    currentAccount.balance -= amount;
    transferTo.balance += amount;

    updateUI();
  }
});

/*
-----------------------------------------
Event Handler to handle closing accounts
-----------------------------------------
*/
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (currentAccount.username === user && currentAccount.pin === pin) {
    const index = accounts.findIndex(acc => acc.username === user);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

/*
-----------------------------------------
Event Handler to handle loans
-----------------------------------------
*/
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    // do the loan
    currentAccount.movements.push(loanAmount);
    updateUI();

    inputLoanAmount.value = '';
  }
});

/*
-----------------------------------------
Event Handler to handle sorting
-----------------------------------------
*/
let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
