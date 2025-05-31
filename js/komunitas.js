// Global variables
let currentTab = 'trending';
let selectedCategory = null;
let posts = [];

// Initialize posts data
function initializePosts() {
    posts = [
        {
            id: 1,
            author: 'Andi Rahman',
            avatar: 'AR',
            time: '2 jam yang lalu',
            category: 'success',
            title: '🎉 Akhirnya 100 hari bebas rokok!',
            content: 'Halo teman-teman! Hari ini genap 100 hari saya bebas dari rokok. Perjalanan yang tidak mudah, tapi dengan dukungan kalian semua, akhirnya berhasil! Sharing tips yang membantu saya...',
            likes: 47,
            comments: 12,
            shares: 5,
            liked: false,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23ecfdf5'/%3E%3Ctext x='200' y='100' font-family='Arial' font-size='24' fill='%2310b981' text-anchor='middle' dominant-baseline='middle'%3E🎉 100 Days Milestone! 🎉%3C/text%3E%3C/svg%3E",
            replies: [
                {
                    id: 1,
                    author: 'Sari Mulyani',
                    avatar: 'SM',
                    time: '1 jam lalu',
                    content: 'Selamat bang! Inspiratif banget. Bisa sharing tips untuk melewati minggu pertama?'
                },
                {
                    id: 2,
                    author: 'Doni Kurniawan',
                    avatar: 'DK',
                    time: '45 menit lalu',
                    content: 'Mantap! Saya baru 20 hari, semoga bisa kayak abang. Terima kasih motivasinya! 💪'
                }
            ]
        },
        {
            id: 2,
            author: 'Linda Permata',
            avatar: 'LP',
            time: '4 jam yang lalu',
            category: 'question',
            title: '❓ Bagaimana mengatasi stress tanpa rokok?',
            content: 'Halo semua, saya baru mulai program berhenti merokok hari ke-3. Masalahnya kalau lagi stress kerja, reflek pengen nyari rokok. Ada yang punya tips alternatif yang efektif?',
            likes: 23,
            comments: 18,
            shares: 2,
            liked: false,
            replies: []
        },
        {
            id: 3,
            author: 'Rudi Hartono',
            avatar: 'RH',
            time: '6 jam yang lalu',
            category: 'tips',
            title: '💡 5 Teknik Pernapasan untuk Mengatasi Craving',
            content: 'Setelah 8 bulan bebas rokok, saya mau share teknik pernapasan yang sangat membantu saat ada keinginan merokok. Teknik 4-7-8 adalah yang paling efektif untuk saya...',
            likes: 89,
            comments: 31,
            shares: 15,
            liked: true,
            replies: []
        },
        {
            id: 4,
            author: 'Novi Kartika',
            avatar: 'NK',
            time: '1 hari yang lalu',
            category: 'motivasi',
            title: '🌟 Motivasi Pagi: Kamu Lebih Kuat Dari Yang Kamu Kira!',
            content: '"Setiap hari tanpa rokok adalah kemenangan kecil yang membangun kekuatan besar. Hari ini adalah hari ke-1 dari sisa hidup yang lebih sehat. Kamu pasti bisa!"',
            likes: 156,
            comments: 42,
            shares: 28,
            liked: false,
            replies: []
        }
    ];
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializePosts();
    renderPosts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Create post form submission
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    // Modal close on outside click
    const createModal = document.getElementById('createModal');
    if (createModal) {
        createModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCreateModal();
            }
        });
    }

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCreateModal();
        }
    });
}

// Tab switching functionality
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide trending section
    const trendingSection = document.getElementById('trending-section');
    if (trendingSection) {
        if (tabName === 'trending') {
            trendingSection.style.display = 'block';
        } else {
            trendingSection.style.display = 'none';
        }
    }
    
    // Filter and render posts
    renderPosts();
}

