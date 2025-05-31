// PuffOff Chatbot - Always Online Version
// Enhanced with multiple fallback layers and optimized API calls

// Configuration for Always Online
const API_CONFIG = {
    baseUrl: 'https://puffoff-api.vercel.app',
    endpoint: '/api/chat',
    timeout: 15000, // Reduced timeout for faster fallback
    maxRetries: 1, // Reduced retries for faster response
    keepAliveInterval: 60000, // Keep connection alive every 1 minute
    healthCheckInterval: 30000 // Check health every 30 seconds
};

// Global variables
let conversationHistory = [];
let isTyping = false;
let chatMessages, chatInput, sendBtn, scrollBtn;
let isVoiceRecording = false;
let hasUserInteracted = false;
let audioContext = null;
let keepAliveTimer;
let healthCheckTimer;

// Enhanced API status tracking
let apiHealthStatus = {
    isHealthy: true,
    lastCheck: null,
    consecutiveFailures: 0,
    lastSuccessfulResponse: null,
    totalRequests: 0,
    successfulRequests: 0
};

let settings = {
    autoScroll: true,
    soundEnabled: true,
    showTimestamps: true,
    chatTheme: 'light',
    alwaysOnlineMode: true,
    aggressiveFallback: true
};

// Initialize marked for markdown parsing
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false
    });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PuffOff Chatbot - Always Online Mode Starting');
    initializeApp();
});

function initializeApp() {
    console.log('⚙️ Initializing Always Online Chatbot...');
    
    // Get DOM elements
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    sendBtn = document.getElementById('sendBtn');
    scrollBtn = document.getElementById('scrollToBottom');
    
    if (!chatMessages || !chatInput || !sendBtn) {
        console.error('❌ Critical elements missing!');
        // Force fallback mode immediately
        settings.alwaysOnlineMode = false;
        showToast('Mode offline aktif - tetap bisa digunakan!', 'warning');
    }
    
    // Load settings and conversation history
    loadSettings();
    loadConversationHistory();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize Always Online features
    initializeAlwaysOnlineMode();
    
    // Focus on input
    if (chatInput) {
        chatInput.focus();
        chatInput.placeholder = 'Ketik pesan... (Always Online Mode)';
    }
    
    // Show welcome message if no conversation history
    if (conversationHistory.length === 0) {
        setTimeout(function() {
            showWelcomeMessage();
        }, 800);
    }
    
    console.log('✅ Always Online Chatbot ready!');
}

function initializeAlwaysOnlineMode() {
    console.log('🌐 Initializing Always Online features...');
    
    // Set initial status as connecting
    updateConnectionStatus('connecting');
    
    // Start immediate health check
    setTimeout(function() {
        performHealthCheck();
    }, 1000);
    
    // Start keep-alive system
    startKeepAliveSystem();
    
    // Start continuous health monitoring
    startContinuousHealthMonitoring();
    
    // Pre-warm API connection
    preWarmConnection();
    
    console.log('🌐 Always Online features activated');
}

function startKeepAliveSystem() {
    // Send lightweight ping every minute to keep connection warm
    keepAliveTimer = setInterval(function() {
        if (apiHealthStatus.isHealthy) {
            performKeepAlivePing();
        }
    }, API_CONFIG.keepAliveInterval);
    
    console.log('💓 Keep-alive system started');
}

function startContinuousHealthMonitoring() {
    // Check API health every 30 seconds
    healthCheckTimer = setInterval(function() {
        performHealthCheck();
    }, API_CONFIG.healthCheckInterval);
    
    console.log('🔍 Continuous health monitoring started');
}

async function performKeepAlivePing() {
    try {
        const controller = new AbortController();
        setTimeout(function() {
            controller.abort();
        }, 5000); // Short timeout for ping
        
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'ping'
            }),
            signal: controller.signal
        });
        
        if (response.ok) {
            console.log('💓 Keep-alive ping successful');
            apiHealthStatus.lastSuccessfulResponse = new Date();
            if (!apiHealthStatus.isHealthy) {
                apiHealthStatus.isHealthy = true;
                apiHealthStatus.consecutiveFailures = 0;
                updateConnectionStatus('online');
                showToast('🟢 AI kembali online!', 'success');
            }
        }
    } catch (error) {
        console.log('💓 Keep-alive ping failed:', error.message);
        // Don't mark as unhealthy for ping failures alone
    }
}

