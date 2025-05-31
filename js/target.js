// Global variables
let currentDate = new Date();
let currentTarget = null;
let selectedMood = null;
let calendarData = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadTargetData();
    loadCalendarData();
    setupEventListeners();
    renderCalendar();
    updateDateDisplay();
    loadTodayMood();
    checkWeeklyReflection();
    loadReflectionHistory();
}

// Setup event listeners
function setupEventListeners() {
    // Target form submission
    const targetForm = document.getElementById('targetForm');
    if (targetForm) {
        targetForm.addEventListener('submit', handleTargetSubmission);
    }

    // Modal close on outside click
    const supportModal = document.getElementById('supportModal');
    if (supportModal) {
        supportModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSupportModal();
            }
        });
    }

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSupportModal();
        }
    });

    // Set default start date to today
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.value = new Date().toISOString().split('T')[0];
    }
}

// Target Management
function handleTargetSubmission(e) {
    e.preventDefault();
    
    const targetType = document.getElementById('targetType').value;
    const targetDays = parseInt(document.getElementById('targetDays').value);
    const startDate = document.getElementById('startDate').value;
    const description = document.getElementById('targetDescription').value;
    
    if (!targetDays || !startDate) {
        showToast('Mohon lengkapi semua field yang diperlukan!', 'error');
        return;
    }
    
    const target = {
        id: Date.now(),
        type: targetType,
        days: targetDays,
        startDate: startDate,
        description: description,
        createdAt: new Date().toISOString(),
        achieved: 0
    };
    
    saveTarget(target);
    showToast('Target berhasil disimpan!', 'success');
    
    // Reset form
    document.getElementById('targetForm').reset();
    document.getElementById('startDate').value = new Date().toISOString().split('T')[0];
}

function saveTarget(target) {
    currentTarget = target;
    localStorage.setItem('currentTarget', JSON.stringify(target));
    updateTargetDisplay();
}

function loadTargetData() {
    const saved = localStorage.getItem('currentTarget');
    if (saved) {
        currentTarget = JSON.parse(saved);
        updateTargetDisplay();
        document.getElementById('targetSetting').style.display = 'none';
    }
}

function updateTargetDisplay() {
    if (!currentTarget) return;
    
    const startDate = new Date(currentTarget.startDate);
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const achieved = Math.max(0, daysPassed);
    const remaining = Math.max(0, currentTarget.days - achieved);
    const progress = Math.min((achieved / currentTarget.days) * 100, 100);
    
    // Update stats
    document.getElementById('currentTargetDays').textContent = currentTarget.days;
    document.getElementById('achievedDays').textContent = achieved;
    document.getElementById('remainingDays').textContent = remaining;
    
    // Update progress
    document.getElementById('progressPercentage').textContent = Math.round(progress) + '%';
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Show overview
    document.getElementById('targetOverview').style.display = 'block';
    document.getElementById('targetSetting').style.display = 'none';
}

function editTarget() {
    document.getElementById('targetSetting').style.display = 'block';
    
    if (currentTarget) {
        document.getElementById('targetType').value = currentTarget.type;
        document.getElementById('targetDays').value = currentTarget.days;
        document.getElementById('startDate').value = currentTarget.startDate;
        document.getElementById('targetDescription').value = currentTarget.description || '';
    }
}

function handleTargetTypeChange() {
    const targetType = document.getElementById('targetType').value;
    const targetDaysInput = document.getElementById('targetDays');
    
    switch(targetType) {
        case 'weekly':
            targetDaysInput.value = 7;
            break;
        case 'monthly':
            targetDaysInput.value = 30;
            break;
        default:
            targetDaysInput.value = '';
    }
}

// Calendar Management
function loadCalendarData() {
    const saved = localStorage.getItem('calendarData');
    if (saved) {
        calendarData = JSON.parse(saved);
    }
}

