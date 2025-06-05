function updateHealthStats() {
    try {
        // Update the health score in stats grid
        const healthStatCard = document.querySelector('.stat-card:last-child .stat-value');
        if (healthStatCard) {
            const percentage = healthLevels[currentHealthLevel].percentage;
            healthStatCard.textContent = `${percentage}%`;
            
            // Add animation
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

// Mood selection functionality
function selectMood(button, mood) {
    try {
        // Remove selected class from all buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked button
        button.classList.add('selected');
        
        // Store mood and show feedback
        localStorage.setItem('todayMood', mood);
        showToast('Mood Tersimpan!', 'Terima kasih sudah berbagi perasaanmu hari ini.', 'success');
        
        // Update quote based on mood
        updateQuoteBasedOnMood(mood);
    } catch (error) {
        console.error('❌ Error selecting mood:', error);
    }
}

// Update quote based on selected mood
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

// Handle emergency button
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
        
        // Show emergency success notification
        setTimeout(() => {
            const emergencyNotif = {
                type: 'success',
                icon: '🆘',
                title: 'Berhasil Mengatasi Keinginan!',
                message: 'Kamu berhasil menahan diri! Setiap detik adalah kemenangan.',
                category: 'Emergency Success'
            };
            showPushNotification(emergencyNotif);
        }, 1000);
    }
}

// Toast notification system
function showToast(title, message, type = 'info') {
    try {
        let toastContainer = document.getElementById('toastContainer');
        
        // Create container if it doesn't exist
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
        
        // Show toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100// Mood selection functionality
function selectMood(button, mood) {
    // Remove selected class from all buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Store mood and show feedback
    localStorage.setItem('todayMood', mood);
    showToast('Mood Tersimpan!', 'Terima kasih sudah berbagi perasaanmu hari ini.', 'success');
    
    // Update quote based on mood
    updateQuoteBasedOnMood(mood);
}

// Update quote based on selected mood
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

// Handle emergency button
function handleEmergency() {
    const emergencyOptions = [
        "🧘 Latihan Pernapasan 2 Menit",
        "🚶 Jalan Kaki Sebentar",
        "💧 Minum Air Putih",
        "📱 Chat dengan Komunitas",
        "🎵 Dengarkan Musik Favorit",
        "🤲 Cuci Tangan dan Wajah",
        "📖 Baca Motivasi Positif",
        "🍎 Makan Camilan Sehat",
        "🧠 Latihan Mindfulness",
        "☕ Minum Teh Herbal"
    ];
    
    const randomOption = emergencyOptions[Math.floor(Math.random() * emergencyOptions.length)];
    
    if (confirm(`Butuh bantuan mengatasi keinginan merokok?\n\nSaran: ${randomOption}\n\nApakah kamu ingin mencoba sekarang?`)) {
        showToast('Kamu Bisa Melakukannya!', 'Ingat tujuanmu dan tetap kuat! 💪', 'success');
        
        // Show emergency success notification
        setTimeout(() => {
            const emergencyNotif = {
                type: 'success',
                icon: '🆘',
                title: 'Berhasil Mengatasi Keinginan!',
                message: 'Kamu berhasil menahan diri! Setiap detik adalah kemenangan.',
                category: 'Emergency Success'
            };
            showPushNotification(emergencyNotif);
        }, 1000);
    }
}

// Toast notification system
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
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
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        closeToast(toastId);
    }, 4000);
}

function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// Animate statistics on page load
function animateStats() {
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
    
    // Animate progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        progressCircle.style.transform = 'scale(0.8)';
        progressCircle.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            progressCircle.style.transform = 'scale(1)';
        }, 600);
    }
}

// Update greeting based on time
function updateGreeting() {
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
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.emergency-btn') || 
        e.target.closest('.control-btn') || 
        e.target.closest('.show-notification-btn')) {
        
        const button = e.target.closest('.emergency-btn, .control-btn, .show-notification-btn');
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
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
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
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
            ripple.remove();
        }, 600);
    }
});

