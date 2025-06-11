// Global variables dengan fitur tema dan friends
let userData = {
    name: 'Ahmad Wijaya',
    status: 'Pejuang Bebas Rokok',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
    startDate: '2024-01-15',
    bio: 'Memulai perjalanan bebas rokok untuk hidup yang lebih sehat dan produktif.',
    streak: 7,
    totalSavings: 210000,
    healthScore: 78,
    level: 4,
    cigarettesAvoided: 84,
    totalBadges: 4,
    referralCode: 'AHMAD2024',
    theme: 'default',
    isPrivate: false
};

let smokingHistory = {
    cigarettesPerDay: 12,
    pricePerPack: 25000,
    smokingYears: 5,
    smokingMonths: 0,
    isSetup: true
};

let savingsGoals = [
    {
        id: 1,
        title: 'Smartphone Baru',
        target: 3000000,
        category: 'elektronik'
    },
    {
        id: 2,
        title: 'Liburan Keluarga',
        target: 8000000,
        category: 'liburan'
    }
];

let friends = [
    {
        id: 'sarah',
        name: 'Sarah Putri',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face&auto=format',
        streak: 12,
        isOnline: true,
        progress: 80
    },
    {
        id: 'budi',
        name: 'Budi Santoso',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face&auto=format',
        streak: 3,
        isOnline: false,
        progress: 20
    }
];

let achievements = {
    'fire-starter': {
        icon: '🔥',
        title: 'Fire Starter',
        description: 'Selamat! Anda telah berhasil tidak merokok selama 3 hari berturut-turut.',
        earnedDate: '2024-01-16',
        tips: 'Terus pertahankan momentum ini dengan mengingat alasan mengapa Anda ingin berhenti merokok.'
    },
    'money-saver': {
        icon: '💰',
        title: 'Money Saver',
        description: 'Luar biasa! Anda telah menghemat Rp 100.000 dari tidak merokok.',
        earnedDate: '2024-01-18',
        tips: 'Gunakan uang yang dihemat untuk sesuatu yang bermanfaat bagi kesehatan Anda.'
    },
    'week-warrior': {
        icon: '🏃',
        title: 'Week Warrior',
        description: 'Pencapaian hebat! Anda telah bebas rokok selama 7 hari konsisten.',
        earnedDate: '2024-01-22',
        tips: 'Minggu pertama adalah yang tersulit. Anda sudah melewatinya dengan baik!'
    },
    'social-supporter': {
        icon: '🤝',
        title: 'Social Supporter',
        description: 'Terima kasih! Anda telah mendukung 5 teman dalam perjalanan mereka.',
        earnedDate: '2024-01-20',
        tips: 'Dukungan dari teman sangat berarti dalam perjalanan bebas rokok.'
    }
};

let themes = {
    default: { name: 'Default', primary: '#667eea', secondary: '#764ba2' },
    ocean: { name: 'Ocean', primary: '#06b6d4', secondary: '#0891b2' },
    forest: { name: 'Forest', primary: '#10b981', secondary: '#059669' },
    sunset: { name: 'Sunset', primary: '#f59e0b', secondary: '#d97706' },
    purple: { name: 'Purple', primary: '#8b5cf6', secondary: '#7c3aed' },
    dark: { name: 'Dark', primary: '#374151', secondary: '#1f2937' }
};

let selectedChallenge = null;
let currentFriend = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    applyTheme(userData.theme);
    updateAllDisplays();
    setupEventListeners();
    initializeCalculation();
    updateFriendsList();
});

function loadData() {
    try {
        const savedUserData = localStorage.getItem('puffoff_user_data');
        const savedSmokingHistory = localStorage.getItem('puffoff_smoking_history');
        const savedGoals = localStorage.getItem('puffoff_savings_goals');
        const savedFriends = localStorage.getItem('puffoff_friends');
        
        if (savedUserData) {
            userData = { ...userData, ...JSON.parse(savedUserData) };
        }
        
        if (savedSmokingHistory) {
            smokingHistory = { ...smokingHistory, ...JSON.parse(savedSmokingHistory) };
        }
        
        if (savedGoals) {
            savingsGoals = JSON.parse(savedGoals);
        }
        
        if (savedFriends) {
            friends = JSON.parse(savedFriends);
        }
    } catch (error) {
        console.log('Error loading data:', error);
    }
}

