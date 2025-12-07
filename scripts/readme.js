document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('posts-grid');
    const articleContainer = document.getElementById('article-container');

    // 1. Fetch the data
    fetch('../gospel.json')
        .then(response => response.json())
        .then(data => {
            // Determine which page we are on
            if (grid) {
                renderGrid(data);
            } else if (articleContainer) {
                loadArticle(data);
            }
        });
});

// Logic for readme.html (The List)
function renderGrid(posts) {
    const container = document.getElementById('posts-grid');
    container.innerHTML = posts.map(post => `
        <div class="post-card" onclick="window.location.href='readme-view.html?id=${post.id}'">
            <div class="card-image" style="background-image: url('${post.banner}')">
                <span class="tag ${post.type}">${post.type.toUpperCase()}</span>
            </div>
            <div class="card-content">
                <h3>${post.title}</h3>
                <div class="meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${post.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Logic for readme-view.html (The Single Page)
function loadArticle(posts) {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    const post = posts.find(p => p.id === postId);

    if (!post) {
        document.getElementById('article-container').innerHTML = "<h1>Post not found</h1>";
        return;
    }

    // Handle Media Embeds
    let mediaHTML = '';
    if(post.mediaType === 'youtube') {
        mediaHTML = `<div class="video-container"><iframe src="${post.mediaUrl}" frameborder="0" allowfullscreen></iframe></div>`;
    } else if (post.mediaType === 'pdf') {
        mediaHTML = `<div class="pdf-container"><embed src="${post.mediaUrl}" width="100%" height="600px" type="application/pdf"></div>`;
    } else if (post.mediaType === 'image') {
        mediaHTML = `<img src="${post.mediaUrl}" class="feature-image" alt="Resource">`;
    }

    // Render the beautiful page
    const html = `
        <header class="article-header">
            <h1 class="entry-title">${post.title}</h1>
            <div class="entry-meta">
                Posted by <strong>${post.author}</strong> on ${post.date}
            </div>
            <button class="share-btn" onclick="copyLink()">
                <i class="fas fa-share-alt"></i> Share this
            </button>
        </header>

        <div class="entry-body">
            ${mediaHTML}
            <div class="text-content">
                ${post.content}
            </div>
        </div>
    `;
    
    document.getElementById('article-container').innerHTML = html;
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
}