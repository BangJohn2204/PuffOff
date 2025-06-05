// Global variables
let currentHealthLevel = 4; // Default health level (1-5)
let notificationCounter = 3; // Counter for notification IDs

// Health level data
const healthLevels = {
    1: {
        status: "Buruk",
        percentage: 20,
        lungStatus: "Rusak parah",
        heartStatus: "Tidak stabil",
        color: "#ef4444"
    },
    2: {
        status: "Kurang Baik",
        percentage: 40,
        lungStatus: "Masih rusak",
        heartStatus: "Kurang stabil",
        color: "#f59e0b"
    },
    3: {
        status: "Cukup",
        percentage: 60,
        lungStatus: "Mulai membaik",
        heartStatus: "Stabil",
        color: "#eab308"
    },
    4: {
        status: "Membaik",
        percentage: 78,
        lungStatus: "Membersihkan diri",
        heartStatus: "Lebih stabil",
        color: "#10b981"
    },
    5: {
        status: "Sangat Sehat",
        percentage: 95,
        lungStatus: "Sangat bersih",
        heartStatus: "Optimal",
        color: "#059669"
    }
};

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
