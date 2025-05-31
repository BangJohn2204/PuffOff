// PuffOff Chatbot - Simple Always Online Version
// Guaranteed to work without syntax errors

// Configuration
var API_CONFIG = {
    baseUrl: 'https://puffoff-api.vercel.app',
    endpoint: '/api/chat',
    timeout: 15000,
    maxRetries: 1
};

// Global variables
var conversationHistory = [];
var isTyping = false;
var chatMessages, chatInput, sendBtn, scrollBtn;
var hasUserInteracted = false;
var audioContext = null;

var settings = {
    autoScroll: true,
    soundEnabled: true,
    showTimestamps: true,
    chatTheme: 'light'
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 PuffOff Always Online - Starting...');
    initializeApp();
});

function initializeApp() {
    console.log('⚙️ Initializing chatbot...');
    
    // Get elements
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    sendBtn = document.getElementById('sendBtn');
    scrollBtn = document.getElementById('scrollToBottom');
    
    if (!chatMessages || !chatInput || !sendBtn) {
        console.error('❌ Missing elements!');
        return;
    }
    
    // Setup
    loadSettings();
    loadConversationHistory();
    setupEventListeners();
    
    // Start monitoring
    setTimeout(function() {
        checkAPIHealth();
    }, 2000);
    
    // Focus input
    if (chatInput) {
        chatInput.focus();
        chatInput.placeholder = 'Ketik pesan... (Always Online Mode)';
    }
    
    // Welcome message
    if (conversationHistory.length === 0) {
        setTimeout(function() {
            showWelcomeMessage();
        }, 1000);
    }
    
    updateConnectionStatus('online');
    console.log('✅ Always Online ready!');
}

function setupEventListeners() {
    // Send button
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            markUserInteraction();
            handleSendMessage();
        });
    }
    
    // Input handlers
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
    }
    
    // Prompt chips
    var promptChips = document.querySelectorAll('.prompt-chip');
    for (var i = 0; i < promptChips.length; i++) {
        promptChips[i].addEventListener('click', function() {
            var message = this.getAttribute('data-message');
            markUserInteraction();
            
            if (chatInput && message) {
                chatInput.value = message;
                autoResizeTextarea();
                updateSendButtonState();
                handleSendMessage();
            }
        });
    }
    
    // Scroll detection
    if (chatMessages) {
        chatMessages.addEventListener('scroll', function() {
            var isAtBottom = this.scrollTop >= this.scrollHeight - this.clientHeight - 50;
            if (scrollBtn) {
                if (isAtBottom) {
                    scrollBtn.classList.remove('show');
                } else {
                    scrollBtn.classList.add('show');
                }
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (chatInput) {
                chatInput.focus();
            }
        }
        
        if (e.key === 'Escape') {
            closeAllModals();
        }
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
            console.log('Audio context failed:', error);
        }
    }
}

function updateSendButtonState() {
    if (sendBtn && chatInput) {
        var hasValue = chatInput.value.trim().length > 0;
        sendBtn.disabled = !hasValue || isTyping;
    }
}

function updateConnectionStatus(status) {
    var statusDot = document.querySelector('.status-dot');
    var statusText = document.getElementById('connectionStatus');
    var apiStatusText = document.getElementById('apiStatusText');
    
    if (statusDot) {
        statusDot.className = 'status-dot ' + status;
    }
    
    var displayText = 'Always Online - Ready';
    if (status === 'connecting') {
        displayText = 'Connecting...';
    } else if (status === 'offline') {
        displayText = 'Backup Mode - Ready';
    }
    
    if (statusText) {
        statusText.textContent = displayText;
    }
    
    if (apiStatusText) {
        apiStatusText.className = 'status-text ' + status;
        apiStatusText.textContent = displayText;
    }
}

