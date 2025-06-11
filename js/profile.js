// ===========================================
// PuffOff Profile Page - Complete JavaScript (Final)
// ===========================================

// Global Variables
let userData = {
    name: 'Ahmad Wijaya',
    status: 'Pejuang Bebas Rokok',
    email: 'ahmad@email.com',
    phone: '+62 812-3456-7890',
    userId: 'USR-2024-001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
    startDate: '2024-01-15',
    bio: 'Memulai perjalanan bebas rokok untuk hidup yang lebih sehat dan produktif.',
    level: 4,
    referralCode: 'AHMAD2024',
    theme: 'default',
    joinedReferrals: [],
    totalSavings: 210000 // Current savings from not smoking
};

let smokingHistory = {
    cigarettesPerDay: 12,
    pricePerPack: 25000,
    smokingYears: 5,
    smokingMonths: 0,
    isSetup: true
};

let communityData = {
    totalReferrals: 3,
    referralRewards: 150,
    friends: [
        {
            id: 'sarah',
            name: 'Sarah Putri',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e906?w=50&h=50&fit=crop&crop=face&auto=format',
            progress: '14 hari bebas rokok',
            progressPercent: 70,
            status: 'online',
            streak: 14
        },
        {
            id: 'budi',
            name: 'Budi Santoso',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face&auto=format',
            progress: '21 hari bebas rokok',
            progressPercent: 85,
            status: 'offline',
            streak: 21
        },
        {
            id: 'rina',
            name: 'Rina Maharani',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face&auto=format',
            progress: '3 hari bebas rokok',
            progressPercent: 30,
            status: 'online',
            streak: 3
        }
    ],
    leaderboard: [
        {
            rank: 1,
            name: 'Budi Santoso',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=36&h=36&fit=crop&crop=face&auto=format',
            score: '21 hari streak',
            medal: '👑'
        },
        {
            rank: 2,
            name: 'Sarah Putri',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e906?w=36&h=36&fit=crop&crop=face&auto=format',
            score: '14 hari streak',
            medal: '🥈'
        },
        {
            rank: 3,
            name: 'Ahmad Wijaya (Anda)',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=36&h=36&fit=crop&crop=face&auto=format',
            score: '7 hari streak',
            medal: '🥉'
        }
    ]
};

let savingsGoals = [
    {
        id: 1,
        title: 'Smartphone Baru',
        target: 3000000,
        category: 'elektronik',
        progress: 0,
        completed: false,
        createdDate: '2024-01-15',
        targetDate: null
    },
    {
        id: 2,
        title: 'Liburan Keluarga',
        target: 8000000,
        category: 'liburan',
        progress: 0,
        completed: false,
        createdDate: '2024-01-15',
        targetDate: '2024-12-31'
    }
];

let journeyTimeline = [
    {
        id: 1,
        title: 'Memulai Perjalanan 🌟',
        description: 'Bergabung dengan PuffOff dan berkomitmen berhenti merokok',
        date: '15 Januari 2024',
        status: 'completed'
    },
    {
        id: 2,
        title: 'Minggu Pertama! 🏆',
        description: 'Berhasil mencapai 7 hari bebas rokok',
        date: '22 Januari 2024',
        status: 'completed'
    },
    {
        id: 3,
        title: 'Target 2 Minggu 🎯',
        description: 'Menuju pencapaian 14 hari bebas rokok',
        date: '29 Januari 2024',
        status: 'upcoming'
    }
];

let themes = {
    default: { name: 'Default', primary: '#667eea', secondary: '#764ba2' },
    ocean: { name: 'Ocean', primary: '#06b6d4', secondary: '#0891b2' },
    forest: { name: 'Forest', primary: '#10b981', secondary: '#059669' },
    sunset: { name: 'Sunset', primary: '#f59e0b', secondary: '#d97706' },
    purple: { name: 'Purple', primary: '#8b5cf6', secondary: '#7c3aed' },
    dark: { name: 'Dark', primary: '#374151', secondary: '#1f2937' }
};

let categoryIcons = {
    elektronik: '📱',
    liburan: '🏖️',
    pendidikan: '📚',
    kesehatan: '❤️',
    investasi: '📈',
    kendaraan: '🚗',
    rumah: '🏠',
    fashion: '👕',
    hobi: '🎨',
    lainnya: '📦'
};

let selectedTheme = 'default';

// Valid referral codes (simulate server validation)
let validReferralCodes = ['SARAH2024', 'BUDI2024', 'RINA2024', 'JOHN2024', 'MAYA2024'];

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PuffOff Profile - Initializing...');
    
    // Initialize core systems
    loadData();
    loadSavedTheme();
    updateThemeDisplay();
    updateAllDisplays();
    setupEventListeners();
    calculateSmokingCosts();
    initializeEnhancedFeatures();
    
    // Hide loading overlay
    setTimeout(() => {
        hideLoading();
        console.log('✅ PuffOff Profile - Ready!');
    }, 1000);
});

// ===========================================
// DATA MANAGEMENT
// ===========================================

