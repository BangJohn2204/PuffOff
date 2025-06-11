// ===========================================
// PuffOff Profile Page - Complete JavaScript
// ===========================================

// Global Variables
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
    theme: 'default'
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
        category: 'elektronik',
        progress: 7,
        completed: false
    },
    {
        id: 2,
        title: 'Liburan Keluarga',
        target: 8000000,
        category: 'liburan',
        progress: 3,
        completed: false
    }
];

let achievements = {
    'fire-starter': {
        icon: '🔥',
        title: 'Fire Starter',
        description: 'Selamat! Anda telah berhasil tidak merokok selama 3 hari berturut-turut.',
        earnedDate: '2024-01-16',
        tips: 'Terus pertahankan momentum ini dengan mengingat alasan mengapa Anda ingin berhenti merokok.',
        unlocked: true
    },
    'money-saver': {
        icon: '💰',
        title: 'Money Saver',
        description: 'Luar biasa! Anda telah menghemat Rp 100.000 dari tidak merokok.',
        earnedDate: '2024-01-18',
        tips: 'Gunakan uang yang dihemat untuk sesuatu yang bermanfaat bagi kesehatan Anda.',
        unlocked: true
    },
    'week-warrior': {
        icon: '🏃',
        title: 'Week Warrior',
        description: 'Pencapaian hebat! Anda telah bebas rokok selama 7 hari konsisten.',
        earnedDate: '2024-01-22',
        tips: 'Minggu pertama adalah yang tersulit. Anda sudah melewatinya dengan baik!',
        unlocked: true
    },
    'champion': {
        icon: '👑',
        title: 'Champion',
        description: 'Luar biasa! Anda telah bebas rokok selama 30 hari.',
        tips: 'Anda sudah melewati fase tersulit. Pertahankan!',
        unlocked: false,
        progress: 23
    },
    'diamond': {
        icon: '💎',
        title: 'Diamond',
        description: 'Prestasi gemilang! 90 hari bebas rokok.',
        tips: 'Anda sudah hampir mencapai kebiasaan baru yang permanen.',
        unlocked: false,
        progress: 8
    },
    'legend': {
        icon: '🌟',
        title: 'Legend',
        description: 'Legenda! Anda telah bebas rokok selama 1 tahun penuh.',
        tips: 'Anda adalah inspirasi bagi banyak orang.',
        unlocked: false,
        progress: 2
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

let selectedTheme = 'default';

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
        const savedGoals = localStorage.getItem('puffoff_savings_goals');
        const savedAchievements = localStorage.getItem('puffoff_achievements');
        
        if (savedUserData) {
            userData = { ...userData, ...JSON.parse(savedUserData) };
        }
        
        if (savedSmokingHistory) {
            smokingHistory = { ...smokingHistory, ...JSON.parse(savedSmokingHistory) };
        }
        
        if (savedGoals) {
            savingsGoals = JSON.parse(savedGoals);
        }
        
        if (savedAchievements) {
            achievements = { ...achievements, ...JSON.parse(savedAchievements) };
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
        localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
        localStorage.setItem('puffoff_achievements', JSON.stringify(achievements));
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
        savingsGoals,
        achievements,
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
        if (backup.savingsGoals) savingsGoals = backup.savingsGoals;
        if (backup.achievements) achievements = { ...achievements, ...backup.achievements };
        
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
    updateStatsDisplay();
    updateSmokingHistoryDisplay();
    updateGoalsDisplay();
    updateHealthDisplay();
    updateAchievementsDisplay();
    
    console.log('🔄 All displays updated');
}

function updateProfileDisplay() {
    const profileName = document.getElementById('profileName');
    const profileStatus = document.getElementById('profileStatus');
    const profileImage = document.getElementById('profileImage');
    const userLevel = document.getElementById('userLevel');
    const mainBadge = document.getElementById('mainBadge');
    const healthIndicator = document.getElementById('healthIndicator');
    const referralCode = document.getElementById('referralCode');
    
    if (profileName) profileName.textContent = userData.name;
    if (profileStatus) profileStatus.textContent = userData.status;
    if (profileImage) profileImage.src = userData.avatar;
    if (userLevel) userLevel.textContent = userData.level;
    if (mainBadge) mainBadge.textContent = 'Week Warrior';
    if (referralCode) referralCode.textContent = userData.referralCode;
    
    if (healthIndicator) {
        healthIndicator.className = `health-indicator level-${userData.level}`;
    }
}

function updateStatsDisplay() {
    const streakElement = document.getElementById('streakDays');
    const savingsElement = document.getElementById('totalSavings');
    const cigarettesElement = document.getElementById('cigarettesAvoided');
    const healthElement = document.getElementById('healthScore');
    
    if (streakElement) {
        animateValue(streakElement, 0, userData.streak, 1000);
    }
    
    if (cigarettesElement) {
        animateValue(cigarettesElement, 0, userData.cigarettesAvoided, 1200);
    }
    
    if (healthElement) {
        setTimeout(() => {
            healthElement.textContent = userData.healthScore + '%';
        }, 800);
    }
    
    if (savingsElement) {
        setTimeout(() => {
            savingsElement.textContent = formatCurrency(userData.totalSavings);
        }, 800);
    }
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
        goal.progress = percentage;
        
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-info">
                <span class="goal-title">${goal.title}</span>
                <span class="goal-target">${formatCurrency(goal.target)}</span>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar" style="--progress-width: ${percentage}%"></div>
                <span class="goal-percentage">${percentage}%</span>
            </div>
        `;
        
        goalsList.appendChild(goalElement);
        
        // Check for goal completion
        if (percentage >= 100 && !goal.completed) {
            goal.completed = true;
            goal.completedDate = new Date().toISOString();
            showToast(`🎉 Target "${goal.title}" tercapai!`, 'success');
        }
    });
    
    // Animate progress bars
    setTimeout(() => {
        goalsList.querySelectorAll('.goal-progress-bar').forEach(bar => {
            const width = bar.style.getPropertyValue('--progress-width');
            bar.style.setProperty('--progress-width', '0%');
            setTimeout(() => {
                bar.style.setProperty('--progress-width', width);
            }, 100);
        });
    }, 100);
}

function updateAchievementsDisplay() {
    // This function can be expanded to update achievement states dynamically
    console.log('🏆 Achievements display updated');
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
        
        const progressFills = document.querySelectorAll('.progress-fill');
        progressFills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 500);
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
    
    userData.name = name.trim();
    userData.status = status.trim();
    userData.bio = bio.trim();
    userData.startDate = startDate;
    
    saveData();
    updateProfileDisplay();
    closeEditProfile();
    showToast('Profil berhasil diperbarui!', 'success');
    
    console.log('✅ Profile saved');
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
    const text = `🔥 ${userData.streak} hari bebas rokok!
💰 Hemat ${formatCurrency(userData.totalSavings)}
🚫 ${userData.cigarettesAvoided} rokok dihindari
❤️ Health Score: ${userData.healthScore}%

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
// SMOKING HISTORY FUNCTIONS
// ===========================================

function openSmokingHistory() {
    const modal = document.getElementById('smokingHistoryModal');
    if (modal) {
        document.getElementById('cigarettesPerDayInput').value = smokingHistory.cigarettesPerDay;
        document.getElementById('pricePerPackInput').value = smokingHistory.pricePerPack;
        document.getElementById('smokingYears').value = smokingHistory.smokingYears;
        document.getElementById('smokingMonths').value = smokingHistory.smokingMonths;
        
        modal.classList.add('show');
        calculateSmokingCosts();
        console.log('🚬 Smoking history modal opened');
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
    const years = parseInt(document.getElementById('smokingYears').value) || 0;
    const months = parseInt(document.getElementById('smokingMonths').value) || 0;
    
    // Validation
    if (!cigarettesPerDay || cigarettesPerDay < 1 || cigarettesPerDay > 100) {
        showToast('Jumlah rokok per hari harus antara 1-100', 'error');
        return;
    }
    
    if (!pricePerPack || pricePerPack < 1000) {
        showToast('Harga per bungkus minimal Rp 1.000', 'error');
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
    
    console.log('✅ Smoking history saved');
}

function calculateDailyCost() {
    return (smokingHistory.cigarettesPerDay / 20) * smokingHistory.pricePerPack;
}

function calculateSmokingCosts() {
    const cigarettesPerDay = parseInt(document.getElementById('cigarettesPerDayInput')?.value) || 0;
    const pricePerPack = parseInt(document.getElementById('pricePerPackInput')?.value) || 0;
    const years = parseInt(document.getElementById('smokingYears')?.value) || 0;
    const months = parseInt(document.getElementById('smokingMonths')?.value) || 0;

    const dailyCost = (cigarettesPerDay * pricePerPack) / 20;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;
    const totalMonths = (years * 12) + months;
    const totalLifetimeCost = (monthlyCost * totalMonths);

    const elements = {
        dailyCost: document.getElementById('dailyCost'),
        monthlyCost: document.getElementById('monthlyCost'),
        yearlyCost: document.getElementById('yearlyCost'),
        totalLifetimeCost: document.getElementById('totalLifetimeCost')
    };

    if (elements.dailyCost) elements.dailyCost.textContent = formatCurrency(dailyCost);
    if (elements.monthlyCost) elements.monthlyCost.textContent = formatCurrency(monthlyCost);
    if (elements.yearlyCost) elements.yearlyCost.textContent = formatCurrency(yearlyCost);
    if (elements.totalLifetimeCost) elements.totalLifetimeCost.textContent = formatCurrency(totalLifetimeCost);
}

// ===========================================
// GOALS FUNCTIONS
// ===========================================

function openAddGoal() {
    const modal = document.getElementById('addGoalModal');
    if (modal) {
        document.getElementById('goalName').value = '';
        document.getElementById('goalAmount').value = '';
        document.getElementById('goalCategory').value = 'elektronik';
        
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

function saveGoal() {
    const name = document.getElementById('goalName').value;
    const amount = parseInt(document.getElementById('goalAmount').value);
    const category = document.getElementById('goalCategory').value;
    
    // Validation
    if (!name.trim()) {
        showToast('Nama target tidak boleh kosong', 'error');
        return;
    }
    
    if (!amount || amount < 1000) {
        showToast('Jumlah target minimal Rp 1.000', 'error');
        return;
    }
    
    const newGoal = {
        id: Date.now(),
        title: name.trim(),
        target: amount,
        category: category,
        progress: 0,
        completed: false,
        createdDate: new Date().toISOString()
    };
    
    savingsGoals.push(newGoal);
    saveData();
    updateGoalsDisplay();
    closeAddGoal();
    showToast('Target baru berhasil ditambahkan!', 'success');
    
    console.log('✅ New goal saved:', newGoal);
}

// ===========================================
// ACHIEVEMENT FUNCTIONS
// ===========================================

function showAchievementDetail(achievementId) {
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    const modal = document.getElementById('achievementModal');
    if (modal) {
        document.getElementById('achievementTitle').textContent = 'Detail Pencapaian';
        document.getElementById('achievementIconLarge').textContent = achievement.icon;
        document.getElementById('achievementName').textContent = achievement.title;
        document.getElementById('achievementDescription').textContent = achievement.description;
        
        if (achievement.unlocked && achievement.earnedDate) {
            document.getElementById('achievementEarnedDate').textContent = `Diraih pada: ${formatDate(achievement.earnedDate)}`;
        } else {
            document.getElementById('achievementEarnedDate').textContent = `Progress: ${achievement.progress || 0}%`;
        }
        
        document.getElementById('achievementTips').querySelector('p').textContent = achievement.tips;
        
        modal.classList.add('show');
        console.log(`🏆 Achievement detail opened: ${achievementId}`);
    }
}

function closeAchievementDetail() {
    const modal = document.getElementById('achievementModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function shareAchievement() {
    const achievementName = document.getElementById('achievementName').textContent;
    const text = `🏆 Baru saja meraih pencapaian "${achievementName}" di PuffOff!

Ikuti perjalanan bebas rokok saya dengan kode referral: ${userData.referralCode}

#BebasRokok #Achievement #PuffOff`;

    if (navigator.share) {
        navigator.share({
            title: `Pencapaian Baru: ${achievementName}`,
            text: text,
            url: window.location.origin
        }).then(() => {
            console.log('🏆 Achievement shared successfully');
        }).catch(() => {
            navigator.clipboard.writeText(text);
            showToast('Pencapaian berhasil disalin untuk dibagikan!', 'success');
        });
    } else {
        navigator.clipboard.writeText(text);
        showToast('Pencapaian berhasil disalin untuk dibagikan!', 'success');
    }
}

function checkAndUnlockAchievements() {
    const newAchievements = [];
    
    // Streak achievements
    if (userData.streak >= 30 && !achievements['champion'].unlocked) {
        unlockAchievement('champion');
        newAchievements.push('champion');
    }
    
    // Savings achievements
    if (userData.totalSavings >= 500000 && !achievements['big-saver']) {
        const bigSaver = {
            icon: '💰',
            title: 'Big Saver',
            description: 'Luar biasa! Anda telah menghemat Rp 500.000.',
            tips: 'Uang yang dihemat bisa digunakan untuk investasi masa depan.',
            unlocked: true,
            earnedDate: new Date().toISOString()
        };
        achievements['big-saver'] = bigSaver;
        newAchievements.push('big-saver');
    }
    
    // Show achievement notifications
    newAchievements.forEach((achievementId, index) => {
        setTimeout(() => {
            showAchievementNotification(achievementId);
        }, (index + 1) * 1000);
    });
    
    // Update achievement progress
    Object.keys(achievements).forEach(key => {
        const achievement = achievements[key];
        if (!achievement.unlocked && achievement.progress !== undefined) {
            // Update progress based on current stats
            if (key === 'champion') {
                achievement.progress = Math.min(Math.round((userData.streak / 30) * 100), 100);
            } else if (key === 'diamond') {
                achievement.progress = Math.min(Math.round((userData.streak / 90) * 100), 100);
            } else if (key === 'legend') {
                achievement.progress = Math.min(Math.round((userData.streak / 365) * 100), 100);
            }
        }
    });
    
    if (newAchievements.length > 0) {
        console.log(`🏆 New achievements unlocked: ${newAchievements.join(', ')}`);
    }
}

function unlockAchievement(achievementId) {
    if (achievements[achievementId]) {
        achievements[achievementId].unlocked = true;
        achievements[achievementId].earnedDate = new Date().toISOString();
        userData.totalBadges = (userData.totalBadges || 0) + 1;
        saveData();
    }
}

function showAchievementNotification(achievementId) {
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    // Create achievement popup
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-popup-content">
            <div class="achievement-popup-icon">${achievement.icon}</div>
            <div class="achievement-popup-title">Pencapaian Baru!</div>
            <div class="achievement-popup-name">${achievement.title}</div>
            <div class="achievement-popup-desc">${achievement.description}</div>
            <button class="achievement-popup-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
        }
    }, 5000);
    
    console.log(`🎉 Achievement notification shown: ${achievementId}`);
}

// ===========================================
// SETTINGS FUNCTIONS
// ===========================================

function openNotificationSettings() {
    showToast('Pengaturan notifikasi akan segera tersedia', 'info');
    console.log('🔔 Notification settings accessed');
}

function openDataManagement() {
    exportData();
}

function exportData() {
    const data = {
        userData,
        smokingHistory,
        savingsGoals,
        achievements,
        exportDate: new Date().toISOString(),
        version: '2.1'
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
    console.log('📁 Data exported successfully');
}

// ===========================================
// ACTION FUNCTIONS
// ===========================================

function resetProgress() {
    if (confirm('Apakah Anda yakin ingin reset semua progress? Tindakan ini tidak dapat dibatalkan.')) {
        // Create backup before reset
        const backup = createBackup();
        localStorage.setItem('puffoff_backup_before_reset', backup);
        
        userData.streak = 0;
        userData.totalSavings = 0;
        userData.cigarettesAvoided = 0;
        userData.healthScore = 0;
        userData.level = 1;
        
        // Reset achievements
        Object.keys(achievements).forEach(key => {
            if (achievements[key].unlocked) {
                achievements[key].unlocked = false;
                delete achievements[key].earnedDate;
            }
            if (achievements[key].progress !== undefined) {
                achievements[key].progress = 0;
            }
        });
        
        saveData();
        updateAllDisplays();
        showToast('Progress berhasil direset. Backup tersimpan otomatis.', 'warning');
        
        console.log('🔄 Progress reset completed');
    }
}

function confirmLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Save current state before logout
        saveData();
        
        showToast('Berhasil keluar. Sampai jumpa lagi!', 'info');
        setTimeout(() => {
            // In a real app, this would redirect to login
            window.location.reload();
        }, 1500);
        
        console.log('👋 User logged out');
    }
}

// ===========================================
// EVENT LISTENERS
// ===========================================

function setupEventListeners() {
    // Smoking history calculation inputs
    const calculationInputs = ['cigarettesPerDayInput', 'pricePerPackInput', 'smokingYears', 'smokingMonths'];
    calculationInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', debounce(calculateSmokingCosts, 300));
        }
    });
    
    // Modal close on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
    
    // Theme option clicks
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            selectTheme(option.dataset.theme);
        });
    });
    
    // Auto-save interval
    setInterval(() => {
        saveData();
    }, 60000); // Save every minute
    
    // Update dark mode toggle based on theme
    const updateDarkModeToggle = () => {
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.checked = selectedTheme === 'dark';
        }
    };

    // Listen for theme changes
    const observer = new MutationObserver(updateDarkModeToggle);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    updateDarkModeToggle();
    
    // Handle visibility change for auto-save
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            saveData();
        }
    });
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        saveData();
    });
    
    console.log('👂 Event listeners setup complete');
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

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

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
    };
    return date.toLocaleDateString('id-ID', options);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
        
        console.log(`📢 Toast: ${type} - ${message}`);
    }
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