// Auto-update greeting every minute
setInterval(updateGreeting, 60000);

// Add random motivational notifications
function addRandomMotivation() {
    const motivations = [
        {
            type: 'success',
            icon: '💪',
            title: 'Kamu Luar Biasa!',
            message: 'Setiap detik tanpa rokok adalah kemenangan besar!',
            category: 'Motivation'
        },
        {
            type: 'info',
            icon: '🌟',
            title: 'Fakta Kesehatan',
            message: 'Dalam 20 menit tanpa rokok, detak jantung dan tekanan darah turun.',
            category: 'Health Fact'
        },
        {
            type: 'achievement',
            icon: '🎯',
            title: 'Tetap Fokus!',
            message: 'Kamu sudah di jalur yang benar menuju hidup bebas rokok.',
            category: 'Encouragement'
        }
    ];
    
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    showPushNotification(randomMotivation);
}

// Show random motivation every 2 minutes (for demo purposes)
setInterval(addRandomMotivation, 120000);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'E' for emergency help
    if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
        e.preventDefault();
        handleEmergency();
    }
    
    // Press '+' to increase health level
    if ((e.key === '+' || e.key === '=') && !e.target.matches('input, textarea')) {
        e.preventDefault();
        changeHealthLevel('increase');
    }
    
    // Press '-' to decrease health level
    if (e.key === '-' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        changeHealthLevel('decrease');
    }
    
    // Press 'N' to show notification
    if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey && !e.target.matches('input, textarea')) {
        e.preventDefault();
        triggerPushNotification();
    }
});

// Touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 80;
    
    // Swipe up to show motivation
    if (swipeDistance > minSwipeDistance) {
        addRandomMotivation();
    }
    
    // Swipe down to trigger notification demo
    if (swipeDistance < -minSwipeDistance) {
        triggerPushNotification();
    }
}

// Debug and help information
console.log('🎮 PuffOff Controls:');
console.log('🔧 Click +/- buttons to change health levels');
console.log('🔔 Click notification button for push notification demo');
console.log('⌨️ Keyboard shortcuts:');
console.log('  - E: Emergency help');
console.log('  - +/=: Increase health level');
console.log('  - -: Decrease health level');
console.log('  - N: Show notification');
console.log('📱 Mobile gestures:');
console.log('  - Swipe up: Random motivation');
console.log('  - Swipe down: Show notification');

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Ensure avatar starts with correct display
    setTimeout(() => {
        updateAvatarDisplay();
    }, 500);
});// Global variables
let currentHealthLevel = 4; // Default health level (1-5)
let notificationCounter = 0;

// Health level data with more detailed information
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚭 PuffOff App Starting...');
    
    // Small delay to ensure DOM is fully loaded
    setTimeout(() => {
        initializeApp();
    }, 100);
});

function initializeApp() {
    console.log('🚭 PuffOff App Initialized!');
    
    // Load saved data
    loadSavedData();
    
    // Initialize avatar
    updateAvatarDisplay();
    
    // Test button functionality
    setupButtonListeners();
    
    // Animate stats on load
    animateStats();
    
    // Update greeting based on time
    updateGreeting();
    
    // Show welcome notification
    setTimeout(() => {
        showToast('Selamat datang kembali!', 'Tetap semangat untuk hidup bebas rokok! 💪', 'success');
    }, 1500);
    
    console.log('✅ App initialization complete');
}