function saveData() {
    try {
        localStorage.setItem('puffoff_user_data', JSON.stringify(userData));
        localStorage.setItem('puffoff_smoking_history', JSON.stringify(smokingHistory));
        localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
        localStorage.setItem('puffoff_friends', JSON.stringify(friends));
    } catch (error) {
        console.log('Error saving data:', error);
    }
}

// Theme Functions
function applyTheme(themeName) {
    const theme = themes[themeName] || themes.default;
    const root = document.documentElement;
    
    root.setAttribute('data-theme', themeName);
    
    // Update theme badge
    const themeBadge = document.getElementById('themeName');
    if (themeBadge) {
        themeBadge.textContent = theme.name;
    }
    
    userData.theme = themeName;
    saveData();
}

function openThemeSelector() {
    const modal = document.getElementById('themeSelectorModal');
    if (modal) {
        // Update active theme
        const themeOptions = modal.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.theme === userData.theme) {
                option.classList.add('active');
            }
        });
        
        modal.classList.add('show');
    }
}

function closeThemeSelector() {
    const modal = document.getElementById('themeSelectorModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function selectTheme(themeName) {
    // Update active state
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === themeName) {
            option.classList.add('active');
        }
    });
    
    applyTheme(themeName);
    showToast(`Tema ${themes[themeName].name} diterapkan!`, 'success');
}

// Setup theme selector click events
function setupThemeEvents() {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectTheme(option.dataset.theme);
        });
    });
}

function updateAllDisplays() {
    updateProfileDisplay();
    updateStatsDisplay();
    updateSmokingHistoryDisplay();
    updateGoalsDisplay();
    updateHealthDisplay();
    updateReferralCode();
}

function updateProfileDisplay() {
    const profileName = document.getElementById('profileName');
    const profileStatus = document.getElementById('profileStatus');
    const profileImage = document.getElementById('profileImage');
    const userLevel = document.getElementById('userLevel');
    const mainBadge = document.getElementById('mainBadge');
    const healthIndicator = document.getElementById('healthIndicator');
    const themeName = document.getElementById('themeName');
    
    if (profileName) profileName.textContent = userData.name;
    if (profileStatus) profileStatus.textContent = userData.status;
    if (profileImage) profileImage.src = userData.avatar;
    if (userLevel) userLevel.textContent = userData.level;
    if (mainBadge) mainBadge.textContent = 'Week Warrior';
    if (themeName) themeName.textContent = themes[userData.theme].name;
    
    if (healthIndicator) {
        healthIndicator.className = `health-indicator level-${userData.level}`;
    }
}

function updateStatsDisplay() {
    const streakElement = document.getElementById('streakDays');
    const savingsElement = document.getElementById('totalSavings');
    const cigarettesElement = document.getElementById('cigarettesAvoided');
    const friendsElement = document.getElementById('friendsCount');
    
    if (streakElement) {
        animateValue(streakElement, 0, userData.streak, 1000);
    }
    
    if (cigarettesElement) {
        animateValue(cigarettesElement, 0, userData.cigarettesAvoided, 1200);
    }
    
    if (friendsElement) {
        animateValue(friendsElement, 0, friends.length, 800);
    }
    
    if (savingsElement) {
        setTimeout(() => {
            savingsElement.textContent = formatCurrency(userData.totalSavings);
        }, 800);
    }
}

function updateReferralCode() {
    const referralCodeEl = document.getElementById('myReferralCode');
    if (referralCodeEl) {
        referralCodeEl.childNodes[0].textContent = userData.referralCode;
    }
}

function updateFriendsList() {
    const friendsList = document.getElementById('friendsList');
    if (!friendsList) return;
    
    friendsList.innerHTML = '';
    
    friends.forEach(friend => {
        const friendElement = createFriendElement(friend);
        friendsList.appendChild(friendElement);
    });
}

