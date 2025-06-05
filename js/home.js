// Global variables
let currentHealthLevel = 4;
let notificationCounter = 0;
let isLevelChanging = false;
let notificationTimeout = null;

// Health level data
const healthLevels = {
    1: {
        status: "Sangat Buruk",
        percentage: 15,
        lungStatus: "Rusak parah",
        heartStatus: "Tidak stabil",
        oxygenStatus: "Sangat rendah",
        color: "#ef4444",
        lungIndicator: "poor",
        heartIndicator: "poor",
        oxygenLevel: 85,
        heartRate: 95
    },
    2: {
        status: "Buruk",
        percentage: 35,
        lungStatus: "Masih rusak",
        heartStatus: "Kurang stabil",
        oxygenStatus: "Rendah",
        color: "#f59e0b",
        lungIndicator: "poor",
        heartIndicator: "moderate",
        oxygenLevel: 88,
        heartRate: 88
    },
    3: {
        status: "Sedang",
        percentage: 55,
        lungStatus: "Mulai membaik",
        heartStatus: "Cukup stabil",
        oxygenStatus: "Cukup",
        color: "#eab308",
        lungIndicator: "moderate",
        heartIndicator: "moderate",
        oxygenLevel: 92,
        heartRate: 80
    },
    4: {
        status: "Baik",
        percentage: 75,
        lungStatus: "Membersihkan diri",
        heartStatus: "Stabil",
        oxygenStatus: "Normal",
        color: "#10b981",
        lungIndicator: "healthy",
        heartIndicator: "healthy",
        oxygenLevel: 97,
        heartRate: 72
    },
    5: {
        status: "Sangat Sehat",
        percentage: 95,
        lungStatus: "Sangat bersih",
        heartStatus: "Optimal",
        oxygenStatus: "Optimal",
        color: "#059669",
        lungIndicator: "healthy",
        heartIndicator: "healthy",
        oxygenLevel: 99,
        heartRate: 65
    }
};

// Push notification templates
const pushNotificationTemplates = [
    {
        type: 'success',
        icon: '🎉',
        title: 'Selamat! Milestone Tercapai',
        message: 'Kamu berhasil mencapai 7 hari bebas rokok! Terus pertahankan!',
        category: 'Achievement'
    },
    {
        type: 'info',
        icon: '💡',
        title: 'Tips Sehat Hari Ini',
        message: 'Minum air putih minimal 8 gelas untuk membantu detoksifikasi tubuh.',
        category: 'Tips'
    },
    {
        type: 'achievement',
        icon: '🏆',
        title: 'Pencapaian Baru!',
        message: 'Kesehatan paru-paru meningkat 20% dalam seminggu terakhir!',
        category: 'Progress'
    },
    {
        type: 'warning',
        icon: '⚠️',
        title: 'Reminder Penting',
        message: 'Hindari area merokok dan tetap fokus pada tujuan sehatmu.',
        category: 'Reminder'
    },
    {
        type: 'success',
        icon: '💰',
        title: 'Penghematan Luar Biasa!',
        message: 'Kamu sudah menghemat Rp 210.000 dalam 7 hari terakhir!',
        category: 'Savings'
    },
    {
        type: 'info',
        icon: '❤️',
        title: 'Kesehatan Membaik',
        message: 'Detak jantung mulai normal dan tekanan darah stabil.',
        category: 'Health'
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚭 PuffOff App Starting...');
    setTimeout(initializeApp, 100);
});

function initializeApp() {
    console.log('🚭 PuffOff App Initialized!');
    
    loadSavedData();
    updateAvatarDisplay();
    setupButtonListeners();
    animateStats();
    updateGreeting();
    
    setTimeout(() => {
        showToast('Selamat datang kembali!', 'Tetap semangat untuk hidup bebas rokok! 💪', 'success');
    }, 1500);
    
    console.log('✅ App initialization complete');
}

function setupButtonListeners() {
    const increaseBtn = document.getElementById('increaseBtn');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (increaseBtn) {
        increaseBtn.removeAttribute('onclick');
        increaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔼 Increase button clicked');
            changeHealthLevelSingle('increase');
        });
        console.log('✅ Increase button listener added');
    }
    
    if (decreaseBtn) {
        decreaseBtn.removeAttribute('onclick');
        decreaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔽 Decrease button clicked');
            changeHealthLevelSingle('decrease');
        });
        console.log('✅ Decrease button listener added');
    }
    
    if (notificationBtn) {
        notificationBtn.removeAttribute('onclick');
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔔 Notification button clicked');
            triggerSinglePushNotification();
        });
        console.log('✅ Notification button listener added');
    }
}

