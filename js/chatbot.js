// Global variables
let conversationHistory = [];
let isTyping = false;
let chatMessages, chatInput, sendBtn, scrollBtn;
let isVoiceRecording = false;
let hasUserInteracted = false;
let audioContext = null;
let settings = {
    autoScroll: true,
    soundEnabled: true,
    showTimestamps: true,
    chatTheme: 'light'
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
    console.log('🚀 DOM Content Loaded - Starting initialization');
    initializeApp();
});

function initializeApp() {
    console.log('⚙️ Initializing app...');
    
    // Get DOM elements
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    sendBtn = document.getElementById('sendBtn');
    scrollBtn = document.getElementById('scrollToBottom');
    
    // Debug: Check if elements exist
    console.log('🔍 Element check:');
    console.log('  - chatMessages:', !!chatMessages);
    console.log('  - chatInput:', !!chatInput);
    console.log('  - sendBtn:', !!sendBtn);
    console.log('  - scrollBtn:', !!scrollBtn);
    
    if (!chatMessages || !chatInput || !sendBtn) {
        console.error('❌ Critical elements missing!');
        showToast('Error: Chat elements not found. Please refresh the page.', 'error');
        return;
    }
    
    // Load settings and conversation history
    loadSettings();
    loadConversationHistory();
    
    // Setup event listeners
    console.log('⚙️ Setting up event listeners...');
    setupEventListeners();
    
    // Focus on input
    if (chatInput) {
        chatInput.focus();
        console.log('🎯 Input focused');
        chatInput.placeholder = 'Ketik pesan dan tekan Enter atau klik kirim...';
    }
    
    // Show welcome message if no conversation history
    if (conversationHistory.length === 0) {
        setTimeout(() => {
            console.log('👋 Showing welcome message');
            showWelcomeMessage();
        }, 800);
    }
    
    console.log('✅ Initialization complete!');
}

function setupEventListeners() {
    // Send button click handler
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔥 Send button clicked!');
            markUserInteraction();
            handleSendMessage();
        });
        console.log('✅ Send button event listener added');
    }
    
    // Input event handlers
    if (chatInput) {
        // Input change handler
        chatInput.addEventListener('input', function() {
            markUserInteraction();
            autoResizeTextarea();
            updateSendButtonState();
        });
        
        // Enter key handler
        chatInput.addEventListener('keypress', function(e) {
            markUserInteraction();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('🚀 Enter key pressed - calling handleSendMessage()');
                handleSendMessage();
            }
        });
        
        // Focus and click handlers
        chatInput.addEventListener('focus', markUserInteraction);
        chatInput.addEventListener('click', markUserInteraction);
        
        console.log('✅ Input event listeners added');
    }
    
    // Prompt chip handlers
    setupPromptChips();
    
    // Scroll detection
    setupScrollDetection();
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Settings handlers
    setupSettingsHandlers();
}

function setupPromptChips() {
    const promptChips = document.querySelectorAll('.prompt-chip');
    console.log('🔘 Setting up', promptChips.length, 'prompt chips');
    
    promptChips.forEach((chip, index) => {
        chip.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            console.log('🔥 Prompt chip', index, 'clicked:', message);
            markUserInteraction();
            
            if (chatInput && message) {
                chatInput.value = message;
                autoResizeTextarea();
                updateSendButtonState();
                handleSendMessage();
            }
        });
    });
    
    console.log('✅ Prompt chip handlers added');
}

function markUserInteraction() {
    if (!hasUserInteracted) {
        hasUserInteracted = true;
        initAudioContext();
        console.log('👤 User interaction detected - audio enabled');
    }
}