// Main send function - ALWAYS WORKS
function handleSendMessage() {
    console.log('🚀 Sending message...');
    
    if (!chatInput || !chatMessages || !sendBtn) {
        console.error('❌ Missing elements');
        return;
    }
    
    var message = chatInput.value.trim();
    
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
        
        // Add user message
        addMessage(message, true);
        
        // Clear input
        chatInput.value = '';
        autoResizeTextarea();
        updateSendButtonState();
        
        // Hide prompts
        var suggestedPrompts = document.getElementById('suggestedPrompts');
        if (suggestedPrompts) {
            var userMessages = 0;
            for (var i = 0; i < conversationHistory.length; i++) {
                if (conversationHistory[i].isUser) {
                    userMessages++;
                }
            }
            if (userMessages === 1) {
                suggestedPrompts.style.display = 'none';
            }
        }
        
        // Show typing
        showTypingIndicator();
        
        // Get response - ALWAYS WORKS
        getBotResponseAlwaysOnline(message).then(function(response) {
            hideTypingIndicator();
            addMessage(response, false, true);
            saveConversationHistory();
            
            isTyping = false;
            sendBtn.disabled = false;
            updateSendButtonState();
            chatInput.focus();
        }).catch(function(error) {
            console.error('Error:', error);
            hideTypingIndicator();
            
            // Emergency fallback
            var emergency = getEmergencyResponse();
            addMessage(emergency, false);
            
            isTyping = false;
            sendBtn.disabled = false;
            updateSendButtonState();
            chatInput.focus();
        });
        
    } catch (error) {
        console.error('Send error:', error);
        
        isTyping = false;
        sendBtn.disabled = false;
        updateSendButtonState();
        
        var emergency = getEmergencyResponse();
        addMessage(emergency, false);
    }
}

// ALWAYS ONLINE response system
function getBotResponseAlwaysOnline(userMessage) {
    return new Promise(function(resolve) {
        console.log('🤖 Getting Always Online response...');
        
        // Add small delay for UX
        setTimeout(function() {
            // Try API first
            tryAPICall(userMessage).then(function(apiResponse) {
                if (apiResponse && apiResponse.trim()) {
                    console.log('✅ API success');
                    updateConnectionStatus('online');
                    resolve(apiResponse);
                } else {
                    console.log('🔄 API empty, using fallback');
                    updateConnectionStatus('offline');
                    resolve(getFallbackResponse(userMessage));
                }
            }).catch(function(error) {
                console.log('❌ API failed:', error.message);
                updateConnectionStatus('offline');
                resolve(getFallbackResponse(userMessage));
            });
        }, 500 + Math.random() * 1000);
    });
}

function tryAPICall(userMessage) {
    return new Promise(function(resolve, reject) {
        var controller = new AbortController();
        var timeoutId = setTimeout(function() {
            controller.abort();
        }, API_CONFIG.timeout);
        
        fetch(API_CONFIG.baseUrl + API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage
            }),
            signal: controller.signal
        }).then(function(response) {
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            
            return response.json();
        }).then(function(data) {
            if (data.reply && data.reply.trim()) {
                if (data.model) {
                    console.log('🎯 Model: ' + data.model);
                    showAPIStatus(data.modelType);
                }
                resolve(data.reply.trim());
            } else {
                reject(new Error('Empty response'));
            }
        }).catch(function(error) {
            clearTimeout(timeoutId);
            reject(error);
        });
    });
}

function showAPIStatus(modelType) {
    var statusText = modelType === 'free' ? '🆓 Free AI' : 
                     modelType === 'paid' ? '💎 Premium AI' : 
                     '🤖 AI Active';
    
    showToast(statusText, 'success');
}

function checkAPIHealth() {
    tryAPICall('health').then(function() {
        console.log('✅ API healthy');
        updateConnectionStatus('online');
    }).catch(function() {
        console.log('⚠️ API check failed');
        updateConnectionStatus('offline');
    });
}