function setupButtonListeners() {
    // Add direct event listeners as backup
    const increaseBtn = document.getElementById('increaseBtn');
    const decreaseBtn = document.getElementById('decreaseBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            console.log('🔼 Increase button clicked');
            changeHealthLevel('increase');
        });
        console.log('✅ Increase button listener added');
    } else {
        console.error('❌ Increase button not found');
    }
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            console.log('🔽 Decrease button clicked');
            changeHealthLevel('decrease');
        });
        console.log('✅ Decrease button listener added');
    } else {
        console.error('❌ Decrease button not found');
    }
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            console.log('🔔 Notification button clicked');
            triggerPushNotification();
        });
        console.log('✅ Notification button listener added');
    } else {
        console.error('❌ Notification button not found');
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
        // Set default and save
        currentHealthLevel = 4;
        localStorage.setItem('healthLevel', currentHealthLevel.toString());
        console.log(`📊 Set default health level: ${currentHealthLevel}`);
    }
}

// Avatar health level functions - FIXED AND IMPROVED
function changeHealthLevel(action) {
    console.log(`🔧 changeHealthLevel called with action: ${action}`);
    console.log(`📊 Current level: ${currentHealthLevel}`);
    
    const oldLevel = currentHealthLevel;
    
    try {
        if (action === 'increase' && currentHealthLevel < 5) {
            currentHealthLevel++;
            console.log(`📈 Health level increased to: ${currentHealthLevel}`);
            showToast('Level Kesehatan Naik!', `Naik ke level ${currentHealthLevel}/5 - ${healthLevels[currentHealthLevel].status}`, 'success');
        } else if (action === 'decrease' && currentHealthLevel > 1) {
            currentHealthLevel--;
            console.log(`📉 Health level decreased to: ${currentHealthLevel}`);
            showToast('Level Kesehatan Turun', `Turun ke level ${currentHealthLevel}/5 - ${healthLevels[currentHealthLevel].status}`, 'warning');
        } else {
            const message = action === 'increase' ? 'Sudah di level maksimal (5/5)!' : 'Sudah di level minimum (1/5)!';
            console.log(`⚠️ Cannot change level: ${message}`);
            showToast('Tidak Bisa Diubah', message, 'info');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('healthLevel', currentHealthLevel.toString());
        console.log(`💾 Health level saved: ${currentHealthLevel}`);
        
        // Update display
        updateAvatarDisplay();
        updateHealthStats();
        
        // Show push notification for level change
        if (oldLevel !== currentHealthLevel) {
            setTimeout(() => {
                const levelChangeNotif = {
                    type: action === 'increase' ? 'success' : 'warning',
                    icon: action === 'increase' ? '📈' : '📉',
                    title: `Level Kesehatan ${action === 'increase' ? 'Naik' : 'Turun'}!`,
                    message: `Status kesehatan berubah menjadi: ${healthLevels[currentHealthLevel].status}`,
                    category: 'Health Update'
                };
                showPushNotification(levelChangeNotif);
            }, 1000);
        }
        
    } catch (error) {
        console.error('❌ Error in changeHealthLevel:', error);
        showToast('Error', 'Terjadi kesalahan saat mengubah level kesehatan', 'error');
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
        
        // Update avatar body class
        avatarBody.className = `avatar-body health-level-${currentHealthLevel}`;
        console.log(`🎭 Avatar class updated to: health-level-${currentHealthLevel}`);
        
        // Update mouth expression
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
        
        // Update health aura
        if (healthAura) {
            if (currentHealthLevel >= 4) {
                healthAura.classList.add('active');
            } else {
                healthAura.classList.remove('active');
            }
        }
        
        // Update lungs
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
        
        // Update heart
        if (avatarHeart) {
            avatarHeart.className = 'heart';
            if (currentHealthLevel >= 4) {
                avatarHeart.classList.add('healthy');
            }
        }
        
        // Update health info
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
        
        // Update status indicators
        if (lungIndicator) {
            lungIndicator.className = `status-indicator lung-indicator ${levelData.lungIndicator}`;
        }
        if (heartIndicator) {
            heartIndicator.className = `status-indicator heart-indicator ${levelData.heartIndicator}`;
        }
        if (oxygenStatusIndicator) {
            oxygenStatusIndicator.className = `status-indicator oxygen-indicator ${levelData.lungIndicator}`;
        }
        
        // Update health indicators in avatar
        if (oxygenIndicator) {
            oxygenIndicator.innerHTML = `<i class="fas fa-lungs"></i><span>${levelData.oxygenLevel}%</span>`;
        }
        
        if (heartRateIndicator) {
            heartRateIndicator.innerHTML = `<i class="fas fa-heartbeat"></i><span>${levelData.heartRate}</span>`;
        }
        
        // Add animation effect
        avatarBody.style.transform = 'scale(1.05)';
        setTimeout(() => {
            avatarBody.style.transform = 'scale(1)';
        }, 300);
        
        console.log(`✅ Avatar display updated successfully`);
        
    } catch (error) {
        console.error('❌ Error updating avatar display:', error);
    }
}

// Push Notification System - FIXED
function triggerPushNotification() {
    console.log('🔔 Triggering push notification...');
    
    try {
        const randomTemplate = pushNotificationTemplates[Math.floor(Math.random() * pushNotificationTemplates.length)];
        showPushNotification(randomTemplate);
        
        // Also show a toast as backup
        showToast('Notifikasi Triggered!', 'Push notification sedang ditampilkan di atas layar.', 'info');
        
    } catch (error) {
        console.error('❌ Error triggering notification:', error);
        showToast('Error', 'Gagal menampilkan notifikasi push', 'error');
    }
}

function showPushNotification(notificationData) {
    try {
        let container = document.getElementById('pushNotificationContainer');
        
        // Create container if it doesn't exist
        if (!container) {
            container = document.createElement('div');
            container.id = 'pushNotificationContainer';
            container.className = 'push-notification-container';
            document.body.appendChild(container);
            console.log('📦 Created push notification container');
        }
        
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
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto hide after 6 seconds
        setTimeout(() => {
            closePushNotification(notificationId);
        }, 6000);
        
        console.log(`✅ Push notification shown: ${notificationData.title}`);
        
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
    },
    {
        type: 'achievement',
        icon: '⭐',
        title: 'Streak Fantastic!',
        message: 'Streak 10 hari! Kamu semakin dekat dengan hidup bebas rokok.',
        category: 'Milestone'
    },
    {
        type: 'success',
        icon: '🌟',
        title: 'Level Up!',
        message: 'Level kesehatan naik! Tubuh mulai merasakan perubahan positif.',
        category: 'Level'
    }
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('🚭 PuffOff App Initialized!');
    
    // Load saved data
    loadSavedData();
    
    // Initialize avatar
    updateAvatarDisplay();
    
    // Animate stats on load
    animateStats();
    
    // Update greeting based on time
    updateGreeting();
    
    // Show welcome notification
    setTimeout(() => {
        showToast('Selamat datang kembali!', 'Tetap semangat untuk hidup bebas rokok! 💪', 'success');
    }, 1500);
    
    // Log controls for debugging
    console.log('🎮 Controls available:');
    console.log('- Click + button to increase health level');
    console.log('- Click - button to decrease health level');
    console.log('- Click notification button for push notification demo');
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
    }
}