function createFriendElement(friend) {
    const friendDiv = document.createElement('div');
    friendDiv.className = 'friend-item';
    friendDiv.innerHTML = `
        <div class="friend-avatar">
            <img src="${friend.avatar}" alt="${friend.name}">
            <div class="friend-status ${friend.isOnline ? 'online' : 'offline'}"></div>
        </div>
        <div class="friend-info">
            <div class="friend-name">${friend.name}</div>
            <div class="friend-progress">${friend.streak} hari bebas rokok</div>
            <div class="friend-progress-bar">
                <div class="progress-fill" style="width: ${friend.progress}%"></div>
            </div>
        </div>
        <div class="friend-actions">
            <button class="support-btn" onclick="openSupportModal('${friend.id}')">
                <i class="fas fa-heart"></i>
            </button>
            <button class="challenge-btn" onclick="openChallengeModal('${friend.id}')">
                <i class="fas fa-fire"></i>
            </button>
        </div>
    `;
    return friendDiv;
}

// Friends Functions
function openAddFriend() {
    const modal = document.getElementById('addFriendModal');
    if (modal) {
        // Reset to first tab
        switchTab('code');
        modal.classList.add('show');
    }
}

function closeAddFriend() {
    const modal = document.getElementById('addFriendModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    const selectedBtn = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedBtn) selectedBtn.classList.add('active');
}

function addFriendByCode() {
    const friendCode = document.getElementById('friendCode').value.toUpperCase();
    
    if (!friendCode) {
        showToast('Masukkan kode referral teman', 'error');
        return;
    }
    
    if (friendCode === userData.referralCode) {
        showToast('Tidak bisa menambah diri sendiri!', 'error');
        return;
    }
    
    // Simulasi penambahan teman
    const newFriend = {
        id: 'friend_' + Date.now(),
        name: 'Teman Baru',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face&auto=format',
        streak: Math.floor(Math.random() * 30),
        isOnline: Math.random() > 0.5,
        progress: Math.floor(Math.random() * 100)
    };
    
    friends.push(newFriend);
    saveData();
    updateFriendsList();
    updateStatsDisplay();
    closeAddFriend();
    showToast(`Teman dengan kode ${friendCode} berhasil ditambahkan!`, 'success');
}

function copyReferralCode() {
    navigator.clipboard.writeText(userData.referralCode).then(() => {
        showToast('Kode referral disalin!', 'success');
    });
}

function shareReferralCode() {
    const text = `Ayo bergabung dengan PuffOff! Gunakan kode referral saya: ${userData.referralCode} untuk memulai perjalanan bebas rokok bersama!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Bergabung dengan PuffOff',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Pesan referral disalin ke clipboard!', 'success');
        });
    }
}

function inviteFriends() {
    const message = `🚭 Halo! Aku lagi pakai aplikasi PuffOff untuk berhenti merokok. Ayo gabung juga dengan kode referral: ${userData.referralCode}

Kita bisa saling support dan pantau progress masing-masing! 💪

Download: ${window.location.origin}`;

    // WhatsApp share
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Challenge Functions
function openChallengeModal(friendId) {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;
    
    currentFriend = friend;
    const modal = document.getElementById('challengeModal');
    if (modal) {
        // Reset selection
        selectedChallenge = null;
        const options = modal.querySelectorAll('.challenge-option');
        options.forEach(option => option.classList.remove('selected'));
        document.getElementById('challengeMessage').value = '';
        
        modal.classList.add('show');
    }
}

function closeChallengeModal() {
    const modal = document.getElementById('challengeModal');
    if (modal) {
        modal.classList.remove('show');
    }
    currentFriend = null;
    selectedChallenge = null;
}

function selectChallenge(type) {
    selectedChallenge = type;
    
    // Update UI
    const options = document.querySelectorAll('.challenge-option');
    options.forEach(option => option.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function sendChallengeMessage() {
    if (!selectedChallenge) {
        showToast('Pilih jenis tantangan terlebih dahulu', 'error');
        return;
    }
    
    const message = document.getElementById('challengeMessage').value;
    const challengeTypes = {
        streak: 'Streak Challenge',
        savings: 'Savings Challenge',
        health: 'Health Challenge'
    };
    
    // Simulasi kirim tantangan
    showToast(`${challengeTypes[selectedChallenge]} berhasil dikirim ke ${currentFriend.name}!`, 'success');
    closeChallengeModal();
}

// Support Functions
function openSupportModal(friendId) {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;
    
    currentFriend = friend;
    const modal = document.getElementById('supportModal');
    if (modal) {
        document.getElementById('supportMessage').value = '';
        modal.classList.add('show');
    }
}

function closeSupportModal() {
    const modal = document.getElementById('supportModal');
    if (modal) {
        modal.classList.remove('show');
    }
    currentFriend = null;
}

function selectTemplate(type) {
    const templates = {
        motivation: 'Kamu hebat! Terus pertahankan ya! 🌟',
        encouragement: 'Jangan menyerah, kamu pasti bisa! 💪',
        celebration: 'Selamat atas pencapaianmu! 🎉'
    };
    
    document.getElementById('supportMessage').value = templates[type];
}

function sendSupportMessage() {
    const message = document.getElementById('supportMessage').value;
    
    if (!message.trim()) {
        showToast('Tulis pesan dukungan terlebih dahulu', 'error');
        return;
    }
    
    // Simulasi kirim dukungan
    showToast(`Dukungan berhasil dikirim ke ${currentFriend.name}! ❤️`, 'success');
    closeSupportModal();
}

function generateQRCode() {
    showToast('Fitur QR Code akan segera tersedia', 'info');
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

function updateGoalsDisplay() {
    const goalsList = document.getElementById('goalsList');
    if (!goalsList) return;
    
    const existingGoals = goalsList.querySelectorAll('.goal-item');
    existingGoals.forEach(goal => goal.remove());
    
    savingsGoals.forEach(goal => {
        const percentage = Math.min(Math.round((userData.totalSavings / goal.target) * 100), 100);
        
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-info">
                <span class="goal-title">${goal.title}</span>
                <span class="goal-target">${formatCurrency(goal.target)}</span>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar" style="width: ${percentage}%"></div>
                <span class="goal-percentage">${percentage}%</span>
            </div>
        `;
        
        goalsList.appendChild(goalElement);
    });
}