function loadData() {
    try {
        const savedUserData = localStorage.getItem('puffoff_user_data');
        const savedSmokingHistory = localStorage.getItem('puffoff_smoking_history');
        const savedCommunityData = localStorage.getItem('puffoff_community_data');
        const savedJourneyTimeline = localStorage.getItem('puffoff_journey_timeline');
        const savedSavingsGoals = localStorage.getItem('puffoff_savings_goals');
        
        if (savedUserData) {
            userData = { ...userData, ...JSON.parse(savedUserData) };
        }
        
        if (savedSmokingHistory) {
            smokingHistory = { ...smokingHistory, ...JSON.parse(savedSmokingHistory) };
        }
        
        if (savedCommunityData) {
            communityData = { ...communityData, ...JSON.parse(savedCommunityData) };
        }
        
        if (savedJourneyTimeline) {
            journeyTimeline = JSON.parse(savedJourneyTimeline);
        }
        
        if (savedSavingsGoals) {
            savingsGoals = JSON.parse(savedSavingsGoals);
        }
        
        console.log('📊 Data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading data:', error);
        showToast('Gagal memuat data', 'error');
    }
}

function saveData() {
    try {
        localStorage.setItem('puffoff_user_data', JSON.stringify(userData));
        localStorage.setItem('puffoff_smoking_history', JSON.stringify(smokingHistory));
        localStorage.setItem('puffoff_community_data', JSON.stringify(communityData));
        localStorage.setItem('puffoff_journey_timeline', JSON.stringify(journeyTimeline));
        localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
        localStorage.setItem('puffoff_last_save', new Date().toISOString());
        
        console.log('💾 Data saved successfully');
    } catch (error) {
        console.error('❌ Error saving data:', error);
        showToast('Gagal menyimpan data', 'error');
    }
}

function createBackup() {
    const backupData = {
        userData,
        smokingHistory,
        communityData,
        journeyTimeline,
        savingsGoals,
        timestamp: new Date().toISOString(),
        version: '2.1'
    };
    
    return JSON.stringify(backupData, null, 2);
}

function restoreFromBackup(backupString) {
    try {
        const backup = JSON.parse(backupString);
        
        if (backup.userData) userData = { ...userData, ...backup.userData };
        if (backup.smokingHistory) smokingHistory = { ...smokingHistory, ...backup.smokingHistory };
        if (backup.communityData) communityData = { ...communityData, ...backup.communityData };
        if (backup.journeyTimeline) journeyTimeline = backup.journeyTimeline;
        if (backup.savingsGoals) savingsGoals = backup.savingsGoals;
        
        saveData();
        updateAllDisplays();
        showToast('Data berhasil dipulihkan!', 'success');
        
        return true;
    } catch (error) {
        console.error('❌ Error restoring backup:', error);
        showToast('Gagal memulihkan data backup', 'error');
        return false;
    }
}

// ===========================================
// THEME MANAGEMENT
// ===========================================

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('puffoff-theme') || userData.theme || 'default';
    selectedTheme = savedTheme;
    userData.theme = savedTheme;
    document.body.setAttribute('data-theme', savedTheme);
    
    // Update dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = savedTheme === 'dark';
    }
}

function updateThemeDisplay() {
    const currentThemeEl = document.getElementById('currentTheme');
    if (currentThemeEl) {
        currentThemeEl.textContent = themes[selectedTheme].name;
    }
}

function openThemeSelector() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        // Update selected theme in modal
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.theme === selectedTheme) {
                option.classList.add('selected');
            }
        });
        
        modal.classList.add('show');
        console.log('🎨 Theme selector opened');
    }
}

function closeThemeSelector() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function selectTheme(theme) {
    selectedTheme = theme;
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-theme="${theme}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    console.log(`🎨 Theme selected: ${theme}`);
}

function applyTheme() {
    document.body.setAttribute('data-theme', selectedTheme);
    userData.theme = selectedTheme;
    localStorage.setItem('puffoff-theme', selectedTheme);
    updateThemeDisplay();
    closeThemeSelector();
    saveData();
    
    showToast(`Tema ${themes[selectedTheme].name} diterapkan!`, 'success');
    console.log(`✅ Theme applied: ${selectedTheme}`);
}

function toggleTheme() {
    const toggle = document.getElementById('darkModeToggle');
    const isDark = toggle.checked;
    
    if (isDark) {
        selectedTheme = 'dark';
    } else {
        selectedTheme = 'default';
    }
    
    applyTheme();
}

// ===========================================
// DISPLAY UPDATE FUNCTIONS
// ===========================================

function updateAllDisplays() {
    updateProfileDisplay();
    updateCommunityDisplay();
    updateSavingsGoalsDisplay();
    updateSmokingHistoryDisplay();
    updateTimelineDisplay();
    
    console.log('🔄 All displays updated');
}

