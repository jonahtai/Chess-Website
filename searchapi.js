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
        const response = await fetch(`http://127.0.0.1:8000/api/search?query=${encodeURIComponent(query)}`);

        if (response.ok) {
            const data = await response.json();
            displayResults(data);
        } else {
            document.getElementById('searchresults').innerHTML = '<div class="result-item" style="flex:1;">Error fetching API</div>';
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