// ===========================================
// PuffOff Progress Page - Complete JavaScript with Smartwatch Integration & Chart Fix
// ===========================================

// Global Variables
let progressChart = null;
let currentChartType = 'daily';
let smartwatchConnected = false;
let heartRateInterval = null;
let healthMonitoringInterval = null;
let emotionTrackingInterval = null;
let breathingExerciseInterval = null;
let breathingActive = false;
let cravingDetectionActive = false;

// Sample data for charts
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
        riskLevel: 'low',
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
    
    // Add inline CSS fallback for timeline to ensure it's visible
    const timelineCSS = `
        <style id="timeline-fallback-css">
        /* Force timeline to be visible */
        .progress-timeline {
            position: relative !important;
            padding-left: 30px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            min-height: 50px !important;
        }
        
        .timeline-item {
            position: relative !important;
            padding-bottom: 24px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .timeline-item::before {
            content: '' !important;
            position: absolute !important;
            left: -30px !important;
            top: 0 !important;
            width: 2px !important;
            height: 100% !important;
            background: #e5e7eb !important;
        }
        
        .timeline-item:last-child::before {
            display: none !important;
        }
        
        .timeline-dot {
            position: absolute !important;
            left: -38px !important;
            top: 4px !important;
            width: 16px !important;
            height: 16px !important;
            border-radius: 50% !important;
            background: #667eea !important;
            border: 3px solid white !important;
            box-shadow: 0 0 0 2px #667eea !important;
            z-index: 2 !important;
        }
        
        .timeline-content {
            background: #f8fafc !important;
            padding: 16px !important;
            border-radius: 12px !important;
            border-left: 4px solid #667eea !important;
            display: block !important;
            visibility: visible !important;
        }
        
        .timeline-title {
            font-weight: 600 !important;
            color: #1f2937 !important;
            margin-bottom: 4px !important;
            display: block !important;
        }
        
        .timeline-desc {
            color: #6b7280 !important;
            font-size: 0.9rem !important;
            margin-bottom: 8px !important;
            display: block !important;
        }
        
        .timeline-time {
            color: #9ca3af !important;
            font-size: 0.8rem !important;
            display: block !important;
        }
        
        /* Force section to be visible */
        .section {
            display: block !important;
            visibility: visible !important;
        }
        
        .section-title {
            display: flex !important;
            visibility: visible !important;
        }
        </style>
    `;
    
    // Inject CSS if not already present
    if (!document.getElementById('timeline-fallback-css')) {
        document.head.insertAdjacentHTML('beforeend', timelineCSS);
        console.log('✅ Timeline fallback CSS injected');
    }
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        updateStats();
        loadAchievements();
        updateHealthMetrics();
        
        // Load timeline with extra delay and debug
        setTimeout(() => {
            console.log('🔍 Starting timeline loading process...');
            
            // Debug: Check if timeline section exists
            const timelineSection = Array.from(document.querySelectorAll('.section')).find(section => {
                const title = section.querySelector('.section-title');
                return title && title.textContent.includes('Aktivitas Terkini');
            });
            
            if (timelineSection) {
                console.log('✅ Found Aktivitas Terkini section');
                timelineSection.style.display = 'block';
                timelineSection.style.visibility = 'visible';
                
                const timeline = timelineSection.querySelector('.progress-timeline');
                if (timeline) {
                    console.log('✅ Found timeline container in section');
                    timeline.style.display = 'block';
                    timeline.style.visibility = 'visible';
                } else {
                    console.error('❌ No .progress-timeline found in Aktivitas Terkini section');
                }
            } else {
                console.error('❌ Aktivitas Terkini section not found');
                console.log('Available sections:');
                document.querySelectorAll('.section').forEach((section, index) => {
                    const title = section.querySelector('.section-title');
                    console.log(`Section ${index + 1}:`, title ? title.textContent.trim() : 'No title');
                });
            }
            
            loadTimelineData();
        }, 300);
        
        setupEventListeners();
        initializeSmartwatch();
        checkForSavedConnection();
        
        // Initialize chart with multiple fallbacks
        setTimeout(() => {
            console.log('🔄 Attempting to initialize chart...');
            initializeChartWithFallback();
        }, 500);
        
        console.log('✅ App initialized successfully');
    }, 200);
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
                                    label += 'Rp ' + (context.parsed.y * 1000).toLocaleString('id-ID');
                                } else if (context.datasetIndex === 2) {
                                    label += context.parsed.y + '%';
                                } else {
                                    label += context.parsed.y + ' hari';
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
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        max: Math.max(...chartData.datasets[0].data) + 2,
                        grid: {
                            color: 'rgba(16, 185, 129, 0.1)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#10b981'
                        },
                        title: {
                            display: true,
                            text: 'Hari Sukses',
                            color: '#10b981',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false,
                            color: 'rgba(245, 158, 11, 0.1)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#f59e0b',
                            callback: function(value) {
                                return 'Rp' + value + 'K';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Penghematan (Ribuan)',
                            color: '#f59e0b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: false, // Hide this axis to avoid clutter, but keep for scaling
                        position: 'right',
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 3
                    },
                    point: {
                        radius: 5,
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
                fill: false,
                yAxisID: 'y',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            },
            {
                label: 'Penghematan (Ribuan)',
                data: data.savings.map(val => val / 1000), // Convert to thousands for better scale
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: false,
                yAxisID: 'y1',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                borderDash: [5, 5] // Dashed line to differentiate
            },
            {
                label: 'Health Score (%)',
                data: data.healthScore,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: false,
                yAxisID: 'y2',
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                borderDash: [10, 5] // Different dash pattern
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
    
    if (chartContainer) {
        chartContainer.innerHTML = `
            <div id="chartError" style="background: #f8fafc; border-radius: 12px; padding: 40px 20px; text-align: center; color: #6b7280; border: 2px dashed #e5e7eb;">
                <div style="font-size: 3rem; margin-bottom: 16px;">📊</div>
                <h3 style="color: #374151; margin: 16px 0 8px 0; font-size: 1.1rem;">Chart Error</h3>
                <p style="margin-bottom: 16px; font-size: 0.9rem;">${message}</p>
                <button onclick="forceChartReload()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-redo"></i> Coba Lagi
                </button>
            </div>
        `;
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
    
    // Update stats from data
    const smokeFreeEl = document.getElementById('smokeFreedays');
    const moneySavedEl = document.getElementById('moneySaved');
    const cigarettesAvoidedEl = document.getElementById('cigarettesAvoided');
    const healthScoreEl = document.getElementById('healthScore');
    
    if (smokeFreeEl) {
        smokeFreeEl.textContent = progressData.smokeFreedays;
        console.log('✅ Updated smokeFreedays:', progressData.smokeFreedays);
    } else {
        console.error('❌ Element smokeFreedays not found');
    }
    
    if (moneySavedEl) {
        moneySavedEl.textContent = formatCurrency(progressData.moneySaved);
        console.log('✅ Updated moneySaved:', formatCurrency(progressData.moneySaved));
    } else {
        console.error('❌ Element moneySaved not found');
    }
    
    if (cigarettesAvoidedEl) {
        cigarettesAvoidedEl.textContent = progressData.cigarettesAvoided;
        console.log('✅ Updated cigarettesAvoided:', progressData.cigarettesAvoided);
    } else {
        console.error('❌ Element cigarettesAvoided not found');
    }
    
    if (healthScoreEl) {
        healthScoreEl.textContent = progressData.healthScore + '%';
        console.log('✅ Updated healthScore:', progressData.healthScore + '%');
    } else {
        console.error('❌ Element healthScore not found');
        // Try alternative IDs that might exist in HTML
        const alternativeHealthScore = document.querySelector('[id*="health"], [class*="health-score"]');
        if (alternativeHealthScore) {
            alternativeHealthScore.textContent = progressData.healthScore + '%';
            console.log('✅ Updated healthScore via alternative selector');
        }
    }
    
    // Also update any stat-value elements by their position
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = progressData.smokeFreedays;
        statValues[1].textContent = formatCurrency(progressData.moneySaved);
        statValues[2].textContent = progressData.cigarettesAvoided;
        statValues[3].textContent = progressData.healthScore + '%';
        console.log('✅ Updated all stats via stat-value class');
    }
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
    if (amount >= 1000000) {
        return 'Rp ' + Math.floor(amount / 1000000) + '.' + Math.floor((amount % 1000000) / 100000) + 'M';
    } else if (amount >= 1000) {
        return 'Rp ' + Math.floor(amount / 1000) + 'K';
    } else {
        return 'Rp ' + amount;
    }
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
        const connectBtn = document.getElementById('connectBtn');
        if (connectBtn) {
            connectBtn.disabled = true;
        }
    }
}

function connectSmartwatch() {
    const connectBtn = document.getElementById('connectBtn');
    const smartwatchCard = document.getElementById('smartwatchCard');
    const realtimeHealth = document.getElementById('realtimeHealth');
    const statusElement = document.getElementById('smartwatchStatus');
    
    if (!connectBtn) return;
    
    try {
        // Show loading
        showLoading('Menghubungkan ke smartwatch...');
        
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghubungkan...';
        connectBtn.disabled = true;
        
        // Update status
        updateSmartWatchStatus('connecting');
        
        // Simulate connection process
        setTimeout(() => {
            hideLoading();
            
            // Update UI for successful connection
            if (smartwatchCard) smartwatchCard.style.display = 'none';
            if (realtimeHealth) realtimeHealth.style.display = 'block';
            
            updateSmartWatchStatus('connected');
            smartwatchConnected = true;
            
            // Start health monitoring
            startHealthMonitoring();
            startEmotionTracking();
            startCravingDetection();
            
            showToast('Smartwatch berhasil terhubung! 📱⌚', 'success');
            
            console.log('✅ Smartwatch connected successfully');
            
        }, 3000);
        
    } catch (error) {
        console.error('❌ Smartwatch connection failed:', error);
        hideLoading();
        
        connectBtn.innerHTML = '<i class="fas fa-bluetooth"></i> Hubungkan Perangkat';
        connectBtn.disabled = false;
        updateSmartWatchStatus('disconnected');
        
        showToast('Gagal menghubungkan smartwatch', 'error');
    }
}

function updateSmartWatchStatus(status) {
    const statusElement = document.getElementById('smartwatchStatus');
    if (!statusElement) return;
    
    const statusDot = statusElement.querySelector('.status-dot');
    const statusText = statusElement.querySelector('.status-text');
    
    if (!statusDot || !statusText) return;
    
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

function checkForSavedConnection() {
    // Simulate checking for saved connection
    console.log('🔍 Checking for saved smartwatch connection...');
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
        
        if (heartRateStatusEl) {
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
        }
        
        if (heartTrendEl) {
            const trend = Math.random() > 0.5 ? 'down' : 'up';
            const trendValue = Math.floor(Math.random() * 5) + 1;
            heartTrendEl.innerHTML = `
                <i class="fas fa-arrow-${trend}"></i>
                <span>${trend === 'down' ? '-' : '+'}${trendValue} dari kemarin</span>
            `;
        }
    }
    
    // Update stress level
    const stressEl = document.getElementById('stressLevel');
    const stressStatusEl = document.getElementById('stressStatus');
    const stressTrendEl = document.getElementById('stressTrend');
    
    if (stressEl) {
        stressEl.textContent = smartwatchData.realTimeMetrics.stressLevel;
        
        if (stressStatusEl) {
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
        }
        
        if (stressTrendEl) {
            stressTrendEl.innerHTML = `
                <i class="fas fa-arrow-down"></i>
                <span>Membaik</span>
            `;
        }
    }
    
    // Update oxygen level
    const oxygenEl = document.getElementById('oxygenLevel');
    const oxygenStatusEl = document.getElementById('oxygenStatus');
    const oxygenTrendEl = document.getElementById('oxygenTrend');
    
    if (oxygenEl) {
        oxygenEl.textContent = smartwatchData.realTimeMetrics.oxygenLevel;
        
        if (oxygenStatusEl) {
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
        }
        
        if (oxygenTrendEl) {
            oxygenTrendEl.innerHTML = `
                <i class="fas fa-arrow-up"></i>
                <span>+2% minggu ini</span>
            `;
        }
    }
    
    // Update sleep quality
    const sleepEl = document.getElementById('sleepQuality');
    const sleepStatusEl = document.getElementById('sleepStatus');
    const sleepTrendEl = document.getElementById('sleepTrend');
    
    if (sleepEl) {
        sleepEl.textContent = smartwatchData.realTimeMetrics.sleepQuality;
        
        if (sleepStatusEl) {
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
        }
        
        if (sleepTrendEl) {
            const hours = Math.floor(Math.random() * 2) + 7;
            const minutes = Math.floor(Math.random() * 60);
            sleepTrendEl.innerHTML = `
                <i class="fas fa-arrow-up"></i>
                <span>${hours}h ${minutes}m tadi malam</span>
            `;
        }
    }
}

function simulateHealthDataChanges() {
    const metrics = smartwatchData.realTimeMetrics;
    
    // Heart rate: 60-100 normal, with small variations
    metrics.heartRate += Math.floor(Math.random() * 6) - 3;
    metrics.heartRate = Math.max(50, Math.min(120, metrics.heartRate));
    
    // Stress level: 0-100, tends to decrease over time
    metrics.stressLevel += Math.floor(Math.random() * 4) - 2;
    metrics.stressLevel = Math.max(0, Math.min(100, metrics.stressLevel));
    
    // Oxygen level: tends to improve
    if (Math.random() > 0.7) {
        metrics.oxygenLevel = Math.min(100, metrics.oxygenLevel + 1);
    }
    metrics.oxygenLevel = Math.max(85, Math.min(100, metrics.oxygenLevel));
    
    // Sleep quality: small random variations
    metrics.sleepQuality += Math.floor(Math.random() * 4) - 2;
    metrics.sleepQuality = Math.max(30, Math.min(100, metrics.sleepQuality));
}

// ===========================================
// EMOTION TRACKING
// ===========================================

function startEmotionTracking() {
    if (emotionTrackingInterval) {
        clearInterval(emotionTrackingInterval);
    }
    
    emotionTrackingInterval = setInterval(() => {
        updateEmotionTracking();
    }, 30000);
    
    updateEmotionTracking();
    console.log('😊 Emotion tracking started');
}

function updateEmotionTracking() {
    if (!smartwatchConnected) return;
    
    const stressLevel = smartwatchData.realTimeMetrics.stressLevel;
    let emotions = smartwatchData.emotions;
    
    if (stressLevel > 60) {
        emotions.stressed = Math.min(80, emotions.stressed + 5);
        emotions.calm = Math.max(10, emotions.calm - 3);
    } else if (stressLevel < 30) {
        emotions.calm = Math.min(80, emotions.calm + 3);
        emotions.stressed = Math.max(5, emotions.stressed - 5);
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
    
    // Time-based factors
    const hour = new Date().getHours();
    if ((hour >= 14 && hour <= 16) || (hour >= 20 && hour <= 22)) {
        riskFactors.push('high_risk_time');
        riskScore += 15;
    }
    
    let riskLevel = 'low';
    if (riskScore >= 60) {
        riskLevel = 'high';
    } else if (riskScore >= 30) {
        riskLevel = 'medium';
    }
    
    smartwatchData.cravingPatterns.riskLevel = riskLevel;
    updateCravingDetectionUI(riskLevel, riskScore, riskFactors);
    
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
        
        const statusTextEl = statusEl.querySelector('span:last-child');
        if (statusTextEl) {
            statusTextEl.textContent = statusText[riskLevel];
        }
    }
    
    if (alertEl) {
        if (riskLevel === 'high') {
            alertEl.classList.remove('hidden');
            
            const alertText = generateAlertMessage(riskFactors);
            const alertTextEl = alertEl.querySelector('.alert-text p');
            if (alertTextEl) {
                alertTextEl.textContent = alertText;
            }
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
    console.log('🚨 Craving alert triggered:', riskFactors);
    
    showToast('⚠️ Potensi keinginan merokok terdeteksi! Coba teknik pernapasan.', 'warning');
    
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
    }
    
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
    
    if (startBtn) startBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'inline-flex';
    
    let cycle = 0;
    const totalCycles = 10;
    let phase = 'prepare';
    
    if (progressBar) progressBar.style.width = '0%';
    
    function breathingCycle() {
        if (!breathingActive) return;
        
        switch(phase) {
            case 'prepare':
                if (text) text.textContent = 'Bersiap...';
                if (circle) circle.className = 'breathing-circle';
                setTimeout(() => {
                    phase = 'inhale';
                    breathingCycle();
                }, 1000);
                break;
                
            case 'inhale':
                if (text) text.textContent = 'Tarik Napas (4 detik)';
                if (circle) circle.className = 'breathing-circle inhale';
                setTimeout(() => {
                    phase = 'hold';
                    breathingCycle();
                }, 4000);
                break;
                
            case 'hold':
                if (text) text.textContent = 'Tahan (7 detik)';
                if (circle) circle.className = 'breathing-circle inhale';
                setTimeout(() => {
                    phase = 'exhale';
                    breathingCycle();
                }, 7000);
                break;
                
            case 'exhale':
                if (text) text.textContent = 'Hembuskan (8 detik)';
                if (circle) circle.className = 'breathing-circle exhale';
                setTimeout(() => {
                    cycle++;
                    const progress = (cycle / totalCycles) * 100;
                    if (progressBar) progressBar.style.width = progress + '%';
                    
                    if (cycle >= totalCycles) {
                        completedBreathing();
                    } else {
                        phase = 'inhale';
                        breathingCycle();
                    }
                }, 8000);
                break;
        }
    }
    
    breathingCycle();
}

function stopBreathing() {
    breathingActive = false;
    
    const startBtn = document.getElementById('startBreathingBtn');
    const stopBtn = document.getElementById('stopBreathingBtn');
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
    if (circle) circle.className = 'breathing-circle';
    if (text) text.textContent = 'Bersiap...';
}

function completedBreathing() {
    breathingActive = false;
    
    const startBtn = document.getElementById('startBreathingBtn');
    const stopBtn = document.getElementById('stopBreathingBtn');
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    
    if (startBtn) startBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
    if (circle) circle.className = 'breathing-circle';
    if (text) text.textContent = 'Selesai! Bagus sekali! 🎉';
    
    showToast('Latihan pernapasan selesai! Bagus sekali! 🎉', 'success');
    
    setTimeout(() => {
        closeBreathingModal();
    }, 3000);
}

function requestSupport() {
    showToast('Menghubungkan ke komunitas dukungan...', 'info');
    setTimeout(() => {
        window.location.href = 'komunitas.html';
    }, 1500);
}

function openDistraction() {
    showToast('Membuka aktivitas pengalihan...', 'info');
    // Could open mini-games or other distractions
}

// ===========================================
// ACHIEVEMENTS AND TIMELINE
// ===========================================

function loadAchievements() {
    console.log('🏆 Loading achievements...');
    
    const achievements = [
        {
            icon: '🔥',
            title: 'Fire Starter',
            description: '3 hari bebas rokok',
            unlocked: true,
            date: '17 Jan 2024'
        },
        {
            icon: '💰',
            title: 'Money Saver',
            description: 'Hemat Rp 100K',
            unlocked: true,
            date: '20 Jan 2024'
        },
        {
            icon: '🏃',
            title: 'Week Warrior',
            description: '7 hari konsisten',
            unlocked: true,
            date: '22 Jan 2024'
        },
        {
            icon: '👑',
            title: 'Champion',
            description: '30 hari bebas rokok',
            unlocked: false,
            progress: 23
        },
        {
            icon: '💎',
            title: 'Diamond',
            description: '90 hari bebas rokok',
            unlocked: false,
            progress: 8
        },
        {
            icon: '🌟',
            title: 'Legend',
            description: '1 tahun bebas rokok',
            unlocked: false,
            progress: 2
        }
    ];
    
    const badgesGrid = document.querySelector('.badges-grid');
    if (!badgesGrid) return;
    
    badgesGrid.innerHTML = '';
    
    achievements.forEach(achievement => {
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge-card ${achievement.unlocked ? 'earned' : 'locked'}`;
        badgeEl.dataset.achievement = achievement.title.toLowerCase().replace(' ', '-');
        
        badgeEl.innerHTML = `
            <div class="badge-icon">${achievement.icon}</div>
            <div class="badge-title">${achievement.title}</div>
            <div class="badge-desc">${achievement.description}</div>
            ${achievement.unlocked ? 
                `<div class="badge-date">Tercapai: ${achievement.date}</div>` :
                `<div class="badge-progress">${achievement.progress}%</div>`
            }
        `;
        
        badgesGrid.appendChild(badgeEl);
    });
}

function updateHealthMetrics() {
    console.log('❤️ Updating health metrics...');
    
    setTimeout(() => {
        document.querySelectorAll('.health-progress-bar').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 500);
}

function loadTimelineData() {
    console.log('📅 Loading timeline data...');
    
    // Check if timeline already exists with content
    const timeline = document.querySelector('.progress-timeline');
    if (!timeline) {
        console.error('❌ Timeline container (.progress-timeline) not found!');
        return;
    }
    
    console.log('✅ Timeline container found');
    
    // Check if timeline already has content from HTML
    const existingItems = timeline.querySelectorAll('.timeline-item');
    if (existingItems.length > 0) {
        console.log('✅ Timeline already has', existingItems.length, 'items from HTML');
        
        // Just add animations to existing items
        existingItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200 + 100);
        });
        
        console.log('✅ Animations applied to existing timeline items');
        return;
    }
    
    // If no existing content, create new timeline data
    const timelineData = [
        {
            title: 'Lencana Week Warrior Diraih! 🏆',
            description: 'Berhasil mencapai 7 hari bebas rokok berturut-turut',
            time: 'Hari ini, 14:30'
        },
        {
            title: 'Smartwatch Terhubung',
            description: 'Monitoring kesehatan real-time dimulai',
            time: 'Hari ini, 08:15'
        },
        {
            title: 'Progress Mingguan Tercapai',
            description: 'Target mingguan berhasil diselesaikan dengan sempurna',
            time: 'Kemarin, 19:45'
        },
        {
            title: 'Hemat Rp 100.000! 💰',
            description: 'Pencapaian penghematan pertama yang luar biasa',
            time: '3 hari lalu, 16:20'
        }
    ];
    
    console.log('Creating new timeline items...');
    
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        timelineItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-desc">${item.description}</div>
                <div class="timeline-time">${item.time}</div>
            </div>
        `;
        
        // Set initial animation state
        timelineItem.style.opacity = '0';
        timelineItem.style.transform = 'translateX(-20px)';
        timelineItem.style.transition = 'all 0.5s ease';
        
        timeline.appendChild(timelineItem);
        
        // Add staggered animation
        setTimeout(() => {
            timelineItem.style.opacity = '1';
            timelineItem.style.transform = 'translateX(0)';
        }, index * 200 + 100);
    });
    
    console.log('✅ Timeline loaded with', timelineData.length, 'new items');
}

function addTimelineEvent(title, description, date) {
    const timeline = document.querySelector('.progress-timeline');
    if (!timeline) return;
    
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    const timeString = date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    timelineItem.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-content">
            <div class="timeline-title">${title}</div>
            <div class="timeline-desc">${description}</div>
            <div class="timeline-time">${timeString}</div>
        </div>
    `;
    
    timeline.insertBefore(timelineItem, timeline.firstChild);
}

// ===========================================
// EVENT LISTENERS AND UTILITIES
// ===========================================

function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
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
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    
    if (breathingActive) {
        stopBreathing();
    }
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

function showLoading(message = 'Memuat...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        const loadingText = loadingOverlay.querySelector('p');
        if (loadingText) {
            loadingText.textContent = message;
        }
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// ===========================================
// EXPORT AND SHARE FUNCTIONS
// ===========================================

function shareProgress() {
    const shareData = {
        title: 'PuffOff - Progress Bebas Rokok',
        text: `Saya sudah ${progressData.smokeFreedays} hari bebas rokok dan menghemat ${formatCurrency(progressData.moneySaved)}! 🎉`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showToast('Progress berhasil dibagikan!', 'success'))
            .catch((err) => console.log('Error sharing:', err));
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `${shareData.text}\n${shareData.url}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => showToast('Progress disalin ke clipboard!', 'success'))
                .catch(() => showToast('Gagal menyalin progress', 'error'));
        } else {
            showToast('Fitur berbagi tidak didukung', 'warning');
        }
    }
}

function exportData() {
    const data = {
        smokeFreedays: progressData.smokeFreedays,
        moneySaved: progressData.moneySaved,
        cigarettesAvoided: progressData.cigarettesAvoided,
        healthScore: progressData.healthScore,
        exportDate: new Date().toISOString(),
        smartwatchConnected: smartwatchConnected,
        achievements: document.querySelectorAll('.badge-card.earned').length
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `puffoff-progress-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Data progress berhasil diexport!', 'success');
}

// ===========================================
// GLOBAL FUNCTIONS FOR ONCLICK HANDLERS
// ===========================================

// Make functions globally available for onclick handlers
window.switchChart = switchChart;
window.connectSmartwatch = connectSmartwatch;
window.forceChartReload = forceChartReload;
window.startBreathingExercise = startBreathingExercise;
window.closeBreathingModal = closeBreathingModal;
window.startBreathing = startBreathing;
window.stopBreathing = stopBreathing;
window.requestSupport = requestSupport;
window.openDistraction = openDistraction;
window.shareProgress = shareProgress;
window.exportData = exportData;

console.log('✅ PuffOff Progress JavaScript loaded successfully!');