function updateHealthDisplay() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

function setupEventListeners() {
    const inputs = ['cigarettesPerDayInput', 'pricePerPackInput', 'smokingYears', 'smokingMonths'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateCalculation);
        }
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Setup theme events after DOM is ready
    setTimeout(setupThemeEvents, 100);
}

function initializeCalculation() {
    updateCalculation();
}

// Utility Functions
function animateValue(element, start, end, duration, suffix = '') {
    if (!element) return;
    
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
    if (amount >= 1000000000) {
        return 'Rp ' + (amount / 1000000000).toFixed(1) + 'B';
    } else if (amount >= 1000000) {
        return 'Rp ' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return 'Rp ' + (amount / 1000).toFixed(0) + 'K';
    }
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function calculateDailyCost() {
    return (smokingHistory.cigarettesPerDay / 20) * smokingHistory.pricePerPack;
}

function updateCalculation() {
    const cigarettesPerDay = parseInt(document.getElementById('cigarettesPerDayInput')?.value) || 0;
    const pricePerPack = parseInt(document.getElementById('pricePerPackInput')?.value) || 0;
    const years = parseInt(document.getElementById('smokingYears')?.value) || 0;
    const months = parseInt(document.getElementById('smokingMonths')?.value) || 0;
    
    const dailyCost = (cigarettesPerDay / 20) * pricePerPack;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;
    const totalYears = years + (months / 12);
    const lifetimeCost = yearlyCost * totalYears;
    
    const dailyCostEl = document.getElementById('dailyCost');
    const monthlyCostEl = document.getElementById('monthlyCost');
    const yearlyCostEl = document.getElementById('yearlyCost');
    const totalLifetimeCostEl = document.getElementById('totalLifetimeCost');
    
    if (dailyCostEl) dailyCostEl.textContent = formatCurrency(dailyCost);
    if (monthlyCostEl) monthlyCostEl.textContent = formatCurrency(monthlyCost);
    if (yearlyCostEl) yearlyCostEl.textContent = formatCurrency(yearlyCost);
    if (totalLifetimeCostEl) totalLifetimeCostEl.textContent = formatCurrency(lifetimeCost);
}

// Modal Functions (existing ones...)
function openEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        document.getElementById('editName').value = userData.name;
        document.getElementById('editStatus').value = userData.status;
        document.getElementById('editBio').value = userData.bio;
        document.getElementById('editStartDate').value = userData.startDate;
        
        modal.classList.add('show');
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
    const bio = document.getElementById('editBio').value;
    const startDate = document.getElementById('editStartDate').value;
    
    if (name.trim() === '') {
        showToast('Nama tidak boleh kosong', 'error');
        return;
    }
    
    userData.name = name;
    userData.status = status;
    userData.bio = bio;
    userData.startDate = startDate;
    
    saveData();
    updateProfileDisplay();
    closeEditProfile();
    showToast('Profil berhasil diperbarui!', 'success');
}