function initAudioContext() {
    if (!audioContext && hasUserInteracted) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 Audio context initialized');
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

// Main message sending function
async function handleSendMessage() {
    console.log('🚀 [SEND] START handleSendMessage');
    
    // Basic validation
    if (!chatInput || !chatMessages || !sendBtn) {
        console.error('❌ [SEND] Missing DOM elements');
        showToast('Error: Halaman tidak lengkap. Silakan refresh.', 'error');
        return;
    }
    
    const message = chatInput.value.trim();
    console.log('📝 [SEND] Message:', message);
    
    if (!message) {
        console.warn('⚠️ [SEND] Empty message');
        showToast('Silakan ketik pesan', 'warning');
        return;
    }
    
    if (isTyping) {
        console.warn('⚠️ [SEND] Already processing');
        showToast('Tunggu sebentar...', 'warning');
        return;
    }
    
    try {
        // Mark as processing
        isTyping = true;
        sendBtn.disabled = true;
        
        console.log('👤 [SEND] Adding user message');
        addMessage(message, true);
        
        // Clear input
        chatInput.value = '';
        autoResizeTextarea();
        updateSendButtonState();
        
        console.log('⏳ [SEND] Showing typing indicator');
        showTypingIndicator();
        
        console.log('🤖 [SEND] Getting bot response');
        const botResponse = await getBotResponse(message);
        
        console.log('📥 [SEND] Response received:', !!botResponse);
        
        if (!botResponse) {
            throw new Error('No response received');
        }
        
        console.log('⏹️ [SEND] Hiding typing indicator');
        hideTypingIndicator();
        
        console.log('🤖 [SEND] Adding bot message');
        addMessage(botResponse, false, true);
        
        console.log('✅ [SEND] SUCCESS!');
        showToast('Pesan terkirim!', 'success');
        
        // Save conversation
        saveConversationHistory();
        
    } catch (error) {
        console.error('❌ [SEND] Error:', error);
        hideTypingIndicator();
        
        // Emergency response
        const emergency = `# Sistem Bermasalah 😅

Maaf ada gangguan teknis! Tapi tetap semangat bebas rokok ya!

**Tips sementara:**
- Tarik napas dalam-dalam
- Minum air putih
- Jalan-jalan sebentar

Coba kirim pesan lagi! 💪`;
        
        addMessage(emergency, false);
        showToast('Ada gangguan, coba lagi', 'error');
    }
    
    // Reset state
    isTyping = false;
    sendBtn.disabled = false;
    updateSendButtonState();
    chatInput.focus();
    
    console.log('🏁 [SEND] END handleSendMessage');
}

// Bot response function
async function getBotResponse(userMessage) {
    console.log('🤖 [getBotResponse] START with:', userMessage);
    
    // Simple delay to simulate thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    try {
        // Try API call first (uncomment when API is ready)
        /*
        console.log('📡 [API] Calling PuffOff API...');
        
        const response = await fetch('https://puffoff-api.vercel.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
            signal: AbortSignal.timeout(8000)
        });
        
        if (response.ok) {
            const data = await response.json();
            const botResponse = data.reply || data.response || data.message;
            if (botResponse && botResponse.trim()) {
                console.log('✅ [API] SUCCESS');
                return botResponse;
            }
        }
        throw new Error('API response invalid');
        */
        
        // For now, use fallback
        console.log('🔄 [FALLBACK] Using local response');
        return getFallbackResponse(userMessage);
        
    } catch (error) {
        console.log('❌ [API] Failed:', error.message);
        return getFallbackResponse(userMessage);
    }
}