// ===========================================
// ENHANCED FEATURES
// ===========================================

function initializeEnhancedFeatures() {
    migrateData();
    enableAutoSave();
    setupErrorBoundary();
    enhanceAccessibility();
    initializePWA();
    
    // Check achievements on load
    setTimeout(() => {
        checkAndUnlockAchievements();
    }, 2000);
    
    console.log('🚀 Enhanced features initialized');
}

function migrateData() {
    const currentVersion = localStorage.getItem('puffoff-version') || '1.0';
    
    if (currentVersion < '2.1') {
        console.log('📦 Migrating data to version 2.1');
        
        // Add new fields with defaults
        userData.totalBadges = userData.totalBadges || 0;
        userData.theme = userData.theme || 'default';
        smokingHistory.isSetup = smokingHistory.isSetup !== undefined ? smokingHistory.isSetup : true;
        
        // Update achievements structure
        Object.keys(achievements).forEach(key => {
            if (!achievements[key].hasOwnProperty('unlocked')) {
                achievements[key].unlocked = achievements[key].earnedDate ? true : false;
            }
        });
        
        localStorage.setItem('puffoff-version', '2.1');
        saveData();
        
        showToast('Data berhasil diperbarui ke versi terbaru!', 'info');
    }
}

function enableAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            saveData();
        }
    }, 30000);
    
    console.log('💾 Auto-save enabled');
}