// Render posts based on current tab
function renderPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    let filteredPosts = [...posts];
    
    // Filter posts based on current tab
    switch(currentTab) {
        case 'trending':
            filteredPosts.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
            break;
        case 'recent':
            filteredPosts.sort((a, b) => b.id - a.id);
            break;
        case 'motivasi':
            filteredPosts = filteredPosts.filter(post => post.category === 'motivasi');
            break;
        case 'my-posts':
            filteredPosts = filteredPosts.filter(post => post.author === 'Current User');
            break;
    }
    
    // Render posts
    container.innerHTML = '';
    filteredPosts.forEach(post => {
        container.appendChild(createPostElement(post));
    });
    
    // Show empty state if no posts
    if (filteredPosts.length === 0 && currentTab === 'my-posts') {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-edit"></i>
                <h3>Belum ada post</h3>
                <p>Mulai berbagi cerita atau tips Anda dengan komunitas!</p>
            </div>
        `;
    }
}

// Create post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card';
    
    const badgeClass = {
        'success': 'badge-success',
        'question': 'badge-question',
        'tips': 'badge-tips',
        'motivasi': 'badge-motivation'
    };
    
    const categoryText = {
        'success': 'Success Story',
        'question': 'Pertanyaan',
        'tips': 'Tips & Trick',
        'motivasi': 'Motivasi'
    };
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="user-info">
                <div class="user-avatar">${post.avatar}</div>
                <div class="user-details">
                    <div class="username">${post.author}</div>
                    <div class="post-time">${post.time}</div>
                </div>
                <div class="post-badge ${badgeClass[post.category]}">${categoryText[post.category]}</div>
            </div>
        </div>
        <div class="post-content">
            <div class="post-title">${post.title}</div>
            <div class="post-excerpt">${post.content}</div>
            ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
        </div>
        <div class="post-actions">
            <div class="action-group">
                <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(this)" data-post-id="${post.id}">
                    <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
                    <span>${post.likes}</span>
                </button>
                <button class="action-btn" onclick="toggleReplies(this)" data-post-id="${post.id}">
                    <i class="far fa-comment"></i>
                    <span>${post.comments}</span>
                </button>
                <button class="action-btn" onclick="sharePost(this)" data-post-id="${post.id}">
                    <i class="fas fa-share"></i>
                    <span>${post.shares}</span>
                </button>
            </div>
            <button class="more-btn" onclick="showMoreOptions(this)">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        <div class="replies-section">
            ${renderReplies(post.replies)}
        </div>
    `;
    
    return postDiv;
}

// Render replies for a post
function renderReplies(replies) {
    if (!replies || replies.length === 0) return '';
    
    let repliesHTML = '';
    replies.forEach(reply => {
        repliesHTML += `
            <div class="reply-card">
                <div class="reply-header">
                    <div class="reply-avatar">${reply.avatar}</div>
                    <div class="reply-username">${reply.author}</div>
                    <div class="reply-time">${reply.time}</div>
                </div>
                <div class="reply-content">${reply.content}</div>
            </div>
        `;
    });
    
    return repliesHTML;
}

// Toggle like functionality
function toggleLike(button) {
    const postId = parseInt(button.getAttribute('data-post-id'));
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        
        // Update button appearance
        const icon = button.querySelector('i');
        const count = button.querySelector('span');
        
        if (post.liked) {
            button.classList.add('liked');
            icon.className = 'fas fa-heart';
        } else {
            button.classList.remove('liked');
            icon.className = 'far fa-heart';
        }
        
        count.textContent = post.likes;
        
        // Show toast
        showToast(post.liked ? 'Post disukai!' : 'Like dibatalkan');
    }
}

// Toggle replies section
function toggleReplies(button) {
    const postCard = button.closest('.post-card');
    const repliesSection = postCard.querySelector('.replies-section');
    
    if (repliesSection.classList.contains('show')) {
        repliesSection.classList.remove('show');
    } else {
        repliesSection.classList.add('show');
        
        // Add reply form if not exists
        if (!repliesSection.querySelector('.new-reply-form')) {
            const replyForm = document.createElement('div');
            replyForm.className = 'new-reply-form';
            replyForm.innerHTML = `
                <textarea class="reply-input" placeholder="Tulis balasan Anda..."></textarea>
                <div class="reply-actions">
                    <button class="reply-btn cancel" onclick="cancelReply(this)">Batal</button>
                    <button class="reply-btn submit" onclick="submitReply(this)">Balas</button>
                </div>
            `;
            repliesSection.appendChild(replyForm);
        }
    }
}