function updateProfileDisplay() {
    const profileName = document.getElementById('profileName');
    const profileStatus = document.getElementById('profileStatus');
    const profileImage = document.getElementById('profileImage');
    const profileUserId = document.getElementById('profileUserId');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const userLevel = document.getElementById('userLevel');
    const mainBadge = document.getElementById('mainBadge');
    const healthIndicator = document.getElementById('healthIndicator');
    const referralCode = document.getElementById('referralCode');
    
    if (profileName) profileName.textContent = userData.name;
    if (profileStatus) profileStatus.textContent = userData.status;
    if (profileImage) profileImage.src = userData.avatar;
    if (profileUserId) profileUserId.textContent = userData.userId;
    if (profileEmail) profileEmail.textContent = userData.email;
    if (profilePhone) profilePhone.textContent = userData.phone;
    if (userLevel) userLevel.textContent = userData.level;
    if (mainBadge) mainBadge.textContent = 'Week Warrior';
    if (referralCode) referralCode.textContent = userData.referralCode;
    
    if (healthIndicator) {
        healthIndicator.className = `health-indicator level-${userData.level}`;
    }
}

function updateCommunityDisplay() {
    // Update referral stats
    const totalReferralsEl = document.getElementById('totalReferrals');
    const referralRewardsEl = document.getElementById('referralRewards');
    
    if (totalReferralsEl) {
        animateValue(totalReferralsEl, 0, communityData.totalReferrals, 1000);
    }
    
    if (referralRewardsEl) {
        animateValue(referralRewardsEl, 0, communityData.referralRewards, 1200);
    }
}

function updateSavingsGoalsDisplay() {
    updateGoalsOverview();
    updateGoalsList();
}

function updateGoalsOverview() {
    const totalGoalsEl = document.getElementById('totalGoals');
    const completedGoalsEl = document.getElementById('completedGoals');
    const totalTargetAmountEl = document.getElementById('totalTargetAmount');
    
    const activeGoals = savingsGoals.filter(goal => !goal.completed).length;
    const completedGoals = savingsGoals.filter(goal => goal.completed).length;
    const totalTargetAmount = savingsGoals.reduce((total, goal) => total + goal.target, 0);
    
    if (totalGoalsEl) {
        animateValue(totalGoalsEl, 0, activeGoals, 1000);
    }
    
    if (completedGoalsEl) {
        animateValue(completedGoalsEl, 0, completedGoals, 1200);
    }
    
    if (totalTargetAmountEl) {
        setTimeout(() => {
            totalTargetAmountEl.textContent = formatCurrency(totalTargetAmount);
        }, 800);
    }
}