function setupErrorBoundary() {
    window.addEventListener('error', (event) => {
        console.error('🚨 Global error:', event.error);
        showToast('Terjadi kesalahan tak terduga', 'error');
        
        // Save current state in case of error
        try {
            saveData();
        } catch (e) {
            console.error('Failed to save data after error:', e);
        }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('🚨 Unhandled promise rejection:', event.reason);
        showToast('Terjadi kesalahan jaringan', 'error');
    });
    
    console.log('🛡️ Error boundary setup complete');
}

function enhanceAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Focus management for modals
        if (e.key === 'Tab') {
            const modal = document.querySelector('.modal.show');
            if (modal) {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            }
        }
        
        // Quick actions with keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    saveData();
                    showToast('Data tersimpan!', 'success');
                    break;
                case 'e':
                    e.preventDefault();
                    exportData();
                    break;
            }
        }
    });
    
    // Add focus indicators
    document.querySelectorAll('button, [href], input, select, textarea').forEach(el => {
        el.addEventListener('focus', () => {
            el.setAttribute('data-focused', 'true');
        });
        
        el.addEventListener('blur', () => {
            el.removeAttribute('data-focused');
        });
    });
    
    console.log('♿ Accessibility enhancements applied');
}

function initializePWA() {
    // Service Worker registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('📱 ServiceWorker registered successfully');
            })
            .catch(error => {
                console.log('❌ ServiceWorker registration failed:', error);
            });
    }
    
    // Install prompt handling
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button or prompt
        showToast('PuffOff dapat diinstall sebagai aplikasi!', 'info');
    });
    
    // Handle app installation
    window.addEventListener('appinstalled', () => {
        console.log('📱 PWA was installed');
        showToast('PuffOff berhasil diinstall!', 'success');
    });
}