function openSmokingHistory() {
    const modal = document.getElementById('smokingHistoryModal');
    if (modal) {
        document.getElementById('cigarettesPerDayInput').value = smokingHistory.cigarettesPerDay;
        document.getElementById('pricePerPackInput').value = smokingHistory.pricePerPack;
        document.getElementById('smokingYears').value = smokingHistory.smokingYears;
        document.getElementById('smokingMonths').value = smokingHistory.smokingMonths;
        
        modal.classList.add('show');
        updateCalculation();
    }
}

function closeSmokingHistory() {
    const modal = document.getElementById('smokingHistoryModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveSmokingHistory() {
    const cigarettesPerDay = parseInt(document.getElementById('cigarettesPerDayInput').value);
    const pricePerPack = parseInt(document.getElementById('pricePerPackInput').value);
    const years = parseInt(document.getElementById('smokingYears').value);
    const months = parseInt(document.getElementById('smokingMonths').value);
    
    if (!cigarettesPerDay || !pricePerPack) {
        showToast('Mohon lengkapi semua data', 'error');
        return;
    }
    
    smokingHistory.cigarettesPerDay = cigarettesPerDay;
    smokingHistory.pricePerPack = pricePerPack;
    smokingHistory.smokingYears = years;
    smokingHistory.smokingMonths = months;
    smokingHistory.isSetup = true;
    
    saveData();
    updateSmokingHistoryDisplay();
    closeSmokingHistory();
    showToast('Riwayat merokok berhasil disimpan!', 'success');
}

function openAddGoal() {
    const modal = document.getElementById('addGoalModal');
    if (modal) {
        document.getElementById('goalName').value = '';
        document.getElementById('goalAmount').value = '';
        document.getElementById('goalCategory').value = 'elektronik';
        
        modal.classList.add('show');
    }
}

function closeAddGoal() {
    const modal = document.getElementById('addGoalModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveGoal() {
    const name = document.getElementById('goalName').value;
    const amount = parseInt(document.getElementById('goalAmount').value);
    const category = document.getElementById('goalCategory').value;
    
    if (!name.trim() || !amount) {
        showToast('Mohon lengkapi semua data', 'error');
        return;
    }
    
    const newGoal = {
        id: Date.now(),
        title: name,
        target: amount,
        category: category
    };
    
    savingsGoals.push(newGoal);
    saveData();
    updateGoalsDisplay();
    closeAddGoal();
    showToast('Target baru berhasil ditambahkan!', 'success');
}

function showAchievementDetail(achievementId) {
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    const modal = document.getElementById('achievementModal');
    if (modal) {
        document.getElementById('achievementTitle').textContent = 'Detail Pencapaian';
        document.getElementById('achievementIconLarge').textContent = achievement.icon;
        document.getElementById('achievementName').textContent = achievement.title;
        document.getElementById('achievementDescription').textContent = achievement.description;
        document.getElementById('achievementEarnedDate').textContent = `Diraih pada: ${formatDate(achievement.earnedDate)}`;
        document.getElementById('achievementTips').querySelector('p').textContent = achievement.tips;
        
        modal.classList.add('show');
    }
}

function closeAchievementDetail() {
    const modal = document.getElementById('achievementModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
}

// Settings Functions
function openNotificationSettings() {
    showToast('Pengaturan notifikasi akan segera tersedia', 'info');
}

function togglePrivacy() {
    const toggle = document.getElementById('privacyToggle');
    userData.isPrivate = toggle.checked;
    saveData();
    
    if (userData.isPrivate) {
        showToast('Profil diatur sebagai privat', 'info');
    } else {
        showToast('Profil diatur sebagai publik', 'info');
    }
}

function openDataManagement() {
    exportData();
}

function shareProfile() {
    if (userData.isPrivate) {
        showToast('Profil privat tidak dapat dibagikan', 'warning');
        return;
    }
    
    const text = `🔥 ${userData.streak} hari bebas rokok!\n💰 Hemat ${formatCurrency(userData.totalSavings)}\n🚫 ${userData.cigarettesAvoided} rokok dihindari\n👥 ${friends.length} teman mendukung\n\n#PuffOff #BebasRokok`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Profil PuffOff - ' + userData.name,
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Profil berhasil disalin ke clipboard!', 'success');
        });
    }
}