async function performHealthCheck() {
    try {
        apiHealthStatus.totalRequests++;
        
        const controller = new AbortController();
        setTimeout(function() {
            controller.abort();
        }, 8000);
        
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'health'
            }),
            signal: controller.signal
        });
        
        if (response.ok) {
            apiHealthStatus.isHealthy = true;
            apiHealthStatus.consecutiveFailures = 0;
            apiHealthStatus.successfulRequests++;
            apiHealthStatus.lastSuccessfulResponse = new Date();
            updateConnectionStatus('online');
            console.log('✅ Health check passed');
            return true;
        } else {
            throw new Error('Health check failed: ' + response.status);
        }
        
    } catch (error) {
        apiHealthStatus.consecutiveFailures++;
        console.log('⚠️ Health check failed:', error.message);
        
        // Mark as unhealthy after 2 consecutive failures
        if (apiHealthStatus.consecutiveFailures >= 2) {
            apiHealthStatus.isHealthy = false;
            updateConnectionStatus('offline');
        }
        return false;
    } finally {
        apiHealthStatus.lastCheck = new Date();
    }
}

function preWarmConnection() {
    // Pre-warm the API connection with a lightweight request
    setTimeout(function() {
        console.log('🔥 Pre-warming API connection...');
        performKeepAlivePing();
    }, 2000);
}

function setupEventListeners() {
    // Send button click handler
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            markUserInteraction();
            handleSendMessage();
        });
    }
    
    // Input event handlers
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            markUserInteraction();
            autoResizeTextarea();
            updateSendButtonState();
        });
        
        chatInput.addEventListener('keypress', function(e) {
            markUserInteraction();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
        
        chatInput.addEventListener('focus', markUserInteraction);
        chatInput.addEventListener('click', markUserInteraction);
    }
    
    // Prompt chip handlers
    setupPromptChips();
    setupScrollDetection();
    setupKeyboardShortcuts();
    setupSettingsListeners();
}

function setupPromptChips() {
    const promptChips = document.querySelectorAll('.prompt-chip');
    
    promptChips.forEach(function(chip, index) {
        chip.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            markUserInteraction();
            
            if (chatInput && message) {
                chatInput.value = message;
                autoResizeTextarea();
                updateSendButtonState();
                handleSendMessage();
            }
        });
    });
}

function markUserInteraction() {
    if (!hasUserInteracted) {
        hasUserInteracted = true;
        initAudioContext();
    }
}

function initAudioContext() {
    if (!audioContext && hasUserInteracted) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Could not initialize audio context:', error);
        }
    }
}

function updateSendButtonState() {
    if (sendBtn && chatInput) {
        const hasValue = chatInput.value.trim().length > 0;
        sendBtn.disabled = !hasValue || isTyping;
    }
}

function updateConnectionStatus(status) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('connectionStatus');
    const apiStatusText = document.getElementById('apiStatusText');
    
    if (statusDot) {
        statusDot.className = 'status-dot ' + status;
    }
    
    let displayText;
    switch(status) {
        case 'online':
            displayText = 'Online - Always Ready';
            break;
        case 'offline':
            displayText = 'Backup Mode - Ready';
            break;
        case 'connecting':
            displayText = 'Connecting...';
            break;
        default:
            displayText = 'Ready';
    }
    
    if (statusText) {
        statusText.textContent = displayText;
    }
    
    if (apiStatusText) {
        apiStatusText.className = 'status-text ' + status;
        apiStatusText.textContent = displayText;
    }
}