function saveCalendarData() {
    localStorage.setItem('calendarData', JSON.stringify(calendarData));
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYear = document.getElementById('monthYear');
    
    if (!grid || !monthYear) return;
    
    // Update month/year display
    monthYear.textContent = currentDate.toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear grid
    grid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day header';
        dayElement.textContent = day;
        grid.appendChild(dayElement);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();
        dayElement.onclick = () => toggleCalendarDay(date);
        
        const dateKey = date.toISOString().split('T')[0];
        const today = new Date().toDateString();
        
        // Add classes based on state
        if (date.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }
        
        if (date.toDateString() === today) {
            dayElement.classList.add('today');
        }
        
        // Check calendar data
        if (calendarData[dateKey]) {
            if (calendarData[dateKey].success) {
                dayElement.classList.add('success');
            } else if (calendarData[dateKey].failed) {
                dayElement.classList.add('failed');
            }
        }
        
        // Check if it's a target day (weekly targets on Sundays)
        if (currentTarget && currentTarget.type === 'weekly' && date.getDay() === 0) {
            dayElement.classList.add('target');
        }
        
        grid.appendChild(dayElement);
    }
}

function toggleCalendarDay(date) {
    const dateKey = date.toISOString().split('T')[0];
    const today = new Date().toDateString();
    
    // Only allow marking today or past days
    if (date.toDateString() > today) {
        showToast('Tidak bisa menandai hari yang akan datang!', 'warning');
        return;
    }
    
    if (!calendarData[dateKey]) {
        calendarData[dateKey] = {};
    }
    
    // Cycle through states: none -> success -> failed -> none
    if (calendarData[dateKey].success) {
        calendarData[dateKey].success = false;
        calendarData[dateKey].failed = true;
    } else if (calendarData[dateKey].failed) {
        delete calendarData[dateKey];
    } else {
        calendarData[dateKey].success = true;
        calendarData[dateKey].failed = false;
    }
    
    saveCalendarData();
    renderCalendar();
    updateTargetDisplay();
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    renderCalendar();
}

// Mood and Reflection Management
function selectMood(mood) {
    selectedMood = mood;
    
    // Update UI
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');
    
    // Save mood for today
    const today = new Date().toISOString().split('T')[0];
    const moodData = {
        date: today,
        mood: mood,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`mood_${today}`, JSON.stringify(moodData));
}

function loadTodayMood() {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem(`mood_${today}`);
    
    if (saved) {
        const moodData = JSON.parse(saved);
        selectedMood = moodData.mood;
        
        const moodBtn = document.querySelector(`[data-mood="${selectedMood}"]`);
        if (moodBtn) {
            moodBtn.classList.add('selected');
        }
    }
}