// ===========================================
// ADVANCED ANALYTICS
// ===========================================

function calculateDetailedStats() {
    const daysSinceStart = userData.streak;
    const dailyCost = calculateDailyCost();
    
    return {
        totalSaved: dailyCost * daysSinceStart,
        cigarettesAvoided: smokingHistory.cigarettesPerDay * daysSinceStart,
        healthImprovement: Math.min(daysSinceStart * 2, 100), // 2% per day, max 100%
        timeRegained: (smokingHistory.cigarettesPerDay * daysSinceStart * 6), // 6 minutes per cigarette
        lifetimeEarnings: dailyCost * 365 * 30, // 30 years projection
        co2Reduced: smokingHistory.cigarettesPerDay * daysSinceStart * 0.014, // kg CO2 per cigarette
        moneyPerDay: dailyCost,
        projectedYearlySavings: dailyCost * 365
    };
}

function generateInsights() {
    const stats = calculateDetailedStats();
    const insights = [];
    
    if (userData.streak >= 7) {
        insights.push('🎉 Selamat! Anda telah melewati minggu pertama yang paling sulit.');
    }
    
    if (stats.totalSaved >= 100000) {
        insights.push('💰 Uang yang dihemat sudah bisa untuk membeli sesuatu yang berguna!');
    }
    
    if (userData.healthScore > 75) {
        insights.push('❤️ Kesehatan Anda sudah mulai membaik secara signifikan.');
    }
    
    if (userData.streak >= 30) {
        insights.push('🏆 Anda telah membentuk kebiasaan baru! Risiko kembali merokok menurun drastis.');
    }
    
    return insights;
}

