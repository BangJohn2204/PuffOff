// Global variables
let progressChart = null;
let currentChartType = 'daily';

// Data dummy untuk simulasi
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

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateStats();
    initializeChart();
    loadAchievements();
    updateHealthMetrics();
    loadTimelineData();
    setupEventListeners();
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
}

// Update stats dengan animasi
function updateStats() {
    const elements = {
        smokeFreedays: document.getElementById('smokeFreedays'),
        moneySaved: document.getElementById('moneySaved'),
        cigarettesAvoided: document.getElementById('cigarettesAvoided'),
        healthScore: document.getElementById('healthScore')
    };

    // Animate numbers
    animateValue(elements.smokeFreedays, 0, progressData.smokeFreedays, 1000);
    animateValue(elements.cigarettesAvoided, 0, progressData.cigarettesAvoided, 1200);
    animateValue(elements.healthScore, 0, progressData.healthScore, 1500, '%');
    
    // Format money with currency
    setTimeout(() => {
        elements.moneySaved.textContent = formatCurrency(progressData.moneySaved);
    }, 800);
}

// Animasi angka
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

// Format currency
function formatCurrency(amount) {
    if (amount >= 1000000) {
        return 'Rp ' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return 'Rp ' + (amount / 1000).toFixed(0) + 'K';
    }
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    progressChart = new Chart(ctx, {
        type: 'line',
        data: getChartData(currentChartType),
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
}

// Get chart data based on type
function getChartData(type) {
    const data = progressData[type + 'Data'];
    
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
                yAxisID: 'y1'
            },
            {
                label: 'Health Score (%)',
                data: data.healthScore,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: false,
                yAxisID: 'y2'
            }
        ]
    };
}