function updateGoalsList() {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;
    
    // Clear existing goals
    goalsList.innerHTML = '';
    
    // Add each goal
    savingsGoals.forEach(goal => {
        const percentage = Math.min(Math.round((userData.totalSavings / goal.target) * 100), 100);
        const saved = Math.min(userData.totalSavings, goal.target);
        const remaining = Math.max(goal.target - userData.totalSavings, 0);
        
        // Update goal progress
        goal.progress = percentage;
        
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-header">
                <div class="goal-category-icon">${categoryIcons[goal.category] || '📦'}</div>
                <div class="goal-info">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-category">${capitalizeFirst(goal.category)}</div>
                </div>
                <div class="goal-amount">${formatCurrency(goal.target)}</div>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="goal-percentage">${percentage}%</div>
            </div>
            <div class="goal-details">
                <div class="goal-saved">Tersimpan: ${formatCurrency(saved)}</div>
                <div class="goal-remaining">Sisa: ${formatCurrency(remaining)}</div>
            </div>
        `;
        
        // Add click event for goal detail
        goalElement.addEventListener('click', () => {
            showGoalDetail(goal);
        });
        
        goalsList.appendChild(goalElement);
        
        // Check for goal completion
        if (percentage >= 100 && !goal.completed) {
            goal.completed = true;
            goal.completedDate = new Date().toISOString();
            showToast(`🎉 Target "${goal.title}" tercapai!`, 'success');
            
            // Show achievement popup
            setTimeout(() => {
                showAchievementPopup('🎯', 'Goal Achieved!', `Selamat! Target "${goal.title}" berhasil dicapai!`);
            }, 1000);
        }
    });
    
    // Animate progress bars after rendering
    setTimeout(() => {
        document.querySelectorAll('.goal-progress-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 100);
}

function showGoalDetail(goal) {
    const percentage = Math.min(Math.round((userData.totalSavings / goal.target) * 100), 100);
    const saved = Math.min(userData.totalSavings, goal.target);
    const remaining = Math.max(goal.target - userData.totalSavings, 0);
    const dailySavings = calculateDailyCost();
    const daysToComplete = remaining > 0 ? Math.ceil(remaining / dailySavings) : 0;
    
    showToast(`${goal.title}: ${percentage}% tercapai. ${daysToComplete > 0 ? `Estimasi ${daysToComplete} hari lagi.` : 'Target tercapai!'}`, 'info');
}

function updateSmokingHistoryDisplay() {
    const cigarettesPerDayEl = document.getElementById('cigarettesPerDay');
    const costPerDayEl = document.getElementById('costPerDay');
    const smokingDurationEl = document.getElementById('smokingDuration');
    const totalSpentEl = document.getElementById('totalSpent');
    
    if (smokingHistory.isSetup) {
        const dailyCost = calculateDailyCost();
        const totalYears = smokingHistory.smokingYears + (smokingHistory.smokingMonths / 12);
        const totalSpent = dailyCost * 365 * totalYears;
        
        if (cigarettesPerDayEl) cigarettesPerDayEl.textContent = `${smokingHistory.cigarettesPerDay} batang`;
        if (costPerDayEl) costPerDayEl.textContent = formatCurrency(dailyCost);
        if (smokingDurationEl) smokingDurationEl.textContent = `${smokingHistory.smokingYears} tahun`;
        if (totalSpentEl) totalSpentEl.textContent = formatCurrency(totalSpent);
    }
}

function updateTimelineDisplay() {
    // Timeline is static in HTML for this demo
    // In real app, this would dynamically generate timeline items based on journeyTimeline array
    console.log('📅 Timeline display updated');
}

// ===========================================
// PROFILE FUNCTIONS
// ===========================================

function changeAvatar() {
    const avatars = [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1494790108755-2616b612e906?w=150&h=150&fit=crop&crop=face&auto=format'
    ];
    
    const currentIndex = avatars.indexOf(userData.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    
    userData.avatar = avatars[nextIndex];
    saveData();
    updateProfileDisplay();
    showToast('Avatar berhasil diubah!', 'success');
    
    console.log('👤 Avatar changed');
}

function openEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        document.getElementById('editName').value = userData.name;
        document.getElementById('editStatus').value = userData.status;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editPhone').value = userData.phone;
        document.getElementById('editBio').value = userData.bio || '';
        document.getElementById('editStartDate').value = userData.startDate;
        
        modal.classList.add('show');
        console.log('✏️ Edit profile modal opened');
    }
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveProfile() {
    const name = document.getElementById('editName').value;
    const status = document.getElementById('editStatus').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const bio = document.getElementById('editBio').value;
    const startDate = document.getElementById('editStartDate').value;
    
    // Validation
    if (name.trim() === '') {
        showToast('Nama tidak boleh kosong', 'error');
        return;
    }
    
    if (name.length < 2) {
        showToast('Nama harus minimal 2 karakter', 'error');
        return;
    }
    
    if (email && !validateEmail(email)) {
        showToast('Format email tidak valid', 'error');
        return;
    }
    
    if (phone && !validatePhone(phone)) {
        showToast('Format nomor telepon tidak valid', 'error');
        return;
    }
    
    userData.name = name.trim();
    userData.status = status.trim();
    userData.email = email.trim();
    userData.phone = phone.trim();
    userData.bio = bio.trim();
    userData.startDate = startDate;
    
    saveData();
    updateProfileDisplay();
    closeEditProfile();
    showToast('Profil berhasil diperbarui!', 'success');
    
    console.log('✅ Profile saved');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// ===========================================
// FRIENDS & COMMUNITY FUNCTIONS
// ===========================================

function copyReferralCode() {
    const code = document.getElementById('referralCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Kode referral berhasil disalin!', 'success');
        
        // Add visual feedback
        const codeElement = document.getElementById('referralCode');
        codeElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            codeElement.style.transform = 'scale(1)';
        }, 200);
        
        console.log(`📋 Referral code copied: ${code}`);
    }).catch(() => {
        showToast('Gagal menyalin kode referral', 'error');
    });
}

function inviteFriends() {
    const code = userData.referralCode;
    const message = `🚭 Halo! Aku lagi pakai aplikasi PuffOff untuk berhenti merokok. Ayo gabung juga dengan kode referral: ${code}

Kita bisa saling support dan pantau progress masing-masing! 💪

Download: ${window.location.origin}`;

    if (navigator.share) {
        navigator.share({
            title: 'Bergabung dengan PuffOff',
            text: message,
            url: window.location.origin
        }).then(() => {
            console.log('📤 Invite shared successfully');
        }).catch(() => {
            // Fallback to clipboard
            navigator.clipboard.writeText(message);
            showToast('Link undangan disalin! Bagikan ke teman Anda.', 'info');
        });
    } else {
        navigator.clipboard.writeText(message);
        showToast('Link undangan disalin! Bagikan ke teman Anda.', 'info');
    }
}

function findFriends() {
    showToast('Fitur pencarian teman akan segera hadir!', 'info');
    console.log('🔍 Find friends feature accessed');
}

function sendSupport(friendId) {
    showToast(`Dukungan berhasil dikirim!`, 'success');
    
    // Add heart animation effect
    if (event && event.target) {
        event.target.style.transform = 'scale(1.2)';
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 200);
    }
    
    console.log(`❤️ Support sent to friend: ${friendId}`);
}

function sendChallenge(friendId) {
    showToast(`Tantangan berhasil dikirim!`, 'success');
    
    // Add fire animation effect
    if (event && event.target) {
        event.target.style.transform = 'scale(1.2)';
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 200);
    }
    
    console.log(`🔥 Challenge sent to friend: ${friendId}`);
}

function shareProfile() {
    const text = `🔥 Bergabung dengan komunitas PuffOff!
👤 ${userData.name}
🎯 ${userData.status}
📧 ${userData.email}

Kode referral: ${userData.referralCode}

#PuffOff #BebasRokok`;

    if (navigator.share) {
        navigator.share({
            title: 'Profil PuffOff Saya',
            text: text,
            url: window.location.href
        }).then(() => {
            console.log('📤 Profile shared successfully');
        }).catch(() => {
            navigator.clipboard.writeText(text);
            showToast('Profil berhasil disalin!', 'success');
        });
    } else {
        navigator.clipboard.writeText(text);
        showToast('Profil berhasil disalin!', 'success');
    }
}

// ===========================================
// REFERRAL FUNCTIONS
// ===========================================

function openReferralModal() {
    const modal = document.getElementById('referralModal');
    if (modal) {
        document.getElementById('friendReferralCode').value = '';
        modal.classList.add('show');
        console.log('🎁 Referral modal opened');
    }
}

function closeReferralModal() {
    const modal = document.getElementById('referralModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function submitReferralCode() {
    const code = document.getElementById('friendReferralCode').value.toUpperCase().trim();
    
    if (!code) {
        showToast('Masukkan kode referral terlebih dahulu', 'error');
        return;
    }
    
    if (code.length < 8 || code.length > 10) {
        showToast('Kode referral harus 8-10 karakter', 'error');
        return;
    }
    
    if (code === userData.referralCode) {
        showToast('Tidak bisa menggunakan kode referral sendiri', 'error');
        return;
    }
    
    if (userData.joinedReferrals.includes(code)) {
        showToast('Kode referral sudah pernah digunakan', 'error');
        return;
    }
    
    // Simulate API call
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        if (validReferralCodes.includes(code)) {
            userData.joinedReferrals.push(code);
            communityData.referralRewards += 50;
            
            // Add friend to community (simulate)
            const friendName = code.replace('2024', '').toLowerCase();
            const newFriend = {
                id: friendName,
                name: capitalizeFirst(friendName),
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face&auto=format',
                progress: '1 hari bebas rokok',
                progressPercent: 10,
                status: 'online',
                streak: 1
            };
            
            communityData.friends.push(newFriend);
            saveData();
            updateCommunityDisplay();
            closeReferralModal();
            
            showToast('🎉 Berhasil bergabung! Bonus 50 poin ditambahkan.', 'success');
            
            setTimeout(() => {
                showAchievementPopup('🎁', 'Bonus Referral!', 'Anda mendapat 50 poin bonus!');
            }, 1000);
            
            console.log(`✅ Referral code submitted: ${code}`);
        } else {
            showToast('Kode referral tidak valid', 'error');
        }
    }, 1500);
}

// ===========================================
// SMOKING HISTORY FUNCTIONS
// ===========================================

function openSmokingHistory() {
    const modal = document.getElementById('smokingHistoryModal');
    if (modal) {
        // Pre-fill with current data
        document.getElementById('cigarettesPerDayInput').value = smokingHistory.cigarettesPerDay;
        document.getElementById('pricePerPackInput').value = smokingHistory.pricePerPack;
        document.getElementById('smokingYears').value = smokingHistory.smokingYears;
        document.getElementById('smokingMonths').value = smokingHistory.smokingMonths;
        
        // Setup real-time calculation
        setupSmokingHistoryCalculation();
        updateSmokingCalculationPreview();
        
        modal.classList.add('show');
        console.log('🚬 Smoking history modal opened');
    }
}

function closeSmokingHistory() {
    const modal = document.getElementById('smokingHistoryModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function setupSmokingHistoryCalculation() {
    const inputs = ['cigarettesPerDayInput', 'pricePerPackInput', 'smokingYears', 'smokingMonths'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateSmokingCalculationPreview);
        }
    });
}