// Action Functions
function resetProgress() {
    if (confirm('Apakah Anda yakin ingin reset semua progress? Tindakan ini tidak dapat dibatalkan.')) {
        userData.streak = 0;
        userData.totalSavings = 0;
        userData.cigarettesAvoided = 0;
        userData.healthScore = 0;
        userData.level = 1;
        
        saveData();
        updateAllDisplays();
        showToast('Progress berhasil direset', 'warning');
    }
}

function confirmLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.clear();
        showToast('Berhasil keluar', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

function exportData() {
    const data = {
        userData,
        smokingHistory,
        savingsGoals,
        friends,
        achievements: Object.keys(achievements).filter(key => 
            achievements[key].earnedDate
        ),
        exportDate: new Date().toISOString(),
        version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `puffoff-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data berhasil diexport!', 'success');
}

function shareProgress() {
    const text = `🔥 ${userData.streak} hari bebas rokok!\n💰 Hemat ${formatCurrency(userData.totalSavings)}\n🚫 ${userData.cigarettesAvoided} rokok dihindari\n❤️ Health Score: ${userData.healthScore}%\n👥 ${friends.length} teman mendukung\n\n#PuffOff #BebasRokok`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Progress Bebas Rokok Saya',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Progress berhasil disalin ke clipboard!', 'success');
        });
    }
}

function shareAchievement() {
    const modal = document.getElementById('achievementModal');
    const achievementName = document.getElementById('achievementName').textContent;
    const text = `🏆 Baru saja meraih pencapaian "${achievementName}" di PuffOff!\n\nIkuti perjalanan bebas rokok saya dengan kode referral: ${userData.referralCode}\n\n#BebasRokok #Achievement #PuffOff`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Pencapaian Baru!',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Pencapaian berhasil disalin ke clipboard!', 'success');
        });
    }
}

