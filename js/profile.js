// Global variables
let userData = {
    name: 'Ahmad Wijaya',
    status: 'Pejuang Bebas Rokok',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
    startDate: '2024-01-15',
    bio: 'Memulai perjalanan bebas rokok untuk hidup yang lebih sehat.',
    healthLevel: 4,
    streak: 7,
    totalSavings: 210000,
    healthScore: 78,
    level: 4,
    mainBadge: 'Week Warrior'
};

let achievements = {
    'fire-starter': {
        title: 'Fire Starter',
        icon: '🔥',
        description: 'Selamat! Anda telah berhasil tidak merokok selama 3 hari berturut-turut. Ini adalah langkah pertama yang sangat penting dalam perjalanan bebas rokok Anda.',
        earned: true,
        earnedDate: '2024-01-16',
        tips: 'Terus pertahankan momentum ini dengan mengingat alasan mengapa Anda ingin berhenti merokok.'
    },
    'money-saver': {
        title: 'Money Saver',
        icon: '💰',
        description: 'Luar biasa! Anda telah menghemat Rp 100.000 dengan tidak membeli rokok. Uang ini bisa Anda gunakan untuk hal yang lebih bermanfaat!',
        earned: true,
        earnedDate: '2024-01-19',
        tips: 'Coba hitung berapa banyak yang bisa Anda hemat dalam setahun dan buat rencana untuk menggunakan uang tersebut.'
    },
    'week-warrior': {
        title: 'Week Warrior',
        icon: '🏃',
        description: 'Hebat! Satu minggu penuh tanpa rokok adalah pencapaian yang luar biasa. Tubuh Anda sudah mulai merasakan manfaatnya!',
        earned: true,
        earnedDate: '2024-01-22',
        tips: 'Fungsi paru-paru Anda mulai membaik. Terus jaga pola hidup sehat dengan olahraga dan makan makanan bergizi.'
    },
    'champion': {
        title: 'Champion',
        icon: '👑',
        description: '30 hari bebas rokok adalah pencapaian yang sangat membanggakan!',
        earned: false,
        progress: 23
    },
    'diamond': {
        title: 'Diamond',
        icon: '💎',
        description: '90 hari bebas rokok menunjukkan komitmen yang luar biasa!',
        earned: false,
        progress: 8
    },
    'legend': {
        title: 'Legend',
        icon: '🌟',
        description: 'Satu tahun bebas rokok adalah pencapaian legendaris!',
        earned: false,
        progress: 2
    }
};

let savingsGoals = [
    {
        id: 1,
        title: 'Smartphone Baru',
        target: 3000000,
        current: 210000
    },
    {
        id: 2,
        title: 'Liburan Keluarga',
        target: 8000000,
        current: 210000
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    setupEventListeners();
    loadUserData();
    initializeHealthScore();
    loadSavingsGoals();
});

function initializeProfile() {
    // Set initial expanded state for first section
    const firstSection = document.querySelector('.section-content');
    if (firstSection) {
        firstSection.classList.add('expanded');
        const firstToggle = document.querySelector('.toggle-icon');
        if (firstToggle) {
            firstToggle.classList.add('rotated');
        }
    }
    
    // Initialize all progress bars
    initializeProgressBars();
    
    // Setup intersection observer for animations
    setupScrollAnimations();
}

function setupEventListeners() {
    // Modal event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Theme toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = isDarkMode;
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }
}

function loadUserData() {
    // Load user data from localStorage or API
    const savedUserData = localStorage.getItem('puffoff_user_data');
    if (savedUserData) {
        userData = { ...userData, ...JSON.parse(savedUserData) };
    }
    
    // Update UI with user data
    updateProfileDisplay();
    updateQuickStats();
}