// Enhanced fallback responses
function getFallbackResponse(userMessage) {
    console.log('🔄 [FALLBACK] Processing:', userMessage);
    
    if (!userMessage || typeof userMessage !== 'string') {
        userMessage = 'halo';
    }
    
    const message = userMessage.toLowerCase().trim();
    
    // Greeting responses
    if (message.includes('halo') || message.includes('hai') || message.includes('hello') || message.includes('hi')) {
        return `# Halo! Selamat datang di PuffBot! 👋

Senang bertemu denganmu! Saya di sini untuk membantu perjalanan bebas rokok kamu.

## Apa yang bisa saya bantu hari ini?
- 🚫 Tips mengatasi keinginan merokok
- ❤️ Informasi kesehatan
- 💪 Motivasi harian
- 💰 Perhitungan penghematan

[TIP]Coba tanyakan "Bagaimana cara berhenti merokok?" atau pilih salah satu prompt di bawah![/TIP]`;
    }
    
    // Smoking craving responses
    if (message.includes('keinginan merokok') || message.includes('ingin merokok') || message.includes('craving') || message.includes('ngidam')) {
        return `# Tips Mengatasi Keinginan Merokok 🚫

[TIP]Keinginan merokok biasanya hanya berlangsung 3-5 menit. Kamu bisa mengatasinya![/TIP]

## Teknik Segera (1-5 menit):
- **Teknik 4-7-8**: Tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik
- **Minum air putih**: Hidrasi membantu mengurangi craving
- **Gigit sesuatu**: Wortel, apel, atau permen bebas gula
- **Ubah posisi**: Berdiri, jalan-jalan, atau stretch

## Pengalihan Jangka Pendek (5-15 menit):
- 🎵 Dengarkan musik favorit
- 📱 Chat dengan teman atau keluarga
- 🎮 Main game ringan di HP
- 🧘 Meditasi atau mindfulness 2 menit
- 🚶‍♂️ Jalan-jalan ke luar ruangan

[MOTIVATION]Ingat, setiap kali kamu berhasil mengatasi keinginan merokok, kamu semakin kuat! 💪[/MOTIVATION]`;
    }
    
    // Stress management
    if (message.includes('stress') || message.includes('cemas') || message.includes('tegang')) {
        return `# Mengelola Stress Tanpa Rokok 🧘

[HEALTH]Stress adalah trigger utama keinginan merokok. Mari kelola dengan cara sehat![/HEALTH]

## Teknik Relaksasi Cepat:
- **Deep Breathing**: Napas dalam selama 5 menit
- **Progressive Muscle Relaxation**: Tegang-rileks otot secara bertahap
- **Mindfulness**: Fokus pada saat ini, bukan kekhawatiran

## Aktivitas Anti-Stress:
- 🚶‍♂️ **Jalan kaki**: 10-15 menit di luar ruangan
- 🎵 **Musik**: Dengarkan musik yang menenangkan
- ✍️ **Journaling**: Tulis perasaan dan pikiran
- 🛁 **Mandi hangat**: Relaksasi untuk tubuh dan pikiran

[TIP]Stress adalah normal, yang penting adalah cara kita mengatasinya dengan sehat![/TIP]`;
    }
    
    // Health benefits
    if (message.includes('manfaat') && (message.includes('berhenti') || message.includes('kesehatan'))) {
        return `# Manfaat Luar Biasa Berhenti Merokok ❤️

[HEALTH]Tubuhmu mulai membaik dalam hitungan menit setelah rokok terakhir![/HEALTH]

## Timeline Pemulihan:
- **20 menit**: Detak jantung dan tekanan darah turun
- **12 jam**: Kadar karbon monoksida dalam darah normal
- **2 minggu**: Sirkulasi membaik, fungsi paru meningkat
- **1 tahun**: Risiko penyakit jantung turun 50%

## Manfaat yang Langsung Terasa:
- 💰 **Finansial**: Hemat jutaan rupiah per tahun
- 👃 **Penciuman**: Kembali normal dalam 2 minggu
- 🦷 **Gigi**: Lebih putih dan nafas lebih segar
- 🏃 **Stamina**: Energi dan daya tahan meningkat

[SUCCESS]Kamu sudah membuat keputusan terbaik untuk hidupmu! 🌟[/SUCCESS]`;
    }
    
    // Motivation
    if (message.includes('motivasi') || message.includes('semangat') || message.includes('inspirasi')) {
        return `# Motivasi Harian Bebas Rokok 💪

[MOTIVATION]Kamu lebih kuat dari kebiasaan lama! Setiap hari tanpa rokok adalah kemenangan besar.[/MOTIVATION]

## Quotes Inspiratif:
> "Kekuatan tidak berasal dari kemampuan fisik. Kekuatan berasal dari tekad yang tidak dapat dikalahkan."

> "Perubahan dimulai dari ujung zona nyaman kamu."

## Ingat Alasan Kuat Kamu:
- ❤️ **Kesehatan**: Hidup lebih lama dan berkualitas
- 👨‍👩‍👧‍👦 **Keluarga**: Menjadi role model yang baik
- 💰 **Finansial**: Uang untuk investasi masa depan
- 🌱 **Prestasi Pribadi**: Membuktikan kamu bisa berubah

[TIP]Buat reminder di HP kamu dengan quotes motivasi ini![/TIP]`;
    }
    
    // Money calculation
    if (message.includes('uang') || message.includes('hemat') || message.includes('penghematan') || message.includes('hitung')) {
        return `# Kalkulator Penghematan PuffOff 💰

[SUCCESS]Mari hitung berapa banyak uang yang sudah dan akan kamu hemat![/SUCCESS]

## Perhitungan Penghematan:
- **1 hari**: Rp 25.000
- **1 minggu**: Rp 175.000
- **1 bulan**: Rp 750.000
- **3 bulan**: Rp 2.250.000
- **6 bulan**: Rp 4.500.000
- **1 tahun**: Rp 9.125.000

## Investasi Alternatif dengan Rp 750.000/bulan:
- 🏠 **DP Rumah**: Dalam 5 tahun bisa terkumpul Rp 45 juta
- 📚 **Pendidikan**: Kursus bahasa asing atau sertifikasi
- 💎 **Emas**: Investasi yang nilainya cenderung naik
- 📈 **Reksadana**: Investasi untuk masa depan

[TIP]Buat rekening khusus "tabungan rokok" dan transfer Rp 25.000 setiap hari![/TIP]`;
    }
    
    // Default response
    return `# Halo! Saya PuffBot 🤖

Terima kasih sudah bertanya! Saya siap membantu perjalanan bebas rokok kamu.

## Yang bisa saya bantu:
- 🚫 **Tips mengatasi keinginan merokok**
- ❤️ **Informasi manfaat kesehatan**  
- 💪 **Motivasi dan dukungan harian**
- 💰 **Perhitungan penghematan uang**
- 🎯 **Strategi berhenti merokok**

[TIP]Coba tanyakan sesuatu seperti "Bagaimana cara mengatasi stress?" atau "Apa manfaat berhenti merokok?"[/TIP]

**Apa yang ingin kamu ketahui?** 😊`;
}