// Avatar health level functions - FIXED
function changeHealthLevel(action) {
    console.log(`🔧 changeHealthLevel called with action: ${action}`);
    console.log(`📊 Current level: ${currentHealthLevel}`);
    
    const oldLevel = currentHealthLevel;
    
    if (action === 'increase' && currentHealthLevel < 5) {
        currentHealthLevel++;
        console.log(`📈 Health level increased to: ${currentHealthLevel}`);
        showToast('Level Kesehatan Naik!', `Naik ke level ${currentHealthLevel}/5 - ${healthLevels[currentHealthLevel].status}`, 'success');
    } else if (action === 'decrease' && currentHealthLevel > 1) {
        currentHealthLevel--;
        console.log(`📉 Health level decreased to: ${currentHealthLevel}`);
        showToast('Level Kesehatan Turun', `Turun ke level ${currentHealthLevel}/5 - ${healthLevels[currentHealthLevel].status}`, 'warning');
    } else {
        const message = action === 'increase' ? 'Sudah di level maksimal (5/5)!' : 'Sudah di level minimum (1/5)!';
        console.log(`⚠️ Cannot change level: ${message}`);
        showToast('Tidak Bisa Diubah', message, 'info');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('healthLevel', currentHealthLevel.toString());
    console.log(`💾 Health level saved: ${currentHealthLevel}`);
    
    // Update display
    updateAvatarDisplay();
    updateHealthStats();
    
    // Show push notification for level change
    if (oldLevel !== currentHealthLevel) {
        setTimeout(() => {
            const levelChangeNotif = {
                type: action === 'increase' ? 'success' : 'warning',
                icon: action === 'increase' ? '📈' : '📉',
                title: `Level Kesehatan ${action === 'increase' ? 'Naik' : 'Turun'}!`,
                message: `Status kesehatan berubah menjadi: ${healthLevels[currentHealthLevel].status}`,
                category: 'Health Update'
            };
            showPushNotification(levelChangeNotif);
        }, 500);
    }
}

function updateAvatarDisplay() {
    console.log(`🎨 Updating avatar display for level ${currentHealthLevel}`);
    
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
    
    if (!avatarBody) {
        console.error('❌ Avatar body element not found');
        return;
    }
    
    const levelData = healthLevels[currentHealthLevel];
    console.log(`📋 Level data:`, levelData);
    
    // Update avatar appearance
    avatarBody.className = `avatar-body health-level-${currentHealthLevel}`;
    
    // Update health info
    if (healthStatus) healthStatus.textContent = levelData.status;
    if (healthStatus) healthStatus.style.color = levelData.color;
    
    if (healthLevelBadge) healthLevelBadge.textContent = `Level ${currentHealthLevel}`;
    
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
    
    // Update status indicators
    if (lungIndicator) {
        lungIndicator.className = `status-indicator lung-indicator ${levelData.lungIndicator}`;
    }
    if (heartIndicator) {
        heartIndicator.className = `status-indicator heart-indicator ${levelData.heartIndicator}`;
    }
    if (oxygenStatusIndicator) {
        oxygenStatusIndicator.className = `status-indicator oxygen-indicator ${levelData.lungIndicator}`;
    }
    
    // Update health indicators in avatar
    const oxygenIndicator = document.getElementById('oxygenIndicator');
    const heartRateIndicator = document.getElementById('heartRateIndicator');
    
    if (oxygenIndicator) {
        const oxygenLevel = Math.floor(85 + (currentHealthLevel * 3));
        oxygenIndicator.innerHTML = `<i class="fas fa-lungs"></i><span>${oxygenLevel}%</span>`;
    }
    
    if (heartRateIndicator) {
        const heartRate = Math.floor(85 - (currentHealthLevel * 5));
        heartRateIndicator.innerHTML = `<i class="fas fa-heartbeat"></i><span>${heartRate}</span>`;
    }
    
    // Add animation effect
    avatarBody.style.transform = 'scale(1.05)';
    setTimeout(() => {
        avatarBody.style.transform = 'scale(1)';
    }, 300);
    
    console.log(`✅ Avatar display updated successfully`);
}

function updateHealthStats() {
    // Update the health score in stats grid
    const healthStatCard = document.querySelector('.stat-card:last-child .stat-value');
    if (healthStatCard) {
        const percentage = healthLevels[currentHealthLevel].percentage;
        healthStatCard.textContent = `${percentage}%`;
        
        // Add animation
        healthStatCard.style.transform = 'scale(1.2)';
        healthStatCard.style.color = healthLevels[currentHealthLevel].color;
        setTimeout(() => {
            healthStatCard.style.transform = 'scale(1)';
        }, 300);
    }
}

// Push Notification System
function triggerPushNotification() {
    console.log('🔔 Triggering push notification...');
    const randomTemplate = pushNotificationTemplates[Math.floor(Math.random() * pushNotificationTemplates.length)];
    showPushNotification(randomTemplate);
}

function showPushNotification(notificationData) {
    const container = document.getElementById('pushNotificationContainer');
    if (!container) {
        console.error('❌ Push notification container not found');
        return;
    }
    
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
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closePushNotification(notificationId);
    }, 5000);
    
    console.log(`✅ Push notification shown: ${notificationData.title}`);
}

function closePushNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }
}

// Sample notifications for testing
const sampleNotifications = [
    {
        icon: "🎉",
        title: "Milestone Baru Tercapai!",
        time: "Baru saja"
    },
    {
        icon: "💪",
        title: "Kamu sudah kuat 24 jam tanpa rokok!",
        time: "2 menit yang lalu"
    },
    {
        icon: "🌟",
        title: "Tips: Minum air putih saat ingin merokok",
        time: "5 menit yang lalu"
    },
    {
        icon: "📈",
        title: "Progress kesehatan naik 5%!",
        time: "10 menit yang lalu"
    },
    {
        icon: "👏",
        title: "Selamat! Kamu berhasil menolak rokok tadi",
        time: "15 menit yang lalu"
    },
    {
        icon: "🥇",
        title: "Ranking kesehatan naik ke posisi 1!",
        time: "20 menit yang lalu"
    },
    {
        icon: "🚭",
        title: "Berhasil menghindari zona merokok",
        time: "30 menit yang lalu"
    },
    {
        icon: "💚",
        title: "Paru-paru mulai membersihkan diri",
        time: "1 jam yang lalu"
    }
];

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load saved data
    loadSavedData();
    
    // Initialize avatar
    updateAvatarDisplay();
    
    // Animate stats on load
    animateStats();
    
    // Update greeting based on time
    updateGreeting();
    
    // Show welcome notification
    setTimeout(() => {
        showToast('Selamat datang kembali!', 'Tetap semangat untuk hidup bebas rokok! 💪', 'success');
    }, 1000);
}