// High-quality fallback responses
function getFallbackResponse(userMessage) {
    console.log('🔄 Fallback response...');
    
    if (!userMessage || typeof userMessage !== 'string') {
        userMessage = 'halo';
    }
    
    var message = userMessage.toLowerCase().trim();
    
    // Greeting
    if (message.indexOf('halo') !== -1 || message.indexOf('hai') !== -1 || 
        message.indexOf('hello') !== -1 || message.indexOf('hi') !== -1) {
        return getWelcomeResponse();
    }
    
    // Craving
    if (message.indexOf('keinginan') !== -1 || message.indexOf('craving') !== -1 || 
        message.indexOf('ingin merokok') !== -1 || message.indexOf('pengen rokok') !== -1) {
        return getCravingResponse();
    }
    
    // Stress
    if (message.indexOf('stress') !== -1 || message.indexOf('cemas') !== -1 || 
        message.indexOf('tegang') !== -1 || message.indexOf('gelisah') !== -1) {
        return getStressResponse();
    }
    
    // Health
    if (message.indexOf('manfaat') !== -1 || message.indexOf('kesehatan') !== -1 || 
        message.indexOf('alasan') !== -1) {
        return getHealthResponse();
    }
    
    // Motivation
    if (message.indexOf('motivasi') !== -1 || message.indexOf('semangat') !== -1 || 
        message.indexOf('susah') !== -1 || message.indexOf('sulit') !== -1) {
        return getMotivationResponse();
    }
    
    // Money
    if (message.indexOf('uang') !== -1 || message.indexOf('hemat') !== -1 || 
        message.indexOf('penghematan') !== -1 || message.indexOf('hitung') !== -1) {
        return getMoneyResponse();
    }
    
    // Default
    return getGeneralResponse();
}

function getWelcomeResponse() {
    return '# Halo! PuffBot Always Online! 👋\n\n' +
           'Senang bertemu denganmu! Saya **selalu siap** membantu perjalanan bebas rokok kamu.\n\n' +
           '## Mode Always Online Aktif 🌐\n' +
           '- ✅ **Response Guaranteed** - Selalu dapat jawaban\n' +
           '- ⚡ **Fast Response** - Dalam hitungan detik\n' +
           '- 🔄 **Smart Fallback** - Backup system ready\n' +
           '- 💪 **Never Offline** - 24/7 ready to help\n\n' +
           '## Yang bisa saya bantu:\n' +
           '- 🚫 Tips mengatasi keinginan merokok\n' +
           '- ❤️ Informasi kesehatan dan manfaat\n' +
           '- 💪 Motivasi harian yang kuat\n' +
           '- 💰 Perhitungan penghematan uang\n' +
           '- 🧘 Teknik mengelola stress\n\n' +
           '[TIP]Saya selalu online dan siap membantu! Coba tanyakan apapun tentang berhenti merokok![/TIP]\n\n' +
           '**Apa yang ingin kamu ketahui hari ini?** 😊';
}

function getCravingResponse() {
    return '# Tips Ampuh Mengatasi Keinginan Merokok! 🚫\n\n' +
           'Keinginan merokok datang? **JANGAN PANIK!** Saya punya solusi yang terbukti efektif!\n\n' +
           '[TIP]Ingat: Keinginan merokok hanya bertahan 3-5 menit. Kamu lebih kuat dari itu![/TIP]\n\n' +
           '## 🔥 **Teknik INSTANT (30 detik - 2 menit):**\n' +
           '- **Teknik 4-7-8**: Tarik napas 4 detik → Tahan 7 detik → Hembuskan 8 detik\n' +
           '- **Cold Water Shock**: Cuci muka/leher dengan air dingin\n' +
           '- **Bite & Chew**: Gigit jeruk, apel, atau es batu\n' +
           '- **Move Your Body**: 10 jumping jacks atau push up\n\n' +
           '## ⚡ **Pengalihan Cepat (2-10 menit):**\n' +
           '- 📱 **Video Lucu**: Buka YouTube, TikTok, atau Instagram\n' +
           '- 🎵 **Music Therapy**: Playlist energik atau calming\n' +
           '- 🎮 **Quick Game**: Mobile game favorit\n' +
           '- 💬 **Text Someone**: Chat teman atau keluarga\n' +
           '- 🚶‍♂️ **Walk Around**: Keliling rumah atau kantor\n\n' +
           '[MOTIVATION]Kamu sudah berhasil mengatasi keinginan sebelumnya. Kamu PASTI bisa lagi! 💪[/MOTIVATION]\n\n' +
           '**Coba salah satu teknik di atas SEKARANG JUGA!**';
}