function saveReflection() {
    const dailyReflection = document.getElementById('dailyReflection').value.trim();
    const gratitude = document.getElementById('gratitude').value.trim();
    const tomorrowGoal = document.getElementById('tomorrowGoal').value.trim();
    
    if (!dailyReflection && !gratitude && !tomorrowGoal) {
        showToast('Mohon isi setidaknya satu field refleksi!', 'warning');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const reflection = {
        date: today,
        dailyReflection: dailyReflection,
        gratitude: gratitude,
        tomorrowGoal: tomorrowGoal,
        mood: selectedMood,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`reflection_${today}`, JSON.stringify(reflection));
    
    // Clear form
    document.getElementById('dailyReflection').value = '';
    document.getElementById('gratitude').value = '';
    document.getElementById('tomorrowGoal').value = '';
    
    showToast('Refleksi berhasil disimpan!', 'success');
    loadReflectionHistory();
}

// Weekly Reflection
function checkWeeklyReflection() {
    if (!currentTarget) return;
    
    const startDate = new Date(currentTarget.startDate);
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const weekNumber = Math.floor(daysPassed / 7);
    
    if (weekNumber > 0 && daysPassed % 7 === 0) {
        const weekKey = `week_${weekNumber}`;
        const saved = localStorage.getItem(weekKey);
        
        if (!saved) {
            document.getElementById('weekNumber').textContent = weekNumber;
            document.getElementById('weeklyReflection').style.display = 'block';
        }
    }
}

function saveWeeklyReflection() {
    const weeklyText = document.getElementById('weeklyReflectionText').value.trim();
    const achievements = [];
    
    document.querySelectorAll('.achievement-input').forEach(input => {
        if (input.value.trim()) {
            achievements.push(input.value.trim());
        }
    });
    
    if (!weeklyText) {
        showToast('Mohon isi refleksi mingguan!', 'warning');
        return;
    }
    
    const weekNumber = document.getElementById('weekNumber').textContent;
    const weeklyReflection = {
        week: weekNumber,
        reflection: weeklyText,
        achievements: achievements,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`week_${weekNumber}`, JSON.stringify(weeklyReflection));
    
    // Hide weekly reflection form
    document.getElementById('weeklyReflection').style.display = 'none';
    
    showToast('Refleksi mingguan berhasil disimpan!', 'success');
    loadReflectionHistory();
}

function addAchievement() {
    const achievementList = document.getElementById('achievementList');
    const newAchievement = document.createElement('div');
    newAchievement.className = 'achievement-item';
    
    const achievementCount = achievementList.children.length + 1;
    newAchievement.innerHTML = `
        <input type="text" class="achievement-input" placeholder="Pencapaian #${achievementCount}">
    `;
    
    achievementList.appendChild(newAchievement);
}

// History Management
function loadReflectionHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const reflections = [];
    
    // Load daily reflections
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('reflection_')) {
            const data = JSON.parse(localStorage.getItem(key));
            data.type = 'daily';
            reflections.push(data);
        } else if (key.startsWith('week_')) {
            const data = JSON.parse(localStorage.getItem(key));
            data.type = 'weekly';
            reflections.push(data);
        }
    }
    
    // Sort by date (newest first)
    reflections.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Render history
    historyList.innerHTML = '';
    
    if (reflections.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">Belum ada refleksi tersimpan</p>';
        return;
    }
    
    reflections.forEach(reflection => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.type = reflection.type;
        
        if (reflection.type === 'daily') {
            historyItem.innerHTML = `
                <div class="history-date">${formatDate(reflection.date)} - Refleksi Harian</div>
                <div class="history-content">
                    ${reflection.dailyReflection ? `<p><strong>Refleksi:</strong> ${reflection.dailyReflection}</p>` : ''}
                    ${reflection.gratitude ? `<p><strong>Syukur:</strong> ${reflection.gratitude}</p>` : ''}
                    ${reflection.tomorrowGoal ? `<p><strong>Target Besok:</strong> ${reflection.tomorrowGoal}</p>` : ''}
                </div>
                ${reflection.mood ? `<div class="history-mood">${getMoodEmoji(reflection.mood)} ${getMoodLabel(reflection.mood)}</div>` : ''}
            `;
        } else if (reflection.type === 'weekly') {
            historyItem.innerHTML = `
                <div class="history-date">Minggu ke-${reflection.week} - Refleksi Mingguan</div>
                <div class="history-content">
                    <p><strong>Refleksi:</strong> ${reflection.reflection}</p>
                    ${reflection.achievements.length > 0 ? `
                        <p><strong>Pencapaian:</strong></p>
                        <ul style="margin-left: 20px;">
                            ${reflection.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        }
        
        historyList.appendChild(historyItem);
    });
}