// Enhanced message sending with always online guarantee
async function handleSendMessage() {
    if (!chatInput || !chatMessages || !sendBtn) {
        // Force offline mode but still work
        addMessage('Mode offline aktif - tetap bisa digunakan!', false);
        return;
    }
    
    const message = chatInput.value.trim();
    
    if (!message) {
        showToast('Silakan ketik pesan', 'warning');
        chatInput.focus();
        return;
    }
    
    if (isTyping) {
        showToast('Sedang memproses...', 'info');
        return;
    }
    
    try {
        isTyping = true;
        sendBtn.disabled = true;
        
        // Add user message immediately
        addMessage(message, true);
        
        // Clear input
        chatInput.value = '';
        autoResizeTextarea();
        updateSendButtonState();
        
        // Hide suggested prompts after first message
        const suggestedPrompts = document.getElementById('suggestedPrompts');
        if (suggestedPrompts && conversationHistory.filter(function(msg) { return msg.isUser; }).length === 1) {
            suggestedPrompts.style.display = 'none';
        }
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get response with always online guarantee
        const botResponse = await getBotResponseAlwaysOnline(message);
        
        hideTypingIndicator();
        addMessage(botResponse, false, true);
        
        // Save conversation
        saveConversationHistory();
        
    } catch (error) {
        console.error('Error in handleSendMessage:', error);
        hideTypingIndicator();
        
        // Emergency fallback - always works
        const emergency = getEmergencyResponse();
        addMessage(emergency, false);
    }
    
    // Reset state
    isTyping = false;
    sendBtn.disabled = false;
    updateSendButtonState();
    chatInput.focus();
}

// Enhanced getBotResponse with Always Online guarantee
async function getBotResponseAlwaysOnline(userMessage) {
    console.log('🤖 Getting response with Always Online guarantee...');
    
    // Strategy 1: Try API if healthy
    if (apiHealthStatus.isHealthy || apiHealthStatus.consecutiveFailures < 3) {
        try {
            const apiResponse = await callVercelAPIOptimized(userMessage);
            if (apiResponse && apiResponse.trim()) {
                apiHealthStatus.successfulRequests++;
                updateConnectionStatus('online');
                showToast('🤖 AI response ready!', 'success');
                return apiResponse;
            }
        } catch (error) {
            console.log('API attempt failed:', error.message);
            apiHealthStatus.consecutiveFailures++;
        }
    }
    
    // Strategy 2: Always fallback to local - GUARANTEED TO WORK
    console.log('🔄 Using local AI backup - always works!');
    updateConnectionStatus('offline');
    return getFallbackResponseEnhanced(userMessage);
}

// Optimized API call for Always Online
async function callVercelAPIOptimized(userMessage) {
    console.log('📡 Optimized API call...');
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(function() {
            controller.abort();
        }, API_CONFIG.timeout);
        
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({
                message: userMessage
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        
        const data = await response.json();
        
        if (data.reply && data.reply.trim()) {
            // Log model info
            if (data.model) {
                console.log('🎯 Model used: ' + data.model);
                showAPIStatus(data.modelType, data.model);
            }
            
            return data.reply.trim();
        } else {
            throw new Error('Empty response');
        }
        
    } catch (error) {
        throw error;
    }
}

function showAPIStatus(modelType, modelName) {
    // Show brief status indicator
    let statusIndicator = document.querySelector('.api-status');
    if (!statusIndicator) {
        statusIndicator = document.createElement('div');
        statusIndicator.className = 'api-status';
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.appendChild(statusIndicator);
        }
    }
    
    statusIndicator.className = 'api-status ' + (modelType || 'free');
    
    const statusText = modelType === 'free' ? '🆓 Free AI' : 
                      modelType === 'paid' ? '💎 Premium AI' : 
                      '🤖 Backup AI';
    
    statusIndicator.textContent = statusText;
    
    // Auto-hide after 2 seconds
    setTimeout(function() {
        if (statusIndicator) {
            statusIndicator.style.opacity = '0';
            setTimeout(function() {
                if (statusIndicator && statusIndicator.parentNode) {
                    statusIndicator.parentNode.removeChild(statusIndicator);
                }
            }, 300);
        }
    }, 2000);
}

