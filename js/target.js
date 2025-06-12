// ===========================================
// PuffOff Target - Enhanced JavaScript with Savings Goals
// ===========================================

// Global variables
let currentDate = new Date();
let currentTarget = null;
let selectedMood = null;
let calendarData = {};

// NEW: Savings Goals variables
let savingsGoals = [];
let userData = {
    totalSavings: 0,
    startDate: null,
    cigarettesPerDay: 12,
    pricePerPack: 25000
};

let categoryIcons = {
    elektronik: '📱',
    liburan: '🏖️',
    pendidikan: '📚',
    kesehatan: '❤️',
    investasi: '📈',
    kendaraan: '🚗',
    rumah: '🏠',
    fashion: '👕',
    hobi: '🎨',
    lainnya: '📦'
};

let selectedGoalId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadTargetData();
    loadCalendarData();
    loadSavingsData(); // NEW
    setupEventListeners();
    renderCalendar();
    updateDateDisplay();
    loadTodayMood();
    checkWeeklyReflection();
    loadReflectionHistory();
    updateSavingsDisplay(); // NEW
    calculateCurrentSavings(); // NEW
}

// ===========================================
// NEW: SAVINGS GOALS FUNCTIONS
// ===========================================

function loadSavingsData() {
    try {
        const savedGoals = localStorage.getItem('puffoff_savings_goals');
        const savedUserData = localStorage.getItem('puffoff_user_data');
        
        if (savedGoals) {
            savingsGoals = JSON.parse(savedGoals);
        }
        
        if (savedUserData) {
            userData = { ...userData, ...JSON.parse(savedUserData) };
        }
        
        console.log('💰 Savings data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading savings data:', error);
        showToast('Gagal memuat data penghematan', 'error');
    }
}

function saveSavingsData() {
    try {
        localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
        localStorage.setItem('puffoff_user_data', JSON.stringify(userData));
        console.log('💾 Savings data saved successfully');
    } catch (error) {
        console.error('❌ Error saving savings data:', error);
        showToast('Gagal menyimpan data penghematan', 'error');
    }
}

function calculateCurrentSavings() {
    if (!userData.startDate) {
        userData.startDate = new Date().toISOString().split('T')[0];
    }
    
    const startDate = new Date(userData.startDate);
    const today = new Date();
    const daysSinceQuit = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceQuit > 0) {
        const dailySavings = calculateDailyCost();
        userData.totalSavings = dailySavings * daysSinceQuit;
        saveSavingsData();
    }
}

function calculateDailyCost() {
    const cigarettesPerPack = 20;
    return Math.round((userData.cigarettesPerDay / cigarettesPerPack) * userData.pricePerPack);
}

function updateSavingsDisplay() {
    updateSavingsOverview();
    updateGoalsList();
    updateDailySavingsInfo();
}

function updateSavingsOverview() {
    const totalSavedEl = document.getElementById('totalSaved');
    const activeGoalsCountEl = document.getElementById('activeGoalsCount');
    const completedGoalsCountEl = document.getElementById('completedGoalsCount');
    
    const activeGoals = savingsGoals.filter(goal => !goal.completed).length;
    const completedGoals = savingsGoals.filter(goal => goal.completed).length;
    
    if (totalSavedEl) {
        animateValue(totalSavedEl, 0, userData.totalSavings, 1500, formatCurrency);
    }
    
    if (activeGoalsCountEl) {
        animateValue(activeGoalsCountEl, 0, activeGoals, 1000);
    }
    
    if (completedGoalsCountEl) {
        animateValue(completedGoalsCountEl, 0, completedGoals, 1200);
    }
}

function updateDailySavingsInfo() {
    const dailySavingsAmountEl = document.getElementById('dailySavingsAmount');
    if (dailySavingsAmountEl) {
        const dailySavings = calculateDailyCost();
        dailySavingsAmountEl.textContent = formatCurrency(dailySavings);
    }
}

