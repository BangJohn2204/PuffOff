// Global variables - Menggunakan in-memory storage untuk demo
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
    totalBadges: 3
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
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateAllDisplays();
    setupEventListeners();
    initializeCalculation();
});

function loadData() {
    // Simulasi load dari localStorage
    try {
        const savedUserData = localStorage.getItem('puffoff_user_data');
        const savedSmokingHistory = localStorage.getItem('puffoff_smoking_history');
        const savedGoals = localStorage.getItem('puffoff_savings_goals');
        
        if (savedUserData) {
            userData = { ...userData, ...JSON.parse(savedUserData) };
        }
        
        if (savedSmokingHistory) {
            smokingHistory = { ...smokingHistory, ...JSON.parse(savedSmokingHistory) };
        }
        
        if (savedGoals) {
            savingsGoals = JSON.parse(savedGoals);
        }
    } catch (error) {
        console.log('Error loading data from localStorage:', error);
    }
}

function saveData() {
    try {
        localStorage.setItem('puffoff_user_data', JSON.stringify(userData));
        localStorage.setItem('puffoff_smoking_history', JSON.stringify(smokingHistory));
        localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
    } catch (error) {
        console.log('Error saving data to localStorage:', error);
    }
}

function updateAllDisplays() {
    updateProfileDisplay();
    updateStatsDisplay();
    updateSmokingHistoryDisplay();
    updateGoalsDisplay();
    updateHealthDisplay();
}

function updateProfileDisplay() {
    // Update profile info
    const profileName = document.getElementById('profileName');
    const profileStatus = document.getElementById('profileStatus');
    const profileImage = document.getElementById('profileImage');
    const userLevel = document.getElementById('userLevel');
    const mainBadge = document.getElementById('mainBadge');
    const healthIndicator = document.getElementById('healthIndicator');
    
    if (profileName) profileName.textContent = userData.name;
    if (profileStatus) profileStatus.textContent = userData.status;
    if (profileImage) profileImage.src = userData.avatar;
    if (userLevel) userLevel.textContent = userData.level;
    if (mainBadge) mainBadge.textContent = 'Week Warrior';
    
    // Update health indicator
    if (healthIndicator) {
        healthIndicator.className = `health-indicator level-${userData.level}`;
    }
}

function updateStatsDisplay() {
    // Animate stats dengan efek yang smooth
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
        animateValue(healthElement, 0, userData.healthScore, 1500, '%');
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
    
    // Clear existing goals
    const existingGoals = goalsList.querySelectorAll('.goal-item');
    existingGoals.forEach(goal => goal.remove());
    
    // Add goals
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
    // Animate health progress bars
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
    // Real-time calculation untuk smoking history
    const inputs = ['cigarettesPerDayInput', 'pricePerPackInput', 'smokingYears', 'smokingMonths'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateCalculation);
        }
    });
    
    // Modal close pada background click
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
    
    // Update preview
    const dailyCostEl = document.getElementById('dailyCost');
    const monthlyCostEl = document.getElementById('monthlyCost');
    const yearlyCostEl = document.getElementById('yearlyCost');
    const totalLifetimeCostEl = document.getElementById('totalLifetimeCost');
    
    if (dailyCostEl) dailyCostEl.textContent = formatCurrency(dailyCost);
    if (monthlyCostEl) monthlyCostEl.textContent = formatCurrency(monthlyCost);
    if (yearlyCostEl) yearlyCostEl.textContent = formatCurrency(yearlyCost);
    if (totalLifetimeCostEl) totalLifetimeCostEl.textContent = formatCurrency(lifetimeCost);
}

// Modal Functions
function openEditProfile() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        // Populate form with current data
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
        // Populate form with current data
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
        // Clear form
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
    showToast('Fitur notifikasi akan segera tersedia', 'info');
}

function toggleTheme() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle.checked) {
        showToast('Mode gelap diaktifkan', 'info');
    } else {
        showToast('Mode terang diaktifkan', 'info');
    }
}

function openDataManagement() {
    showToast('Fitur export data akan segera tersedia', 'info');
}

function shareProfile() {
    if (navigator.share) {
        navigator.share({
            title: 'PuffOff - Perjalanan Bebas Rokok',
            text: `Saya sudah ${userData.streak} hari bebas rokok dan menghemat ${formatCurrency(userData.totalSavings)}!`,
            url: window.location.href
        });
    } else {
        // Fallback untuk browser yang tidak mendukung Web Share API
        const text = `Saya sudah ${userData.streak} hari bebas rokok dan menghemat ${formatCurrency(userData.totalSavings)}!`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Teks berhasil disalin ke clipboard!', 'success');
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
        // Clear data
        localStorage.clear();
        showToast('Berhasil keluar', 'info');
        // Redirect ke halaman login jika ada
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
        exportDate: new Date().toISOString()
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
    const text = `🔥 ${userData.streak} hari bebas rokok!\n💰 Hemat ${formatCurrency(userData.totalSavings)}\n🚫 ${userData.cigarettesAvoided} rokok dihindari\n❤️ Health Score: ${userData.healthScore}%\n\n#PuffOff #BebasRokok`;
    
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
    const text = `🏆 Baru saja meraih pencapaian "${achievementName}" di PuffOff! #BebasRokok #Achievement`;
    
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
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face&auto=format'
    ];
    
    const currentIndex = avatars.indexOf(userData.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    
    userData.avatar = avatars[nextIndex];
    saveData();
    updateProfileDisplay();
    showToast('Avatar berhasil diubah!', 'success');
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