// Enhanced fallback responses - ALWAYS WORKS
function getFallbackResponseEnhanced(userMessage) {
    console.log('🔄 Enhanced fallback processing...');
    
    if (!userMessage || typeof userMessage !== 'string') {
        userMessage = 'halo';
    }
    
    const message = userMessage.toLowerCase().trim();
    
    // Comprehensive response matching
    if (message.indexOf('halo') !== -1 || message.indexOf('hai') !== -1 || 
        message.indexOf('hello') !== -1 || message.indexOf('hi') !== -1 ||
        message.indexOf('ping') !== -1 || message.indexOf('health') !== -1) {
        return getWelcomeResponse();
    }
    
    if (message.indexOf('keinginan') !== -1 || message.indexOf('craving') !== -1 || 
        message.indexOf('ingin merokok') !== -1 || message.indexOf('pengen rokok') !== -1) {
        return getCravingResponse();
    }
    
    if (message.indexOf('stress') !== -1 || message.indexOf('cemas') !== -1 || 
        message.indexOf('tegang') !== -1 || message.indexOf('gelisah') !== -1) {
        return getStressResponse();
    }
    
    if (message.indexOf('manfaat') !== -1 || message.indexOf('kesehatan') !== -1 || 
        message.indexOf('alasan') !== -1) {
        return getHealthBenefitsResponse();
    }
    
    if (message.indexOf('motivasi') !== -1 || message.indexOf('semangat') !== -1 || 
        message.indexOf('susah') !== -1 || message.indexOf('sulit') !== -1) {
        return getMotivationResponse();
    }
    
    if (message.indexOf('uang') !== -1 || message.indexOf('hemat') !== -1 || 
        message.indexOf('penghematan') !== -1 || message.indexOf('hitung') !== -1) {
        return getMoneyResponse();
    }
    
    // Default intelligent response
    return getGeneralResponse();
}

function getWelcomeResponse() {
    return `# Halo! PuffBot Always Online! 👋

Senang bertemu denganmu! Saya **selalu siap** membantu perjalanan bebas rokok kamu.

## Mode Always Online Aktif 🌐
- ✅ **Response Guaranteed** - Selalu dapat jawaban
- ⚡ **Fast Response** - Dalam hitungan detik  
- 🔄 **Smart Fallback** - Backup system ready
- 💪 **Never Offline** - 24/7 ready to help

## Yang bisa saya bantu:
- 🚫 Tips mengatasi keinginan merokok
- ❤️ Informasi kesehatan dan manfaat
- 💪 Motivasi harian yang kuat
- 💰 Perhitungan penghematan uang
- 🧘 Teknik mengelola stress

[TIP]Saya selalu online dan siap membantu! Coba tanyakan apapun tentang berhenti merokok![/TIP]

**Apa yang ingin kamu ketahui hari ini?** 😊`;
}

function getCravingResponse() {
    return `# Tips Ampuh Mengatasi Keinginan Merokok! 🚫

Keinginan merokok datang? **JANGAN PANIK!** Saya punya solusi yang terbukti efektif!

[TIP]Ingat: Keinginan merokok hanya bertahan 3-5 menit. Kamu lebih kuat dari itu![/TIP]

## 🔥 **Teknik INSTANT (30 detik - 2 menit):**
- **Teknik 4-7-8**: Tarik napas 4 detik → Tahan 7 detik → Hembuskan 8 detik
- **Cold Water Shock**: Cuci muka/leher dengan air dingin
- **Bite & Chew**: Gigit jeruk, apel, atau es batu
- **Move Your Body**: 10 jumping jacks atau push up

## ⚡ **Pengalihan Cepat (2-10 menit):**
- 📱 **Video Lucu**: Buka YouTube, TikTok, atau Instagram
- 🎵 **Music Therapy**: Playlist energik atau calming
- 🎮 **Quick Game**: Mobile game favorit
- 💬 **Text Someone**: Chat teman atau keluarga
- 🚶‍♂️ **Walk Around**: Keliling rumah atau kantor

## 💪 **Power Mindset:**
> "Setiap detik yang aku tahan, aku semakin kuat!"
> "Tubuhku sedang healing, aku tidak akan merusaknya!"

[MOTIVATION]Kamu sudah berhasil mengatasi keinginan sebelumnya. Kamu PASTI bisa lagi! 💪[/MOTIVATION]

**Coba salah satu teknik di atas SEKARANG JUGA!**`;
}

