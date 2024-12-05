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