// Submit reply
function submitReply(button) {
    const form = button.closest('.new-reply-form');
    const textarea = form.querySelector('.reply-input');
    const content = textarea.value.trim();
    
    if (content) {
        const repliesSection = form.closest('.replies-section');
        const postCard = repliesSection.closest('.post-card');
        const postId = parseInt(postCard.querySelector('[data-post-id]').getAttribute('data-post-id'));
        const post = posts.find(p => p.id === postId);
        
        // Add new reply to post data
        const newReply = {
            id: (post.replies ? post.replies.length : 0) + 1,
            author: 'You',
            avatar: 'YU',
            time: 'Baru saja',
            content: content
        };
        
        if (!post.replies) post.replies = [];
        post.replies.push(newReply);
        
        // Create new reply element
        const newReplyElement = document.createElement('div');
        newReplyElement.className = 'reply-card';
        newReplyElement.innerHTML = `
            <div class="reply-header">
                <div class="reply-avatar">YU</div>
                <div class="reply-username">You</div>
                <div class="reply-time">Baru saja</div>
            </div>
            <div class="reply-content">${content}</div>
        `;
        
        repliesSection.insertBefore(newReplyElement, form);
        textarea.value = '';
        showToast('Balasan berhasil dikirim!');
        
        // Update comment count
        const commentBtn = postCard.querySelector('.action-btn[onclick*="toggleReplies"]');
        const countSpan = commentBtn.querySelector('span');
        post.comments = parseInt(countSpan.textContent) + 1;
        countSpan.textContent = post.comments;
    }
}

// Cancel reply
function cancelReply(button) {
    const form = button.closest('.new-reply-form');
    const textarea = form.querySelector('.reply-input');
    textarea.value = '';
}

// Share post functionality
function sharePost(button) {
    const postId = button.getAttribute('data-post-id');
    const post = posts.find(p => p.id === parseInt(postId));
    
    if (post) {
        // Update share count
        post.shares++;
        const countSpan = button.querySelector('span');
        countSpan.textContent = post.shares;
        
        // Try native share API, fallback to clipboard
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.content,
                url: window.location.href
            }).then(() => {
                showToast('Post berhasil dibagikan!');
            }).catch(() => {
                // Fallback to clipboard
                copyToClipboard(post);
            });
        } else {
            copyToClipboard(post);
        }
    }
}

// Copy post to clipboard
function copyToClipboard(post) {
    const shareText = `${post.title}\n\n${post.content}\n\nLihat di PuffOff Community: ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('Link berhasil disalin!');
    }).catch(() => {
        showToast('Gagal menyalin link', 'error');
    });
}

// Show more options
function showMoreOptions(button) {
    showToast('Fitur akan segera hadir!');
}

// Load more replies
function loadMoreReplies(button) {
    showToast('Memuat balasan lainnya...');
    // Simulate loading
    setTimeout(() => {
        button.style.display = 'none';
    }, 1000);
}

// Modal functions
function openCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('createPostForm');
        if (form) {
            form.reset();
        }
        
        selectedCategory = null;
        document.querySelectorAll('.chip').forEach(chip => {
            chip.classList.remove('selected');
        });
    }
}

// Select category
function selectCategory(chip) {
    // Remove previous selection
    document.querySelectorAll('.chip').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Select current
    chip.classList.add('selected');
    selectedCategory = chip.getAttribute('data-category');
}

// Handle form submission
function handleCreatePost(e) {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    
    if (!title || !content || !selectedCategory) {
        showToast('Mohon lengkapi semua field!', 'error');
        return;
    }
    
    // Create new post
    const newPost = {
        id: posts.length + 1,
        author: 'Current User',
        avatar: 'CU',
        time: 'Baru saja',
        category: selectedCategory,
        title: title,
        content: content,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        replies: []
    };
    
    // Handle image if uploaded
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result;
            addNewPost(newPost);
        };
        reader.readAsDataURL(imageFile);
    } else {
        addNewPost(newPost);
    }
}

// Add new post to the list
function addNewPost(post) {
    posts.unshift(post);
    closeCreateModal();
    renderPosts();
    showToast('Post berhasil dibuat!');
    
    // Update stats
    const postsToday = document.getElementById('posts-today');
    if (postsToday) {
        postsToday.textContent = parseInt(postsToday.textContent) + 1;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}