function updateProfileDisplay() {
    const elements = {
        profileName: document.getElementById('profileName'),
        profileStatus: document.getElementById('profileStatus'),
        profileImage: document.getElementById('profileImage'),
        mainBadge: document.getElementById('mainBadge'),
        healthIndicator: document.getElementById('healthIndicator')
    };
    
    if (elements.profileName) elements.profileName.textContent = userData.name;
    if (elements.profileStatus) elements.profileStatus.textContent = userData.status;
    if (elements.profileImage) elements.profileImage.src = userData.avatar;
    if (elements.mainBadge) elements.mainBadge.textContent = userData.mainBadge;
    
    if (elements.healthIndicator) {
        elements.healthIndicator.className = `health-indicator level-${userData.healthLevel}`;
    }
}

function updateQuickStats() {
    const elements = {
        streakDays: document.getElementById('streakDays'),
        totalSavings: document.getElementById('totalSavings'),
        healthScore: document.getElementById('healthScore'),
        userLevel: document.getElementById('userLevel')
    };
    
    if (elements.streakDays) {
        animateValue(elements.streakDays, 0, userData.streak, 1000);
    }
    
    if (elements.totalSavings) {
        setTimeout(() => {
            elements.totalSavings.textContent = formatCurrency(userData.totalSavings);
        }, 500);
    }
    
    if (elements.healthScore) {
        animateValue(elements.healthScore, 0, userData.healthScore, 1500, '%');
    }
    
    if (elements.userLevel) {
        animateValue(elements.userLevel, 0, userData.level, 800);
    }
}

function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function formatCurrency(amount) {
    if (amount >= 1000000) {
        return 'Rp ' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return 'Rp ' + (amount / 1000).toFixed(0) + 'K';
    }
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Section Toggle
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId + '-content');
    const toggle = document.getElementById(sectionId + '-toggle');
    
    if (!content || !toggle) return;
    
    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
        content.classList.remove('expanded');
        toggle.classList.remove('rotated');
    } else {
        content.classList.add('expanded');
        toggle.classList.add('rotated');
    }
    
    // Save section state
    localStorage.setItem(`section_${sectionId}_expanded`, !isExpanded);
}

// Health Score Initialization
function initializeHealthScore() {
    const scoreProgress = document.querySelector('.score-progress');
    if (scoreProgress) {
        const score = userData.healthScore;
        const degrees = (score / 100) * 360;
        scoreProgress.style.background = `conic-gradient(#10b981 0deg, #10b981 ${degrees}deg, #e5e7eb ${degrees}deg, #e5e7eb 360deg)`;
    }
}

// Progress Bars Initialization
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
    
    // Initialize goal progress bars
    const goalBars = document.querySelectorAll('.goal-progress-bar');
    goalBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.setProperty('--width', '0%');
        setTimeout(() => {
            bar.style.setProperty('--width', width);
        }, 800);
    });
}