// ===========================================
// SHARING FUNCTIONS
// ===========================================

function shareWithCustomMessage(type, customMessage = '') {
    const baseMessage = customMessage || generateShareMessage(type);
    
    if (navigator.share) {
        navigator.share({
            title: 'PuffOff - Bebas Rokok',
            text: baseMessage,
            url: window.location.origin
        }).catch(() => {
            navigator.clipboard.writeText(baseMessage);
            showToast('Pesan berhasil disalin!', 'success');
        });
    } else {
        navigator.clipboard.writeText(baseMessage);
        showToast('Pesan berhasil disalin!', 'success');
    }
}

function generateShareMessage(type) {
    const stats = calculateDetailedStats();
    
    switch (type) {
        case 'progress':
            return `🔥 ${userData.streak} hari bebas rokok!
💰 Hemat ${formatCurrency(userData.totalSavings)}
🚫 ${userData.cigarettesAvoided} rokok dihindari
❤️ Health Score: ${userData.healthScore}%
⏰ Waktu hidup kembali: ${Math.round(stats.timeRegained / 60)} jam

#PuffOff #BebasRokok`;

        case 'milestone':
            return `🎉 Mencapai milestone baru di PuffOff!
🔥 ${userData.streak} hari bebas rokok
💪 Mari berhenti merokok bersama!
🌱 ${formatCurrency(stats.totalSaved)} sudah dihemat

Kode referral: ${userData.referralCode}

#BebasRokok #PuffOff`;

        case 'invitation':
            return `🚭 Yuk bergabung dengan PuffOff!
Aplikasi yang membantu berhenti merokok dengan dukungan komunitas.

✨ Fitur lengkap: tracking progress, komunitas, achievement
🎯 Sudah terbukti membantu ribuan orang
💪 Mari berhenti merokok bersama!

Kode referral: ${userData.referralCode}

#PuffOff #BebasRokok`;

        case 'health':
            return `❤️ Update kesehatan PuffOff:
🫁 Fungsi paru membaik
💓 Sirkulasi darah normal
⚡ Energi meningkat
🌬️ Napas lebih lega

${userData.streak} hari bebas rokok dan terus bertambah!

#PuffOff #KesehatanParu #BebasRokok`;

        default:
            return `Bergabung dengan PuffOff untuk memulai perjalanan bebas rokok! Kode referral: ${userData.referralCode}`;
    }
}

