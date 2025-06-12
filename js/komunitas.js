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
            replies: [
                {
                    id: 1,
                    author: 'Dr. Maya',
                    avatar: 'DM',
                    time: '3 jam lalu',
                    content: 'Coba teknik pernapasan 4-7-8. Tarik napas 4 detik, tahan 7 detik, buang 8 detik. Sangat efektif!'
                },
                {
                    id: 2,
                    author: 'Budi Santoso',
                    avatar: 'BS',
                    time: '2 jam lalu',
                    content: 'Saya biasanya jalan-jalan sebentar atau minum air putih. Distraksi sederhana tapi manjur.'
                }
            ]
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
            replies: [
                {
                    id: 1,
                    author: 'Nina Sari',
                    avatar: 'NS',
                    time: '5 jam lalu',
                    content: 'Wah terima kasih sharingnya! Langsung saya coba dan berhasil mengatasi craving tadi pagi.'
                }
            ]
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
        },
        {
            id: 5,
            author: 'Tommy Wijaya',
            avatar: 'TW',
            time: '1 hari yang lalu',
            category: 'success',
            title: '🏆 Milestone 6 Bulan Tercapai!',
            content: 'Tidak terasa sudah 6 bulan bebas rokok! Terima kasih komunitas PuffOff yang selalu supportive. Sekarang stamina jauh lebih baik dan tidur lebih nyenyak.',
            likes: 203,
            comments: 67,
            shares: 45,
            liked: false,
            replies: []
        },
        {
            id: 6,
            author: 'Sinta Dewi',
            avatar: 'SD',
            time: '2 hari yang lalu',
            category: 'tips',
            title: '🍎 Camilan Sehat Pengganti Rokok',
            content: 'Berbagi tips camilan sehat yang bisa membantu mengalihkan keinginan merokok: wortel baby, kacang almond, buah apel potong, dan permen mint tanpa gula.',
            likes: 78,
            comments: 29,
            shares: 12,
            liked: true,
            replies: []
        }
    ];
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚭 PuffOff Komunitas Loading...');
    initializePosts();
    renderPosts();
    setupEventListeners();
    animateStats();
    console.log('✅ Komunitas initialized successfully');
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

    // Trending topics click
    document.querySelectorAll('.trending-item').forEach(item => {
        item.addEventListener('click', function() {
            const hashtag = this.querySelector('.trending-text').textContent;
            showToast(`Mencari posts dengan ${hashtag}...`);
        });
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
    
    // Show tab change notification
    const tabNames = {
        'trending': 'Trending',
        'recent': 'Terbaru',
        'motivasi': 'Motivasi',
        'my-posts': 'Post Saya'
    };
    
    showToast(`Menampilkan: ${tabNames[tabName]}`);
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
    
    if (filteredPosts.length === 0 && currentTab === 'my-posts') {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-edit"></i>
                <h3>Belum ada post</h3>
                <p>Mulai berbagi cerita atau tips Anda dengan komunitas!</p>
            </div>
        `;
    } else if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Tidak ada post</h3>
                <p>Belum ada post di kategori ini.</p>
            </div>
        `;
    } else {
        filteredPosts.forEach(post => {
            container.appendChild(createPostElement(post));
        });
    }
    
    // Animate posts appearance
    setTimeout(() => {
        container.querySelectorAll('.post-card').forEach((card, index) => {
            card.style.animation = `postSlideIn 0.5s ease-out ${index * 0.1}s both`;
        });
    }, 100);
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
            button.style.animation = 'likeHeartBeat 0.6s ease-in-out';
        } else {
            button.classList.remove('liked');
            icon.className = 'far fa-heart';
        }
        
        count.textContent = post.likes;
        
        // Show toast
        showToast(post.liked ? 'Post disukai!' : 'Like dibatalkan');
        
        // Reset animation
        setTimeout(() => {
            button.style.animation = '';
        }, 600);
    }
}

// Toggle replies section
function toggleReplies(button) {
    const postCard = button.closest('.post-card');
    const repliesSection = postCard.querySelector('.replies-section');
    
    if (repliesSection.classList.contains('show')) {
        repliesSection.classList.remove('show');
        repliesSection.style.display = 'none';
    } else {
        repliesSection.classList.add('show');
        repliesSection.style.display = 'block';
        
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
            
            // Focus on textarea
            setTimeout(() => {
                replyForm.querySelector('.reply-input').focus();
            }, 100);
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
        newReplyElement.style.animation = 'replySlideIn 0.4s ease-out';
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
        
        // Update stats
        updateCommunityStats();
        
    } else {
        showToast('Balasan tidak boleh kosong!', 'warning');
        textarea.focus();
    }
}