function loadSavedData() {
    const savedMood = localStorage.getItem('todayMood');
    if (savedMood) {
        const moodButtons = {
            'great': 0, 'good': 1, 'okay': 2, 'bad': 3, 'terrible': 4
        };
        
        const buttonIndex = moodButtons[savedMood];
        if (buttonIndex !== undefined) {
            const button = document.querySelectorAll('.mood-btn')[buttonIndex];
            if (button) {
                button.classList.add('selected');
                updateQuoteBasedOnMood(savedMood);
            }
        }
    }
    
    const savedHealthLevel = localStorage.getItem('healthLevel');
    if (savedHealthLevel && savedHealthLevel >= 1 && savedHealthLevel <= 5) {
        currentHealthLevel = parseInt(savedHealthLevel);
        console.log(`📊 Loaded health level: ${currentHealthLevel}`);
    } else {
        currentHealthLevel = 4;
        localStorage.setItem('healthLevel', currentHealthLevel.toString());
        console.log(`📊 Set default health level: ${currentHealthLevel}`);
    }
}

function changeHealthLevelSingle(action) {
    if (isLevelChanging) {
        console.log('⚠️ Level change already in progress, ignoring...');
        return;
    }
    
    isLevelChanging = true;
    console.log(`🔧 changeHealthLevelSingle called with action: ${action}`);
    console.log(`📊 Current level: ${currentHealthLevel}`);
    
    const oldLevel = currentHealthLevel;
    let newLevel = currentHealthLevel;
    
    try {
        if (action === 'increase' && currentHealthLevel < 5) {
            newLevel = currentHealthLevel + 1;
            console.log(`📈 Health level increased from ${currentHealthLevel} to ${newLevel}`);
            showToast('Level Kesehatan Naik!', `Naik ke level ${newLevel}/5 - ${healthLevels[newLevel].status}`, 'success');
        } else if (action === 'decrease' && currentHealthLevel > 1) {
            newLevel = currentHealthLevel - 1;
            console.log(`📉 Health level decreased from ${currentHealthLevel} to ${newLevel}`);
            showToast('Level Kesehatan Turun', `Turun ke level ${newLevel}/5 - ${healthLevels[newLevel].status}`, 'warning');
        } else {
            const message = action === 'increase' ? 'Sudah di level maksimal (5/5)!' : 'Sudah di level minimum (1/5)!';
            console.log(`⚠️ Cannot change level: ${message}`);
            showToast('Tidak Bisa Diubah', message, 'info');
            isLevelChanging = false;
            return;
        }
        
        currentHealthLevel = newLevel;
        localStorage.setItem('healthLevel', currentHealthLevel.toString());
        console.log(`💾 Health level saved: ${currentHealthLevel}`);
        
        updateAvatarDisplay();
        updateHealthStats();
        
        if (oldLevel !== currentHealthLevel) {
            if (notificationTimeout) {
                clearTimeout(notificationTimeout);
            }
            
            notificationTimeout = setTimeout(() => {
                const levelChangeNotif = {
                    type: action === 'increase' ? 'success' : 'warning',
                    icon: action === 'increase' ? '📈' : '📉',
                    title: `Level Kesehatan ${action === 'increase' ? 'Naik' : 'Turun'}!`,
                    message: `Status kesehatan berubah menjadi: ${healthLevels[currentHealthLevel].status}`,
                    category: 'Health Update'
                };
                showSinglePushNotification(levelChangeNotif);
                notificationTimeout = null;
            }, 1500);
        }
        
    } catch (error) {
        console.error('❌ Error in changeHealthLevelSingle:', error);
        showToast('Error', 'Terjadi kesalahan saat mengubah level kesehatan', 'error');
    } finally {
        setTimeout(() => {
            isLevelChanging = false;
        }, 500);
    }
}

function triggerSinglePushNotification() {
    if (notificationTimeout) {
        console.log('⚠️ Notification already scheduled, ignoring...');
        return;
    }
    
    console.log('🔔 Triggering single push notification...');
    
    try {
        const randomTemplate = pushNotificationTemplates[Math.floor(Math.random() * pushNotificationTemplates.length)];
        showSinglePushNotification(randomTemplate);
        showToast('Notifikasi Ditampilkan!', 'Push notification muncul di atas layar.', 'info');
    } catch (error) {
        console.error('❌ Error triggering notification:', error);
        showToast('Error', 'Gagal menampilkan notifikasi push', 'error');
    }
}