function loadSavedData() {
    // Load saved mood
    const savedMood = localStorage.getItem('todayMood');
    if (savedMood) {
        const moodButtons = {
            'great': 0,
            'good': 1, 
            'okay': 2,
            'bad': 3,
            'terrible': 4
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
    if (savedHealthLevel) {
        currentHealthLevel = parseInt(savedHealthLevel);
        updateAvatarDisplay();
    }
}

// Mood selection functionality
function selectMood(button, mood) {
    // Remove selected class from all buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Store mood and show feedback
    localStorage.setItem('todayMood', mood);
    showToast('Mood Tersimpan!', 'Terima kasih sudah berbagi perasaanmu hari ini.', 'success');
    
    // Update quote based on mood
    updateQuoteBasedOnMood(mood);
}

// Update quote based on selected mood
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

// Handle emergency button
function handleEmergency() {
    const emergencyOptions = [
        "🧘 Latihan Pernapasan 2 Menit",
        "🚶 Jalan Kaki Sebentar",
        "💧 Minum Air Putih",
        "📱 Chat dengan Komunitas",
        "🎵 Dengarkan Musik Favorit",
        "🤲 Cuci Tangan dan Wajah",
        "📖 Baca Motivasi Positif",
        "🍎 Makan Camilan Sehat",
        "🧠 Latihan Mindfulness",
        "☕ Minum Teh Herbal"
    ];
    
    const randomOption = emergencyOptions[Math.floor(Math.random() * emergencyOptions.length)];
    
    if (confirm(`Butuh bantuan mengatasi keinginan merokok?\n\nSaran: ${randomOption}\n\nApakah kamu ingin mencoba sekarang?`)) {
        showToast('Kamu Bisa Melakukannya!', 'Ingat tujuanmu dan tetap kuat! 💪', 'success');
        
        // Add emergency notification
        addNotification('🆘', 'Berhasil mengatasi keinginan merokok!', 'Baru saja');
        
        // Update health slightly as reward
        if (currentHealthLevel < 5) {
            showToast('Bonus Kesehatan!', 'Kesehatan meningkat karena berhasil menahan diri!', 'success');
        }
    }
}

// Avatar health level functions
function changeHealthLevel(action) {
    if (action === 'increase' && currentHealthLevel < 5) {
        currentHealthLevel++;
        showToast('Level Kesehatan Naik!', `Sekarang di level ${currentHealthLevel}/5`, 'success');
    } else if (action === 'decrease' && currentHealthLevel > 1) {
        currentHealthLevel--;
        showToast('Level Kesehatan Turun', `Sekarang di level ${currentHealthLevel}/5`, 'warning');
    } else {
        const message = action === 'increase' ? 'Sudah di level maksimal!' : 'Sudah di level minimum!';
        showToast('Tidak Bisa Diubah', message, 'info');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('healthLevel', currentHealthLevel.toString());
    
    // Update display
    updateAvatarDisplay();
    
    // Update stats
    updateHealthStats();
    
    // Add notification about level change
    const levelNames = ['', 'Buruk', 'Kurang Baik', 'Cukup', 'Membaik', 'Sangat Sehat'];
    addNotification('📊', `Level kesehatan berubah ke: ${levelNames[currentHealthLevel]}`, 'Baru saja');
}

function updateAvatarDisplay() {
    const avatarBody = document.getElementById('avatarBody');
    const healthStatus = document.getElementById('healthStatus');
    const healthFill = document.getElementById('healthFill');
    const healthPercentage = document.getElementById('healthPercentage');
    const lungStatus = document.getElementById('lungStatus');
    const heartStatus = document.getElementById('heartStatus');
    
    if (!avatarBody || !healthStatus || !healthFill || !healthPercentage || !lungStatus || !heartStatus) {
        return;
    }
    
    const levelData = healthLevels[currentHealthLevel];
    
    // Update avatar appearance
    avatarBody.className = `avatar-body health-level-${currentHealthLevel}`;
    
    // Update health info
    healthStatus.textContent = levelData.status;
    healthStatus.style.color = levelData.color;
    
    healthFill.style.width = `${levelData.percentage}%`;
    healthFill.style.background = `linear-gradient(90deg, ${levelData.color}, ${levelData.color}dd)`;
    
    healthPercentage.textContent = `${levelData.percentage}%`;
    healthPercentage.style.color = levelData.color;
    
    lungStatus.textContent = levelData.lungStatus;
    heartStatus.textContent = levelData.heartStatus;
    
    // Add animation effect
    avatarBody.style.transform = 'scale(1.05)';
    setTimeout(() => {
        avatarBody.style.transform = 'scale(1)';
    }, 300);
}

function updateHealthStats() {
    // Update the health score in stats grid
    const healthStatCard = document.querySelector('.stat-card:last-child .stat-value');
    if (healthStatCard) {
        const percentage = healthLevels[currentHealthLevel].percentage;
        healthStatCard.textContent = `${percentage}%`;
        
        // Add animation
        healthStatCard.style.transform = 'scale(1.2)';
        healthStatCard.style.color = healthLevels[currentHealthLevel].color;
        setTimeout(() => {
            healthStatCard.style.transform = 'scale(1)';
        }, 300);
    }
}

// Notification functions
function dismissNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
        
        showToast('Notifikasi Dihapus', 'Notifikasi telah dihapus dari daftar.', 'info');
    }
}

function addSampleNotification() {
    const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    addNotification(randomNotif.icon, randomNotif.title, randomNotif.time);
    showToast('Notifikasi Ditambahkan!', 'Notifikasi test berhasil ditambahkan.', 'success');
}

function addNotification(icon, title, time) {
    notificationCounter++;
    const notificationPanel = document.querySelector('.notification-panel');
    
    if (!notificationPanel) return;
    
    const notificationId = `notification${notificationCounter}`;
    const notificationHTML = `
        <div class="notification-item active" id="${notificationId}">
            <div class="notif-icon">${icon}</div>
            <div class="notif-content">
                <div class="notif-title">${title}</div>
                <div class="notif-time">${time}</div>
            </div>
            <button class="notif-dismiss" onclick="dismissNotification('${notificationId}')">×</button>
        </div>
    `;
    
    notificationPanel.insertAdjacentHTML('afterbegin', notificationHTML);
    
    // Add entrance animation
    const newNotification = document.getElementById(notificationId);
    newNotification.style.transform = 'translateX(-100%)';
    newNotification.style.opacity = '0';
    
    setTimeout(() => {
        newNotification.style.transform = 'translateX(0)';
        newNotification.style.opacity = '1';
    }, 100);
}

function clearAllNotifications() {
    const notifications = document.querySelectorAll('.notification-item');
    
    if (notifications.length === 0) {
        showToast('Tidak Ada Notifikasi', 'Tidak ada notifikasi untuk dihapus.', 'info');
        return;
    }
    
    if (confirm('Hapus semua notifikasi?')) {
        notifications.forEach((notification, index) => {
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, index * 100);
        });
        
        showToast('Semua Notifikasi Dihapus', 'Daftar notifikasi telah dibersihkan.', 'success');
    }
}

