document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.getElementById('announcements-container');
    const announcementFiles = [
        'announcements/weekly.html',
        ''
    ];

    async function loadAnnouncements() {
        for (const file of announcementFiles) {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for ${file}`);
                }
                const htmlContent = await response.text();
                announcementsContainer.insertAdjacentHTML('beforeend', htmlContent);
            } catch (error) {
                console.error('Error loading announcement:', error);
            }
        }
        applyRevealEffect();
    }

    function applyRevealEffect() {
        const revealElements = document.querySelectorAll('.announcement-item');
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of item visible to trigger
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    loadAnnouncements();
});