function showSinglePushNotification(notificationData) {
    try {
        let container = document.getElementById('pushNotificationContainer');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'pushNotificationContainer';
            container.className = 'push-notification-container';
            document.body.appendChild(container);
            console.log('📦 Created push notification container');
        }
        
        container.innerHTML = '';
        
        notificationCounter++;
        const notificationId = `push-notification-${notificationCounter}`;
        const currentTime = new Date().toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const notificationHTML = `
            <div class="push-notification ${notificationData.type}" id="${notificationId}">
                <div class="notification-header">
                    <div class="notification-app-info">
                        <div class="notification-app-icon">P</div>
                        <span class="notification-app-name">PuffOff</span>
                    </div>
                    <span class="notification-time">${currentTime}</span>
                    <button class="notification-close" onclick="closePushNotification('${notificationId}')">×</button>
                </div>
                <div class="notification-content">
                    <div class="notification-title">
                        <span class="notification-icon">${notificationData.icon}</span>
                        ${notificationData.title}
                    </div>
                    <div class="notification-message">${notificationData.message}</div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', notificationHTML);
        
        const notification = document.getElementById(notificationId);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            closePushNotification(notificationId);
        }, 6000);
        
        console.log(`✅ Single push notification shown: ${notificationData.title}`);
        
    } catch (error) {
        console.error('❌ Error showing push notification:', error);
    }
}

function closePushNotification(notificationId) {
    try {
        const notification = document.getElementById(notificationId);
        if (notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }
    } catch (error) {
        console.error('❌ Error closing push notification:', error);
    }
}

function updateAvatarDisplay() {
    console.log(`🎨 Updating avatar display for level ${currentHealthLevel}`);
    
    try {
        const avatarBody = document.getElementById('avatarBody');
        const healthStatus = document.getElementById('healthStatus');
        const healthFill = document.getElementById('healthFill');
        const healthPercentage = document.getElementById('healthPercentage');
        const healthLevelBadge = document.getElementById('healthLevelBadge');
        const lungStatus = document.getElementById('lungStatus');
        const heartStatus = document.getElementById('heartStatus');
        const oxygenStatus = document.getElementById('oxygenStatus');
        const lungIndicator = document.getElementById('lungIndicator');
        const heartIndicator = document.getElementById('heartIndicator');
        const oxygenStatusIndicator = document.getElementById('oxygenStatusIndicator');
        const oxygenIndicator = document.getElementById('oxygenIndicator');
        const heartRateIndicator = document.getElementById('heartRateIndicator');
        const avatarMouth = document.getElementById('avatarMouth');
        const healthAura = document.getElementById('healthAura');
        const avatarLungs = document.getElementById('avatarLungs');
        const avatarHeart = document.getElementById('avatarHeart');
        
        if (!avatarBody) {
            console.error('❌ Avatar body element not found');
            return;
        }
        
        const levelData = healthLevels[currentHealthLevel];
        console.log(`📋 Level data:`, levelData);
        
        avatarBody.className = `avatar-body health-level-${currentHealthLevel}`;
        console.log(`🎭 Avatar class updated to: health-level-${currentHealthLevel}`);
        
        if (avatarMouth) {
            avatarMouth.className = 'mouth';
            switch(currentHealthLevel) {
                case 1: avatarMouth.classList.add('very-sad'); break;
                case 2: avatarMouth.classList.add('sad'); break;
                case 3: avatarMouth.classList.add('neutral'); break;
                case 4: avatarMouth.classList.add('happy'); break;
                case 5: avatarMouth.classList.add('very-happy'); break;
            }
        }
        
        if (healthAura) {
            if (currentHealthLevel >= 4) {
                healthAura.classList.add('active');
            } else {
                healthAura.classList.remove('active');
            }
        }
        
        if (avatarLungs) {
            avatarLungs.className = 'lungs';
            if (currentHealthLevel >= 4) {
                avatarLungs.classList.add('healthy');
            } else if (currentHealthLevel === 3) {
                avatarLungs.classList.add('moderate');
            } else {
                avatarLungs.classList.add('poor');
            }
        }
        
        if (avatarHeart) {
            avatarHeart.className = 'heart';
            if (currentHealthLevel >= 4) {
                avatarHeart.classList.add('healthy');
            }
        }
        
        if (healthStatus) {
            healthStatus.textContent = levelData.status;
            healthStatus.style.color = levelData.color;
        }
        
        if (healthLevelBadge) {
            healthLevelBadge.textContent = `Level ${currentHealthLevel}`;
        }
        
        if (healthFill) {
            healthFill.style.width = `${levelData.percentage}%`;
            healthFill.style.background = `linear-gradient(90deg, ${levelData.color}, ${levelData.color}dd)`;
        }
        
        if (healthPercentage) {
            healthPercentage.textContent = `${levelData.percentage}%`;
            healthPercentage.style.color = levelData.color;
        }
        
        if (lungStatus) lungStatus.textContent = levelData.lungStatus;
        if (heartStatus) heartStatus.textContent = levelData.heartStatus;
        if (oxygenStatus) oxygenStatus.textContent = levelData.oxygenStatus;
        
        if (lungIndicator) {
            lungIndicator.className = `status-indicator lung-indicator ${levelData.lungIndicator}`;
        }
        if (heartIndicator) {
            heartIndicator.className = `status-indicator heart-indicator ${levelData.heartIndicator}`;
        }
        if (oxygenStatusIndicator) {
            oxygenStatusIndicator.className = `status-indicator oxygen-indicator ${levelData.lungIndicator}`;
        }
        
        if (oxygenIndicator) {
            oxygenIndicator.innerHTML = `<i class="fas fa-lungs"></i><span>${levelData.oxygenLevel}%</span>`;
        }
        
        if (heartRateIndicator) {
            heartRateIndicator.innerHTML = `<i class="fas fa-heartbeat"></i><span>${levelData.heartRate}</span>`;
        }
        
        avatarBody.style.transform = 'scale(1.05)';
        setTimeout(() => {
            avatarBody.style.transform = 'scale(1)';
        }, 300);
        
        console.log(`✅ Avatar display updated successfully`);
        
    } catch (error) {
        console.error('❌ Error updating avatar display:', error);
    }
}

function updateHealthStats() {
    try {
        const healthStatCard = document.querySelector('.stat-card:last-child .stat-value');
        if (healthStatCard) {
            const percentage = healthLevels[currentHealthLevel].percentage;
            healthStatCard.textContent = `${percentage}%`;
            
            healthStatCard.style.transform = 'scale(1.2)';
            healthStatCard.style.color = healthLevels[currentHealthLevel].color;
            setTimeout(() => {
                healthStatCard.style.transform = 'scale(1)';
            }, 300);
        }
    } catch (error) {
        console.error('❌ Error updating health stats:', error);
    }
}

function selectMood(button, mood) {
    try {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        button.classList.add('selected');
        localStorage.setItem('todayMood', mood);
        showToast('Mood Tersimpan!', 'Terima kasih sudah berbagi perasaanmu hari ini.', 'success');
        updateQuoteBasedOnMood(mood);
    } catch (error) {
        console.error('❌ Error selecting mood:', error);
    }
}

function updateQuoteBasedOnMood(mood) {
    const quotes = {
        great: {
            text: "Energi positifmu hari ini luar biasa! Terus pertahankan semangat bebas rokok ini.",
            author: "- Stay Strong"
        },
        good: {
            text: "Hari yang baik untuk terus melanjutkan perjalanan sehatmu tanpa rokok.",
            author: "- Keep Going"
        },
        okay: {
            text: "Hari biasa-biasa saja? Tidak apa-apa. Yang penting kamu tetap konsisten tanpa rokok.",
            author: "- One Day at a Time"
        },
        bad: {
            text: "Hari yang berat? Ingatlah bahwa tidak merokok adalah satu hal positif yang sudah kamu lakukan hari ini.",
            author: "- Every Step Counts"
        },
        terrible: {
            text: "Hari yang sangat sulit? Kamu tidak sendirian. Tim PuffOff dan komunitas selalu siap membantumu.",
            author: "- We're Here for You"
        }
    };

    const quoteCard = document.querySelector('.quote-card');
    const selectedQuote = quotes[mood];
    
    if (selectedQuote && quoteCard) {
        quoteCard.innerHTML = `
            <div class="quote-text">${selectedQuote.text}</div>
            <div class="quote-author">${selectedQuote.author}</div>
        `;
    }
}

function handleEmergency() {
    const emergencyOptions = [
        "🧘 Latihan Pernapasan 2 Menit",
        "🚶 Jalan Kaki Sebentar",
        "💧 Minum Air Putih",
        "📱 Chat dengan Komunitas",
        "🎵 Dengarkan Musik Favorit",
        "🤲 Cuci Tangan dan Wajah",
        "📖 Baca Motivasi Positif",
        "🍎 Makan Camilan Sehat"
    ];
    
    const randomOption = emergencyOptions[Math.floor(Math.random() * emergencyOptions.length)];
    
    if (confirm(`Butuh bantuan mengatasi keinginan merokok?\n\nSaran: ${randomOption}\n\nApakah kamu ingin mencoba sekarang?`)) {
        showToast('Kamu Bisa Melakukannya!', 'Ingat tujuanmu dan tetap kuat! 💪', 'success');
        
        setTimeout(() => {
            const emergencyNotif = {
                type: 'success',
                icon: '🆘',
                title: 'Berhasil Mengatasi Keinginan!',
                message: 'Kamu berhasil menahan diri! Setiap detik adalah kemenangan.',
                category: 'Emergency Success'
            };
            showSinglePushNotification(emergencyNotif);
        }, 2000);
    }
}

function showToast(title, message, type = 'info') {
    try {
        let toastContainer = document.getElementById('toastContainer');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        const toastId = `toast-${Date.now()}`;
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const toastHTML = `
            <div class="toast ${type}" id="${toastId}">
                <div class="toast-icon">${icons[type] || icons.info}</div>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close" onclick="closeToast('${toastId}')">×</button>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toast = document.getElementById(toastId);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            closeToast(toastId);
        }, 4000);
        
    } catch (error) {
        console.error('❌ Error showing toast:', error);
    }
}