function changeAvatar() {
    const avatars = [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face&auto=format',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
    ];
    
    const currentIndex = avatars.indexOf(userData.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    
    userData.avatar = avatars[nextIndex];
    saveData();
    updateProfileDisplay();
    showToast('Avatar berhasil diubah!', 'success');
}

// New Social Features
function sendSupport(friendId) {
    openSupportModal(friendId);
}

function sendChallenge(friendId) {
    openChallengeModal(friendId);
}

// Gamification Features
function checkAchievements() {
    // Check for new achievements based on current progress
    const newAchievements = [];
    
    // Streak achievements
    if (userData.streak >= 30 && !achievements['champion']) {
        newAchievements.push('champion');
    }
    
    // Friends achievements
    if (friends.length >= 10 && !achievements['social-butterfly']) {
        newAchievements.push('social-butterfly');
    }
    
    // Savings achievements
    if (userData.totalSavings >= 500000 && !achievements['big-saver']) {
        newAchievements.push('big-saver');
    }
    
    // Show achievement notifications
    newAchievements.forEach(achievementId => {
        setTimeout(() => {
            showAchievementNotification(achievementId);
        }, 1000);
    });
}

function showAchievementNotification(achievementId) {
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    // Create achievement notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-popup">
            <div class="achievement-popup-icon">${achievement.icon}</div>
            <div class="achievement-popup-title">Pencapaian Baru!</div>
            <div class="achievement-popup-name">${achievement.title}</div>
            <button onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Advanced Theme Features
function createCustomTheme() {
    showToast('Fitur tema kustom akan segera tersedia!', 'info');
}

function importTheme() {
    showToast('Fitur import tema akan segera tersedia!', 'info');
}

// Analytics and Insights
function generateInsights() {
    const insights = {
        smokeFreeTime: userData.streak,
        moneySaved: userData.totalSavings,
        cigarettesAvoided: userData.cigarettesAvoided,
        healthImprovement: userData.healthScore,
        socialSupport: friends.length,
        achievements: Object.keys(achievements).filter(key => achievements[key].earnedDate).length
    };
    
    return insights;
}

function showWeeklyReport() {
    const insights = generateInsights();
    const reportText = `📊 Laporan Mingguan PuffOff

🔥 Streak: ${insights.smokeFreeTime} hari
💰 Total Hemat: ${formatCurrency(insights.moneySaved)}
🚫 Rokok Dihindari: ${insights.cigarettesAvoided} batang
❤️ Health Score: ${insights.healthImprovement}%
👥 Dukungan Teman: ${insights.socialSupport} orang
🏆 Pencapaian: ${insights.achievements} lencana

Tetap semangat dalam perjalanan bebas rokok! 💪`;

    showToast('Laporan mingguan berhasil dibuat!', 'success');
    
    if (navigator.share) {
        navigator.share({
            title: 'Laporan Mingguan PuffOff',
            text: reportText
        });
    } else {
        navigator.clipboard.writeText(reportText);
    }
}

// Utility Functions
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

function showLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.classList.add('show');
    }
}

function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.classList.remove('show');
    }
}

// Initialize features when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Run achievement check after initial load
    setTimeout(checkAchievements, 2000);
    
    // Setup periodic data sync (every 5 minutes)
    setInterval(() => {
        saveData();
    }, 300000);
    
    // Setup theme persistence
    const savedTheme = userData.theme || 'default';
    applyTheme(savedTheme);
});

// PWA Support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully');
            })
            .catch(function(registrationError) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Notification Support
function requestNotificationPermission() {
    if ('Notification' in window && navigator.serviceWorker) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('Notifikasi diaktifkan!', 'success');
            }
        });
    }
}

// Background sync for offline support
function syncData() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
            return registration.sync.register('background-sync');
        });
    }
}

// Export all functions for global access
window.PuffOffProfile = {
    // Theme functions
    openThemeSelector,
    closeThemeSelector,
    selectTheme,
    applyTheme,
    
    // Friend functions
    openAddFriend,
    closeAddFriend,
    switchTab,
    addFriendByCode,
    copyReferralCode,
    shareReferralCode,
    inviteFriends,
    
    // Challenge functions
    openChallengeModal,
    closeChallengeModal,
    selectChallenge,
    sendChallengeMessage,
    
    // Support functions
    openSupportModal,
    closeSupportModal,
    selectTemplate,
    sendSupportMessage,
    
    // Profile functions
    openEditProfile,
    closeEditProfile,
    saveProfile,
    changeAvatar,
    
    // Settings functions
    togglePrivacy,
    shareProfile,
    resetProgress,
    confirmLogout,
    
    // Utility functions
    showToast,
    formatDate,
    formatCurrency,
    exportData,
    shareProgress,
    shareAchievement
};
