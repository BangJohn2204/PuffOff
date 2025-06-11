// ===========================================
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
