// ===========================================
// PuffOff Progress Page - Complete JavaScript with Smartwatch Integration & Chart Fix
// ===========================================

// Global Variables
let progressChart = null;
let currentChartType = 'daily';
let smartwatchConnected = false;
let heartRateInterval = null;

// Sample data for charts
const progressData = {
    dailyData: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        successDays: [1, 2, 3, 4, 5, 6, 7],
        savings: [30000, 60000, 90000, 120000, 150000, 180000, 210000],
        healthScore: [65, 68, 70, 72, 73, 74, 75]
    },
    weeklyData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        successDays: [7, 14, 21, 28],
        savings: [210000, 420000, 630000, 840000],
        healthScore: [65, 70, 73, 75]
    },
    monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        successDays: [30, 59, 90, 120, 151, 181],
        savings: [900000, 1770000, 2700000, 3600000, 4530000, 5430000],
        healthScore: [60, 65, 70, 73, 75, 78]
    }
};

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PuffOff Progress - Initializing with Smartwatch Support...');
    
    // Set body to light theme
    document.body.setAttribute('data-theme', 'light');
    document.body.style.colorScheme = 'light';
    
    setTimeout(() => {
        initializeApp();
    }, 100);
});

function initializeApp() {
    console.log('📊 Starting app initialization...');
    
    updateStats();
    loadAchievements();
    updateHealthMetrics();
    loadTimelineData();
    setupEventListeners();
    initializeSmartwatch();
    checkForSavedConnection();
    
    // Initialize chart with multiple fallbacks
    setTimeout(() => {
        console.log('🔄 Attempting to initialize chart...');
        initializeChartWithFallback();
    }, 500);
    
    console.log('✅ App initialized successfully');
}

// ===========================================
// CHART FUNCTIONS WITH DEBUGGING
// ===========================================

function initializeChartWithFallback() {
    console.log('📊 Chart initialization starting...');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js is not loaded!');
        showChartError('Chart.js library tidak tersedia');
        return;
    }
    
    console.log('✅ Chart.js detected, version:', Chart.version || 'unknown');
    
    const canvas = document.getElementById('progressChart');
    if (!canvas) {
        console.error('❌ Canvas element not found!');
        showChartError('Element canvas tidak ditemukan');
        return;
    }
    
    console.log('✅ Canvas element found');
    
    try {
        // Destroy existing chart if exists
        if (progressChart) {
            console.log('🗑️ Destroying existing chart...');
            progressChart.destroy();
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('❌ Cannot get 2D context');
            showChartError('Tidak dapat membuat konteks 2D');
            return;
        }
        
        console.log('✅ 2D context obtained');
        
        // Get chart data
        const chartData = getChartData(currentChartType);
        console.log('📊 Chart data:', chartData);
        
        // Create chart
        progressChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.datasetIndex === 1) {
                                    label += formatCurrency(context.parsed.y);
                                } else if (context.datasetIndex === 2) {
                                    label += context.parsed.y + '%';
                                } else {
                                    label += context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 3
                    },
                    point: {
                        radius: 6,
                        hoverRadius: 8,
                        borderWidth: 2
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        console.log('✅ Chart created successfully!');
        hideChartError();
        
        // Test chart animation
        setTimeout(() => {
            if (progressChart) {
                progressChart.update('active');
                console.log('✅ Chart animation test successful');
            }
        }, 1000);
        
    } catch (error) {
        console.error('❌ Chart creation failed:', error);
        showChartError('Gagal membuat chart: ' + error.message);
    }
}

function getChartData(type) {
    const data = progressData[type + 'Data'];
    
    if (!data) {
        console.error('❌ Chart data not found for type:', type);
        return {
            labels: ['No Data'],
            datasets: []
        };
    }
    
    console.log('📊 Loading chart data for:', type);
    
    return {
        labels: data.labels,
        datasets: [
            {
                label: 'Hari Sukses',
                data: data.successDays,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                yAxisID: 'y'
            },
            {
                label: 'Penghematan (Rp)',
                data: data.savings,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: false,
                yAxisID: 'y'
            },
            {
                label: 'Health Score (%)',
                data: data.healthScore,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: false,
                yAxisID: 'y'
            }
        ]
    };
}