function getStressResponse() {
    return `# Kelola Stress Tanpa Rokok - Always Works! 🧘

Stress datang? **NORMAL!** Yang penting cara mengatasinya yang sehat!

[HEALTH]Rokok tidak mengatasi stress, hanya menambah masalah. Mari gunakan cara yang benar-benar efektif![/HEALTH]

## 🔥 **Anti-Stress Emergency Kit:**

### **Level 1 - Quick Relief (1-3 menit):**
- **Box Breathing**: 4 detik masuk → 4 detik tahan → 4 detik keluar → 4 detik tahan
- **Cold Therapy**: Es di pergelangan tangan atau leher
- **Grounding 5-4-3-2-1**: 5 yang dilihat, 4 yang diraba, 3 yang didengar, 2 yang dicium, 1 yang dirasa

### **Level 2 - Medium Relief (5-15 menit):**
- 🎵 **Music Healing**: Playlist chill atau nature sounds
- ✍️ **Brain Dump**: Tulis semua yang bikin stress di kertas/notes
- 🚶‍♂️ **Walk & Talk**: Jalan sambil telefon teman
- 🛁 **Self Care**: Cuci muka, sikat gigi, atau skincare

### **Level 3 - Deep Relief (15+ menit):**
- 🧘 **Meditation**: Headspace, Calm, atau YouTube guided meditation
- 📚 **Learn Something**: Kursus online, podcast, atau artikel menarik
- 🎨 **Creative Outlet**: Gambar, nulis, atau craft
- 💪 **Physical Release**: Workout, yoga, atau stretching

## 🏆 **Stress vs Smoke Tracker:**
- **Stress + Rokok** = Masalah bertambah + Kesehatan rusak
- **Stress + Healthy Coping** = Masalah teratasi + Skill bertambah

[TIP]Simpan list ini di HP! Next time stress datang, langsung buka dan pilih satu teknik![/TIP]

**Kamu lebih kuat dari stress! 💪**`;
}

function getHealthBenefitsResponse() {
    return `# Timeline Ajaib Pemulihan Tubuh! ❤️

Setiap detik tanpa rokok = HEALING PROCESS! Ini buktinya:

[HEALTH]Tubuhmu adalah mesin self-healing yang luar biasa. Mari lihat keajaibannya![/HEALTH]

## 🕐 **Real-Time Recovery Timeline:**

### **20 MENIT** ⏱️
- ❤️ Detak jantung normal
- 🩸 Tekanan darah turun
- 🌡️ Suhu tangan & kaki naik (sirkulasi membaik)

### **8 JAM** ⏰
- 💨 Kadar nikotin turun 93%
- 🫁 Oksigen dalam darah naik
- ⚡ Energi mulai meningkat

### **24 JAM** 📅
- 💀 Karbon monoksida HILANG dari darah
- 🫀 Risiko serangan jantung mulai turun
- 👃 Penciuman mulai membaik

### **48 JAM** 📅📅
- 👅 Taste buds regenerasi - makanan lebih enak!
- 👃 Smell sense kembali normal
- 🦷 Nafas lebih segar

### **3 HARI** 📅📅📅
- 🫁 Fungsi paru meningkat 30%
- 🏃‍♂️ Stamina naik drastis
- 😴 Tidur lebih nyenyak

### **1 MINGGU** 📅x7
- 🧠 Mental clarity meningkat
- 😊 Mood lebih stabil
- 💰 Hemat Rp 175.000!

### **1 BULAN** 📅x30
- 🦷 Gigi lebih putih
- 👶 Kulit lebih bersih & muda
- 💰 Hemat Rp 750.000!

### **1 TAHUN** 📅x365
- ❤️ Risiko penyakit jantung turun 50%
- 🫁 Risiko kanker paru turun drastis
- 💰 Hemat Rp 9.125.000!

[SUCCESS]Setiap hari tanpa rokok = INVESTASI TERBAIK untuk masa depanmu! 🌟[/SUCCESS]

**Tubuhmu sedang berterima kasih sekarang juga!**`;
}