function updateSmokingCalculationPreview() {
    const cigarettesPerDay = parseInt(document.getElementById('cigarettesPerDayInput').value) || 0;
    const pricePerPack = parseInt(document.getElementById('pricePerPackInput').value) || 0;
    const years = parseInt(document.getElementById('smokingYears').value) || 0;
    const months = parseInt(document.getElementById('smokingMonths').value) || 0;
    
    const cigarettesPerPack = 20;
    const dailyCost = (cigarettesPerDay / cigarettesPerPack) * pricePerPack;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;
    const totalLifetimeCost = yearlyCost * years + (monthlyCost * months);
    
    // Update preview elements
    const dailyCostEl = document.getElementById('dailyCost');
    const monthlyCostEl = document.getElementById('monthlyCost');
    const yearlyCostEl = document.getElementById('yearlyCost');
    const totalLifetimeCostEl = document.getElementById('totalLifetimeCost');
    
    if (dailyCostEl) dailyCostEl.textContent = formatCurrency(dailyCost);
    if (monthlyCostEl) monthlyCostEl.textContent = formatCurrency(monthlyCost);
    if (yearlyCostEl) yearlyCostEl.textContent = formatCurrency(yearlyCost);
    if (totalLifetimeCostEl) totalLifetimeCostEl.textContent = formatCurrency(totalLifetimeCost);
    
    // Add visual feedback for high costs
    if (totalLifetimeCostEl) {
        if (totalLifetimeCost > 50000000) { // 50 million
            totalLifetimeCostEl.style.color = '#ef4444';
            totalLifetimeCostEl.style.fontWeight = '700';
        } else if (totalLifetimeCost > 10000000) { // 10 million
            totalLifetimeCostEl.style.color = '#f59e0b';
            totalLifetimeCostEl.style.fontWeight = '600';
        } else {
            totalLifetimeCostEl.style.color = '#6b7280';
            totalLifetimeCostEl.style.fontWeight = '600';
        }
    }
}

