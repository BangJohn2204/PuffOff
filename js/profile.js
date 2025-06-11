// Global variables - Menggunakan localStorage untuk persistence
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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateAllDisplays();
    setupEventListeners();
    initializeCalculation();
});

function loadData() {
    // Load dari localStorage jika ada
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
}

function saveData() {
    localStorage.setItem('puffoff_user_data', JSON.stringify(userData));
    localStorage.setItem('puffoff_smoking_history', JSON.stringify(smokingHistory));
    localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
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
    document.getElementById('profileName').textContent = userData.name;
    document.getElementById('profileStatus').textContent = `${userData.status} - Level ${userData.level}`;
    document.getElementById('profileImage').src = userData.avatar;
    
    // Update mini stats
    document.getElementById('streakDays').textContent = userData.streak;
    document.getElementById('totalBadges').textContent = userData.totalBadges;
    document.getElementById('healthLevel').textContent = userData.healthScore + '%';
    
    // Update health badge
    const healthBadge = document.getElementById('healthBadge');
    healthBadge.className = `health-badge level-${userData.level}`;
}

function updateStatsDisplay() {
    // Animate stats dengan efek yang smooth
    animateValue(document.getElementById('smokeFreedays'), 0, userData.streak, 1000);
    animateValue(document.getElementById('cigarettesAvoided'), 0, userData.cigarettesAvoided, 1200);
    animateValue(document.getElementById('healthScore'), 0, userData.healthScore, 1500, '%');
    
    setTimeout(() => {
        document.getElementById('moneySaved').textContent = formatCurrency(userData.totalSavings);
    }, 800);
}

function updateSmokingHistoryDisplay() {
    const historyDesc = document.getElementById('smokingHistoryDesc');
    const smokingSummary = document.getElementById('smokingSummary');
    const prevCigarettes = document.getElementById('prevCigarettes');
    const prevCost = document.getElementById('prevCost');
    
    if (smokingHistory.isSetup) {
        const dailyCost = calculateDailyCost();
        historyDesc.textContent = 'Data riwayat merokok sudah diatur';
        prevCigarettes.textContent = `${smokingHistory.cigarettesPerDay} batang/hari`;
        prevCost.textContent = `${formatCurrency(dailyCost)}/hari`;
        smokingSummary.style.display = 'block';
    } else {
        historyDesc.textContent = 'Klik untuk mengatur riwayat merokok Anda';
        smokingSummary.style.display = 'none';
    }
}

function updateGoalsDisplay() {
    const goalsContainer = document.querySelector('.savings-goals');
    const existingGoals = goalsContainer.querySelectorAll('.goal-item:not(.add-goal-btn)');
    
    // Remove existing goal items (except add button)
    existingGoals.forEach(goal => goal.remove());
    
    // Add goals before the add button
    const addButton = goalsContainer.querySelector('.add-goal-btn');
    
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
        
        goalsContainer.insertBefore(goalElement, addButton);
    });
}

function updateHealthDisplay() {
    // Animate health progress bars
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.health-progress-bar');
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
    const inputs = ['cigarettesPerDay', 'pricePerPack', 'smokingYears', 'smokingMonths'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateCalculation);
        }
    });
    
    // Modal close pada background click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
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
    return (smokingHistory.cigarettesPerDay / 20) * smok
