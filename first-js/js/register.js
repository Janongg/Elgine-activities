function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    const error = document.getElementById('error')

    if(username.length === 0 && password.length === 0) {
        error.innerHTML = "Username and password is required"
        error.style.visibility = "visible"
    }

    else if(username.length === 0) {
        alert("Username required");
    }

    else if(password.length === 0) {
        alert("Password required");
    }

    else if(confirm.length === 0) {
        alert("confirm password required");
    }

    else if(password !== confirm) {
        alert('Password mismatch');
    }

    else {
        alert('Registered successfully');
    }
}