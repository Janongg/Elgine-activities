async function getData() {
    const response = await fetch(
        'http://localhost/api/student-list.php'
    );
    const data = await response.json();
    console.log(data);
}

async function submitData() {
    const data = {
        username: 'admin',
        password: 'admin123'
    }
    const response =
        await fetch(
            'http://localhost/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const resData = await response.json();
            console.log(resData.success);
}