function saveSmokingHistory() {
    const cigarettesPerDay = parseInt(document.getElementById('cigarettesPerDayInput').value);
    const pricePerPack = parseInt(document.getElementById('pricePerPackInput').value);
    const years = parseInt(document.getElementById('smokingYears').value) || 0;
    const months = parseInt(document.getElementById('smokingMonths').value) || 0;
    
    // Validation
    if (!cigarettesPerDay || cigarettesPerDay < 1 || cigarettesPerDay > 100) {
        showToast('Jumlah rokok per hari harus antara 1-100', 'error');
        return;
    }
    
    if (!pricePerPack || pricePerPack < 1000) {
        showToast('Harga per bungkus minimal Rp 1,000', 'error');
        return;
    }
    
    if (years === 0 && months === 0) {
        showToast('Durasi merokok tidak boleh kosong', 'error');
        return;
    }
    
    // Save data
    smokingHistory.cigarettesPerDay = cigarettesPerDay;
    smokingHistory.pricePerPack = pricePerPack;
    smokingHistory.smokingYears = years;
    smokingHistory.smokingMonths = months;
    smokingHistory.isSetup = true;
    
    saveData();
    updateSmokingHistoryDisplay();
    calculateSmokingCosts();
    closeSmokingHistory();
    
    showToast('Riwayat merokok berhasil disimpan!', 'success');
    console.log('💾 Smoking history saved');
}

// ===========================================
// SAVINGS GOALS FUNCTIONS
// ===========================================

function openAddGoal() {
    const modal = document.getElementById('addGoalModal');
    if (modal) {
        // Clear form
        document.getElementById('goalName').value = '';
        document.getElementById('goalAmount').value = '';
        document.getElementById('goalCategory').value = 'elektronik';
        document.getElementById('goalTargetDate').value = '';
        
        // Setup real-time preview
        setupGoalPreview();
        updateGoalPreview();
        
        modal.classList.add('show');
        console.log('🎯 Add goal modal opened');
    }
}

function closeAddGoal() {
    const modal = document.getElementById('addGoalModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function setupGoalPreview() {
    const inputs = ['goalName', 'goalAmount', 'goalTargetDate'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateGoalPreview);
        }
    });
}