function updateGoalsList() {
    const goalsList = document.getElementById('savingsGoalsList');
    if (!goalsList) return;
    
    // Clear existing goals
    goalsList.innerHTML = '';
    
    if (savingsGoals.length === 0) {
        goalsList.innerHTML = `
            <div class="no-goals-message">
                <div class="no-goals-icon">🎯</div>
                <h4>Belum ada target penghematan</h4>
                <p>Mulai dengan membuat target pertama Anda!</p>
            </div>
        `;
        return;
    }
    
    // Add each goal
    savingsGoals.forEach(goal => {
        const percentage = Math.min(Math.round((userData.totalSavings / goal.target) * 100), 100);
        const saved = Math.min(userData.totalSavings, goal.target);
        const remaining = Math.max(goal.target - userData.totalSavings, 0);
        
        // Update goal progress
        goal.progress = percentage;
        
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-header">
                <div class="goal-category-icon">${categoryIcons[goal.category] || '📦'}</div>
                <div class="goal-info">
                    <div class="goal-title">${goal.title}</div>
                    <div class="goal-category">${capitalizeFirst(goal.category)}</div>
                </div>
                <div class="goal-amount">${formatCurrency(goal.target)}</div>
            </div>
            <div class="goal-progress">
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="goal-percentage">${percentage}%</div>
            </div>
            <div class="goal-details">
                <div class="goal-saved">Tersimpan: ${formatCurrency(saved)}</div>
                <div class="goal-remaining">Sisa: ${formatCurrency(remaining)}</div>
            </div>
        `;
        
        // Add click event for goal detail
        goalElement.addEventListener('click', () => {
            showGoalDetail(goal);
        });
        
        goalsList.appendChild(goalElement);
        
        // Check for goal completion
        if (percentage >= 100 && !goal.completed) {
            goal.completed = true;
            goal.completedDate = new Date().toISOString();
            showToast(`🎉 Target "${goal.title}" tercapai!`, 'success');
            
            // Show achievement popup
            setTimeout(() => {
                showAchievementPopup('🎯', 'Target Tercapai!', `Selamat! Target "${goal.title}" berhasil dicapai!`);
            }, 1000);
        }
    });
    
    // Animate progress bars after rendering
    setTimeout(() => {
        document.querySelectorAll('.goal-progress-fill').forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = width;
            }, 100);
        });
    }, 100);
}

function openAddSavingsGoal() {
    const modal = document.getElementById('addSavingsGoalModal');
    if (modal) {
        // Clear form
        document.getElementById('goalName').value = '';
        document.getElementById('goalAmount').value = '';
        document.getElementById('goalCategory').value = 'elektronik';
        document.getElementById('goalTargetDate').value = '';
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('goalTargetDate').min = today;
        
        // Setup real-time preview
        setupGoalPreview();
        updateGoalPreview();
        
        modal.classList.add('show');
        console.log('🎯 Add savings goal modal opened');
    }
}

function closeAddSavingsGoal() {
    const modal = document.getElementById('addSavingsGoalModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function setupGoalPreview() {
    const inputs = ['goalName', 'goalAmount', 'goalTargetDate'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateGoalPreview);
        }
    });
}

function updateGoalPreview() {
    const goalAmount = parseInt(document.getElementById('goalAmount').value) || 0;
    const targetDate = document.getElementById('goalTargetDate').value;
    const dailySavings = calculateDailyCost();
    
    const previewDailySavingsEl = document.getElementById('previewDailySavings');
    const previewTimeEstimateEl = document.getElementById('previewTimeEstimate');
    const previewCurrentProgressEl = document.getElementById('previewCurrentProgress');
    
    if (previewDailySavingsEl) {
        previewDailySavingsEl.textContent = formatCurrency(dailySavings);
    }
    
    if (goalAmount > 0 && dailySavings > 0) {
        const remainingAmount = Math.max(goalAmount - userData.totalSavings, 0);
        const daysNeeded = Math.ceil(remainingAmount / dailySavings);
        const currentProgress = Math.min((userData.totalSavings / goalAmount) * 100, 100);
        
        if (previewTimeEstimateEl) {
            if (currentProgress >= 100) {
                previewTimeEstimateEl.innerHTML = `<span style="color: #10b981;">✅ Target sudah tercapai!</span>`;
            } else if (daysNeeded > 365) {
                const years = Math.floor(daysNeeded / 365);
                const remainingDays = daysNeeded % 365;
                previewTimeEstimateEl.textContent = `${years} tahun ${remainingDays} hari`;
            } else {
                previewTimeEstimateEl.textContent = `${daysNeeded} hari`;
            }
        }
        
        if (previewCurrentProgressEl) {
            previewCurrentProgressEl.textContent = `${currentProgress.toFixed(1)}%`;
            previewCurrentProgressEl.style.color = currentProgress >= 100 ? '#10b981' : '#667eea';
        }
    } else {
        if (previewTimeEstimateEl) previewTimeEstimateEl.textContent = '0 hari';
        if (previewCurrentProgressEl) previewCurrentProgressEl.textContent = '0%';
    }
    
    // Target date validation
    if (targetDate && goalAmount > 0) {
        const targetDateObj = new Date(targetDate);
        const today = new Date();
        const daysUntilTarget = Math.ceil((targetDateObj - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilTarget > 0) {
            const remainingAmount = Math.max(goalAmount - userData.totalSavings, 0);
            const requiredDailySavings = Math.ceil(remainingAmount / daysUntilTarget);
            
            if (requiredDailySavings > dailySavings) {
                if (previewTimeEstimateEl) {
                    previewTimeEstimateEl.innerHTML = `${daysUntilTarget} hari <br><small style="color: #ef4444;">⚠️ Target terlalu ambisius</small>`;
                }
            } else {
                if (previewTimeEstimateEl) {
                    previewTimeEstimateEl.innerHTML = `${daysUntilTarget} hari <br><small style="color: #10b981;">✅ Target realistis</small>`;
                }
            }
        }
    }
}

function saveSavingsGoal() {
    const name = document.getElementById('goalName').value.trim();
    const amount = parseInt(document.getElementById('goalAmount').value);
    const category = document.getElementById('goalCategory').value;
    const targetDate = document.getElementById('goalTargetDate').value;
    
    // Validation
    if (!name) {
        showToast('Nama target tidak boleh kosong', 'error');
        return;
    }
    
    if (name.length < 3) {
        showToast('Nama target minimal 3 karakter', 'error');
        return;
    }
    
    if (!amount || amount < 10000) {
        showToast('Jumlah target minimal Rp 10,000', 'error');
        return;
    }
    
    if (amount > 1000000000) { // 1 billion
        showToast('Jumlah target maksimal Rp 1,000,000,000', 'error');
        return;
    }
    
    // Check for duplicate names
    if (savingsGoals.some(goal => goal.title.toLowerCase() === name.toLowerCase())) {
        showToast('Nama target sudah ada', 'error');
        return;
    }
    
    // Create new goal
    const newGoal = {
        id: Date.now(),
        title: name,
        target: amount,
        category: category,
        progress: 0,
        completed: false,
        createdDate: new Date().toISOString(),
        targetDate: targetDate || null
    };
    
    savingsGoals.push(newGoal);
    saveSavingsData();
    updateSavingsDisplay();
    closeAddSavingsGoal();
    
    showToast(`Target "${name}" berhasil ditambahkan!`, 'success');
    
    // Show motivation message
    setTimeout(() => {
        const dailySavings = calculateDailyCost();
        const remainingAmount = Math.max(amount - userData.totalSavings, 0);
        const daysNeeded = Math.ceil(remainingAmount / dailySavings);
        showToast(`💪 Dengan hemat ${formatCurrency(dailySavings)}/hari, target ini bisa tercapai dalam ${daysNeeded} hari!`, 'info');
    }, 2000);
    
    console.log('✅ New savings goal saved:', newGoal);
}

function showGoalDetail(goal) {
    const modal = document.getElementById('goalDetailModal');
    if (!modal) return;
    
    selectedGoalId = goal.id;
    
    const percentage = Math.min(Math.round((userData.totalSavings / goal.target) * 100), 100);
    const saved = Math.min(userData.totalSavings, goal.target);
    const remaining = Math.max(goal.target - userData.totalSavings, 0);
    const dailySavings = calculateDailyCost();
    const daysToComplete = remaining > 0 ? Math.ceil(remaining / dailySavings) : 0;
    
    // Update modal title
    document.getElementById('goalDetailTitle').textContent = goal.title;
    
    // Create detail content
    const content = document.getElementById('goalDetailContent');
    content.innerHTML = `
        <div class="goal-detail-header">
            <div class="goal-detail-icon">${categoryIcons[goal.category] || '📦'}</div>
            <div class="goal-detail-info">
                <h4>${goal.title}</h4>
                <p class="goal-detail-category">${capitalizeFirst(goal.category)}</p>
            </div>
            <div class="goal-detail-amount">${formatCurrency(goal.target)}</div>
        </div>
        
        <div class="goal-detail-progress">
            <div class="progress-header">
                <span>Progress</span>
                <span class="progress-percentage">${percentage}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        </div>
        
        <div class="goal-detail-stats">
            <div class="stat-row">
                <span class="stat-label">💰 Tersimpan:</span>
                <span class="stat-value">${formatCurrency(saved)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">📋 Sisa target:</span>
                <span class="stat-value">${formatCurrency(remaining)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">📅 Estimasi waktu:</span>
                <span class="stat-value">${daysToComplete > 0 ? `${daysToComplete} hari` : 'Target tercapai!'}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">📊 Hemat per hari:</span>
                <span class="stat-value">${formatCurrency(dailySavings)}</span>
            </div>
        </div>
        
        ${goal.targetDate ? `
            <div class="goal-target-date">
                <span class="target-date-label">🗓️ Target tanggal:</span>
                <span class="target-date-value">${formatDate(goal.targetDate)}</span>
            </div>
        ` : ''}
        
        <div class="goal-created-date">
            <small>Dibuat pada: ${formatDate(goal.createdDate)}</small>
        </div>
    `;
    
    modal.classList.add('show');
    console.log('📊 Goal detail shown for:', goal.title);
}

function closeGoalDetail() {
    const modal = document.getElementById('goalDetailModal');
    if (modal) {
        modal.classList.remove('show');
        selectedGoalId = null;
    }
}

function deleteGoal() {
    if (!selectedGoalId) return;
    
    const goal = savingsGoals.find(g => g.id === selectedGoalId);
    if (!goal) return;
    
    if (confirm(`Yakin ingin menghapus target "${goal.title}"?`)) {
        savingsGoals = savingsGoals.filter(g => g.id !== selectedGoalId);
        saveSavingsData();
        updateSavingsDisplay();
        closeGoalDetail();
        showToast(`Target "${goal.title}" berhasil dihapus`, 'success');
        console.log('🗑️ Goal deleted:', goal.title);
    }
}

// ===========================================
// EXISTING TARGET FUNCTIONS (Enhanced)
// ===========================================

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
            closeAddSavingsGoal();
            closeGoalDetail();
        }
    });

    // Set default start date to today
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // NEW: Modal backdrop clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
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
    
    // NEW: Update user start date for savings calculation
    if (!userData.startDate) {
        userData.startDate = startDate;
        saveSavingsData();
        calculateCurrentSavings();
        updateSavingsDisplay();
    }
    
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
    
    // NEW: Update savings when calendar changes
    calculateCurrentSavings();
    updateSavingsDisplay();
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
        showToast('Hari ditandai sebagai "tergoda"', 'warning');
    } else if (calendarData[dateKey].failed) {
        delete calendarData[dateKey];
        showToast('Penandaan hari dihapus', 'info');
    } else {
        calendarData[dateKey].success = true;
        calendarData[dateKey].failed = false;
        showToast('Hari ditandai sebagai "sukses"!', 'success');
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

// ===========================================
// UTILITY FUNCTIONS (Enhanced)
// ===========================================

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

function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}K`;
    } else {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function animateValue(element, start, end, duration, formatter = null) {
    if (!element) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        
        if (formatter) {
            element.textContent = formatter(current);
        } else {
            element.textContent = current;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
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
    
    console.log(`🍞 Toast: ${type} - ${message}`);
}

function showAchievementPopup(icon, title, message) {
    // Create achievement popup element
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-title">${title}</div>
            <div class="achievement-message">${message}</div>
        </div>
    `;
    
    // Add styles
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 24px;
        border-radius: 16px;
        text-align: center;
        z-index: 10002;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        font-family: inherit;
    `;
    
    // Add achievement content styles
    const style = document.createElement('style');
    style.textContent = `
        .achievement-icon {
            font-size: 3rem;
            margin-bottom: 12px;
            animation: achievementBounce 0.6s ease-out;
        }
        .achievement-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .achievement-message {
            font-size: 0.9rem;
            opacity: 0.9;
            line-height: 1.4;
        }
        @keyframes achievementBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(popup);
    
    // Animate in
    setTimeout(() => {
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        popup.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 300);
    }, 3000);
}

// ===========================================
// DATA EXPORT/IMPORT FUNCTIONS
// ===========================================

function exportData() {
    const data = {
        target: currentTarget,
        calendar: calendarData,
        savingsGoals: savingsGoals, // NEW
        userData: userData, // NEW
        reflections: {},
        moods: {},
        strategies: {},
        temptations: {},
        exportDate: new Date().toISOString(),
        version: '2.1'
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
    a.download = `puffoff_target_data_${new Date().toISOString().split('T')[0]}.json`;
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
            
            // NEW: Import savings goals and user data
            if (data.savingsGoals) {
                savingsGoals = data.savingsGoals;
                localStorage.setItem('puffoff_savings_goals', JSON.stringify(savingsGoals));
            }
            
            if (data.userData) {
                userData = { ...userData, ...data.userData };
                localStorage.setItem('puffoff_user_data', JSON.stringify(userData));
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
            
            // Refresh displays
            updateTargetDisplay();
            updateSavingsDisplay();
            renderCalendar();
            loadReflectionHistory();
            
            showToast('Data berhasil diimpor!', 'success');
            setTimeout(() => {
                location.reload();
            }, 1000);
            
        } catch (error) {
            showToast('Error: File tidak valid!', 'error');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}

// ===========================================
// ANALYTICS AND INSIGHTS
// ===========================================

function generateInsights() {
    const insights = {
        totalDays: 0,
        successDays: 0,
        failedDays: 0,
        averageMood: 0,
        mostUsedStrategy: '',
        longestStreak: 0,
        currentStreak: 0,
        totalSaved: userData.totalSavings,
        goalsProgress: savingsGoals.length > 0 ? savingsGoals.map(goal => ({
            name: goal.title,
            progress: Math.min(Math.round((userData.totalSavings / goal.target) * 100), 100)
        })) : []
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

// ===========================================
// MOTIVATIONAL FEATURES
// ===========================================

function getMotivationalQuote() {
    const quotes = [
        {
            text: "Setiap hari tanpa rokok adalah investasi untuk masa depan yang lebih sehat.",
            author: "PuffOff Team"
        },
        {
            text: "Target penghematan Anda menunjukkan kekuatan untuk mengubah kebiasaan menjadi kemajuan.",
            author: "PuffOff Team"
        },
        {
            text: "Uang yang tidak dihabiskan untuk rokok adalah uang yang diinvestasikan untuk mimpi Anda.",
            author: "PuffOff Team"
        },
        {
            text: "Kesuksesan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.",
            author: "Colin Powell"
        },
        {
            text: "Jangan menyerah pada sesuatu yang benar-benar kamu inginkan. Sulit menunggu, tapi menyesal lebih sulit.",
            author: "Unknown"
        }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// ===========================================
// NOTIFICATION SYSTEM
// ===========================================

function scheduleNotifications() {
    const notifications = [
        {
            time: '08:00',
            message: '🌅 Selamat pagi! Mulai hari dengan semangat bebas rokok dan raih target penghematan!',
            type: 'motivation'
        },
        {
            time: '12:00',
            message: '🌞 Sudah setengah hari tanpa rokok! Tabungan Anda bertambah!',
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

// ===========================================
// GAMIFICATION ELEMENTS
// ===========================================

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
        'first_goal': {
            name: 'Target Pertama',
            description: 'Membuat target penghematan pertama',
            icon: '💰',
            unlocked: false
        },
        'goal_achiever': {
            name: 'Pencapai Target',
            description: 'Berhasil mencapai target penghematan pertama',
            icon: '🎉',
            unlocked: false
        },
        'reflection_master': {
            name: 'Master Refleksi',
            description: 'Menulis refleksi harian selama 30 hari',
            icon: '📝',
            unlocked: false
        },
        'savings_hero': {
            name: 'Pahlawan Hemat',
            description: 'Menghemat lebih dari Rp 1,000,000',
            icon: '💎',
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
    
    if (savingsGoals.length > 0) {
        achievements.first_goal.unlocked = true;
    }
    
    if (savingsGoals.some(goal => goal.completed)) {
        achievements.goal_achiever.unlocked = true;
    }
    
    if (userData.totalSavings >= 1000000) {
        achievements.savings_hero.unlocked = true;
    }
    
    // Save achievements
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    return achievements;
}

// ===========================================
// ENHANCED FEATURES INITIALIZATION
// ===========================================

function initializeEnhancedFeatures() {
    scheduleNotifications();
    updateAchievements();
    
    // Auto-save data every 30 seconds
    setInterval(() => {
        saveSavingsData();
        if (currentTarget) {
            localStorage.setItem('currentTarget', JSON.stringify(currentTarget));
        }
        localStorage.setItem('calendarData', JSON.stringify(calendarData));
    }, 30000);
    
    // Update savings calculation every minute
    setInterval(() => {
        calculateCurrentSavings();
        updateSavingsDisplay();
    }, 60000);
    
    // Check for achievements periodically
    setInterval(() => {
        checkForNewAchievements();
    }, 10000);
    
    console.log('🚀 Enhanced features initialized');
}

function checkForNewAchievements() {
    const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '{}');
    const newAchievements = updateAchievements();
    
    // Check for newly unlocked achievements
    Object.keys(newAchievements).forEach(key => {
        if (newAchievements[key].unlocked && !currentAchievements[key]?.unlocked) {
            showAchievementPopup(
                newAchievements[key].icon,
                newAchievements[key].name,
                newAchievements[key].description
            );
        }
    });
}

// ===========================================
// CSS INJECTION FOR NEW STYLES
// ===========================================

function injectAdditionalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .no-goals-message {
            text-align: center;
            padding: 40px 20px;
            color: #6b7280;
        }
        
        .no-goals-icon {
            font-size: 3rem;
            margin-bottom: 16px;
        }
        
        .no-goals-message h4 {
            color: #374151;
            margin-bottom: 8px;
        }
        
        .goal-detail-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
        }
        
        .goal-detail-icon {
            font-size: 2rem;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            color: white;
        }
        
        .goal-detail-info h4 {
            color: #1f2937;
            margin-bottom: 4px;
        }
        
        .goal-detail-category {
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .goal-detail-amount {
            font-size: 1.2rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .goal-detail-progress {
            margin-bottom: 20px;
        }
        
        .goal-detail-stats {
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 20px;
        }
        
        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .stat-row:last-child {
            border-bottom: none;
        }
        
        .stat-label {
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        .stat-value {
            color: #1f2937;
            font-weight: 600;
        }
        
        .goal-target-date {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #fef3e2;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        .target-date-label {
            color: #d97706;
            font-weight: 500;
        }
        
        .target-date-value {
            color: #92400e;
            font-weight: 600;
        }
        
        .goal-created-date {
            text-align: center;
            color: #9ca3af;
            font-size: 0.8rem;
        }
    `;
    document.head.appendChild(style);
}

// ===========================================
// INITIALIZE ON LOAD
// ===========================================

// Call enhanced features initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedFeatures();
    injectAdditionalStyles();
});

console.log('📱 PuffOff Enhanced Target JavaScript loaded successfully!');
