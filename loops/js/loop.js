const output = document.getElementById("output");

function clearOutput(title) {
    output.textContent = title + "\n--------------------\n"
}

function forLoop() {
    clearOutput("FOR LOOP");
    for (let i = 1; i <= 5; i++ ) {
        output.textContent += `Count: ${i}\n`;
    }
}

function whileLoop() {
    clearOutput("WHILE LOOP");
    let i = 1; 
    while (i <= 5) {
        output.textContent += `Count: ${i}\n`;
        i++;
    }
}

function doWhileLoop() {
    clearOutput("DO...WHILE LOOP");
    let i = 1; 
    do {
        output.textContent += `Count: ${i}\n`;
        i++;
    } while (i <= 5);
}

function forOfLoop() {
    clearOutput("FOR...OF LOOP");
    const fruits = ["Apple", "Banana", "Mango"];
    for (const fruit of fruits) {
        output.textContent += fruit + "\n";
    }
}

function  forInLoop() {
    clearOutput("FOR...IN LOOP");
    const person = {
        name: "Juan",
        age: 21,
        course: "IT"
    };
    for (const key in person ) {
        output.textContent += `${key}: ${person[key]}\n`;
    }
}

function forEachLoop() {
    clearOutput("FOREACH LOOP");
    const numbers = [10, 20, 30];
    numbers.forEach((num, index) => {
        output.textContent += `index ${index}: ${num}\n`;
    });
}