function updateGoalPreview() {
    const goalAmount = parseInt(document.getElementById('goalAmount').value) || 0;
    const targetDate = document.getElementById('goalTargetDate').value;
    const dailySavings = calculateDailyCost();
    
    const previewDailySavingsEl = document.getElementById('previewDailySavings');
    const previewTimeEstimateEl = document.getElementById('previewTimeEstimate');
    const previewCurrentProgressEl = document.getElementById('previewCurrentProgress');
    
    if (previewDailySavingsEl) {
        previewDailySavingsEl.textContent = formatCurrency(dailySavings);
    }
    
    if (goalAmount > 0 && dailySavings > 0) {
        const daysNeeded = Math.ceil(goalAmount / dailySavings);
        const currentProgress = Math.min((userData.totalSavings / goalAmount) * 100, 100);
        
        if (previewTimeEstimateEl) {
            if (daysNeeded > 365) {
                const years = Math.floor(daysNeeded / 365);
                const remainingDays = daysNeeded % 365;
                previewTimeEstimateEl.textContent = `${years} tahun ${remainingDays} hari`;
            } else {
                previewTimeEstimateEl.textContent = `${daysNeeded} hari`;
            }
        }
        
        if (previewCurrentProgressEl) {
            previewCurrentProgressEl.textContent = `${currentProgress.toFixed(1)}%`;
        }
    } else {
        if (previewTimeEstimateEl) previewTimeEstimateEl.textContent = '0 hari';
        if (previewCurrentProgressEl) previewCurrentProgressEl.textContent = '0%';
    }
    
    // Target date validation
    if (targetDate) {
        const targetDateObj = new Date(targetDate);
        const today = new Date();
        const daysUntilTarget = Math.ceil((targetDateObj - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilTarget > 0 && goalAmount > 0) {
            const requiredDailySavings = Math.ceil(goalAmount / daysUntilTarget);
            
            if (requiredDailySavings > dailySavings) {
                if (previewTimeEstimateEl) {
                    previewTimeEstimateEl.innerHTML = `${daysUntilTarget} hari <br><small style="color: #ef4444;">⚠️ Target terlalu ambisius</small>`;
                }
            } else {
                if (previewTimeEstimateEl) {
                    previewTimeEstimateEl.innerHTML = `${daysUntilTarget} hari <br><small style="color: #10b981;">✅ Target realistis</small>`;
                }
            }
        }
    }
}

function saveGoal() {
    const name = document.getElementById('goalName').value.trim();
    const amount = parseInt(document.getElementById('goalAmount').value);
    const category = document.getElementById('goalCategory').value;
    const targetDate = document.getElementById('goalTargetDate').value;
    
    // Validation
    if (!name) {
        showToast('Nama target tidak boleh kosong', 'error');
        return;
    }
    
    if (name.length < 3) {
        showToast('Nama target minimal 3 karakter', 'error');
        return;
    }
    
    if (!amount || amount < 10000) {
        showToast('Jumlah target minimal Rp 10,000', 'error');
        return;
    }
    
    if (amount > 1000000000) { // 1 billion
        showToast('Jumlah target maksimal Rp 1,000,000,000', 'error');
        return;
    }
    
    // Check for duplicate names
    if (savingsGoals.some(goal => goal.title.toLowerCase() === name.toLowerCase())) {
        showToast('Nama target sudah ada', 'error');
        return;
    }
    
    // Create new goal
    const newGoal = {
        id: Date.now(),
        title: name,
        target: amount,
        category: category,
        progress: 0,
        completed: false,
        createdDate: new Date().toISOString(),
        targetDate: targetDate || null
    };
    
    savingsGoals.push(newGoal);
    saveData();
    updateSavingsGoalsDisplay();
    closeAddGoal();
    
    showToast(`Target "${name}" berhasil ditambahkan!`, 'success');
    
    // Show motivation message
    setTimeout(() => {
        const dailySavings = calculateDailyCost();
        const daysNeeded = Math.ceil(amount / dailySavings);
        showToast(`💪 Dengan hemat Rp ${formatCurrency(dailySavings)}/hari, target ini bisa tercapai dalam ${daysNeeded} hari!`, 'info');
    }, 2000);
    
    console.log('✅ New goal saved:', newGoal);
}

// ===========================================
// CALCULATION FUNCTIONS
// ===========================================

function calculateDailyCost() {
    if (!smokingHistory.isSetup) return 30000; // Default
    
    const cigarettesPerPack = 20;
    return Math.round((smokingHistory.cigarettesPerDay / cigarettesPerPack) * smokingHistory.pricePerPack);
}

function calculateSmokingCosts() {
    if (!smokingHistory.isSetup) return;
    
    const dailyCost = calculateDailyCost();
    const totalYears = smokingHistory.smokingYears + (smokingHistory.smokingMonths / 12);
    const totalSpent = dailyCost * 365 * totalYears;
    
    // Calculate days since quit (simulate 7 days for demo)
    const daysSinceQuit = 7;
    userData.totalSavings = dailyCost * daysSinceQuit;
    
    console.log(`💰 Daily cost: ${formatCurrency(dailyCost)}, Total spent: ${formatCurrency(totalSpent)}, Current savings: ${formatCurrency(userData.totalSavings)}`);
}

// ===========================================
// SETTINGS FUNCTIONS
// ===========================================

function openNotificationSettings() {
    showToast('Pengaturan notifikasi akan segera hadir!', 'info');
    console.log('🔔 Notification settings accessed');
}

function openDataManagement() {
    const options = [
        'Export Data',
        'Import Data',
        'Reset Data',
        'Create Backup'
    ];
    
    const choice = prompt(`Pilih opsi:\n1. Export Data\n2. Import Data\n3. Reset Data\n4. Create Backup\n\nMasukkan nomor (1-4):`);
    
    switch(choice) {
        case '1':
            exportData();
            break;
        case '2':
            importData();
            break;
        case '3':
            if (confirm('⚠️ Reset akan menghapus semua data. Lanjutkan?')) {
                resetAllData();
            }
            break;
        case '4':
            createAndDownloadBackup();
            break;
        default:
            showToast('Pilihan tidak valid', 'error');
    }
}

function exportData() {
    const exportData = {
        userData,
        smokingHistory,
        communityData,
        savingsGoals,
        journeyTimeline,
        exportDate: new Date().toISOString(),
        version: '2.1'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `puffoff-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Data berhasil diekspor!', 'success');
    console.log('📤 Data exported');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    if (importedData.userData) userData = { ...userData, ...importedData.userData };
                    if (importedData.smokingHistory) smokingHistory = { ...smokingHistory, ...importedData.smokingHistory };
                    if (importedData.communityData) communityData = { ...communityData, ...importedData.communityData };
                    if (importedData.savingsGoals) savingsGoals = importedData.savingsGoals;
                    if (importedData.journeyTimeline) journeyTimeline = importedData.journeyTimeline;
                    
                    saveData();
                    updateAllDisplays();
                    showToast('Data berhasil diimpor!', 'success');
                    
                    console.log('📥 Data imported');
                } catch (error) {
                    showToast('File tidak valid atau rusak', 'error');
                    console.error('Import error:', error);
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

function resetAllData() {
    localStorage.clear();
    showToast('Semua data berhasil direset. Halaman akan dimuat ulang.', 'info');
    
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

function createAndDownloadBackup() {
    const backup = createBackup();
    const dataBlob = new Blob([backup], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `puffoff-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Backup berhasil dibuat!', 'success');
}

function resetProgress() {
    if (confirm('⚠️ Reset progress akan menghapus semua pencapaian. Yakin ingin melanjutkan?')) {
        // Reset user progress but keep profile data
        userData.totalSavings = 0;
        userData.level = 1;
        
        // Reset goals progress
        savingsGoals.forEach(goal => {
            goal.progress = 0;
            goal.completed = false;
        });
        
        // Reset timeline to initial state
        journeyTimeline = [
            {
                id: 1,
                title: 'Memulai Perjalanan Baru 🌟',
                description: 'Mengatur ulang progress dan memulai komitmen baru',
                date: new Date().toLocaleDateString('id-ID'),
                status: 'completed'
            }
        ];
        
        saveData();
        updateAllDisplays();
        showToast('Progress berhasil direset! Semangat memulai lagi! 💪', 'success');
        
        console.log('🔄 Progress reset');
    }
}

function confirmLogout() {
    if (confirm('Yakin ingin keluar dari aplikasi?')) {
        showToast('Keluar dari aplikasi...', 'info');
        
        setTimeout(() => {
            // In real app, this would redirect to login page
            window.location.href = 'index.html';
        }, 1500);
    }
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}K`;
    } else {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function animateValue(element, start, end, duration) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
    
    console.log(`🍞 Toast: ${type} - ${message}`);
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function showAchievementPopup(icon, title, message) {
    // Create achievement popup element
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-title">${title}</div>
            <div class="achievement-message">${message}</div>
        </div>
    `;
    
    // Add styles
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 24px;
        border-radius: 16px;
        text-align: center;
        z-index: 10002;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(popup);
    
    // Animate in
    setTimeout(() => {
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        popup.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 300);
    }, 3000);
}

