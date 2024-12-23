let debounceTimeout;


// search function
async function search() {
    const query = document.getElementById('search-input').value.trim()
    clearTimeout(debounceTimeout);

    // checks to see if the search bar is empty
    if (query.length == 0) {
        document.getElementById('searchresults').innerHTML = '';
        return;
    }

    debounceTimeout = setTimeout(async() => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/search?query=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                displayResults(data);
            } else {
            document.getElementById('searchresults').innerHTML = `<div class="result-item" style="flex:1;">Error fetching API: ${response.status} ${response.statusText}</div>`;
            } 
        } catch (error) {
            document.getElementById('searchresults').innerHTML = '<div class="result-item" style="flex:1;">Error contacting server</div>';
        }
    }, 400);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('searchresults');
    resultsDiv.innerHTML = '';

    if (results.length > 0) {
        results.forEach(item => {
            const div = document.createElement('div');
            div.className = 'result-item';

            div.innerHTML = `
                <div class="name"><a href="${item.link}" target="_blank">${item.name}</a></div>
                <div class="school">School: ${item.school}</div>
                <div class="uscfid">USCF ID: ${item.uscfid}</div>
                <div class="rating">Rating: ${item.rating}</div>
                `
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.innerHTML = '<div class="result-item" style="flex: 1;">No results found</div>';
    }
}

async function getLeaderboard() {
    const MIN = 0;
    const MAX = 3000;
    const maximumRating = document.getElementById("maxrating").value || MAX;
    const minimumRating = document.getElementById("minrating").value || MIN;
    const schools = window.schools;
    const table = document.getElementById("leaderboard");

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/leaderboard?schools=${encodeURIComponent(schools)}&minRating=${encodeURIComponent(minimumRating)}&maxRating=${encodeURIComponent(maximumRating)}`);
        if (response.ok) {
            const lbdata = await response.json();
            displayTable(lbdata);
        } else {
            console.log(response.status);
        }
    } catch (error) {
        table.innerHTML = 'ERROR CONTACTING SERVER';
    }
}
function displayTable(data) {
    const table = document.getElementById("leaderboard");
    table.innerHTML = `
            <tr>
                <th style='width: 8rem;'>Rank</th>
                <th style='width: 20rem;'>Player</th>
                <th style='width: 20rem;'>School</th>
                <th style='width: 8rem;'>Rating</th>
            </tr>
            `

    if (data.length > 0) {
        let i = 1;
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="centered">${i}</td>
                <td><a href="${item.link}" target="_blank" style="text-decoration: none;"><strong>${item.name}</strong></a></td>
                <td>${item.school}</td>
                <td class="centered">${item.rating}</td>
            `
            i++;
            table.appendChild(row);
        });
    }
}