function getMotivationResponse() {
    return `# Power Motivation - Kamu UNSTOPPABLE! 💪

Merasa down? **WAJAR!** Tapi ingat, WINNERS never quit!

[MOTIVATION]Kamu sudah memilih jalan yang tidak mudah, tapi itulah yang membuat kamu SPECIAL! 🌟[/MOTIVATION]

## 🔥 **Daily Motivation Booster:**

### **🏆 Achievement Unlocked:**
- ✅ Kamu sudah membuat keputusan TERBAIK dalam hidup
- ✅ Setiap detik tanpa rokok = LEVEL UP!
- ✅ Kamu inspirasi untuk orang lain
- ✅ Future you akan berterima kasih

### **💎 Power Quotes for Warriors:**
> *"Champions tidak dibuat di gym. Champions dibuat dari sesuatu yang dalam - desire, dream, vision!"*

> *"Kamu tidak berhenti merokok karena mudah. Kamu berhenti karena WORTH IT!"*

> *"Every craving you defeat makes you STRONGER than yesterday!"*

### **🎯 Why You're AWESOME:**
- 🧠 **Mental Strength**: Mengalahkan addiction = mental warrior
- ❤️ **Self Love**: Memilih kesehatan = love yourself
- 🌟 **Role Model**: Inspirasi untuk keluarga & teman
- 💰 **Smart Financial**: Invest in future, not cigarettes
- 🌍 **Planet Hero**: Saving environment from cigarette waste

### **🚀 Momentum Builders:**
- **Morning Mantra**: "Today I choose HEALTH over HABIT!"
- **Craving Crusher**: "This too shall pass, I am STRONGER!"
- **Evening Gratitude**: "Thank you body for healing today!"

## 📱 **Action Plan - DO THIS NOW:**
1. **Screenshot** motivational quote favoritmu
2. **Set alarm** dengan reminder "YOU'RE AMAZING!"
3. **Text someone** yang support journey-mu
4. **Reward yourself** - treat yourself something nice!

[TIP]Setiap kali craving datang, baca ulang ini! Simpan di bookmark! 📌[/TIP]

**Kamu tidak sendirian dalam journey ini. WE BELIEVE IN YOU! 🙌**`;
}

function getMoneyResponse() {
    return `# Money Saved = Dreams Achieved! 💰

Siap-siap terkejut dengan angka FANTASTIS ini!

[SUCCESS]Setiap hari tanpa rokok = UANG MASUK TABUNGAN! Mari hitung wealth-mu! 💎[/SUCCESS]

## 💸 **Money Freedom Calculator:**

### **📊 Asumsi Realistic:**
- **Harga rokok**: Rp 25.000/bungkus (2024)
- **Konsumsi**: 1 bungkus/hari (standard)
- **Daily cost**: Rp 25.000

### **🎯 Savings Breakdown:**
- **1 hari**: Rp 25.000 (satu nasi padang enak!)
- **1 minggu**: Rp 175.000 (shopping kecil!)
- **2 minggu**: Rp 350.000 (skincare set!)
- **1 bulan**: Rp 750.000 (gadget baru!)
- **3 bulan**: Rp 2.250.000 (motorcycle down payment!)
- **6 bulan**: Rp 4.500.000 (laptop gaming!)
- **1 tahun**: Rp 9.125.000 (motor second/vacation abroad!)
- **2 tahun**: Rp 18.250.000 (mobil down payment!)
- **5 tahun**: Rp 45.625.000 (investasi property!) 🏠

### **🚀 Dream Investment Options:**

#### **💎 Option A - Conservative:**
- **Deposito 6%**: Rp 750k/bulan × 12 = Rp 9.5 juta/tahun + bunga
- **Emas**: Hedging inflation + appreciate value
- **Reksadana**: Professional managed investment

#### **📈 Option B - Growth:**
- **Saham Blue Chip**: Dividend income + capital gain
- **Crypto**: High risk high reward (DYOR!)
- **Business Capital**: Start your own business

#### **🎓 Option C - Self Investment:**
- **Online Course**: Skill upgrade = salary upgrade
- **Certification**: Professional development
- **Gym Membership**: Health = wealth

#### **✈️ Option D - Experience:**
- **Travel Fund**: Rp 750k/bulan = 1 trip abroad/year
- **Hobby**: Professional equipment for passion
- **Family Time**: Quality experiences with loved ones

## 🏆 **Wealth Mindset Shift:**
- **Before**: Rp 25k → SMOKE → GONE (+ health problem)
- **After**: Rp 25k → INVEST → COMPOUND → WEALTH (+ health bonus)

[
