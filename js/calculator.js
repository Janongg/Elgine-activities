function press(val) {
    var display = document.getElementById('screen');
    display.value = display.value + val;
}

function allClear() {
    var display = document.getElementById('screen');
    display.value = "";
}