function switchChart(type) {
    console.log('🔄 Switching chart to:', type);
    
    // Update button states
    const buttons = document.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Find and activate the clicked button
    const clickedButton = event ? event.target : document.querySelector(`[onclick="switchChart('${type}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    currentChartType = type;
    
    if (progressChart) {
        try {
            const newData = getChartData(type);
            progressChart.data = newData;
            progressChart.update('active');
            console.log('✅ Chart updated successfully for:', type);
        } catch (error) {
            console.error('❌ Chart update failed:', error);
            showToast('Gagal mengupdate chart', 'error');
        }
    } else {
        console.warn('⚠️ Chart not initialized, reinitializing...');
        initializeChartWithFallback();
    }
}

function showChartError(message) {
    const chartContainer = document.querySelector('.chart-container');
    const canvas = document.getElementById('progressChart');
    const errorDiv = document.getElementById('chartError');
    
    if (canvas) canvas.style.display = 'none';
    if (errorDiv) {
        errorDiv.style.display = 'block';
        errorDiv.querySelector('p').textContent = message;
    }
    
    console.error('📊 Chart Error:', message);
}

function hideChartError() {
    const canvas = document.getElementById('progressChart');
    const errorDiv = document.getElementById('chartError');
    
    if (canvas) canvas.style.display = 'block';
    if (errorDiv) errorDiv.style.display = 'none';
}

function forceChartReload() {
    console.log('🔄 Force reloading chart...');
    showToast('Memuat ulang chart...', 'info');
    
    setTimeout(() => {
        initializeChartWithFallback();
    }, 500);
}

// ===========================================
// STATS AND UI UPDATES
// ===========================================

function updateStats() {
    console.log('📊 Updating stats...');
    
    // Animate numbers
    animateValue(document.getElementById('daysSinceQuit'), 0, 7, 1000);
    animateValue(document.getElementById('currentStreak'), 0, 7, 1200);
    
    // Update savings with animation
    setTimeout(() => {
        document.getElementById('totalSavings').textContent = 'Rp 210K';
    }, 800);
    
    // Update health score
    setTimeout(() => {
        document.getElementById('healthScore').textContent = '75%';
    }, 1000);
}

function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (range * progress));
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// ===========================================
// SMARTWATCH INTEGRATION
// ===========================================

function initializeSmartwatch() {
    console.log('⌚ Initializing smartwatch features...');
    
    // Check if Web Bluetooth is supported
    if ('bluetooth' in navigator) {
        console.log('✅ Web Bluetooth is supported');
    } else {
        console.log('❌ Web Bluetooth not supported');
        document.getElementById('smartwatchBtn').disabled = true;
        document.getElementById('statusDesc').textContent = 'Web Bluetooth tidak didukung di browser ini';
    }
}

function toggleSmartwatch() {
    if (!smartwatchConnected) {
        connectSmartwatch();
    } else {
        disconnectSmartwatch();
    }
}

async function connectSmartwatch() {
    const btn = document.getElementById('smartwatchBtn');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusTitle = document.getElementById('statusTitle');
    const statusDesc = document.getElementById('statusDesc');
    const features = document.getElementById('smartwatchFeatures');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghubungkan...';
        btn.disabled = true;
        
        statusIndicator.className = 'status-indicator connecting';
        statusTitle.textContent = 'Menghubungkan...';
        statusDesc.textContent = 'Mencari perangkat smartwatch terdekat';
        
        // Simulate connection process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // For demo purposes, we'll simulate a successful connection
        smartwatchConnected = true;
        
        // Update UI
        btn.innerHTML = '<i class="fas fa-unlink"></i> Putuskan Koneksi';
        btn.disabled = false;
        btn.className = 'btn-danger';
        
        statusIndicator.className = 'status-indicator connected';
        statusTitle.textContent = 'Terhubung';
        statusDesc.textContent = 'Galaxy Watch 4 - Monitoring aktif';
        
        features.style.display = 'block';
        
        // Start simulated monitoring
        startHealthMonitoring();
        
        showToast('Smartwatch berhasil terhubung!', 'success');
        console.log('✅ Smartwatch connected successfully');
        
    } catch (error) {
        console.error('❌ Smartwatch connection failed:', error);
        showToast('Gagal menghubungkan smartwatch', 'error');
        
        // Reset UI
        btn.innerHTML = '<i class="fas fa-bluetooth"></i> Hubungkan Smartwatch';
        btn.disabled = false;
        
        statusIndicator.className = 'status-indicator disconnected';
        statusTitle.textContent = 'Koneksi Gagal';
        statusDesc.textContent = 'Pastikan smartwatch dalam mode pairing';
    }
}

function disconnectSmartwatch() {
    const btn = document.getElementById('smartwatchBtn');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusTitle = document.getElementById('statusTitle');
    const statusDesc = document.getElementById('statusDesc');
    const features = document.getElementById('smartwatchFeatures');
    
    smartwatchConnected = false;
    
    // Stop monitoring
    if (heartRateInterval) {
        clearInterval(heartRateInterval);
        heartRateInterval = null;
    }
    
    // Update UI
    btn.innerHTML = '<i class="fas fa-bluetooth"></i> Hubungkan Smartwatch';
    btn.className = 'btn-primary';
    
    statusIndicator.className = 'status-indicator disconnected';
    statusTitle.textContent = 'Tidak Terhubung';
    statusDesc.textContent = 'Hubungkan smartwatch untuk monitoring real-time';
    
    features.style.display = 'none';
    
    showToast('Smartwatch terputus', 'info');
    console.log('📱 Smartwatch disconnected');
}

function startHealthMonitoring() {
    console.log('💓 Starting health monitoring...');
    
    // Simulate real-time health data
    heartRateInterval = setInterval(() => {
        const heartRate = 70 + Math.floor(Math.random() * 20); // 70-90 bpm
        const stressLevel = 15 + Math.floor(Math.random() * 25); // 15-40%
        const activityLevel = 5000 + Math.floor(Math.random() * 3000); // 5000-8000 steps
        
        document.getElementById('heartRate').textContent = heartRate + ' bpm';
        document.getElementById('stressLevel').textContent = stressLevel + '%';
        document.getElementById('activityLevel').textContent = activityLevel + ' steps';
        
        // Check for high stress levels
        if (stressLevel > 35) {
            showToast('⚠️ Tingkat stress tinggi terdeteksi! Lakukan teknik relaksasi.', 'warning');
        }
        
    }, 3000); // Update every 3 seconds
}

function checkForSavedConnection() {
    const savedConnection = localStorage.getItem('puffoff_smartwatch_connected');
    if (savedConnection === 'true') {
        console.log('🔄 Restoring previous smartwatch connection...');
        setTimeout(() => {
            connectSmartwatch();
        }, 1000);
    }
}

// ===========================================
// ACHIEVEMENTS AND TIMELINE
// ===========================================

function loadAchievements() {
    console.log('🏆 Loading achievements...');
    
    const achievements = [
        {
            icon: '🏁',
            title: 'First Step',
            description: 'Memulai perjalanan bebas rokok',
            unlocked: true,
            date: '15 Jan 2024'
        },
        {
            icon: '📅',
            title: 'Week Warrior',
            description: '7 hari bebas rokok',
            unlocked: true,
            date: '22 Jan 2024'
        },
        {
            icon: '💰',
            title: 'Money Saver',
            description: 'Menghemat Rp 200.000',
            unlocked: true,
            date: '29 Jan 2024'
        },
        {
            icon: '🎯',
            title: 'Two Weeks Strong',
            description: '14 hari bebas rokok',
            unlocked: false,
            progress: 50
        },
        {
            icon: '👑',
            title: 'Month Master',
            description: '30 hari bebas rokok',
            unlocked: false,
            progress: 23
        },
        {
            icon: '💎',
            title: 'Health Hero',
            description: 'Health score mencapai 80%',
            unlocked: false,
            progress: 75
        }
    ];
    
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        achievementEl.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h3>${achievement.title}</h3>
                <p>${achievement.description}</p>
                ${achievement.unlocked ? 
                    `<div class="achievement-date">Tercapai: ${achievement.date}</div>` :
                    `<div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${achievement.progress}%"></div>
                        </div>
                        <span>${achievement.progress}%</span>
                    </div>`
                }
            </div>
            ${achievement.unlocked ? '<div class="achievement-badge">✓</div>' : ''}
        `;
        
        achievementsGrid.appendChild(achievementEl);
    });
}

