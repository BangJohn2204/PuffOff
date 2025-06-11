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
    mainBadge: 'Week Warrior',
    cigarettesAvoided: 84
};

let smokingHistory = {
    cigarettesPerDay: 12,
    pricePerPack: 25000,
    smokingYears: 5,
    smokingMonths: 0,
    isSetup: false
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
        current: 210000,
        category: 'elektronik'
    },
    {
        id: 2,
        title: 'Liburan Keluarga',
        target: 8000000,
        current: 210000,
        category: 'liburan'
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    showLoadingOverlay();
    setTimeout(() => {
        initializeProfile();
        setupEventListeners();
        loadUserData();
        loadSmokingHistoryData();
        initializeHealthScore();
        loadSavingsGoals();
        initializeProgressBars();
        hideLoadingOverlay();
    }, 1000);
});

function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function initializeProfile() {
    // Setup intersection observer for animations
    setupScrollAnimations();
    
    // Load theme preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }
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
    
    // Real-time calculation for smoking history
    const inputs = ['cigarettesPerDayInput', 'pricePerPackInput', 'smokingYears', 'smokingMonths'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateSmokingCalculation);
        }
    });
}

function loadUserData() {
    // Load user data from localStorage
    const savedUserData = localStorage.getItem('puffoff_user_data');
    if (savedUserData) {
        userData = { ...userData, ...JSON.parse(savedUserData) };
    }
    
    // Update UI with user data
    updateProfileDisplay();
    updateQuickStats();
}

function loadSmokingHistoryData() {
    const savedHistory = localStorage.getItem('puffoff_smoking_history');
    if (savedHistory) {
        smokingHistory = { ...smokingHistory, ...JSON.parse(savedHistory) };
    }
    
    updateSmokingHistoryDisplay();
}

function updateProfileDisplay() {
    const elements = {
        profileName: document.getElementById('profileName'),
        profileStatus: document.getElementById('profileStatus'),
        profileImage: document.getElementById('profileImage'),
        mainBadge: document.getElementById('mainBadge'),
        healthIndicator: document.getElementById('healthIndicator'),
        userLevel: document.getElementById('userLevel')
    };
    
    if (elements.profileName) elements.profileName.textContent = userData.name;
    if (elements.profileStatus) elements.profileStatus.textContent = userData.status;
    if (elements.profileImage) elements.profileImage.src = userData.avatar;
    if (elements.mainBadge) elements.mainBadge.textContent = userData.mainBadge;
    if (elements.userLevel) elements.userLevel.textContent = userData.level;
    
    if (elements.healthIndicator) {
        elements.healthIndicator.className = `health-indicator level-${userData.healthLevel}`;
    }
}