// Message formatting
function formatMessage(text) {
    let formattedText = text;
    
    // Convert markdown to HTML if marked is available
    if (typeof marked !== 'undefined') {
        formattedText = marked.parse(formattedText);
    }
    
    // Enhanced info boxes
    formattedText = formattedText.replace(/\[INFO\](.*?)\[\/INFO\]/gs, '<div class="info-box"><strong>ℹ️ Informasi:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[WARNING\](.*?)\[\/WARNING\]/gs, '<div class="warning-box"><strong>⚠️ Peringatan:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[SUCCESS\](.*?)\[\/SUCCESS\]/gs, '<div class="success-box"><strong>✅ Berhasil:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[TIP\](.*?)\[\/TIP\]/gs, '<div class="tip-box"><strong>💡 Tips:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[MOTIVATION\](.*?)\[\/MOTIVATION\]/gs, '<div class="success-box"><strong>💪 Motivasi:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[HEALTH\](.*?)\[\/HEALTH\]/gs, '<div class="info-box"><strong>❤️ Kesehatan:</strong><br>$1</div>');
    
    return formattedText;
}

// Add message to chat
function addMessage(content, isUser = false, showQuickReplies = false) {
    console.log('📝 Adding message:', isUser ? 'User' : 'Bot', content.substring(0, 50) + '...');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'message-user' : 'message-bot'} new`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isUser) {
        contentDiv.textContent = content;
    } else {
        contentDiv.innerHTML = formatMessage(content);
    }
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    timeDiv.style.display = settings.showTimestamps ? 'block' : 'none';
    
    bubbleDiv.appendChild(contentDiv);
    bubbleDiv.appendChild(timeDiv);
    
    // Add quick replies for bot messages
    if (!isUser && showQuickReplies) {
        const quickReplies = getQuickReplies(content);
        if (quickReplies.length > 0) {
            const repliesDiv = document.createElement('div');
            repliesDiv.className = 'quick-replies';
            
            quickReplies.forEach(reply => {
                const replyBtn = document.createElement('button');
                replyBtn.className = 'quick-reply';
                replyBtn.textContent = reply;
                replyBtn.onclick = () => sendQuickMessage(reply);
                repliesDiv.appendChild(replyBtn);
            });
            
            bubbleDiv.appendChild(repliesDiv);
        }
    }
    
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    // Store in conversation history
    conversationHistory.push({
        content,
        isUser,
        timestamp: new Date().toISOString()
    });
    
    // Play notification sound
    if (!isUser && settings.soundEnabled) {
        playNotificationSound();
    }
    
    // Auto scroll if enabled
    if (settings.autoScroll) {
        scrollToBottom();
    }
    
    // Remove 'new' class after animation
    setTimeout(() => {
        messageDiv.classList.remove('new');
    }, 400);
}

// Quick replies
function getQuickReplies(botMessage) {
    const message = botMessage.toLowerCase();
    
    if (message.includes('keinginan merokok') || message.includes('craving')) {
        return ['Latihan pernapasan', 'Aktivitas pengalih', 'Minta dukungan'];
    }
    
    if (message.includes('manfaat') || message.includes('kesehatan')) {
        return ['Manfaat lainnya?', 'Timeline pemulihan', 'Tips kesehatan'];
    }
    
    if (message.includes('motivasi') || message.includes('semangat')) {
        return ['Cerita sukses', 'Reminder harian', 'Komunitas support'];
    }
    
    if (message.includes('penghematan') || message.includes('uang')) {
        return ['Hitung detail', 'Investasi sehat', 'Target tabungan'];
    }
    
    return ['Terima kasih', 'Tanya lagi', 'Bantuan lain'];
}

// Quick message sender
function sendQuickMessage(message) {
    console.log('⚡ Quick message:', message);
    markUserInteraction();
    
    if (chatInput) {
        chatInput.value = message;
        autoResizeTextarea();
        updateSendButtonState();
        handleSendMessage();
    }
}

// Typing indicator
function showTypingIndicator() {
    console.log('⏳ Showing typing indicator');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message message-bot';
    typingDiv.id = 'typing-indicator';
    
    const typingBubble = document.createElement('div');
    typingBubble.className = 'typing-indicator';
    typingBubble.innerHTML = `
        <span>PuffBot sedang mengetik</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    typingDiv.appendChild(typingBubble);
    chatMessages.appendChild(typingDiv);
    
    if (settings.autoScroll) {
        scrollToBottom();
    }
}