function getStressResponse() {
    return '# Kelola Stress Tanpa Rokok - Always Works! 🧘\n\n' +
           'Stress datang? **NORMAL!** Yang penting cara mengatasinya yang sehat!\n\n' +
           '[HEALTH]Rokok tidak mengatasi stress, hanya menambah masalah. Mari gunakan cara yang benar-benar efektif![/HEALTH]\n\n' +
           '## 🔥 **Anti-Stress Emergency Kit:**\n\n' +
           '### **Level 1 - Quick Relief (1-3 menit):**\n' +
           '- **Box Breathing**: 4 detik masuk → 4 detik tahan → 4 detik keluar → 4 detik tahan\n' +
           '- **Cold Therapy**: Es di pergelangan tangan atau leher\n' +
           '- **Grounding 5-4-3-2-1**: 5 yang dilihat, 4 yang diraba, 3 yang didengar, 2 yang dicium, 1 yang dirasa\n\n' +
           '### **Level 2 - Medium Relief (5-15 menit):**\n' +
           '- 🎵 **Music Healing**: Playlist chill atau nature sounds\n' +
           '- ✍️ **Brain Dump**: Tulis semua yang bikin stress di kertas/notes\n' +
           '- 🚶‍♂️ **Walk & Talk**: Jalan sambil telefon teman\n' +
           '- 🛁 **Self Care**: Cuci muka, sikat gigi, atau skincare\n\n' +
           '[TIP]Simpan list ini di HP! Next time stress datang, langsung buka dan pilih satu teknik![/TIP]\n\n' +
           '**Kamu lebih kuat dari stress! 💪**';
}

function getHealthResponse() {
    return '# Timeline Ajaib Pemulihan Tubuh! ❤️\n\n' +
           'Setiap detik tanpa rokok = HEALING PROCESS! Ini buktinya:\n\n' +
           '[HEALTH]Tubuhmu adalah mesin self-healing yang luar biasa. Mari lihat keajaibannya![/HEALTH]\n\n' +
           '## 🕐 **Real-Time Recovery Timeline:**\n\n' +
           '### **20 MENIT** ⏱️\n' +
           '- ❤️ Detak jantung normal\n' +
           '- 🩸 Tekanan darah turun\n' +
           '- 🌡️ Suhu tangan & kaki naik (sirkulasi membaik)\n\n' +
           '### **24 JAM** 📅\n' +
           '- 💀 Karbon monoksida HILANG dari darah\n' +
           '- 🫀 Risiko serangan jantung mulai turun\n' +
           '- 👃 Penciuman mulai membaik\n\n' +
           '### **1 MINGGU** 📅x7\n' +
           '- 🧠 Mental clarity meningkat\n' +
           '- 😊 Mood lebih stabil\n' +
           '- 💰 Hemat Rp 175.000!\n\n' +
           '### **1 BULAN** 📅x30\n' +
           '- 🦷 Gigi lebih putih\n' +
           '- 👶 Kulit lebih bersih & muda\n' +
           '- 💰 Hemat Rp 750.000!\n\n' +
           '[SUCCESS]Setiap hari tanpa rokok = INVESTASI TERBAIK untuk masa depanmu! 🌟[/SUCCESS]\n\n' +
           '**Tubuhmu sedang berterima kasih sekarang juga!**';
}

