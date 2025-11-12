document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('open-announcements-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('announcement-modal');

    if (openModalBtn) {
        openModalBtn.addEventListenker('click', () => {
            modal.classList.add('is-visible');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('is-visible');
        });
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('is-visible');
            }
        });
    }
});