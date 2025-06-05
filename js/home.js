
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
    
    // Load saved data and setup
    loadSavedData();
    setupButtonListeners();
    updateGreeting();
    
    // Update displays if elements exist
    updateAvatarDisplay();
    
    // Animate elements
    setTimeout(() => {
        animateStats();
    }, 500);
    
    // Welcome notification
    setTimeout(() => {
        showNotification('Selamat datang kembali! Tetap semangat! 💪', 'success');
    }, 1500);
    
    console.log('✅ App initialization complete');
}

function setupButtonListeners() {
    // Avatar control buttons (if they exist)
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
    // Load saved mood
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
    
    // Load saved health level
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

// Health Level Management Functions
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

function updateAvatarDisplay() {
    console.log(`🎨 Updating avatar display for level ${currentHealthLevel}`);
    
    try {
        const avatarBody = document.getElementById('avatarBody');
        
        if (!avatarBody) {
            console.log('ℹ️ Avatar elements not found - skipping avatar update');
            return;
        }
        
        const levelData = healthLevels[currentHealthLevel];
        console.log(`📋 Level data:`, levelData);
        
        // Update avatar elements
        avatarBody.className = `avatar-body health-level-${currentHealthLevel}`;
        
        // Update various health indicators
        const healthStatus = document.getElementById('healthStatus');
        const healthFill = document.getElementById('healthFill');
        const healthPercentage = document.getElementById('healthPercentage');
        const healthLevelBadge = document.getElementById('healthLevelBadge');
        const lungStatus = document.getElementById('lungStatus');
        const heartStatus = document.getElementById('heartStatus');
        const oxygenStatus = document.getElementById('oxygenStatus');
        const oxygenIndicator = document.getElementById('oxygenIndicator');
        const heartRateIndicator = document.getElementById('heartRateIndicator');
        
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
        
        if (oxygenIndicator) {
            oxygenIndicator.innerHTML = `<i class="fas fa-lungs"></i><span>${levelData.oxygenLevel}%</span>`;
        }
        
        if (heartRateIndicator) {
            heartRateIndicator.innerHTML = `<i class="fas fa-heartbeat"></i><span>${levelData.heartRate}</span>`;
        }
        
        // Animation effect
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

// Push Notification System
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
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 20000;
                pointer-events: none;
            `;
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
            <div class="push-notification ${notificationData.type}" id="${notificationId}" style="
                background: white;
                margin: 20px auto 0;
                max-width: 400px;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                border-left: 6px solid ${notificationData.type === 'success' ? '#10b981' : notificationData.type === 'warning' ? '#f59e0b' : '#3b82f6'};
                transform: translateY(-100px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                pointer-events: auto;
                position: relative;
                overflow: hidden;
            ">
                <div class="notification-header" style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px 8px;
                    border-bottom: 1px solid #f3f4f6;
                ">
                    <div class="notification-app-info" style="display: flex; align-items: center; gap: 10px;">
                        <div class="notification-app-icon" style="
                            width: 24px;
                            height: 24px;
                            background: linear-gradient(135deg, #667eea, #764ba2);
                            border-radius: 6px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 0.8rem;
                            font-weight: 700;
                        ">P</div>
                        <span class="notification-app-name" style="font-weight: 600; color: #1f2937; font-size: 0.9rem;">PuffOff</span>
                    </div>
                    <span class="notification-time" style="color: #6b7280; font-size: 0.8rem;">${currentTime}</span>
                    <button class="notification-close" onclick="closePushNotification('${notificationId}')" style="
                        background: none;
                        border: none;
                        color: #9ca3af;
                        cursor: pointer;
                        font-size: 1.2rem;
                        padding: 4px;
                        border-radius: 4px;
                        transition: all 0.2s ease;
                    ">×</button>
                </div>
                <div class="notification-content" style="padding: 12px 20px 20px;">
                    <div class="notification-title" style="font-weight: 700; color: #1f2937; margin-bottom: 8px; font-size: 1rem;">
                        <span class="notification-icon" style="font-size: 1.5rem; margin-right: 8px; vertical-align: middle;">${notificationData.icon}</span>
                        ${notificationData.title}
                    </div>
                    <div class="notification-message" style="color: #6b7280; line-height: 1.5; font-size: 0.9rem;">${notificationData.message}</div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', notificationHTML);
        
        const notification = document.getElementById(notificationId);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
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
            notification.style.transform = 'translateY(-100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }
    } catch (error) {
        console.error('❌ Error closing push notification:', error);
    }
}

// Toast Notification System
function showToast(title, message, type = 'info') {
    try {
        let toastContainer = document.getElementById('toastContainer');
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 350px;
            `;
            document.body.appendChild(toastContainer);
        }
        
        const toastId = `toast-${Date.now()}`;
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        const toastHTML = `
            <div class="toast ${type}" id="${toastId}" style="
                background: white;
                border-radius: 12px;
                padding: 16px 20px;
                margin-bottom: 12px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                border-left: 4px solid ${colors[type]};
                transform: translateX(100%);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 12px;
                position: relative;
            ">
                <div class="toast-icon" style="font-size: 1.2rem; min-width: 20px;">${icons[type] || icons.info}</div>
                <div class="toast-content" style="flex: 1;">
                    <div class="toast-title" style="font-weight: 600; color: #1f2937; margin-bottom: 2px; font-size: 0.9rem;">${title}</div>
                    <div class="toast-message" style="color: #6b7280; font-size: 0.8rem;">${message}</div>
                </div>
                <button class="toast-close" onclick="closeToast('${toastId}')" style="
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                ">×</button>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toast = document.getElementById(toastId);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
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
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    } catch (error) {
        console.error('❌ Error closing toast:', error);
    }
}

// Mood Selection Functions
function selectMood(button, mood) {
    try {
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        button.classList.add('selected');
        localStorage.setItem('todayMood', mood);
        showNotification('Mood tersimpan! Tetap semangat! 💪', 'success');
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

// Emergency Function
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
        showNotification('Kamu bisa melakukannya! 💪 Ingat tujuanmu dan tetap kuat!', 'success');
        
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

// Enhanced Notification Function (for backward compatibility)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'info' ? '#667eea' : '#f59e0b'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        line-height: 1.4;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Utility Functions
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
            }, index * 150);
        });
        
        // Animate progress circle
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

// Legacy function aliases for compatibility
function changeHealthLevel(action) {
    changeHealthLevelSingle(action);
}

function triggerPushNotification() {
    triggerSinglePushNotification();
}

// Test functions for development
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

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .action-btn')) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        // Add ripple animation CSS if not exists
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (button.contains(ripple)) {
                button.removeChild(ripple);
            }
        }, 600);
    }
});

// Auto-update greeting every minute
setInterval(updateGreeting, 60000);

// Enhanced Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    try {
        // Emergency shortcut (E key)
        if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
            e.preventDefault();
            handleEmergency();
        }
        
        // Health level shortcuts
        if ((e.key === '+' || e.key === '=') && !e.target.matches('input, textarea')) {
            e.preventDefault();
            changeHealthLevelSingle('increase');
        }
        
        if (e.key === '-' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            changeHealthLevelSingle('decrease');
        }
        
        // Notification shortcut (N key)
        if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
            e.preventDefault();
            triggerSinglePushNotification();
        }
        
        // Motivation shortcut (M key)
        if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
            e.preventDefault();
            showNotification('Tetap semangat! Kamu sudah melakukan hal yang hebat! 🌟', 'info');
        }
    } catch (error) {
        console.error('❌ Error in keyboard shortcuts:', error);
    }
});

// Console messages
console.log('🎮 PuffOff Controls Ready!');
console.log('🔧 Features available:');
console.log('  • Avatar Health System (if elements exist)');
console.log('  • Push Notifications');
console.log('  • Toast Notifications');
console.log('  • Mood Selection');
console.log('  • Emergency Support');
console.log('⌨️  Keyboard shortcuts:');
console.log('  • E = Emergency');
console.log('  • +/- = Health Level (if avatar exists)');
console.log('  • N = Show Notification');
console.log('  • M = Show Motivation');
console.log('🚭 Let\'s stay smoke-free together!');

// Initialize if DOM already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    setTimeout(initializeApp, 100);
}