function getMotivationResponse() {
    return '# Power Motivation - Kamu UNSTOPPABLE! 💪\n\n' +
           'Merasa down? **WAJAR!** Tapi ingat, WINNERS never quit!\n\n' +
           '[MOTIVATION]Kamu sudah memilih jalan yang tidak mudah, tapi itulah yang membuat kamu SPECIAL! 🌟[/MOTIVATION]\n\n' +
           '## 🔥 **Daily Motivation Booster:**\n\n' +
           '### **🏆 Achievement Unlocked:**\n' +
           '- ✅ Kamu sudah membuat keputusan TERBAIK dalam hidup\n' +
           '- ✅ Setiap detik tanpa rokok = LEVEL UP!\n' +
           '- ✅ Kamu inspirasi untuk orang lain\n' +
           '- ✅ Future you akan berterima kasih\n\n' +
           '### **💎 Power Quotes for Warriors:**\n' +
           '> *"Champions tidak dibuat di gym. Champions dibuat dari sesuatu yang dalam - desire, dream, vision!"*\n\n' +
           '> *"Kamu tidak berhenti merokok karena mudah. Kamu berhenti karena WORTH IT!"*\n\n' +
           '### **🚀 Momentum Builders:**\n' +
           '- **Morning Mantra**: "Today I choose HEALTH over HABIT!"\n' +
           '- **Craving Crusher**: "This too shall pass, I am STRONGER!"\n' +
           '- **Evening Gratitude**: "Thank you body for healing today!"\n\n' +
           '[TIP]Setiap kali craving datang, baca ulang ini! Simpan di bookmark! 📌[/TIP]\n\n' +
           '**Kamu tidak sendirian dalam journey ini. WE BELIEVE IN YOU! 🙌**';
}

function getMoneyResponse() {
    return '# Money Saved = Dreams Achieved! 💰\n\n' +
           'Siap-siap terkejut dengan angka FANTASTIS ini!\n\n' +
           '[SUCCESS]Setiap hari tanpa rokok = UANG MASUK TABUNGAN! Mari hitung wealth-mu! 💎[/SUCCESS]\n\n' +
           '## 💸 **Money Freedom Calculator:**\n\n' +
           '### **📊 Asumsi Realistic:**\n' +
           '- **Harga rokok**: Rp 25.000/bungkus (2024)\n' +
           '- **Konsumsi**: 1 bungkus/hari (standard)\n' +
           '- **Daily cost**: Rp 25.000\n\n' +
           '### **🎯 Savings Breakdown:**\n' +
           '- **1 hari**: Rp 25.000 (satu nasi padang enak!)\n' +
           '- **1 minggu**: Rp 175.000 (shopping kecil!)\n' +
           '- **1 bulan**: Rp 750.000 (gadget baru!)\n' +
           '- **3 bulan**: Rp 2.250.000 (motorcycle down payment!)\n' +
           '- **6 bulan**: Rp 4.500.000 (laptop gaming!)\n' +
           '- **1 tahun**: Rp 9.125.000 (motor second/vacation abroad!)\n' +
           '- **5 tahun**: Rp 45.625.000 (investasi property!) 🏠\n\n' +
           '### **🚀 Dream Investment Options:**\n' +
           '- **Deposito 6%**: Rp 750k/bulan = passive income\n' +
           '- **Saham Blue Chip**: Dividend income + capital gain\n' +
           '- **Travel Fund**: 1 trip abroad per year\n' +
           '- **Self Investment**: Course, certification, gym\n\n' +
           '[TIP]Buat rekening terpisah "FREEDOM FUND" - transfer Rp 25k setiap hari! Watch it grow! 📈[/TIP]\n\n' +
           '**From cigarette slave to FINANCIAL FREEDOM! 🗽**';
}