function closeToast(toastId) {
    try {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    } catch (error) {
        console.error('❌ Error closing toast:', error);
    }
}

function animateStats() {
    try {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transform = 'scale(1.1)';
                stat.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 200);
            }, index * 100);
        });
        
        const progressCircle = document.querySelector('.progress-circle');
        if (progressCircle) {
            progressCircle.style.transform = 'scale(0.8)';
            progressCircle.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                progressCircle.style.transform = 'scale(1)';
            }, 600);
        }
        
        // Animate milestone progress bar
        const milestoneProgressFill = document.querySelector('.milestone-progress-fill');
        if (milestoneProgressFill) {
            milestoneProgressFill.style.width = '0%';
            setTimeout(() => {
                milestoneProgressFill.style.width = '70%';
            }, 800);
        }
    } catch (error) {
        console.error('❌ Error animating stats:', error);
    }
}

function updateGreeting() {
    try {
        const greeting = document.querySelector('.greeting');
        const hour = new Date().getHours();
        let timeGreeting = '';
        
        if (hour < 12) {
            timeGreeting = 'Selamat pagi';
        } else if (hour < 18) {
            timeGreeting = 'Selamat siang';
        } else {
            timeGreeting = 'Selamat malam';
        }
        
        if (greeting) {
            greeting.innerHTML = `${timeGreeting}, <strong>Ahmad!</strong> 👋`;
        }
    } catch (error) {
        console.error('❌ Error updating greeting:', error);
    }
}