// Avatar Functions
function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userData.avatar = e.target.result;
                updateProfileDisplay();
                saveUserData();
                showToast('Avatar berhasil diubah!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// Edit Profile Modal
function openEditProfile() {
    const modal = document.getElementById('editProfileModal');
    const elements = {
        editName: document.getElementById('editName'),
        editStatus: document.getElementById('editStatus'),
        editBio: document.getElementById('editBio'),
        editStartDate: document.getElementById('editStartDate')
    };
    
    // Populate form with current data
    if (elements.editName) elements.editName.value = userData.name;
    if (elements.editStatus) elements.editStatus.value = userData.status;
    if (elements.editBio) elements.editBio.value = userData.bio || '';
    if (elements.editStartDate) elements.editStartDate.value = userData.startDate;
    
    modal.classList.add('show');
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    modal.classList.remove('show');
}

function saveProfile() {
    const elements = {
        editName: document.getElementById('editName'),
        editStatus: document.getElementById('editStatus'),
        editBio: document.getElementById('editBio'),
        editStartDate: document.getElementById('editStartDate')
    };
    
    // Validate inputs
    if (!elements.editName.value.trim()) {
        showToast('Nama tidak boleh kosong!', 'error');
        return;
    }
    
    // Update user data
    userData.name = elements.editName.value.trim();
    userData.status = elements.editStatus.value.trim();
    userData.bio = elements.editBio.value.trim();
    userData.startDate = elements.editStartDate.value;
    
    // Save to localStorage
    saveUserData();
    
    // Update display
    updateProfileDisplay();
    
    // Close modal
    closeEditProfile();
    
    showToast('Profil berhasil diperbarui!', 'success');
}

// Achievement Functions
function showAchievementDetail(achievementId) {
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    const modal = document.getElementById('achievementModal');
    const elements = {
        achievementTitle: document.getElementById('achievementTitle'),
        achievementIconLarge: document.getElementById('achievementIconLarge'),
        achievementName: document.getElementById('achievementName'),
        achievementDescription: document.getElementById('achievementDescription'),
        achievementEarnedDate: document.getElementById('achievementEarnedDate')
    };
    
    elements.achievementTitle.textContent = achievement.title;
    elements.achievementIconLarge.textContent = achievement.icon;
    elements.achievementName.textContent = achievement.title;
    elements.achievementDescription.textContent = achievement.description;
    
    if (achievement.earned) {
        elements.achievementEarnedDate.innerHTML = `
            <i class="fas fa-calendar"></i>
            <span>Diraih pada: ${formatDate(achievement.earnedDate)}</span>
        `;
    } else {
        elements.achievementEarnedDate.innerHTML = `
            <i class="fas fa-lock"></i>
            <span>Belum terbuka (Progress: ${achievement.progress}%)</span>
        `;
    }
    
    modal.classList.add('show');
}

function closeAchievementDetail() {
    const modal = document.getElementById('achievementModal');
    modal.classList.remove('show');
}

function shareAchievement() {
    const text = `🏆 Saya baru saja meraih pencapaian di PuffOff! 
    
Bergabunglah dengan perjalanan bebas rokok saya dan dapatkan hidup yang lebih sehat!

#PuffOff #BebasRokok #Achievement`;

    if (navigator.share) {
        navigator.share({
            title: 'Pencapaian PuffOff',
            text: text,
            url: window.location.href
        }).then(() => {
            showToast('Pencapaian berhasil dibagikan!', 'success');
        }).catch(() => {
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

// Savings Goals
function loadSavingsGoals() {
    const savedGoals = localStorage.getItem('puffoff_savings_goals');
    if (savedGoals) {
        savingsGoals = JSON.parse(savedGoals);
    }
    updateSavingsDisplay();
}

function updateSavingsDisplay() {
    savingsGoals.forEach(goal => {
        const percentage = Math.round((goal.current / goal.target) * 100);
        const goalElement = document.querySelector(`[data-goal-id="${goal.id}"]`);
        if (goalElement) {
            const progressBar = goalElement.querySelector('.goal-progress-bar');
            const percentageElement = goalElement.querySelector('.goal-percentage');
            
            if (progressBar) progressBar.style.setProperty('--width', `${percentage}%`);
            if (percentageElement) percentageElement.textContent = `${percentage}%`;
        }
    });
}

function addSavingsGoal() {
    const title = prompt('Masukkan nama target penghematan:');
    if (!title) return;
    
    const targetStr = prompt('Masukkan jumlah target (dalam Rupiah):');
    if (!targetStr) return;
    
    const target = parseInt(targetStr.replace(/[^\d]/g, ''));
    if (isNaN(target) || target <= 0) {
        showToast('Jumlah target tidak valid!', 'error');
        return;
    }
    
    const newGoal = {
        id: Date.now(),
        title: title.trim(),
        target: target,
        current: userData.totalSavings
    };
    
    savingsGoals.push(newGoal);
    localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
    
    // Refresh savings display
    location.reload();
    
    showToast('Target penghematan berhasil ditambahkan!', 'success');
}

// Analytics & Export
function exportData() {
    const exportData = {
        userData: userData,
        achievements: achievements,
        savingsGoals: savingsGoals,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `puffoff_profile_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    showToast('Data profil berhasil diexport!', 'success');
}

// Settings Functions
function openNotificationSettings() {
    showToast('Pengaturan notifikasi akan segera tersedia!', 'info');
}

function toggleTheme() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDarkMode = darkModeToggle.checked;
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
    }
    
    showToast(`Mode ${isDarkMode ? 'gelap' : 'terang'} diaktifkan!`, 'success');
}

function openPrivacySettings() {
    showToast('Pengaturan privasi akan segera tersedia!', 'info');
}

function openBackupSettings() {
    showToast('Pengaturan backup akan segera tersedia!', 'info');
}

function openEmergencyContacts() {
    showToast('Fitur kontak darurat akan segera tersedia!', 'info');
}

function shareProfile() {
    const profileUrl = window.location.href;
    const text = `🌟 Lihat progress bebas rokok saya di PuffOff! 
    
✅ ${userData.streak} hari streak
💰 Hemat ${formatCurrency(userData.totalSavings)}
❤️ Health Score: ${userData.healthScore}%

Bergabunglah dengan perjalanan hidup sehat!

#PuffOff #BebasRokok #HidupSehat`;

    if (navigator.share) {
        navigator.share({
            title: 'Profil PuffOff - ' + userData.name,
            text: text,
            url: profileUrl
        }).then(() => {
            showToast('Profil berhasil dibagikan!', 'success');
        }).catch(() => {
            copyToClipboard(text + '\n\n' + profileUrl);
        });
    } else {
        copyToClipboard(text + '\n\n' + profileUrl);
    }
}

// Danger Zone Functions
function confirmLogout() {
    if (confirm('Apakah Anda yakin ingin keluar? Data yang belum disimpan akan hilang.')) {
        logout();
    }
}

function logout() {
    // Clear sensitive data but keep progress
    localStorage.removeItem('puffoff_session');
    localStorage.removeItem('puffoff_temp_data');
    
    showToast('Berhasil keluar!', 'success');
    
    // Redirect to login or home
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function confirmDeleteAccount() {
    const confirmation = prompt('PERINGATAN: Tindakan ini akan menghapus semua data Anda secara permanen!\n\nKetik "HAPUS AKUN" untuk konfirmasi:');
    
    if (confirmation === 'HAPUS AKUN') {
        deleteAccount();
    } else if (confirmation !== null) {
        showToast('Konfirmasi tidak sesuai. Akun tidak dihapus.', 'warning');
    }
}

function deleteAccount() {
    // Clear all data
    localStorage.clear();
    
    showToast('Akun berhasil dihapus. Terima kasih telah menggunakan PuffOff!', 'success');
    
    // Redirect to welcome page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Utility Functions
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

function saveUserData() {
    localStorage.setItem('puffoff_user_data', JSON.stringify(userData));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Teks berhasil disalin ke clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Teks berhasil disalin!', 'success');
    } catch (err) {
        showToast('Gagal menyalin teks', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate progress bars when section comes into view
                const progressBars = entry.target.querySelectorAll('.progress-bar, .goal-progress-bar');
                progressBars.forEach(bar => {
                    const width = bar.style.width || bar.style.getPropertyValue('--width');
                    bar.style.width = '0%';
                    bar.style.setProperty('--width', '0%');
                    
                    setTimeout(() => {
                        bar.style.width = width;
                        bar.style.setProperty('--width', width);
                    }, 300);
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section, .stat-card').forEach(section => {
        observer.observe(section);
    });
}

// Auto-save functionality
setInterval(() => {
    saveUserData();
}, 30000); // Auto-save every 30 seconds

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        saveUserData();
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', function() {
    saveUserData();
});

// Initialize on load
window.addEventListener('load', function() {
    // Remove loading states
    document.querySelectorAll('.loading').forEach(element => {
        element.classList.remove('loading');
    });
    
    // Initialize animations
    setTimeout(() => {
        initializeProgressBars();
    }, 500);
});