// ===========================================
// EVENT LISTENERS SETUP
// ===========================================

function setupEventListeners() {
    // Modal close on backdrop click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
    
    // Form submission prevention
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
    
    // Real-time input formatting
    document.addEventListener('input', function(e) {
        if (e.target.type === 'tel') {
            // Format phone number
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('62')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                value = '+62' + value.substring(1);
            }
            e.target.value = value;
        }
        
        if (e.target.type === 'email') {
            // Basic email formatting
            e.target.value = e.target.value.toLowerCase().trim();
        }
        
        if (e.target.id === 'friendReferralCode') {
            // Format referral code
            e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        }
    });
    
    console.log('🎧 Event listeners setup complete');
}

function initializeEnhancedFeatures() {
    // Auto-save data every 30 seconds
    setInterval(() => {
        saveData();
    }, 30000);
    
    // Update time-based elements
    setInterval(() => {
        updateTimeBasedElements();
    }, 60000); // Every minute
    
    // Check for achievements periodically
    setInterval(() => {
        checkForAchievements();
    }, 10000); // Every 10 seconds
    
    console.log('🚀 Enhanced features initialized');
}

function updateTimeBasedElements() {
    // Update any time-sensitive displays
    const now = new Date();
    
    // Update savings based on time passed
    const daysSinceQuit = Math.floor((now - new Date(userData.startDate)) / (1000 * 60 * 60 * 24));
    if (daysSinceQuit > 0) {
        const dailySavings = calculateDailyCost();
        userData.totalSavings = dailySavings * daysSinceQuit;
        updateSavingsGoalsDisplay();
    }
}

function checkForAchievements() {
    // Check for various achievements
    const achievements = [
        {
            id: 'first_week',
            condition: () => userData.totalSavings >= calculateDailyCost() * 7,
            icon: '🏆',
            title: 'First Week!',
            message: 'Selamat! Anda telah bebas rokok selama 1 minggu!'
        },
        {
            id: 'first_month',
            condition: () => userData.totalSavings >= calculateDailyCost() * 30,
            icon: '🎉',
            title: 'Monthly Champion!',
            message: 'Luar biasa! 1 bulan bebas rokok tercapai!'
        },
        {
            id: 'big_saver',
            condition: () => userData.totalSavings >= 1000000,
            icon: '💰',
            title: 'Big Saver!',
            message: 'Anda telah menghemat lebih dari 1 juta rupiah!'
        }
    ];
    
    // Check each achievement (in real app, this would be stored in localStorage)
    achievements.forEach(achievement => {
        if (achievement.condition() && !userData.achievementsUnlocked?.includes(achievement.id)) {
            if (!userData.achievementsUnlocked) {
                userData.achievementsUnlocked = [];
            }
            
            userData.achievementsUnlocked.push(achievement.id);
            showAchievementPopup(achievement.icon, achievement.title, achievement.message);
            saveData();
        }
    });
}

// ===========================================
// INITIALIZE ON LOAD
// ===========================================

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Already handled above
    });
} else {
    // Document already loaded
    setTimeout(() => {
        if (typeof loadData === 'function') {
            loadData();
            loadSavedTheme();
            updateThemeDisplay();
            updateAllDisplays();
            setupEventListeners();
            calculateSmokingCosts();
            initializeEnhancedFeatures();
            hideLoading();
        }
    }, 100);
}

console.log('📱 PuffOff Profile JavaScript loaded successfully!');
