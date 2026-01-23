function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username.length === 0) {
        alert("Muttaleng awan password ken username mo");
    }

    if((username === 'admin') && (password === '12345')) {
        alert('Wow haan na nalipatan');
    }
}