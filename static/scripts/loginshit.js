let debounceTimeout;

async function login() {
    const hidden = document.getElementById("hidden");
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
        hidden.style.display = "flex";
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
    const hidden = document.getElementById("hidden");
    const loginform = document.getElementById("loginform");
    const response = await fetch('https://checkchesser.com/api/secure/logout', { method: "POST" });
    const result = await response.json();
    alert(result.message);

    loginform.style.display = 'block';
    hidden.style.display = 'none';
}

async function sendUpdate(event) {
    event.preventDefault();
    const statusbar = document.getElementById('chingabar');
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const school = document.getElementById('schoolselector').value;
    const ID = document.getElementById('ID').value;

    statusbar.innerHTML = '';

    if (ID.toString().length !== 8 || firstname == '' || lastname == '') {
        console.log('bruh');
        statusbar.innerHTML = `<p style='color: red;'>ID must be 8 digits</p>`;
        return false;
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
        if (response.status == 401) {
            statusbar.innerHTML = `<p style='color: red;'>Unauthorized</p>`
        }
    } catch (error) {
        statusbar.innerHTML = `<p style='color: red;'>Error contacting server</p>`;
    }
}

async function search() {
    const query = document.getElementById('playersearch').value.trim()
    clearTimeout(debounceTimeout);

    // checks to see if the search bar is empty
    if (query.length == 0) {
        document.getElementById('searchform').innerHTML = '';
    }

    debounceTimeout = setTimeout(async() => {
        try {
            const response = await fetch(`https://checkchesser.com/api/search?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                displayResults(data);
            } else {
            document.getElementById('searchresults').innerText = `Error: ${response.status} ${response.statusText}`;
            } 
        } catch (error) {
            document.getElementById('searchresults').innerText = 'Error contacting server';
        }
    }, 400);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('searchresults');
    resultsDiv.innerHTML = '';

    if (results.length > 0) {
        results.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `<button onclick='fillresults(${item.uscfid}, "${item.name}", "${item.school}", ${item.rating}, ${item.rowid})'>${item.name}: ${item.uscfid}</button>`
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.innerHTML = '<div class="result-item" style="flex: 1;">No results found</div>';
    }
}

function fillresults(id, name, school, rating, rowid) {
    const ratingjawn = document.getElementById('ratingjawn');
    const schoolselector = document.getElementById('editschoolselector');
    const idinput = document.getElementById('uscf');
    const firstnameinput = document.getElementById('first');
    const lastnameinput = document.getElementById('last');
    const rowidbox = document.getElementById('rowid');
    const resultsDiv = document.getElementById('searchresults');
    resultsDiv.innerHTML = '';

    const firstlast = name.split(' ');
    const firstname = firstlast[0];
    const lastname = firstlast[1];

    rowidbox.value = rowid;
    firstnameinput.value = firstname;
    lastnameinput.value = lastname;
    idinput.value = id;
    schoolselector.value = school;
    ratingjawn.value = rating;
}

async function updateEntry() {
    const rating = document.getElementById('ratingjawn').value;
    const school = document.getElementById('editschoolselector').value;
    const id = document.getElementById('uscf').value;
    const firstname = document.getElementById('first').value;
    const lastname = document.getElementById('last').value;
    const rowid = document.getElementById('rowid').value;
    const resultsdiv = document.getElementById('result');


    try {
        const response = await fetch('https://checkchesser.com/api/secure/updateentry', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                ID: id, 
                school: school,
                rating: rating,
                rowid: rowid
            })
        });
        const result = await response.json();
        if (response.ok) {
            resultsdiv.innerText = result.message;
        } else {
            resultsdiv.innerText = 'sumting wong';
        }

    } catch (error) {
        resultsdiv.innerText = 'cant connect johnson';
        return;
    }
}