// Legacy function aliases
function changeHealthLevel(action) {
    changeHealthLevelSingle(action);
}

function triggerPushNotification() {
    triggerSinglePushNotification();
}

// Test functions
window.testHealthLevel = function(level) {
    if (level >= 1 && level <= 5) {
        if (isLevelChanging) {
            console.log('⚠️ Level change already in progress');
            return;
        }
        
        currentHealthLevel = level;
        localStorage.setItem('healthLevel', currentHealthLevel.toString());
        updateAvatarDisplay();
        updateHealthStats();
        console.log(`🧪 Test: Set health level to ${level}`);
    } else {
        console.log('🧪 Test: Level must be 1-5');
    }
};

window.testNotification = function() {
    triggerSinglePushNotification();
    console.log('🧪 Test: Triggered single notification');
};

// Auto-update greeting
setInterval(updateGreeting, 60000);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    try {
        if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
            e.preventDefault();
            handleEmergency();
        }
        
        if ((e.key === '+' || e.key === '=') && !e.target.matches('input, textarea')) {
            e.preventDefault();
            changeHealthLevelSingle('increase');
        }
        
        if (e.key === '-' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            changeHealthLevelSingle('decrease');
        }
        
        if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
            e.preventDefault();
            triggerSinglePushNotification();
        }
    } catch (error) {
        console.error('❌ Error in keyboard shortcuts:', error);
    }
});

console.log('🎮 PuffOff Controls Ready!');
console.log('🔧 Click +/- buttons to change health levels');
console.log('🔔 Click notification button for demo');
console.log('⌨️ Keyboard: E=Emergency, +/-=Health, N=Notification');

// Initialize if DOM already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    setTimeout(initializeApp, 100);
}