// ===========================================
// PERFORMANCE OPTIMIZATION
// ===========================================

function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce expensive operations
    const debouncedSave = debounce(saveData, 1000);
    
    // Memory cleanup
    window.addEventListener('beforeunload', () => {
        // Clean up any ongoing operations
        clearInterval(window.autoSaveInterval);
    });
}

// ===========================================
// EXPORT GLOBAL FUNCTIONS
// ===========================================

// Make functions globally available for HTML onclick handlers
window.PuffOffProfile = {
    // Theme functions
    openThemeSelector,
    closeThemeSelector,
    selectTheme,
    applyTheme,
    toggleTheme,
    
    // Profile functions
    changeAvatar,
    openEditProfile,
    closeEditProfile,
    saveProfile,
    
    // Friends functions
    copyReferralCode,
    inviteFriends,
    findFriends,
    sendSupport,
    sendChallenge,
    shareProfile,
    
    // History functions
    openSmokingHistory,
    closeSmokingHistory,
    saveSmokingHistory,
    calculateSmokingCosts,
    
    // Goals functions
    openAddGoal,
    closeAddGoal,
    saveGoal,
    
    // Achievement functions
    showAchievementDetail,
    closeAchievementDetail,
    shareAchievement,
    
    // Settings functions
    openNotificationSettings,
    openDataManagement,
    exportData,
    resetProgress,
    confirmLogout,
    
    // Utility functions
    formatCurrency,
    formatDate,
    showToast,
    showLoading,
    hideLoading,
    
    // Enhanced functions
    shareWithCustomMessage,
    createBackup,
    restoreFromBackup,
    calculateDetailedStats,
    generateInsights
};