function updateQuickStats() {
    const elements = {
        streakDays: document.getElementById('streakDays'),
        totalSavings: document.getElementById('totalSavings'),
        healthScore: document.getElementById('healthScore'),
        cigarettesAvoided: document.getElementById('cigarettesAvoided')
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
    
    if (elements.cigarettesAvoided) {
        animateValue(elements.cigarettesAvoided, 0, userData.cigarettesAvoided, 1200);
    }
}

function updateSmokingHistoryDisplay() {
    if (!smokingHistory.isSetup) {
        // Show setup prompt
        const section = document.getElementById('smokingHistorySection');
        if (section) {
            section.innerHTML = `
                <div class="history-setup">
                    <div class="setup-icon">📝</div>
                    <h4>Belum Ada Riwayat Merokok</h4>
                    <p>Masukkan data riwayat merokok Anda untuk mendapatkan analisis penghematan yang lebih akurat.</p>
                    <button class="setup-btn" onclick="openSmokingHistory()">
                        <i class="fas fa-plus"></i>
                        Setup Riwayat Merokok
                    </button>
                </div>
            `;
        }
        return;
    }
    
    // Calculate values
    const dailyCost = (smokingHistory.cigarettesPerDay / 20) * smokingHistory.pricePerPack;
    const totalMonths = (smokingHistory.smokingYears * 12) + smokingHistory.smokingMonths;
    const totalSpent = dailyCost * 30 * totalMonths;
    const smokingDuration = formatDuration(smokingHistory.smokingYears, smokingHistory.smokingMonths);
    
    // Update display elements
    const elements = {
        cigarettesPerDay: document.getElementById('cigarettesPerDay'),
        costPerDay: document.getElementById('costPerDay'),
        smokingDuration: document.getElementById('smokingDuration'),
        totalSpent: document.getElementById('totalSpent')
    };
    
    if (elements.cigarettesPerDay) elements.cigarettesPerDay.textContent = `${smokingHistory.cigarettesPerDay} batang`;
    if (elements.costPerDay) elements.costPerDay.textContent = formatCurrency(dailyCost);
    if (elements.smokingDuration) elements.smokingDuration.textContent = smokingDuration;
    if (elements.totalSpent) elements.totalSpent.textContent = formatCurrency(totalSpent);
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
    if (amount >= 1000000000) {
        return 'Rp ' + (amount / 1000000000).toFixed(1) + 'B';
    } else if (amount >= 1000000) {
        return 'Rp ' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return 'Rp ' + (amount / 1000).toFixed(0) + 'K';
    }
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDuration(years, months) {
    if (years === 0 && months === 0) return '0 bulan';
    if (years === 0) return `${months} bulan`;
    if (months === 0) return `${years} tahun`;
    return `${years} tahun ${months} bulan`;
}

// Health Score Initialization
function initializeHealthScore() {
    const healthCircle = document.querySelector('.health-circle');
    if (healthCircle) {
        const score = userData.healthScore;
        const degrees = (score / 100) * 360;
        healthCircle.style.background = `conic-gradient(#10b981 0deg, #10b981 ${degrees}deg, #e5e7eb ${degrees}deg, #e5e7eb 360deg)`;
    }
}

// Progress Bars Initialization
function initializeProgressBars() {
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        
        // Initialize goal progress bars
        const goalBars = document.querySelectorAll('.goal-progress-bar');
        goalBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.setProperty('--width', '0%');
            setTimeout(() => {
                bar.style.setProperty('--width', width);
            }, 200);
        });
    }, 500);
}

// Avatar Functions
function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast('Ukuran file terlalu besar! Maksimal 5MB.', 'error');
                return;
            }
            
            showLoadingOverlay();
            const reader = new FileReader();
            reader.onload = function(e) {
                userData.avatar = e.target.result;
                updateProfileDisplay();
                saveUserData();
                hideLoadingOverlay();
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
    
    if (!elements.editStartDate.value) {
        showToast('Tanggal mulai berhenti harus diisi!', 'error');
        return;
    }
    
    showLoadingOverlay();
    
    // Update user data
    userData.name = elements.editName.value.trim();
    userData.status = elements.editStatus.value.trim();
    userData.bio = elements.editBio.value.trim();
    userData.startDate = elements.editStartDate.value;
    
    // Calculate new streak based on start date
    const startDate = new Date(elements.editStartDate.value);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    userData.streak = diffDays;
    
    // Save to localStorage
    saveUserData();
    
    // Update display
    updateProfileDisplay();
    updateQuickStats();
    
    // Close modal
    closeEditProfile();
    hideLoadingOverlay();
    
    showToast('Profil berhasil diperbarui!', 'success');
}

// Smoking History Functions
function openSmokingHistory() {
    const modal = document.getElementById('smokingHistoryModal');
    const elements = {
        cigarettesPerDayInput: document.getElementById('cigarettesPerDayInput'),
        pricePerPackInput: document.getElementById('pricePerPackInput'),
        smokingYears: document.getElementById('smokingYears'),
        smokingMonths: document.getElementById('smokingMonths')
    };
    
    // Populate form with current data
    if (elements.cigarettesPerDayInput) elements.cigarettesPerDayInput.value = smokingHistory.cigarettesPerDay;
    if (elements.pricePerPackInput) elements.pricePerPackInput.value = smokingHistory.pricePerPack;
    if (elements.smokingYears) elements.smokingYears.value = smokingHistory.smokingYears;
    if (elements.smokingMonths) elements.smokingMonths.value = smokingHistory.smokingMonths;
    
    // Update calculation preview
    updateSmokingCalculation();
    
    modal.classList.add('show');
}

function closeSmokingHistory() {
    const modal = document.getElementById('smokingHistoryModal');
    modal.classList.remove('show');
}

function updateSmokingCalculation() {
    const elements = {
        cigarettesPerDayInput: document.getElementById('cigarettesPerDayInput'),
        pricePerPackInput: document.getElementById('pricePerPackInput'),
        smokingYears: document.getElementById('smokingYears'),
        smokingMonths: document.getElementById('smoking