function filterHistory(type) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Filter history items
    document.querySelectorAll('.history-item').forEach(item => {
        if (type === 'all' || item.dataset.type === type) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Support Modal
function showTemptationSupport() {
    document.getElementById('supportModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSupportModal() {
    document.getElementById('supportModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function useStrategy(strategy) {
    const strategies = {
        breathing: {
            title: 'Latihan Pernapasan',
            action: 'Tarik napas dalam-dalam selama 4 detik, tahan 7 detik, buang napas 8 detik. Ulangi 3-5 kali.',
            duration: 60000 // 1 minute
        },
        water: {
            title: 'Minum Air',
            action: 'Minum segelas air putih perlahan-lahan. Fokus pada sensasi air yang menyegarkan.',
            duration: 30000 // 30 seconds
        },
        walk: {
            title: 'Jalan Kaki',
            action: 'Berjalanlah selama 5-10 menit. Nikmati udara segar dan gerakan tubuh.',
            duration: 300000 // 5 minutes
        },
        music: {
            title: 'Mendengar Musik',
            action: 'Putar lagu favoritmu dan fokus pada melodi dan liriknya.',
            duration: 180000 // 3 minutes
        },
        call: {
            title: 'Telepon Teman',
            action: 'Hubungi teman atau keluarga untuk berbicara dan mengalihkan perhatian.',
            duration: 600000 // 10 minutes
        },
        community: {
            title: 'Chat Komunitas',
            action: 'Bergabunglah dengan komunitas PuffOff untuk mendapat dukungan.',
            duration: 0
        }
    };
    
    const selectedStrategy = strategies[strategy];
    if (selectedStrategy) {
        showToast(`Strategi dipilih: ${selectedStrategy.title}`, 'success');
        
        if (strategy === 'community') {
            // Redirect to community page
            window.location.href = 'komunitas.html';
        } else {
            // Start timer if applicable
            if (selectedStrategy.duration > 0) {
                startStrategyTimer(selectedStrategy);
            }
        }
        
        // Log strategy usage
        logStrategyUsage(strategy);
        closeSupportModal();
    }
}

function startStrategyTimer(strategy) {
    const minutes = Math.floor(strategy.duration / 60000);
    const seconds = Math.floor((strategy.duration % 60000) / 1000);
    
    showToast(`Timer dimulai: ${strategy.title} (${minutes}:${seconds.toString().padStart(2, '0')})`, 'info');
    
    setTimeout(() => {
        showToast(`Selesai! Bagaimana perasaanmu sekarang?`, 'success');
    }, strategy.duration);
}

function logStrategyUsage(strategy) {
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `strategy_usage_${today}`;
    const existing = JSON.parse(localStorage.getItem(usageKey) || '[]');
    
    existing.push({
        strategy: strategy,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(usageKey, JSON.stringify(existing));
}

function logTemptation() {
    const note = document.getElementById('temptationNote').value.trim();
    
    if (!note) {
        showToast('Mohon isi catatan situasi!', 'warning');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const temptationKey = `temptation_${Date.now()}`;
    
    const temptationLog = {
        date: today,
        note: note,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(temptationKey, JSON.stringify(temptationLog));
    
    document.getElementById('temptationNote').value = '';
    showToast('Catatan situasi berhasil disimpan!', 'success');
    
    closeSupportModal();
}

// Utility Functions
function updateDateDisplay() {
    const dateToday = document.getElementById('dateToday');
    if (dateToday) {
        dateToday.textContent = new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function getMoodEmoji(mood) {
    const moodEmojis = {
        excellent: '😁',
        good: '😊',
        neutral: '😐',
        bad: '😟',
        terrible: '😢'
    };
    return moodEmojis[mood] || '😐';
}

function getMoodLabel(mood) {
    const moodLabels = {
        excellent: 'Sangat Baik',
        good: 'Baik',
        neutral: 'Biasa',
        bad: 'Buruk',
        terrible: 'Sangat Buruk'
    };
    return moodLabels[mood] || 'Tidak diketahui';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Data Export/Import (Advanced Feature)
function exportData() {
    const data = {
        target: currentTarget,
        calendar: calendarData,
        reflections: {},
        moods: {},
        strategies: {},
        temptations: {}
    };
    
    // Collect all stored data
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        
        if (key.startsWith('reflection_')) {
            data.reflections[key] = JSON.parse(value);
        } else if (key.startsWith('mood_')) {
            data.moods[key] = JSON.parse(value);
        } else if (key.startsWith('week_')) {
            data.reflections[key] = JSON.parse(value);
        } else if (key.startsWith('strategy_usage_')) {
            data.strategies[key] = JSON.parse(value);
        } else if (key.startsWith('temptation_')) {
            data.temptations[key] = JSON.parse(value);
        }
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `puffoff_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data berhasil diekspor!', 'success');
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Import target
            if (data.target) {
                localStorage.setItem('currentTarget', JSON.stringify(data.target));
                currentTarget = data.target;
            }
            
            // Import calendar
            if (data.calendar) {
                localStorage.setItem('calendarData', JSON.stringify(data.calendar));
                calendarData = data.calendar;
            }
            
            // Import reflections
            if (data.reflections) {
                Object.keys(data.reflections).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(data.reflections[key]));
                });
            }
            
            // Import moods
            if (data.moods) {
                Object.keys(data.moods).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(data.moods[key]));
                });
            }
            
            // Import strategies
            if (data.strategies) {
                Object.keys(data.strategies).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(data.strategies[key]));
                });
            }
            
            // Import temptations
            if (data.temptations) {
                Object.keys(data.temptations).forEach(key => {
                    localStorage.setItem(key, JSON.stringify(data.temptations[key]));
                });
            }
            
            // Refresh the page to show imported data
            showToast('Data berhasil diimpor!', 'success');
            setTimeout(() => {
                location.reload();
            }, 1000);
            
        } catch (error) {
            showToast('Error: File tidak valid!', 'error');
        }
    };
    reader.readAsText(file);
}

// Analytics and Insights (Advanced Feature)
function generateInsights() {
    const insights = {
        totalDays: 0,
        successDays: 0,
        failedDays: 0,
        averageMood: 0,
        mostUsedStrategy: '',
        longestStreak: 0,
        currentStreak: 0
    };
    
    // Analyze calendar data
    Object.keys(calendarData).forEach(date => {
        insights.totalDays++;
        if (calendarData[date].success) {
            insights.successDays++;
        } else if (calendarData[date].failed) {
            insights.failedDays++;
        }
    });
    
    // Calculate success rate
    insights.successRate = insights.totalDays > 0 ? 
        (insights.successDays / insights.totalDays * 100).toFixed(1) : 0;
    
    // Analyze mood data
    const moods = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('mood_')) {
            const moodData = JSON.parse(localStorage.getItem(key));
            moods.push(moodData.mood);
        }
    }
    
    if (moods.length > 0) {
        const moodValues = {
            'terrible': 1,
            'bad': 2,
            'neutral': 3,
            'good': 4,
            'excellent': 5
        };
        
        const totalMoodValue = moods.reduce((sum, mood) => sum + moodValues[mood], 0);
        insights.averageMood = (totalMoodValue / moods.length).toFixed(1);
    }
    
    // Analyze strategy usage
    const strategyCount = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('strategy_usage_')) {
            const strategies = JSON.parse(localStorage.getItem(key));
            strategies.forEach(usage => {
                strategyCount[usage.strategy] = (strategyCount[usage.strategy] || 0) + 1;
            });
        }
    }
    
    if (Object.keys(strategyCount).length > 0) {
        insights.mostUsedStrategy = Object.keys(strategyCount).reduce((a, b) => 
            strategyCount[a] > strategyCount[b] ? a : b
        );
    }
    
    // Calculate streaks
    const sortedDates = Object.keys(calendarData).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
        const date = sortedDates[i];
        if (calendarData[date].success) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
            
            // Check if this is part of current streak (recent dates)
            const dateObj = new Date(date);
            const today = new Date();
            const diffDays = Math.floor((today - dateObj) / (1000 * 60 * 60 * 24));
            
            if (diffDays <= tempStreak - 1) {
                currentStreak = tempStreak;
            }
        } else {
            tempStreak = 0;
        }
    }
    
    insights.longestStreak = longestStreak;
    insights.currentStreak = currentStreak;
    
    return insights;
}

// Motivational Quotes
function getMotivationalQuote() {
    const quotes = [
        {
            text: "Setiap hari tanpa rokok adalah investasi untuk masa depan yang lebih sehat.",
            author: "PuffOff Team"
        },
        {
            text: "Kamu tidak berhenti merokok karena mudah, tapi karena kamu tahu itu yang terbaik.",
            author: "Mark Twain"
        },
        {
            text: "Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.",
            author: "Colin Powell"
        },
        {
            text: "Kebiasaan adalah awalnya seperti benang laba-laba, tapi akhirnya menjadi seperti tali.",
            author: "Spanish Proverb"
        },
        {
            text: "Jangan menyerah pada sesuatu yang benar-benar kamu inginkan. Sulit menunggu, tapi menyesal lebih sulit.",
            author: "Unknown"
        }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Notification System
function scheduleNotifications() {
    // This would typically use Service Workers for real push notifications
    // For now, we'll use simple reminders in localStorage
    
    const notifications = [
        {
            time: '08:00',
            message: '🌅 Selamat pagi! Mulai hari dengan semangat bebas rokok!',
            type: 'motivation'
        },
        {
            time: '12:00',
            message: '🌞 Sudah setengah hari tanpa rokok! Kamu hebat!',
            type: 'progress'
        },
        {
            time: '18:00',
            message: '🌆 Waktunya refleksi harian. Bagaimana hari ini?',
            type: 'reflection'
        },
        {
            time: '21:00',
            message: '🌙 Selamat! Satu hari lagi berhasil dilewati tanpa rokok.',
            type: 'celebration'
        }
    ];
    
    // Save notification schedule
    localStorage.setItem('notificationSchedule', JSON.stringify(notifications));
}

// Gamification Elements
function updateAchievements() {
    const achievements = {
        'first_day': {
            name: 'Hari Pertama',
            description: 'Berhasil melewati hari pertama tanpa rokok',
            icon: '🎯',
            unlocked: false
        },
        'week_warrior': {
            name: 'Pejuang Minggu',
            description: 'Berhasil bebas rokok selama 1 minggu',
            icon: '🏆',
            unlocked: false
        },
        'mood_tracker': {
            name: 'Pelacak Mood',
            description: 'Mencatat mood selama 7 hari berturut-turut',
            icon: '📊',
            unlocked: false
        },
        'reflection_master': {
            name: 'Master Refleksi',
            description: 'Menulis refleksi harian selama 30 hari',
            icon: '📝',
            unlocked: false
        },
        'community_helper': {
            name: 'Penolong Komunitas',
            description: 'Membantu 10 orang di komunitas',
            icon: '🤝',
            unlocked: false
        }
    };
    
    // Check and unlock achievements based on user data
    const insights = generateInsights();
    
    if (insights.totalDays >= 1) {
        achievements.first_day.unlocked = true;
    }
    
    if (insights.successDays >= 7) {
        achievements.week_warrior.unlocked = true;
    }
    
    // Save achievements
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    return achievements;
}

// Emergency Contact Feature
function setupEmergencyContacts() {
    const defaultContacts = [
        {
            name: 'Hotline Berhenti Merokok',
            number: '0800-1234-5678',
            type: 'hotline'
        },
        {
            name: 'Komunitas PuffOff',
            action: 'openCommunity',
            type: 'community'
        }
    ];
    
    if (!localStorage.getItem('emergencyContacts')) {
        localStorage.setItem('emergencyContacts', JSON.stringify(defaultContacts));
    }
}

// Initialize additional features
function initializeAdvancedFeatures() {
    scheduleNotifications();
    setupEmergencyContacts();
    updateAchievements();
}

// Call advanced features initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedFeatures();
});
