document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('announcement-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const openBtn = document.getElementById('open-announcements-btn');

    // Check if the modal has been shown in this session
    const hasShown = sessionStorage.getItem('announcementModalShown');

    if (!hasShown) {
        modal.classList.add('active');
        sessionStorage.setItem('announcementModalShown', 'true');
    }

    // Close the modal when the close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Open the modal manually with the header button
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Close the modal if the user clicks outside of it
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});