// Also make individual functions available globally for onclick handlers
Object.assign(window, {
    // Core functions
    openThemeSelector,
    closeThemeSelector,
    selectTheme,
    applyTheme,
    toggleTheme,
    changeAvatar,
    openEditProfile,
    closeEditProfile,
    saveProfile,
    copyReferralCode,
    inviteFriends,
    findFriends,
    sendSupport,
    sendChallenge,
    shareProfile,
    openSmokingHistory,
    closeSmokingHistory,
    saveSmokingHistory,
    openAddGoal,
    closeAddGoal,
    saveGoal,
    showAchievementDetail,
    closeAchievementDetail,
    shareAchievement,
    openNotificationSettings,
    openDataManagement,
    resetProgress,
    confirmLogout
});

// ===========================================
// INITIALIZATION COMPLETE
// ===========================================

console.log('🎉 PuffOff Profile JavaScript - Loaded Successfully!');
console.log('📊 Features:', {
    theme: '6 themes with dark mode',
    profile: 'Complete profile management',
    community: 'Friends and referral system',
    achievements: 'Gamification system',
    goals: 'Savings goal tracking',
    history: 'Smoking history calculator',
    data: 'Auto-save and export',
    pwa: 'Progressive Web App ready',
    accessibility: 'Keyboard navigation',
    performance: 'Optimized and responsive'
});

// Development helper
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected');
    window.PuffOffDebug = {
        userData,
        smokingHistory,
        savingsGoals,
        achievements,
        themes,
        saveData,
        loadData,
        calculateDetailedStats,
        generateInsights
    };
    console.log('🛠️ Debug tools available at window.PuffOffDebug');
}
