// scripts/study.js - FULLY UPDATED AND CLEANED UP

document.addEventListener('DOMContentLoaded', () => {
    const summariesList = document.getElementById('summaries-list');
    const modal = document.getElementById('study-modal');
    const modalContent = document.getElementById('modal-summary-content');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- Modal Handlers ---

    /**
     * Shows the modal and populates it with the study data.
     */
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

    /**
     * Hides the modal.
     */
    function hideModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Add event listeners for closing the modal
    closeModalBtn.addEventListener('click', hideModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // --- Summary Formatting ---

    /**
     * Converts plain text with basic newlines and **bold** formatting into HTML paragraphs.
     */
    function formatSummaryText(text) {
        if (!text) return '';
        
        let html = text;

        // 1. Convert **Bold** into <strong> Bold </strong>
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 2. Convert double newlines (new paragraph) into closing/opening paragraph tags
        html = html.replace(/(\r\n|\r|\n){2,}/g, '</p><p>');

        // 3. Convert single newlines (line break) into <br> tags
        html = html.replace(/(\r\n|\r|\n)/g, '<br>');

        // 4. Wrap the whole thing in a div and starting <p> tag
        return `<div class="content-wrapper"><p>${html}</p></div>`;
    }

    // --- Summary Card Creation ---

    /**
     * Creates an HTML card element with minimal information for the tile view.
     */
    function createSummaryCard(study) {
        const card = document.createElement('div');
        card.className = 'summary-card';
        
        // Direct access to new fields: portion and title
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

    // --- Data Loading ---

    async function loadSummaries() {
        try {
            const response = await fetch('study.json'); 
            
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

    // Start the loading process
    loadSummaries();
});