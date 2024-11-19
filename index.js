function toggleMenu() {
    const searchbuttons = document.getElementById('searchbuttons');
    const hamburger = document.getElementById('hamburger');

    // Toggle the 'active' class for both the nav links and the hamburger icon
    searchbuttons.classList.toggle('active');
    hamburger.classList.toggle('active');
}