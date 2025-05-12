// DOM element selections
const numbers = document.querySelectorAll('.numbers');
const result = document.querySelector('.result');
const allClear = document.querySelector('.ac');
const clear = document.querySelector('.c');
const equals = document.querySelector('.total');
const operators = document.querySelectorAll(".tools");
const decimalPoint = document.querySelector(".float");

// State flags
let isOperatorAllowed = true;
let isDecimalAllowed = true;


// Handle number button clicks
numbers.forEach((numberButton) => {
    numberButton.addEventListener('click', (e) => {
        const clickedNumber = e.target.name;

        if (result.value === "0") {
            result.value = clickedNumber;
        } else {
            result.value += clickedNumber;
        }

        isOperatorAllowed = true;
    });
});


//Handle operator button clicks (+, -, *, /, %)

operators.forEach((operatorButton) => {
    operatorButton.addEventListener('click', (e) => {
        const clickedOperator = e.target.name;

        if (isOperatorAllowed) {
            result.value += clickedOperator;
        } else {
            result.value = result.value.slice(0, -1) + clickedOperator;
        }

        isOperatorAllowed = false;
        isDecimalAllowed = true;
    });
});


// Handle decimal point button click

decimalPoint.addEventListener('click', () => {
    if (isOperatorAllowed && isDecimalAllowed) {
        result.value += decimalPoint.name;
        isDecimalAllowed = false;
    }
});


// Handle All Clear (AC) button click

allClear.addEventListener('click', () => {
    result.value = "0";
    isOperatorAllowed = true;
    isDecimalAllowed = true;
});


// Handle Clear (C) button click - removes last character
clear.addEventListener('click', () => {
    if (result.value.length === 1) {
        result.value = "0";
    } else {
        const lastChar = result.value.slice(-1);
        result.value = result.value.slice(0, -1);
        if (lastChar === '.') {
            isDecimalAllowed = true;
        }
        const lastCharAfterDelete = result.value.slice(-1);
        isOperatorAllowed = !isOperator(lastCharAfterDelete);
    }
});


//Handle equals button click - calculate the result
equals.addEventListener('click', calculateResult);


//Handle keyboard input

window.addEventListener("keydown", (event) => {
    const key = event.key;

    // Handle number keys
    if (!isNaN(parseInt(key))) {
        if (result.value === "0") {
            result.value = key;
        } else {
            result.value += key;
        }
        isOperatorAllowed = true;
    }

    // Handle operator keys
    if (['+', '-', '*', '/', '%'].includes(key)) {
        if (isOperatorAllowed) {
            result.value += key;
        } else {
            result.value = result.value.slice(0, -1) + key;
        }
        isOperatorAllowed = false;
        isDecimalAllowed = true;
    }

    // Handle decimal point
    if (key === '.') {
        if (isOperatorAllowed && isDecimalAllowed) {
            result.value += key;
            isDecimalAllowed = false;
        }
    }

    // Handle backspace
    if (key === "Backspace") {
        if (result.value.length === 1) {
            result.value = "0";
        } else {
            const lastChar = result.value.slice(-1);
            result.value = result.value.slice(0, -1);

            if (lastChar === '.') {
                isDecimalAllowed = true;
            }

            const lastCharAfterDelete = result.value.slice(-1);
            isOperatorAllowed = !isOperator(lastCharAfterDelete);
        }
    }

    // Handle equals/enter
    if (key === "=" || key === "Enter") {
        calculateResult();
    }
});

function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}


//Calculate and display the result of the expression

function calculateResult() {
    try {
        const calculatedResult = new Function('return ' + result.value)();

        if (Number.isFinite(calculatedResult)) {
            result.value = Number(calculatedResult.toFixed(10)).toString();
        } else {
            result.value = "Error";
        }
    } catch (error) {
        result.value = "Error";
    }
}