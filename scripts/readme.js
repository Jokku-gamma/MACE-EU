document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('posts-grid');
    const articleContainer = document.getElementById('article-container');

    // --- CACHE BUSTER STRATEGY ---
    // We add ?v=TIMESTAMP to the URL.
    // This makes every request unique, so the browser CANNOT use the old cached version.
    const jsonUrl = `./data/gospel.json?v=${new Date().getTime()}`;

    // 1. Fetch the data with headers to forbid caching
    fetch(jsonUrl, { 
        cache: "no-store",
        headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return response.json();
    })
    .then(data => {
        // Determine which page we are on
        if (articleContainer && window.location.search.includes('id=')) {
            // If URL has ?id=..., we are in "View Mode" (assuming you reused the layout)
            // Or if you are using readme-view.html, check for that ID there.
            // Based on your previous code, this logic handles both scenarios if IDs exist.
            if (document.getElementById('article-container')) {
                 // Check if we are meant to be viewing an article
                 const params = new URLSearchParams(window.location.search);
                 if(params.get('id')) {
                     if(grid) grid.style.display = 'none'; // Hide grid if showing article
                     loadArticle(data);
                 } else if (grid) {
                     renderGrid(data);
                 }
            }
        } else if (grid) {
            renderGrid(data);
        }
    })
    .catch(error => {
        console.error("Error loading resources:", error);
        if (grid) grid.innerHTML = `<p style="text-align:center; color:red;">Error loading content. Please try again later.</p>`;
    });
});

// Logic for readme.html (The List)
function renderGrid(posts) {
    const container = document.getElementById('posts-grid');
    if (!container) return;

    container.innerHTML = posts.map(post => `
        <div class="post-card" onclick="window.location.href='readme-view.html?id=${post.id}'">
            <div class="card-image" style="background-image: url('${post.banner}');">
                <span class="tag ${post.type}" style="
                    position: absolute; top: 15px; right: 15px; 
                    background: rgba(0,0,0,0.7); color: white; 
                    padding: 5px 10px; border-radius: 20px; 
                    font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">
                    ${post.type}
                </span>
            </div>
            <div class="card-content" style="padding: 20px;">
                <h3 style="margin: 0 0 10px; color: #333;">${post.title}</h3>
                <div class="meta" style="font-size: 0.85rem; color: #777; display: flex; justify-content: space-between;">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${post.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Logic for readme-view.html (The Single Page)
function loadArticle(posts) {
    const container = document.getElementById('article-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const post = posts.find(p => p.id === postId);

    if (!post) {
        container.innerHTML = "<h1>Post not found</h1>";
        return;
    }

    // Handle Media Embeds
    let mediaHTML = '';
    if(post.mediaType === 'youtube') {
        mediaHTML = `<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; margin-bottom: 30px;">
            <iframe src="${post.mediaUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>`;
    } else if (post.mediaType === 'pdf') {
        mediaHTML = `<div class="pdf-container"><embed src="${post.mediaUrl}" width="100%" height="600px" type="application/pdf"></div>`;
    } else if (post.mediaType === 'image') {
        mediaHTML = `<img src="${post.mediaUrl}" class="feature-image" style="width: 100%; height: auto; border-radius: 10px; margin-bottom: 30px;" alt="Resource">`;
    }

    // Render the beautiful page
    const html = `
        <header class="article-header" style="text-align: center; margin-bottom: 40px;">
            <h1 class="entry-title" style="font-size: 2.5rem; color: #222; margin-bottom: 15px;">${post.title}</h1>
            <div class="entry-meta">
                Posted by <strong>${post.author}</strong> on ${post.date}
            </div>
            <button class="share-btn" onclick="copyLink()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-share-alt"></i> Share this
            </button>
        </header>

        <div class="entry-body" style="max-width: 800px; margin: 0 auto; line-height: 1.8; color: #444;">
            ${mediaHTML}
            <div class="text-content">
                ${post.content}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
}