// Cancel reply
function cancelReply(button) {
    const form = button.closest('.new-reply-form');
    const textarea = form.querySelector('.reply-input');
    
    if (textarea.value.trim()) {
        if (confirm('Yakin ingin membatalkan balasan?')) {
            textarea.value = '';
            form.remove();
        }
    } else {
        form.remove();
    }
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
        
        // Animation for share button
        button.style.animation = 'btnClick 0.2s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 200);
        
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
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Link berhasil disalin!');
        }).catch(() => {
            showToast('Gagal menyalin link', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Link berhasil disalin!');
        } catch (err) {
            showToast('Gagal menyalin link', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Show more options
function showMoreOptions(button) {
    const options = [
        'Laporkan Post',
        'Sembunyikan Post',
        'Blokir Pengguna',
        'Salin Link'
    ];
    
    const selectedOption = prompt(`Pilih opsi:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}\n\nMasukkan nomor (1-${options.length}):`);
    
    if (selectedOption && selectedOption >= 1 && selectedOption <= options.length) {
        showToast(`${options[selectedOption - 1]} - Fitur akan segera hadir!`);
    }
}

// Modal functions
function openCreateModal() {
    const modal = document.getElementById('createModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('.form-input');
            if (firstInput) firstInput.focus();
        }, 100);
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
    
    // Show feedback
    const categoryText = chip.textContent.trim();
    showToast(`Kategori terpilih: ${categoryText}`);
}

// Handle form submission
function handleCreatePost(e) {
    e.preventDefault();
    
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const imageFile = document.getElementById('postImage').files[0];
    
    // Validation
    if (!selectedCategory) {
        showToast('Pilih kategori post terlebih dahulu!', 'warning');
        return;
    }
    
    if (!title) {
        showToast('Judul post tidak boleh kosong!', 'warning');
        document.getElementById('postTitle').focus();
        return;
    }
    
    if (!content) {
        showToast('Isi post tidak boleh kosong!', 'warning');
        document.getElementById('postContent').focus();
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memposting...';
    submitBtn.disabled = true;
    
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
            setTimeout(() => {
                addNewPost(newPost);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
        };
        reader.readAsDataURL(imageFile);
    } else {
        setTimeout(() => {
            addNewPost(newPost);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
}

// Add new post to the list
function addNewPost(post) {
    posts.unshift(post);
    closeCreateModal();
    
    // Switch to recent tab to show new post
    currentTab = 'recent';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.tab-btn[onclick*="recent"]').classList.add('active');
    
    // Hide trending section
    const trendingSection = document.getElementById('trending-section');
    if (trendingSection) {
        trendingSection.style.display = 'none';
    }
    
    renderPosts();
    showToast('Post berhasil dibuat!', 'success');
    
    // Update stats
    updateCommunityStats();
    
    // Scroll to top to see new post
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update community stats
function updateCommunityStats() {
    const postsToday = document.getElementById('posts-today');
    if (postsToday) {
        const currentCount = parseInt(postsToday.textContent);
        postsToday.textContent = currentCount + 1;
        
        // Animation
        postsToday.style.animation = 'countUp 0.5s ease-out';
        setTimeout(() => {
            postsToday.style.animation = '';
        }, 500);
    }
}

// Animate stats on load
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        const finalValue = stat.textContent;
        stat.textContent = '0';
        
        setTimeout(() => {
            animateValue(stat, 0, parseInt(finalValue.replace(/,/g, '')), 1000);
        }, index * 200);
    });
}

// Animate number counting
function animateValue(element, start, end, duration) {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    function update() {
        const now = Date.now();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = Math.round(end - (remaining * (end - start)));
        
        element.textContent = value.toLocaleString();
        
        if (value === end) {
            element.style.color = '#667eea';
        } else {
            requestAnimationFrame(update);
        }
    }
    
    update();
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

// Search functionality for trending topics
function searchHashtag(hashtag) {
    const searchTerm = hashtag.replace('#', '').toLowerCase();
    const results = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm)
    );
    
    if (results.length > 0) {
        showToast(`Ditemukan ${results.length} post dengan ${hashtag}`);
        // Could implement filtered view here
    } else {
        showToast(`Tidak ada post dengan ${hashtag}`, 'info');
    }
}

// Auto-refresh stats periodically
setInterval(() => {
    const memberCount = document.getElementById('member-count');
    const postsToday = document.getElementById('posts-today');
    const successStories = document.getElementById('success-stories');
    
    if (memberCount && Math.random() < 0.1) { // 10% chance
        const current = parseInt(memberCount.textContent.replace(/,/g, ''));
        memberCount.textContent = (current + 1).toLocaleString();
        memberCount.style.animation = 'countUp 0.5s ease-out';
        setTimeout(() => memberCount.style.animation = '', 500);
    }
}, 30000); // Every 30 seconds

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form in modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const modal = document.getElementById('createModal');
        if (modal && modal.classList.contains('show')) {
            e.preventDefault();
            const form = document.getElementById('createPostForm');
            if (form) {
                handleCreatePost(e);
            }
        }
    }
    
    // ESC to close modal
    if (e.key === 'Escape') {
        closeCreateModal();
    }
    
    // Quick tab switching
    if (!e.target.matches('input, textarea')) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                switchTab('trending');
                break;
            case '2':
                e.preventDefault();
                switchTab('recent');
                break;
            case '3':
                e.preventDefault();
                switchTab('motivasi');
                break;
            case '4':
                e.preventDefault();
                switchTab('my-posts');
                break;
        }
    }
});

// Smooth scroll for trending topics
document.addEventListener('click', function(e) {
    if (e.target.closest('.trending-item')) {
        const item = e.target.closest('.trending-item');
        item.style.animation = 'btnClick 0.2s ease';
        setTimeout(() => {
            item.style.animation = '';
        }, 200);
    }
});

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Community App Error:', e.error);
    showToast('Terjadi kesalahan. Silakan refresh halaman.', 'error');
});

// Performance monitoring
let loadStartTime = performance.now();
window.addEventListener('load', function() {
    const loadTime = performance.now() - loadStartTime;
    console.log(`🚀 Komunitas loaded in ${Math.round(loadTime)}ms`);
});

console.log('🚭 PuffOff Komunitas Script Loaded');
console.log('⌨️ Shortcuts: 1-4 (switch tabs), Ctrl+Enter (submit), ESC (close modal)');
