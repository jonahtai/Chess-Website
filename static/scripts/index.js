window.schools = [];

function hasFocusWithin(element) {
    const activeElement = document.activeElement;
    return element.contains(activeElement);
}

function toggleMenu() {
    const searchbuttons = document.getElementById('searchbuttons');
    const hamburger = document.getElementById('hamburger');

    // Toggle the 'active' class for both the nav links and the hamburger icon
    searchbuttons.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    // dropdown.style.opacity = dropdown.style.display === '1' ? '0' : '1';  maybe fix this johnson later
}

function closeDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.style.display = 'none';
}

function updateSchool(school) {
    let index = schools.indexOf(school);
    if (index === -1) {
        schools.push(school);
    } else {
        schools.splice(index, 1);
    }
    updateFilters();
}

function updateFilters() {
    const filterlist = document.getElementById('filtercontainer');
    var filterlistHTML = '';
    for (const school of schools) {
        filterlistHTML += `<div class="filterchip">${school}<button onclick="removeFilter(this)"class="idbutton"><strong>x</strong></button></div>`;
    }
    filterlist.innerHTML = filterlistHTML;
}

function removeFilter(button) {
    let index = schools.indexOf(button.parentElement.textContent - 'x')
    const chip = button.parentElement;
    schools.splice(index, 1)
    chip.remove();
}