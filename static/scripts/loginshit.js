async function login() {
    const updateform = document.getElementById("updateform");
    const loginform = document.getElementById("loginform");
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const challenge = await getChallenge(username);
    const statusbar = document.getElementById("statusbar");

    const encoder = new TextEncoder();
    const passwordChallenge = password + challenge;
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(passwordChallenge));
    const responseHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    try {
        const response = await fetch('https://checkchesser.com/api/secure/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, response: responseHash}),
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401) {
                statusbar.innerText = 'Username or password is incorrect';
            } else {
                statusbar.innerText = `Error: ${response.statusText}`;
            }
            return; // Exit the function to prevent further processing
        }

        const result = await response.json();
        updateform.style.display = "block";
        loginform.style.display = "none";
        statusbar.innerText = '';
    } catch (error) {
        statusbar.innerText = "Error contacting server, try again later";
    }
}

async function getChallenge(username) {
    try{
        const response = await fetch('https://checkchesser.com/api/secure/challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });
        const data = await response.json();
        return data.challenge;
    } catch (error) {
        document.getElementById('statusbar').innerText = "Error contacting server, try again later";
        return;
    }
}

async function logout() {
    const response = await fetch('https://checkchesser.com/api/secure/logout', { method: "POST" });
    const result = await response.json();
    alert(result.message);

    loginform.style.display = 'block';
    updateform.style.display = 'none';
}

async function sendUpdate(event) {
    event.preventDefault();
    const statusbar = document.getElementById('chingabar');
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const school = document.getElementById('schoolselector').value;
    const ID = document.getElementById('ID').value;

    if (ID > 99999999 || firstname == '' || lastname == '') {
        statusbar.innerHTML = `<p style='color: red;'>Sum ting wong</p>`;
    } 
    
    try {
        const response = await fetch('https://checkchesser.com/api/secure/update', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                ID: ID,
                school: school
            })
        });
        const result = await response.json()
        if (response.ok) {
            statusbar.innerHTML = `<p style='color: green;'>Database updated</p>`;
        } 
        if (response.status == 400) {
            statusbar.innerHTML = `<p style='color: red;'>${result.message}</p>`;
        }
    } catch (error) {
        statusbar.innerHTML = `<p style='color: red;'>Error contacting server</p>`;
    }
}