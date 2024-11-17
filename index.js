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
            displayResults(data.results);
        } else {
            console.error("Error fetching search results");
        }
    }, 300);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('searchresults');
    resultsDiv.innerHTML = '';

    if (results.length > 0) {
        results.forEach(name => {
            const div = document.createElement('div');
            div.className = 'result-item';
            div.textContent = name;
            resultsDiv.appendChild(div);
        });
    } else {
        resultsDiv.innerHTML = '<div class="result-item">No results found</div>';
    }
}