function getGeneralResponse() {
    return '# PuffBot Always Online - Ready to Help! 🤖\n\n' +
           'Terima kasih sudah ngobrol sama saya! Mode Always Online aktif - **saya SELALU siap membantu!**\n\n' +
           '## 🌟 **What Makes Me Special:**\n' +
           '- ⚡ **Always Online** - Never offline, always ready\n' +
           '- 🎯 **Instant Response** - Fast & accurate answers\n' +
           '- 🧠 **Smart AI** - Understanding your needs\n' +
           '- ❤️ **Emphatic** - Genuine care for your journey\n\n' +
           '## 🚀 **Popular Topics - Ask Me About:**\n\n' +
           '### **🚫 Quit Smoking Mastery:**\n' +
           '- "Bagaimana mengatasi keinginan merokok?"\n' +
           '- "Tips berhenti merokok yang efektif"\n\n' +
           '### **❤️ Health & Recovery:**\n' +
           '- "Apa manfaat berhenti merokok?"\n' +
           '- "Timeline pemulihan tubuh"\n\n' +
           '### **💪 Motivation & Support:**\n' +
           '- "Motivasi berhenti merokok"\n' +
           '- "Cara tetap konsisten"\n\n' +
           '### **💰 Financial Benefits:**\n' +
           '- "Hitung penghematan uang"\n' +
           '- "Investasi alternatif rokok"\n\n' +
           '[TIP]Saya selalu online dan ready to help! Jangan ragu bertanya apapun tentang journey bebas rokok kamu! 😊[/TIP]\n\n' +
           '**What\'s on your mind today? Let\'s talk! 💬**';
}

function getEmergencyResponse() {
    return '# System Recovery Mode - Still Here for You! 🛡️\n\n' +
           'Meskipun ada gangguan teknis, **PuffBot tetap ALWAYS ONLINE** untuk kamu!\n\n' +
           '## 🚨 **Emergency Support Mode Active:**\n\n' +
           '### **✅ What Still Works:**\n' +
           '- ✅ **Full Support** - Semua fitur backup tersedia\n' +
           '- ✅ **Instant Response** - Respons tetap cepat\n' +
           '- ✅ **Complete Help** - Bantuan lengkap ready\n' +
           '- ✅ **Never Offline** - Always here for you\n\n' +
           '### **🆘 Emergency Quit Smoking Kit:**\n\n' +
           '**Keinginan Merokok SEKARANG?**\n' +
           '1. **BREATHE**: 4 detik masuk - 4 detik keluar (repeat 5x)\n' +
           '2. **MOVE**: Jumping jacks 10x atau push up 5x\n' +
           '3. **HYDRATE**: Minum air putih 2 gelas besar\n' +
           '4. **DISTRACT**: Buka YouTube/TikTok/musik 5 menit\n' +
           '5. **REMEMBER**: "This craving will pass in 3-5 minutes!"\n\n' +
           '[MOTIVATION]Technical issues can\'t stop your amazing journey! You\'re doing GREAT! 🌟[/MOTIVATION]\n\n' +
           '**Emergency mode atau tidak, saya tetap 100% support kamu! 💪**';
}

// Message formatting
function formatMessage(text) {
    var formattedText = text;
    
    // Convert markdown to HTML if marked is available
    if (typeof marked !== 'undefined') {
        formattedText = marked.parse(formattedText);
    }
    
    // Info boxes
    formattedText = formattedText.replace(/\[TIP\](.*?)\[\/TIP\]/gs, '<div class="tip-box"><strong>💡 Tips:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[MOTIVATION\](.*?)\[\/MOTIVATION\]/gs, '<div class="success-box"><strong>💪 Motivasi:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[HEALTH\](.*?)\[\/HEALTH\]/gs, '<div class="info-box"><strong>❤️ Kesehatan:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[SUCCESS\](.*?)\[\/SUCCESS\]/gs, '<div class="success-box"><strong>✅ Berhasil:</strong><br>$1</div>');
    
    return formattedText;
}

// Add message to chat
function addMessage(content, isUser, showQuickReplies) {
    if (typeof isUser === 'undefined') isUser = false;
    if (typeof showQuickReplies === 'undefined') showQuickReplies = false;
    
    var messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isUser ? 'message-user' : 'message-bot') + ' new';
    
    var bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    var contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isUser) {
        contentDiv.textContent = content;
    } else {
        contentDiv.innerHTML = formatMessage(content);
    }
    
    var timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    timeDiv.style.display = settings.showTimestamps ? 'block' : 'none';