function hideTypingIndicator() {
    console.log('❌ Hiding typing indicator');
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Utility functions
function getCurrentTime() {
    return new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function autoResizeTextarea() {
    if (chatInput) {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    }
}

function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (scrollBtn) {
            scrollBtn.classList.remove('show');
        }
    }
}

function setupScrollDetection() {
    if (!chatMessages) return;
    
    chatMessages.addEventListener('scroll', function() {
        const isAtBottom = this.scrollTop >= this.scrollHeight - this.clientHeight - 50;
        if (scrollBtn) {
            scrollBtn.classList.toggle('show', !isAtBottom);
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus on input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            chatInput?.focus();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Settings functions
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('puffoff_chat_settings');
        if (savedSettings) {
            settings = { ...settings, ...JSON.parse(savedSettings) };
        }
        applySettings();
    } catch (error) {
        console.warn('Could not load settings:', error);
    }
}

function saveSettings() {
    try {
        localStorage.setItem('puffoff_chat_settings', JSON.stringify(settings));
    } catch (error) {
        console.warn('Could not save settings:', error);
    }
}

function applySettings() {
    // Apply theme
    document.body.className = settings.chatTheme === 'dark' ? 'dark-theme' : '';
    
    // Update settings panel
    const autoScrollCheckbox = document.getElementById('autoScroll');
    const soundEnabledCheckbox = document.getElementById('soundEnabled');
    const showTimestampsCheckbox = document.getElementById('showTimestamps');
    const chatThemeSelect = document.getElementById('chatTheme');
    
    if (autoScrollCheckbox) autoScrollCheckbox.checked = settings.autoScroll;
    if (soundEnabledCheckbox) soundEnabledCheckbox.checked = settings.soundEnabled;
    if (showTimestampsCheckbox) showTimestampsCheckbox.checked = settings.showTimestamps;
    if (chatThemeSelect) chatThemeSelect.value = settings.chatTheme;
}

function setupSettingsHandlers() {
    // Settings will be handled by the existing functions in HTML
}

// Data persistence
function saveConversationHistory() {
    try {
        localStorage.setItem('puffoff_conversation_history', JSON.stringify(conversationHistory));
    } catch (error) {
        console.warn('Could not save conversation history:', error);
    }
}

function loadConversationHistory() {
    try {
        const saved = localStorage.getItem('puffoff_conversation_history');
        if (saved) {
            const history = JSON.parse(saved);
            // Only load recent messages (last 50)
            conversationHistory = history.slice(-50);
            
            // Restore messages to chat
            conversationHistory.forEach(msg => {
                addMessage(msg.content, msg.isUser, false);
            });
        }
    } catch (error) {
        console.warn('Could not load conversation history:', error);
    }
}

// Welcome message
function showWelcomeMessage() {
    const welcomeMessage = `# Selamat datang di PuffBot! 👋

Halo! Saya **PuffBot**, asisten AI khusus untuk mendampingi perjalanan bebas rokok kamu.

## Yang bisa saya bantu:

- 🚫 **Tips mengatasi keinginan merokok**
- ❤️ **Informasi manfaat kesehatan**
- 💪 **Motivasi dan dukungan harian**
- 💰 **Perhitungan penghematan uang**
- 🎯 **Bantuan setting target dan goal**
- 🧘 **Teknik mengelola stress**

[TIP]Cobalah mengetik pertanyaan seperti "Bagaimana cara mengatasi keinginan merokok?" atau pilih prompt cepat di bawah![/TIP]

**Apa yang ingin kamu tanyakan hari ini?** 😊`;
    
    setTimeout(() => {
        addMessage(welcomeMessage, false, true);
    }, 500);
}

// Notification sound
function playNotificationSound() {
    if (!settings.soundEnabled || !hasUserInteracted) return;
    
    try {
        if (!audioContext) {
            initAudioContext();
        }
        
        if (!audioContext) return;
        
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log('Could not play notification sound:', error);
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Settings modal functions
function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('overlay');
    
    if (settingsPanel && overlay) {
        if (settingsPanel.classList.contains('show')) {
            settingsPanel.classList.remove('show');
            overlay.classList.remove('show');
        } else {
            settingsPanel.classList.add('show');
            overlay.classList.add('show');
            setupSettingsListeners();
        }
    }
}

function setupSettingsListeners() {
    const autoScrollCheckbox = document.getElementById('autoScroll');
    const soundEnabledCheckbox = document.getElementById('soundEnabled');
    const showTimestampsCheckbox = document.getElementById('showTimestamps');
    const chatThemeSelect = document.getElementById('chatTheme');
    
    if (autoScrollCheckbox) {
        autoScrollCheckbox.addEventListener('change', function() {
            settings.autoScroll = this.checked;
            saveSettings();
        });
    }
    
    if (soundEnabledCheckbox) {
        soundEnabledCheckbox.addEventListener('change', function() {
            settings.soundEnabled = this.checked;
            saveSettings();
        });
    }
    
    if (showTimestampsCheckbox) {
        showTimestampsCheckbox.addEventListener('change', function() {
            settings.showTimestamps = this.checked;
            saveSettings();
            refreshMessageTimestamps();
        });
    }
    
    if (chatThemeSelect) {
        chatThemeSelect.addEventListener('change', function() {
            settings.chatTheme = this.value;
            saveSettings();
            applySettings();
        });
    }
}

function refreshMessageTimestamps() {
    const timeElements = document.querySelectorAll('.message-time');
    timeElements.forEach(element => {
        element.style.display = settings.showTimestamps ? 'block' : 'none';
    });
}

function closeAllModals() {
    const settingsPanel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('overlay');
    
    if (settingsPanel) settingsPanel.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
}

// Chat management functions
function clearChat() {
    if (confirm('Hapus semua percakapan? Data tidak dapat dikembalikan.')) {
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        conversationHistory = [];
        localStorage.removeItem('puffoff_conversation_history');
        showWelcomeMessage();
        showToast('Chat berhasil dibersihkan', 'info');
    }
}

function exportChat() {
    if (conversationHistory.length === 0) {
        showToast('Tidak ada percakapan untuk diekspor', 'warning');
        return;
    }
    
    // Simple text export
    const timestamp = new Date().toLocaleString('id-ID');
    let textContent = `PERCAKAPAN PUFFOFF AI HELPER\n`;
    textContent += `=================================\n`;
    textContent += `Diekspor pada: ${timestamp}\n`;
    textContent += `Total pesan: ${conversationHistory.length}\n\n`;

    conversationHistory.forEach((msg, index) => {
        const time = new Date(msg.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const sender = msg.isUser ? 'ANDA' : 'PUFFBOT';
        const content = msg.content.replace(/\[.*?\]/g, '').replace(/#{1,6}\s*/g, '').replace(/\*\*(.*?)\*\*/g, '$1');
        
        textContent += `[${time}] ${sender}:\n${content}\n\n`;
    });

    textContent += `=================================\n`;
    textContent += `Diekspor dari PuffOff AI Helper\n`;
    
    // Create download
    const dataBlob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `puffoff_chat_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('Chat berhasil diekspor!', 'success');
}

// Voice input functions (basic implementation)
function toggleVoiceInput() {
    const voiceBtn = document.querySelector('.input-btn i.fa-microphone');
    if (!voiceBtn) return;
    
    const button = voiceBtn.parentElement;
    
    if (!isVoiceRecording) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            startVoiceRecognition(button);
        } else {
            showToast('Browser tidak mendukung voice recognition', 'warning');
        }
    } else {
        stopVoiceRecognition(button);
    }
}

function startVoiceRecognition(button) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = function() {
        isVoiceRecording = true;
        button.classList.add('voice-recording');
        button.innerHTML = '<i class="fas fa-stop"></i>';
        showToast('Mulai merekam suara...', 'info');
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        if (chatInput) {
            chatInput.value = transcript;
            autoResizeTextarea();
            updateSendButtonState();
        }
    };
    
    recognition.onerror = function(event) {
        showToast('Error dalam voice recognition: ' + event.error, 'error');
        stopVoiceRecognition(button);
    };
    
    recognition.onend = function() {
        stopVoiceRecognition(button);
    };
    
    recognition.start();
    window.currentRecognition = recognition;
}

function stopVoiceRecognition(button) {
    isVoiceRecording = false;
    button.classList.remove('voice-recording');
    button.innerHTML = '<i class="fas fa-microphone"></i>';
    
    if (window.currentRecognition) {
        window.currentRecognition.stop();
        window.currentRecognition = null;
    }
    
    showToast('Rekaman selesai', 'success');
}

// File attachment placeholder
function attachFile() {
    showToast('Fitur upload file akan segera hadir!', 'info');
}

// Auto-save conversation periodically
setInterval(() => {
    if (conversationHistory.length > 0) {
        saveConversationHistory();
    }
}, 30000); // Save every 30 seconds

// Save on page unload
window.addEventListener('beforeunload', () => {
    saveConversationHistory();
});

// Global functions that might be called from HTML
window.handleSendMessage = handleSendMessage;
window.toggleSettings = toggleSettings;
window.clearChat = clearChat;
window.exportChat = exportChat;
window.toggleVoiceInput = toggleVoiceInput;
window.attachFile = attachFile;
window.scrollToBottom = scrollToBottom;
window.closeAllModals = closeAllModals;

console.log('✅ Chatbot script loaded successfully!');Node.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gain
