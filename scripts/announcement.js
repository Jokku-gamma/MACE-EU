// scripts/announcement_bell.js

document.addEventListener('DOMContentLoaded', () => {
    const bellNotificationTrigger = document.getElementById('bellNotificationTrigger');
    const announcementContentFixed = document.getElementById('announcementContentFixed');
    const closeAnnouncementButton = announcementContentFixed.querySelector('.close-announcement-button');
    const notificationBadge = document.getElementById('notificationBadge');

    // Function to show the announcement content pop-up
    function showAnnouncementContent() {
        announcementContentFixed.classList.add('is-open');
        // Hide badge when the notification pop-up is opened
        if (notificationBadge) {
            notificationBadge.style.display = 'none';
        }
    }

    // Function to hide the announcement content pop-up
    function hideAnnouncementContent() {
        announcementContentFixed.classList.remove('is-open');
    }

    // Toggle announcement content when bell icon is clicked
    bellNotificationTrigger.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        if (announcementContentFixed.classList.contains('is-open')) {
            hideAnnouncementContent();
        } else {
            showAnnouncementContent();
        }
    });

    // Close announcement content when close button is clicked
    closeAnnouncementButton.addEventListener('click', hideAnnouncementContent);

    // Optional: Auto-show the announcement pop-up on page load after a delay (like a cookie consent)
    // If you want it to pop up automatically the first time a user visits.
    setTimeout(() => {
        showAnnouncementContent();
    }, 2500); // Shows after 2.5 seconds

    // Close if user clicks anywhere else on the page (outside the announcement box or bell)
    document.addEventListener('click', (e) => {
        // Check if the click was outside the announcement box AND outside the bell trigger
        if (announcementContentFixed.classList.contains('is-open') &&
            !announcementContentFixed.contains(e.target) &&
            !bellNotificationTrigger.contains(e.target)) {
            hideAnnouncementContent();
        }
    });

    // --- IMPORTANT FOR PERMANENT BELL VISIBILITY ---
    // Make the notification badge visible if there are announcements loaded in the pop-up initially.
    // This ensures the badge is there if you expect notifications on page load.
    // The '2' in the badge HTML will be displayed initially.
    if (notificationBadge && announcementContentFixed.querySelectorAll('.announcement-item').length > 0) {
        notificationBadge.style.display = 'block';
    }
});