// Switch chart view
function switchChart(type) {
    const buttons = document.querySelectorAll('.toggle-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    currentChartType = type;
    
    // Update chart with new data
    progressChart.data = getChartData(type);
    
    // Update chart options for different scales
    if (type === 'monthly') {
        progressChart.options.scales.y1 = {
            type: 'linear',
            display: false,
            position: 'right'
        };
        progressChart.options.scales.y2 = {
            type: 'linear',
            display: false,
            position: 'right'
        };
    }
    
    progressChart.update('active');
    
    // Add loading animation
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.classList.add('loading');
    
    setTimeout(() => {
        chartContainer.classList.remove('loading');
    }, 500);
}

// Update health metrics
function updateHealthMetrics() {
    const healthItems = document.querySelectorAll('.health-item');
    
    healthItems.forEach((item, index) => {
        const progressBar = item.querySelector('.health-progress-bar');
        if (progressBar) {
            setTimeout(() => {
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
            }, index * 200);
        }
    });
}

// Load achievements
function loadAchievements() {
    const achievements = {
        'fire-starter': { unlocked: true, date: '2024-01-15' },
        'money-saver': { unlocked: true, date: '2024-01-18' },
        'week-warrior': { unlocked: true, date: '2024-01-22' },
        'champion': { unlocked: false, progress: 23 },
        'diamond': { unlocked: false, progress: 8 },
        'legend': { unlocked: false, progress: 2 }
    };

    Object.keys(achievements).forEach(achievementId => {
        const badge = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (badge && achievements[achievementId].unlocked) {
            badge.classList.add('earned');
            badge.classList.remove('locked');
        }
    });
}

// Show badge details
function showBadgeDetails(achievementId) {
    const achievements = {
        'fire-starter': {
            title: 'Fire Starter 🔥',
            description: 'Selamat! Kamu telah berhasil tidak merokok selama 3 hari berturut-turut. Ini adalah langkah pertama yang sangat penting!',
            tips: 'Terus pertahankan momentum ini dengan mengingat alasan mengapa kamu ingin berhenti merokok.'
        },
        'money-saver': {
            title: 'Money Saver 💰',
            description: 'Luar biasa! Kamu telah menghemat Rp 100.000 dengan tidak membeli rokok. Uang ini bisa kamu gunakan untuk hal yang lebih bermanfaat!',
            tips: 'Coba hitung berapa banyak yang bisa kamu hemat dalam setahun dan buat rencana untuk menggunakan uang tersebut.'
        },
        'week-warrior': {
            title: 'Week Warrior 🏃',
            description: 'Hebat! Satu minggu penuh tanpa rokok adalah pencapaian yang luar biasa. Tubuhmu sudah mulai merasakan manfaatnya!',
            tips: 'Fungsi paru-parumu mulai membaik. Terus jaga pola hidup sehat dengan olahraga dan makan makanan bergizi.'
        }
    };

    const achievement = achievements[achievementId];
    if (achievement) {
        alert(`${achievement.title}\n\n${achievement.description}\n\n💡 Tips: ${achievement.tips}`);
    }
}

// Load timeline data
function loadTimelineData() {
    // Simulate loading animation for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Share progress
function shareProgress() {
    const text = `🎉 Progress Bebas Rokok - PuffOff
    
🔥 ${progressData.smokeFreedays} hari bebas rokok
💰 Hemat ${formatCurrency(progressData.moneySaved)}
🚫 Hindari ${progressData.cigarettesAvoided} batang rokok
❤️ Health Score: ${progressData.healthScore}%

Bergabunglah dengan PuffOff untuk mencapai hidup bebas rokok!

#PuffOff #BebasRokok #SehatTanpaRokok #ProgressTracker`;

    if (navigator.share) {
        navigator.share({
            title: 'Progress Bebas Rokok - PuffOff',
            text: text,
            url: window.location.href
        }).then(() => {
            showToast('Progress berhasil dibagikan!', 'success');
        }).catch(() => {
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

// Copy to clipboard fallback
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Progress berhasil disalin ke clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Progress berhasil disalin!', 'success');
    } catch (err) {
        showToast('Gagal menyalin progress', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Export data
function exportData() {
    const data = {
        tanggal_export: new Date().toISOString(),
        user_info: {
            hari_bebas_rokok: progressData.smokeFreedays,
            uang_dihemat: progressData.moneySaved,
            rokok_dihindari: progressData.cigarettesAvoided,
            health_score: progressData.healthScore
        },
        progress_harian: progressData.dailyData,
        progress_mingguan: progressData.weeklyData,
        progress_bulanan: progressData.monthlyData,
        pencapaian: [
            { nama: 'Fire Starter', tanggal: '2024-01-15', deskripsi: '3 hari bebas rokok' },
            { nama: 'Money Saver', tanggal: '2024-01-18', deskripsi: 'Hemat Rp 100K' },
            { nama: 'Week Warrior', tanggal: '2024-01-22', deskripsi: '7 hari konsisten' }
        ],
        kesehatan: {
            fungsi_paru: { status: 'membaik', persentase: 15 },
            sirkulasi_darah: { status: 'membaik', persentase: 20 },
            penciuman: { status: 'normal', persentase: 90 },
            energi: { status: 'meningkat', persentase: 75 }
        },
        target_penghematan: [
            { nama: 'Smartphone Baru', target: 3000000, progress: 7 },
            { nama: 'Liburan Keluarga', target: 5000000, progress: 4 }
        ]
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `puffoff_progress_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    showToast('Data progress berhasil diexport!', 'success');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Unlock new badge (simulation)
function unlockBadge(badgeId) {
    const badge = document.querySelector(`[data-achievement="${badgeId}"]`);
    if (badge && badge.classList.contains('locked')) {
        badge.classList.remove('locked');
        badge.classList.add('earned');
        
        // Add celebration animation
        badge.style.animation = 'badgeGlow 1s ease-in-out 3';
        
        setTimeout(() => {
            badge.style.animation = '';
            showToast('🎉 Lencana baru terbuka!', 'success');
        }, 3000);
    }
}

// Simulate real-time updates
function simulateRealtimeUpdates() {
    setInterval(() => {
        // Randomly update health score
        const healthScore = document.getElementById('healthScore');
        const currentScore = parseInt(healthScore.textContent.replace('%', ''));
        const newScore = Math.min(100, currentScore + Math.floor(Math.random() * 2));
        
        if (newScore > currentScore) {
            healthScore.textContent = newScore + '%';
            progressData.healthScore = newScore;
        }
        
        // Check for new achievements
        if (progressData.smokeFreedays >= 30 && document.querySelector('[data-achievement="champion"]').classList.contains('locked')) {
            unlockBadge('champion');
        }
        
    }, 30000); // Update every 30 seconds
}

// Start real-time simulation
// simulateRealtimeUpdates(); // Uncomment for demo purposes

// Add smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update progress bars on scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.health-progress-bar, .goal-progress-bar, .milestone-progress-bar');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    });
}, observerOptions);

// Observe sections with progress bars
document.querySelectorAll('.health-metrics, .savings-goals, .milestone-card').forEach(section => {
    observer.observe(section);
});
