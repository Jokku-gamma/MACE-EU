// scripts/study.js

document.addEventListener('DOMContentLoaded', () => {
    const summariesList = document.getElementById('summaries-list');
    const modal = document.getElementById('study-modal');
    const modalContent = document.getElementById('modal-summary-content');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- Modal Handlers ---
    function showModal(study) {
        const formattedSummary = formatSummaryText(study.summary);
        
        modalContent.innerHTML = `
            <h2 class="modal-title">${study.title}</h2>
            <div class="modal-meta">
                <p><strong>Portion:</strong> ${study.portion}</p>
                <p><strong>Date:</strong> ${study.date_display}</p>
                <p><strong>Speaker:</strong> ${study.speaker}</p>
            </div>
            <div class="modal-members">
                <h4>Members Present:</h4>
                <p>${study.members || 'N/A'}</p>
            </div>
            <hr class="summary-divider">
            <div class="full-summary-text">
                ${formattedSummary}
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    closeModalBtn.addEventListener('click', hideModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // --- Summary Formatting ---
    function formatSummaryText(text) {
        if (!text) return '';
        let html = text;
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(\r\n|\r|\n){2,}/g, '</p><p>');
        html = html.replace(/(\r\n|\r|\n)/g, '<br>');
        return `<div class="content-wrapper"><p>${html}</p></div>`;
    }

    // --- Summary Card Creation ---
    function createSummaryCard(study) {
        const card = document.createElement('div');
        card.className = 'summary-card';
        
        const portion = study.portion || 'N/A';
        const title = study.title || 'No Title';

        card.innerHTML = `
            <div class="tile-info">
                <p><strong>Date:</strong> ${study.date_display}</p>
                <p><strong>Portions:</strong> ${portion}</p>
                <p><strong>Speaker:</strong> ${study.speaker}</p>
            </div>
            <button class="btn primary-btn view-summary-btn">See Summary</button>
        `;

        const viewButton = card.querySelector('.view-summary-btn');
        viewButton.addEventListener('click', (e) => {
            e.preventDefault();
            showModal(study);
        });

        return card;
    }

    // --- Data Loading (Updated for No-Cache) ---
    async function loadSummaries() {
        try {
            // FIXED: Added timestamp to URL to prevent caching
            const noCacheUrl = `study.json?t=${new Date().getTime()}`;
            
            const response = await fetch(noCacheUrl, {
                cache: "no-store" // Explicitly tell fetch not to cache
            }); 
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const studies = await response.json();
            
            summariesList.innerHTML = ''; 
            studies.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (studies.length > 0) {
                studies.forEach(study => {
                    summariesList.appendChild(createSummaryCard(study));
                });
            } else {
                summariesList.innerHTML = '<p>No study summaries are currently available. Check back soon!</p>';
            }

        } catch (error) {
            console.error('Failed to load study summaries:', error);
            summariesList.innerHTML = `<p class="error-message">Error loading summaries: ${error.message}. Please try again later.</p>`;
        }
    }

    loadSummaries();
});