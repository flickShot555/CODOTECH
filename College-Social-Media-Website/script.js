document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.dataset.theme = 
            document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    // Sample Posts Data
    const posts = [
        {
            user: "Campus News",
            handle: "@campus_news",
            content: "New student lounge opening next week! 🎉",
            likes: 142,
            comments: 23,
            time: "2h ago"
        },
        {
            user: "CS Department",
            handle: "@cs_dept",
            content: "Reminder: Programming workshop tomorrow at 3 PM in Lab 4",
            likes: 89,
            comments: 12,
            time: "4h ago"
        }
    ];

    // Generate Posts
    const postsContainer = document.getElementById('posts-container');
    
    posts.forEach(post => {
        const postHTML = `
            <div class="post">
                <div class="post-header">
                    <img src="avatar-placeholder.png" class="profile-pic">
                    <div>
                        <h4>${post.user}</h4>
                        <p>${post.handle} · ${post.time}</p>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                <div class="post-actions">
                    <button class="like-btn">❤️ ${post.likes}</button>
                    <button class="comment-btn">💬 ${post.comments}</button>
                </div>
            </div>
        `;
        postsContainer.innerHTML += postHTML;
    });

    // Like Button Functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('like-btn')) {
            const likeBtn = e.target;
            const currentLikes = parseInt(likeBtn.textContent.match(/\d+/)[0]);
            const isLiked = likeBtn.classList.toggle('liked');
            
            likeBtn.textContent = `❤️ ${isLiked ? currentLikes + 1 : currentLikes - 1}`;
        }
    });
});