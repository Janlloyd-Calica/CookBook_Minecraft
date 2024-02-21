document.addEventListener('DOMContentLoaded', function() {
    // Find the "Cook Book" title element
    var cookBookTitle = document.querySelector('.title');

    // Add a click event listener to the "Cook Book" title
    cookBookTitle.addEventListener('click', function() {
        // Redirect to the specified HTML file
        window.location.href = 'craft.html';
    });
});