// Toast notification system
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
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
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        closeToast(toastId);
    }, 4000);
}

function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

// Animate statistics on page load
function animateStats() {
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
    
    // Animate progress circle
    const progressCircle = document.querySelector('.progress-circle');
    if (progressCircle) {
        progressCircle.style.transform = 'scale(0.8)';
        progressCircle.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
            progressCircle.style.transform = 'scale(1)';
        }, 600);
    }
}

// Update greeting based on time
function updateGreeting() {
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
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('emergency-btn') || 
        e.target.classList.contains('control-btn') || 
        e.target.classList.contains('notif-control-btn')) {
        
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
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
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
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
            ripple.remove();
        }, 600);
    }
});

// Auto-update greeting every minute
setInterval(updateGreeting, 60000);

// Add some fun interactive features
function addRandomMotivation() {
    const motivations = [
        "Kamu sudah melakukan hal yang luar biasa hari ini!",
        "Setiap detik tanpa rokok adalah kemenangan!",
        "Tubuhmu berterima kasih atas keputusan baikmu!",
        "Kamu lebih kuat dari keinginan merokok!",
        "Hidup sehat adalah investasi terbaik!"
    ];
    
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    showToast('Motivasi Harian', randomMotivation, 'success');
}

// Show random motivation every 5 minutes (for demo purposes)
setInterval(addRandomMotivation, 300000);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'E' for emergency help
    if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.altKey) {
        handleEmergency();
    }
    
    // Press '+' to increase health level
    if (e.key === '+' || e.key === '=') {
        changeHealthLevel('increase');
    }
    
    // Press '-' to decrease health level
    if (e.key === '-') {
        changeHealthLevel('decrease');
    }
    
    // Press 'N' to add notification
    if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.altKey) {
        addSampleNotification();
    }
});

// Touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50;
    
    // Swipe up to show motivation
    if (swipeDistance > minSwipeDistance) {
        addRandomMotivation();
    }
    
    // Swipe down to add notification (for demo)
    if (swipeDistance < -minSwipeDistance) {
        addSampleNotification();
    }
}

// Initialize all features when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('PuffOff App Initialized! 🚭');
    console.log('Keyboard shortcuts:');
    console.log('- Press E for emergency help');
    console.log('- Press + to increase health level');
    console.log('- Press - to decrease health level');
    console.log('- Press N to add test notification');
    console.log('- Swipe up/down on mobile for interactions');
});