function updateHealthMetrics() {
    console.log('❤️ Updating health metrics...');
    
    // Animate progress bars
    setTimeout(() => {
        document.querySelectorAll('.metric-item .progress-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 500);
}

function loadTimelineData() {
    console.log('📅 Loading timeline data...');
    
    const timelineData = [
        {
            date: '29 Jan 2024',
            title: 'Target 2 Minggu',
            description: 'Dalam 7 hari lagi Anda akan mencapai milestone 2 minggu!',
            type: 'upcoming',
            icon: '🎯'
        },
        {
            date: '22 Jan 2024',
            title: 'Minggu Pertama Selesai!',
            description: 'Selamat! Anda telah berhasil melewati minggu pertama tanpa rokok.',
            type: 'completed',
            icon: '🏆'
        },
        {
            date: '20 Jan 2024',
            title: 'Withdrawal Symptoms Menurun',
            description: 'Gejala putus nikotin mulai berkurang. Tetap semangat!',
            type: 'completed',
            icon: '💪'
        },
        {
            date: '18 Jan 2024',
            title: 'Smartwatch Terhubung',
            description: 'Monitoring kesehatan real-time dimulai.',
            type: 'completed',
            icon: '⌚'
        },
        {
            date: '15 Jan 2024',
            title: 'Memulai Perjalanan',
            description: 'Hari pertama bebas rokok. Langkah pertama menuju hidup sehat!',
            type: 'completed',
            icon: '🌟'
        }
    ];
    
    const timeline = document.getElementById('progressTimeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${item.type}`;
        
        timelineItem.innerHTML = `
            <div class="timeline-marker">
                <div class="timeline-icon">${item.icon}</div>
            </div>
            <div class="timeline-content">
                <div class="timeline-date">${item.date}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        timeline.appendChild(timelineItem);
        
        // Add animation delay
        setTimeout(() => {
            timelineItem.classList.add('animate');
        }, index * 200);
    });
}

// ===========================================
// EVENT LISTENERS AND UTILITIES
// ===========================================

function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Save smartwatch connection state
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('puffoff_smartwatch_connected', smartwatchConnected);
    });
    
    // Handle visibility change for smartwatch monitoring
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && smartwatchConnected) {
            console.log('📱 Page hidden, continuing background monitoring');
        } else if (!document.hidden && smartwatchConnected) {
            console.log('📱 Page visible, resuming active monitoring');
        }
    });
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
    
    console.log(`📢 Toast: ${message} (${type})`);
}

// ===========================================
// GLOBAL FUNCTIONS FOR ONCLICK HANDLERS
// ===========================================

// Make functions globally available for onclick handlers
window.switchChart = switchChart;
window.toggleSmartwatch = toggleSmartwatch;
window.forceChartReload = forceChartReload;// ===========================================
// PuffOff Progress Page - Complete JavaScript with Smartwatch Integration
// ===========================================

// Global variables
let progressChart = null;
let currentChartType = 'daily';
let smartwatchConnected = false;
let healthMonitoringInterval = null;
let emotionTrackingInterval = null;
let breathingExerciseInterval = null;
let breathingActive = false;
let cravingDetectionActive = false;

// Smartwatch simulation data
let smartwatchData = {
    device: null,
    battery: 85,
    lastSync: null,
    realTimeMetrics: {
        heartRate: 72,
        stressLevel: 23,
        oxygenLevel: 98,
        sleepQuality: 85,
        bodyTemp: 36.5,
        steps: 8342,
        calories: 1847
    },
    emotions: {
        calm: 65,
        stressed: 20,
        happy: 15,
        currentMood: 'calm',
        lastUpdate: new Date()
    },
    cravingPatterns: {
        riskLevel: 'low', // low, medium, high
        triggers: ['stress', 'coffee', 'social'],
        lastCraving: null,
        preventionScore: 85
    },
    healthInsights: [
        {
            type: 'positive',
            icon: '📈',
            title: 'Detak Jantung Istirahat',
            description: 'Turun 8 BPM sejak berhenti merokok',
            value: '-8 BPM',
            trend: 'improving'
        },
        {
            type: 'positive',
            icon: '🫁',
            title: 'Tingkat Oksigen',
            description: 'Meningkat signifikan dalam 7 hari',
            value: '+3%',
            trend: 'improving'
        },
        {
            type: 'warning',
            icon: '⚡',
            title: 'Level Stress',
            description: 'Tinggi pada jam kerja, butuh manajemen',
            value: 'Perlu Perhatian',
            trend: 'stable'
        }
    ]
};

// Progress data (existing)
const progressData = {
    smokeFreedays: 7,
    moneySaved: 210000,
    cigarettesAvoided: 84,
    healthScore: 78,
    dailyData: {
        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
        successDays: [1, 1, 1, 0, 1, 1, 1],
        savings: [30000, 30000, 30000, 0, 30000, 30000, 30000],
        healthScore: [65, 68, 70, 68, 72, 75, 78]
    },
    weeklyData: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        successDays: [5, 6, 7, 7],
        savings: [150000, 180000, 210000, 210000],
        healthScore: [55, 65, 72, 78]
    },
    monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        successDays: [20, 25, 28, 30, 30, 30],
        savings: [600000, 750000, 840000, 900000, 900000, 900000],
        healthScore: [45, 55, 65, 72, 78, 85]
    }
};

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PuffOff Progress - Initializing with Smartwatch Support...');
    initializeApp();
});

function initializeApp() {
    updateStats();
    initializeChart();
    loadAchievements();
    updateHealthMetrics();
    loadTimelineData();
    setupEventListeners();
    initializeSmartwatch();
    checkForSavedConnection();
    
    console.log('✅ App initialized successfully');
}



function setupEventListeners() {
    // Badge click events
    document.querySelectorAll('.badge-card').forEach(badge => {
        badge.addEventListener('click', function() {
            if (!this.classList.contains('locked')) {
                showBadgeDetails(this.dataset.achievement);
            }
        });
    });

    // Chart responsiveness
    window.addEventListener('resize', function() {
        if (progressChart) {
            progressChart.resize();
        }
    });

    // Modal backdrop clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Health metric click events
    document.querySelectorAll('.health-metric').forEach(metric => {
        metric.addEventListener('click', function() {
            showMetricDetails(this.dataset.metric);
        });
    });

    // Emotion item click events
    document.querySelectorAll('.emotion-item').forEach(item => {
        item.addEventListener('click', function() {
            showEmotionHistory(this.dataset.emotion);
        });
    });

    console.log('🎧 Event listeners setup complete');
}

// ===========================================
// SMARTWATCH INTEGRATION
// ===========================================

function initializeSmartwatch() {
    // Check for Web Bluetooth support
    if ('bluetooth' in navigator) {
        console.log('🔵 Bluetooth API supported');
    } else {
        console.log('❌ Bluetooth API not supported');
        showToast('Bluetooth tidak didukung di perangkat ini', 'warning');
    }

    // Initialize smartwatch UI
    updateSmartWatchStatus('disconnected');
}

function checkForSavedConnection() {
    const savedDevice = localStorage.getItem('puffoff_smartwatch_device');
    if (savedDevice) {
        try {
            const deviceInfo = JSON.parse(savedDevice);
            smartwatchData.device = deviceInfo;
            
            // Simulate reconnection
            setTimeout(() => {
                if (Math.random() > 0.3) { // 70% chance to reconnect
                    connectToSavedDevice(deviceInfo);
                } else {
                    showToast('Gagal terhubung ke perangkat tersimpan', 'warning');
                }
            }, 2000);
        } catch (error) {
            console.error('Error parsing saved device:', error);
        }
    }
}

async function connectSmartwatch() {
    const connectBtn = document.getElementById('connectBtn');
    const btnText = connectBtn.querySelector('span');
    const btnIcon = connectBtn.querySelector('i');
    
    try {
        // Update button state
        connectBtn.disabled = true;
        btnIcon.className = 'fas fa-spinner fa-spin';
        btnText.textContent = 'Menghubungkan...';
        updateSmartWatchStatus('connecting');
        
        showLoading('Mencari perangkat smartwatch...');

        // Simulate device discovery and connection
        await simulateDeviceConnection();
        
        hideLoading();
        
        // Update UI for successful connection
        connectBtn.style.display = 'none';
        document.getElementById('smartwatchCard').style.display = 'none';
        document.getElementById('realtimeHealth').style.display = 'block';
        
        updateSmartWatchStatus('connected');
        smartwatchConnected = true;
        
        // Start health monitoring
        startHealthMonitoring();
        startEmotionTracking();
        startCravingDetection();
        
        showToast('Smartwatch berhasil terhubung! 📱⌚', 'success');
        
        // Add to timeline
        addTimelineEvent('Smartwatch Terhubung', 'Monitoring kesehatan real-time dimulai', new Date());
        
        console.log('✅ Smartwatch connected successfully');
        
    } catch (error) {
        console.error('❌ Smartwatch connection failed:', error);
        
        hideLoading();
        connectBtn.disabled = false;
        btnIcon.className = 'fas fa-bluetooth';
        btnText.textContent = 'Hubungkan Perangkat';
        updateSmartWatchStatus('disconnected');
        
        showToast('Gagal menghubungkan smartwatch: ' + error.message, 'error');
    }
}

async function simulateDeviceConnection() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate various device types
            const deviceTypes = [
                { name: 'Apple Watch Series 9', type: 'apple', battery: 85 },
                { name: 'Samsung Galaxy Watch 6', type: 'samsung', battery: 78 },
                { name: 'Fitbit Sense 2', type: 'fitbit', battery: 92 },
                { name: 'Garmin Forerunner 255', type: 'garmin', battery: 67 }
            ];
            
            const selectedDevice = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
            
            // 90% success rate
            if (Math.random() > 0.1) {
                smartwatchData.device = {
                    ...selectedDevice,
                    id: 'device_' + Date.now(),
                    connectedAt: new Date().toISOString()
                };
                
                // Save device info
                localStorage.setItem('puffoff_smartwatch_device', JSON.stringify(smartwatchData.device));
                
                resolve(selectedDevice);
            } else {
                reject(new Error('Perangkat tidak ditemukan atau gagal terhubung'));
            }
        }, 3000 + Math.random() * 2000); // 3-5 seconds
    });
}

function connectToSavedDevice(deviceInfo) {
    showLoading('Menghubungkan ke ' + deviceInfo.name + '...');
    
    setTimeout(() => {
        hideLoading();
        
        document.getElementById('smartwatchCard').style.display = 'none';
        document.getElementById('realtimeHealth').style.display = 'block';
        
        updateSmartWatchStatus('connected');
        smartwatchConnected = true;
        
        startHealthMonitoring();
        startEmotionTracking();
        startCravingDetection();
        
        showToast(`Terhubung kembali ke ${deviceInfo.name}`, 'success');
        
        console.log('✅ Reconnected to saved device:', deviceInfo.name);
    }, 2000);
}

function updateSmartWatchStatus(status) {
    const statusElement = document.getElementById('smartwatchStatus');
    const statusDot = statusElement.querySelector('.status-dot');
    const statusText = statusElement.querySelector('.status-text');
    
    // Remove all status classes
    statusDot.className = 'status-dot';
    
    switch(status) {
        case 'connected':
            statusDot.classList.add('connected');
            statusText.textContent = smartwatchData.device ? 
                `Terhubung - ${smartwatchData.device.name}` : 'Terhubung';
            break;
        case 'connecting':
            statusDot.classList.add('connecting');
            statusText.textContent = 'Menghubungkan...';
            break;
        case 'disconnected':
        default:
            statusDot.classList.add('disconnected');
            statusText.textContent = 'Tidak Terhubung';
            break;
    }
}

// ===========================================
// HEALTH MONITORING
// ===========================================

function startHealthMonitoring() {
    if (healthMonitoringInterval) {
        clearInterval(healthMonitoringInterval);
    }
    
    // Update health metrics every 5 seconds
    healthMonitoringInterval = setInterval(() => {
        updateHealthMetricsRealtime();
    }, 5000);
    
    // Initial update
    updateHealthMetricsRealtime();
    
    console.log('❤️ Health monitoring started');
}

function updateHealthMetricsRealtime() {
    if (!smartwatchConnected) return;
    
    // Simulate realistic health data variations
    simulateHealthDataChanges();
    
    // Update heart rate
    const heartRateEl = document.getElementById('heartRate');
    const heartRateStatusEl = document.getElementById('heartRateStatus');
    const heartTrendEl = document.getElementById('heartTrend');
    
    if (heartRateEl) {
        heartRateEl.textContent = smartwatchData.realTimeMetrics.heartRate;
        
        // Update status based on heart rate
        const hr = smartwatchData.realTimeMetrics.heartRate;
        if (hr < 60) {
            heartRateStatusEl.textContent = 'Rendah';
            heartRateStatusEl.className = 'metric-status warning';
        } else if (hr > 100) {
            heartRateStatusEl.textContent = 'Tinggi';
            heartRateStatusEl.className = 'metric-status warning';
        } else {
            heartRateStatusEl.textContent = 'Normal';
            heartRateStatusEl.className = 'metric-status normal';
        }
        
        // Update trend
        const trend = Math.random() > 0.5 ? 'down' : 'up';
        const trendValue = Math.floor(Math.random() * 5) + 1;
        heartTrendEl.innerHTML = `
            <i class="fas fa-arrow-${trend}"></i>
            <span>${trend === 'down' ? '-' : '+'}${trendValue} dari kemarin</span>
        `;
    }
    
    // Update stress level
    const stressEl = document.getElementById('stressLevel');
    const stressStatusEl = document.getElementById('stressStatus');
    const stressTrendEl = document.getElementById('stressTrend');
    
    if (stressEl) {
        stressEl.textContent = smartwatchData.realTimeMetrics.stressLevel;
        
        const stress = smartwatchData.realTimeMetrics.stressLevel;
        if (stress < 30) {
            stressStatusEl.textContent = 'Rendah';
            stressStatusEl.className = 'metric-status good';
        } else if (stress > 70) {
            stressStatusEl.textContent = 'Tinggi';
            stressStatusEl.className = 'metric-status warning';
        } else {
            stressStatusEl.textContent = 'Sedang';
            stressStatusEl.className = 'metric-status normal';
        }
        
        stressTrendEl.innerHTML = `
            <i class="fas fa-arrow-down"></i>
            <span>Membaik</span>
        `;
    }
    
    // Update oxygen level
    const oxygenEl = document.getElementById('oxygenLevel');
    const oxygenStatusEl = document.getElementById('oxygenStatus');
    const oxygenTrendEl = document.getElementById('oxygenTrend');
    
    if (oxygenEl) {
        oxygenEl.textContent = smartwatchData.realTimeMetrics.oxygenLevel;
        
        const oxygen = smartwatchData.realTimeMetrics.oxygenLevel;
        if (oxygen >= 95) {
            oxygenStatusEl.textContent = 'Excellent';
            oxygenStatusEl.className = 'metric-status excellent';
        } else if (oxygen >= 90) {
            oxygenStatusEl.textContent = 'Normal';
            oxygenStatusEl.className = 'metric-status normal';
        } else {
            oxygenStatusEl.textContent = 'Rendah';
            oxygenStatusEl.className = 'metric-status warning';
        }
        
        oxygenTrendEl.innerHTML = `
            <i class="fas fa-arrow-up"></i>
            <span>+2% minggu ini</span>
        `;
    }
    
    // Update sleep quality
    const sleepEl = document.getElementById('sleepQuality');
    const sleepStatusEl = document.getElementById('sleepStatus');
    const sleepTrendEl = document.getElementById('sleepTrend');
    
    if (sleepEl) {
        sleepEl.textContent = smartwatchData.realTimeMetrics.sleepQuality;
        
        const sleep = smartwatchData.realTimeMetrics.sleepQuality;
        if (sleep >= 80) {
            sleepStatusEl.textContent = 'Baik';
            sleepStatusEl.className = 'metric-status good';
        } else if (sleep >= 60) {
            sleepStatusEl.textContent = 'Cukup';
            sleepStatusEl.className = 'metric-status normal';
        } else {
            sleepStatusEl.textContent = 'Kurang';
            sleepStatusEl.className = 'metric-status warning';
        }
        
        const hours = Math.floor(Math.random() * 2) + 7; // 7-8 hours
        const minutes = Math.floor(Math.random() * 60);
        sleepTrendEl.innerHTML = `
            <i class="fas fa-arrow-up"></i>
            <span>${hours}h ${minutes}m tadi malam</span>
        `;
    }
}

function simulateHealthDataChanges() {
    const metrics = smartwatchData.realTimeMetrics;
    
    // Heart rate: 60-100 normal, with small variations
    metrics.heartRate += Math.floor(Math.random() * 6) - 3; // ±3
    metrics.heartRate = Math.max(50, Math.min(120, metrics.heartRate));
    
    // Stress level: 0-100, tends to decrease over time (quit smoking effect)
    metrics.stressLevel += Math.floor(Math.random() * 4) - 2; // ±2
    metrics.stressLevel = Math.max(0, Math.min(100, metrics.stressLevel));
    
    // Oxygen level: tends to improve (quit smoking effect)
    if (Math.random() > 0.7) { // 30% chance to improve
        metrics.oxygenLevel = Math.min(100, metrics.oxygenLevel + 1);
    }
    metrics.oxygenLevel = Math.max(85, Math.min(100, metrics.oxygenLevel));
    
    // Sleep quality: small random variations
    metrics.sleepQuality += Math.floor(Math.random() * 4) - 2; // ±2
    metrics.sleepQuality = Math.max(30, Math.min(100, metrics.sleepQuality));
    
    // Body temperature: normal variations
    metrics.bodyTemp += (Math.random() - 0.5) * 0.2; // ±0.1°C
    metrics.bodyTemp = Math.max(35.5, Math.min(37.5, metrics.bodyTemp));
}

// ===========================================
// EMOTION TRACKING
// ===========================================

function startEmotionTracking() {
    if (emotionTrackingInterval) {
        clearInterval(emotionTrackingInterval);
    }
    
    // Update emotions every 30 seconds
    emotionTrackingInterval = setInterval(() => {
        updateEmotionTracking();
    }, 30000);
    
    // Initial update
    updateEmotionTracking();
    
    console.log('😊 Emotion tracking started');
}

function updateEmotionTracking() {
    if (!smartwatchConnected) return;
    
    // Simulate emotion changes based on stress level and heart rate
    const stressLevel = smartwatchData.realTimeMetrics.stressLevel;
    const heartRate = smartwatchData.realTimeMetrics.heartRate;
    
    // Calculate emotion percentages
    let emotions = smartwatchData.emotions;
    
    if (stressLevel > 60) {
        emotions.stressed = Math.min(80, emotions.stressed + 5);
        emotions.calm = Math.max(10, emotions.calm - 3);
    } else if (stressLevel < 30) {
        emotions.calm = Math.min(80, emotions.calm + 3);
        emotions.stressed = Math.max(5, emotions.stressed - 5);
    }
    
    if (heartRate > 90) {
        emotions.stressed = Math.min(70, emotions.stressed + 2);
    }
    
    // Normalize percentages
    const total = emotions.calm + emotions.stressed + emotions.happy;
    emotions.calm = Math.round((emotions.calm / total) * 100);
    emotions.stressed = Math.round((emotions.stressed / total) * 100);
    emotions.happy = 100 - emotions.calm - emotions.stressed;
    
    // Determine current mood
    if (emotions.calm > 50) {
        emotions.currentMood = 'calm';
    } else if (emotions.stressed > 40) {
        emotions.currentMood = 'stressed';
    } else {
        emotions.currentMood = 'happy';
    }
    
    emotions.lastUpdate = new Date();
    
    // Update UI
    updateEmotionUI();
}

function updateEmotionUI() {
    const emotions = smartwatchData.emotions;
    
    // Update emotion percentages
    document.querySelectorAll('.emotion-item').forEach(item => {
        const emotion = item.dataset.emotion;
        const percentageEl = item.querySelector('.emotion-percentage');
        
        if (percentageEl && emotions[emotion] !== undefined) {
            percentageEl.textContent = emotions[emotion] + '%';
            
            // Update active state
            item.classList.remove('active', 'moderate', 'good');
            
            if (emotions[emotion] > 50) {
                item.classList.add('active');
            } else if (emotions[emotion] > 25) {
                item.classList.add('moderate');
            } else {
                item.classList.add('good');
            }
        }
    });
    
    // Update current mood
    const moodCircle = document.querySelector('.mood-circle');
    const moodText = document.querySelector('.mood-text');
    
    if (moodCircle && moodText) {
        const moodEmojis = {
            calm: '😌',
            stressed: '😰',
            happy: '😊'
        };
        
        const moodTexts = {
            calm: 'Tenang & Fokus',
            stressed: 'Sedikit Tegang',
            happy: 'Bahagia & Energik'
        };
        
        moodCircle.textContent = moodEmojis[emotions.currentMood] || '😐';
        moodText.textContent = moodTexts[emotions.currentMood] || 'Normal';
    }
}

// ===========================================
// CRAVING DETECTION
// ===========================================

function startCravingDetection() {
    cravingDetectionActive = true;
    
    // Check for craving patterns every 15 seconds
    setInterval(() => {
        if (cravingDetectionActive) {
            analyzeCravingRisk();
        }
    }, 15000);
    
    console.log('🚨 Craving detection started');
}

function analyzeCravingRisk() {
    if (!smartwatchConnected) return;
    
    const metrics = smartwatchData.realTimeMetrics;
    const emotions = smartwatchData.emotions;
    
    let riskFactors = [];
    let riskScore = 0;
    
    // Analyze risk factors
    if (metrics.heartRate > 85) {
        riskFactors.push('elevated_hr');
        riskScore += 25;
    }
    
    if (metrics.stressLevel > 60) {
        riskFactors.push('high_stress');
        riskScore += 35;
    }
    
    if (emotions.stressed > 40) {
        riskFactors.push('negative_emotion');
        riskScore += 20;
    }
    
    // Time-based factors (common craving times)
    const hour = new Date().getHours();
    if ((hour >= 14 && hour <= 16) || (hour >= 20 && hour <= 22)) {
        riskFactors.push('high_risk_time');
        riskScore += 15;
    }
    
    // Update risk level
    let riskLevel = 'low';
    if (riskScore >= 60) {
        riskLevel = 'high';
    } else if (riskScore >= 30) {
        riskLevel = 'medium';
    }
    
    smartwatchData.cravingPatterns.riskLevel = riskLevel;
    smartwatchData.cravingPatterns.lastCheck = new Date();
    
    // Update UI
    updateCravingDetectionUI(riskLevel, riskScore, riskFactors);
    
    // Trigger alert if high risk
    if (riskLevel === 'high' && riskScore >= 70) {
        triggerCravingAlert(riskFactors);
    }
}

function updateCravingDetectionUI(riskLevel, riskScore, riskFactors) {
    const statusEl = document.getElementById('cravingStatus');
    const alertEl = document.getElementById('cravingAlert');
    
    if (statusEl) {
        statusEl.className = `detection-status ${riskLevel === 'low' ? 'safe' : riskLevel === 'medium' ? 'warning' : 'danger'}`;
        
        const statusText = {
            low: 'Aman',
            medium: 'Waspada',
            high: 'Berisiko Tinggi'
        };
        
        statusEl.querySelector('span:last-child').textContent = statusText[riskLevel];
    }
    
    // Show/hide alert
    if (alertEl) {
        if (riskLevel === 'high') {
            alertEl.classList.remove('hidden');
            
            // Update alert text based on risk factors
            const alertText = generateAlertMessage(riskFactors);
            alertEl.querySelector('.alert-text p').textContent = alertText;
        } else {
            alertEl.classList.add('hidden');
        }
    }
}

function generateAlertMessage(riskFactors) {
    let message = 'Berdasarkan data smartwatch, ';
    
    const messages = [];
    
    if (riskFactors.includes('elevated_hr')) {
        messages.push('detak jantung meningkat');
    }
    
    if (riskFactors.includes('high_stress')) {
        messages.push('level stress tinggi');
    }
    
    if (riskFactors.includes('negative_emotion')) {
        messages.push('emosi negatif terdeteksi');
    }
    
    if (riskFactors.includes('high_risk_time')) {
        messages.push('waktu rentan keinginan merokok');
    }
    
    if (messages.length > 0) {
        message += messages.join(', ') + ' terdeteksi. ';
    }
    
    message += 'Ini mungkin menandakan keinginan untuk merokok. Gunakan teknik yang tersedia untuk mengatasinya.';
    
    return message;
}

function triggerCravingAlert(riskFactors) {
    // Log craving event
    console.log('🚨 Craving alert triggered:', riskFactors);
    
    // Show notification
    showToast('⚠️ Potensi keinginan merokok terdeteksi! Coba teknik pernapasan.', 'warning');
    
    // Add to timeline
    addTimelineEvent(
        'Deteksi Keinginan Merokok',
        'Smartwatch mendeteksi pola yang menandakan keinginan merokok',
        new Date()
    );
    
    // Vibrate device if supported
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
    
    // Update prevention score
    smartwatchData.cravingPatterns.preventionScore = Math.max(0, 
        smartwatchData.cravingPatterns.preventionScore - 5);
}

// ===========================================
// BREATHING EXERCISE
// ===========================================

function startBreathingExercise() {
    const modal = document.getElementById('breathingModal');
    if (modal) {
        modal.classList.add('show');
    }
    
    console.log('🫁 Breathing exercise modal opened');
}

function closeBreathingModal() {
    const modal = document.getElementById('breathingModal');
    if (modal) {
        modal.classList.remove('show');
    }
    
    if (breathingActive) {
        stopBreathing();
    }
}

function startBreathing() {
    if (breathingActive) return;
    
    breathingActive = true;
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const startBtn = document.getElementById('startBreathingBtn');
    const stopBtn = document.getElementById('stopBreathingBtn');
    const progressBar = document.getElementById('breathingProgress');
    
    // Update buttons
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-flex';
    
    let cycle = 0;
    const totalCycles = 10;
    let phase = 'prepare'; // prepare, inhale, hold, exhale
    
    // Reset progress
    progressBar.style.width = '0%';
    
    function breathingCycle() {
        if (!breathingActive) return;
        
        switch(phase) {
            case 'prepare':
                text.textContent = 'Bersiap...';
                circle.className = 'breathing-circle';
                setTimeout(() => {
                    phase = 'inhale';
                    breathingCycle();
                }, 1000);
                break;
                
            case 'inhale':
                text.textContent = 'Tarik Napas (4 detik)';
                circle.className = 'breathing-circle inhale';
                setTimeout(() => {
                    phase = 'hold';
                    breathingCycle();
                }, 4000);
                break;
                
            case 'hold':
                text.textContent = 'Tahan (7 detik)';
                circle.className = 'breathing-circle inhale';
                setTimeout(() => {
                    phase = 'exhale';
                    breathingCycle();
                }, 7000);
                break;
                
            case 'exhale':
                text.textContent = 'Hembuskan (8 detik)';
                circle.className = 'breathing-circle exhale';
                setTimeout(() => {
                    cycle++;
                    const progress = (cycle / totalCycles) * 100;
                    progressBar.style.width = progress + '%';
                    
                    if (cycle >= totalCycles) {
                        completedBreathing();
                    } else {
                        phase = 'inhale';
                        breathingCycle();
