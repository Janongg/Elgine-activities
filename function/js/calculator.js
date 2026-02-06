// Calculator state
let currentInput = '0'; // agstart ti 0 
let previousInput = ''; // store na jay first number tas balin kanto agtype'n ti sumaruno nga num
let operation = null; // Store na jy operator

// Display elements
const numberDisplay = document.getElementById('numberDisplay');
const operatorDisplay = document.getElementById('operatorDisplay');

// Display
function updateDisplay() {
    numberDisplay.textContent = currentInput;
    operatorDisplay.textContent = operation || '';
    
    // Adjust na jay size ti number no ado ikabil na
    if (currentInput.length > 10) {
        numberDisplay.style.fontSize = '1.2em';
    } else if (currentInput.length > 8) {
        numberDisplay.style.fontSize = '1.5em';
    } else {
        numberDisplay.style.fontSize = '1.8em';
    }
}

// Append number wenno ag add ti number
function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) {
        return; // Prevent na jay multiple decimal points
    }
    
    // Ti limit nga number mo nga ikabil ket 12 characters lang
    if (currentInput.length >= 12 && currentInput !== '0') {
        return;
    }
    
    if (currentInput === '0' && number !== '.') { // iprevent na tapno haan nga ag 05 no agtype
        currentInput = number; 
    } else {
        currentInput += number; // tapno agcombine jay number ex type 1 kn 2 ag 12
    }
    
    updateDisplay();
}

// Set operation
function setOperation(op) {
    if (operation !== null) {
        calculate();
    }
    
    previousInput = currentInput;
    currentInput = '0';
    operation = op;
    updateDisplay();
}

// Calculate result
function calculate() {
    if (operation === null || previousInput === '') { // AWan mapasamak to prevent crashing 
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearAll();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    updateDisplay();
}

// Clear na jay last digit (C button)
function clearLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Clear all na (AC button)
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') { // 1-9
        appendNumber(key);
    } else if (key === '.') { //pindoten na jay ag add ti decimal
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        setOperation(key); // prepare na jay calculation
    } else if (key === 'Enter' || key === '=') { // ipakita na jay result
        event.preventDefault(); 
        calculate();
    } else if (key === 'Escape') {
        clearAll(); // Escape clears all number
    } else if (key === 'c' || key === 'C') {
        clearLast(); // C key clears last number
    } else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});
