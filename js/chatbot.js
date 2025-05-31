// Message Sending dengan debugging lebih detail
async function handleSendMessage() {
    console.log('🚀 handleSendMessage function called');
    
    if (!hasUserInteracted) {
        hasUserInteracted = true;
        initAudioContext();
    }
    
    if (!chatInput) {
        console.error('❌ Chat input not found!');
        showToast('Error: Input tidak ditemukan', 'error');
        return;
    }
    
    const message = chatInput.value.trim();
    console.log('📝 Message to send:', `"${message}"`);
    
    if (!message) {
        console.warn('⚠️ Empty message, not sending');
        showToast('Silakan ketik pesan terlebih dahulu', 'warning');
        return;
    }
    
    if (isTyping) {
        console.warn('⚠️ Bot is typing, please wait');
        showToast('Tunggu sebentar, bot sedang mengetik...', 'warning');
        return;
    }
    
    console.log('✅ Message validation passed, proceeding...');
    
    try {
        // Add user message
        console.log('👤 Adding user message to chat');
        addMessage(message, true);
        
        // Clear input and set typing state
        chatInput.value = '';
        autoResizeTextarea();
        sendBtn.disabled = true;
        isTyping = true;
        
        console.log('🔄 Input cleared, showing typing indicator');
        
        // Show typing indicator IMMEDIATELY
        showTypingIndicator();
        
        // Get bot response
        console.log('🤖 Calling getBotResponse...');
        const response = await getBotResponse(message);
        console.log('💬 Response received from getBotResponse:', response ? 'SUCCESS' : 'FAILED');
        
        if (!response) {
            throw new Error('No response received from getBotResponse');
        }
        
        // Hide typing indicator
        console.log('⏹️ Hiding typing indicator');
        hideTypingIndicator();
        
        // Add bot response
        console.log('🤖 Adding bot response to chat');
        addMessage(response, false, true);
        console.log('✅ Bot message added to chat successfully');
        
        showToast('Pesan berhasil dikirim!', 'success');
        
    } catch (error) {
        console.error('❌ Error in handleSendMessage:', error);
        hideTypingIndicator();
        
        // Emergency fallback - pastikan selalu ada response
        const emergencyResponse = `[WARNING]Maaf, terjadi kesalahan sistem. Tapi jangan khawatir, saya tetap di sini untuk membantu![/WARNING]

# Sementara ini, beberapa tips cepat untuk kamu: 💪

- 🚫 **Jika ingin merokok**: Tarik napas dalam 10 kali
- 💧 **Minum air putih**: Hidrasi membantu mengurangi craving  
- 🚶‍♂️ **Bergerak**: Berdiri dan stretching 2 menit
- 🎵 **Musik**: Dengarkan lagu favorit

[TIP]Coba refresh halaman atau kirim pesan lagi. Saya akan berusaha memberikan respons yang lebih baik![/TIP]`;

        addMessage(emergencyResponse, false);
        showToast('Terjadi kesalahan, tapi saya tetap bisa membantu!', 'error');
    }
    
    isTyping = false;
    sendBtn.disabled = false;
    chatInput.focus();
    console.log('🏁 handleSendMessage completed');
}
        // Initialize marked for markdown parsing
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false
    });
}

// Global variables
let conversationHistory = [];
let isTyping = false;
let chatMessages, chatInput, sendBtn, scrollBtn;
let isVoiceRecording = false;
let settings = {
    autoScroll: true,
    soundEnabled: true,
    showTimestamps: true,
    chatTheme: 'light'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Starting initialization');
    initializeApp();
});

function initializeApp() {
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
    
    // Load settings
    loadSettings();
    
    // Setup event listeners
    console.log('⚙️ Setting up event listeners...');
    setupInputListeners();
    setupScrollDetection();
    setupKeyboardShortcuts();
    setupClickListeners(); // Add click listeners for user interaction
    
    // Focus on input
    if (chatInput) {
        chatInput.focus();
        console.log('🎯 Input focused');
        chatInput.placeholder = 'Ketik pesan dan tekan Enter atau klik kirim...';
    }
    
    // Show welcome message
    setTimeout(() => {
        console.log('👋 Showing welcome message');
        showWelcomeMessage();
    }, 800);
    
    console.log('✅ Initialization complete!');
}

function setupClickListeners() {
    // Add click listeners to mark user interaction
    document.addEventListener('click', function() {
        if (!hasUserInteracted) {
            hasUserInteracted = true;
            initAudioContext();
            console.log('👤 User interaction detected via click - audio enabled');
        }
    }, { once: true });
    
    // Also listen for send button clicks
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                initAudioContext();
            }
        });
    }
}

// Settings Management
function loadSettings() {
    const savedSettings = localStorage.getItem('puffoff_chat_settings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
    applySettings();
}

function saveSettings() {
    localStorage.setItem('puffoff_chat_settings', JSON.stringify(settings));
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

function toggleSettings() {
    const settingsPanel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('overlay');
    
    if (settingsPanel.classList.contains('show')) {
        settingsPanel.classList.remove('show');
        overlay.classList.remove('show');
    } else {
        settingsPanel.classList.add('show');
        overlay.classList.add('show');
        setupSettingsListeners();
    }
}

function setupSettingsListeners() {
    const autoScrollCheckbox = document.getElementById('autoScroll');
    const soundEnabledCheckbox = document.getElementById('soundEnabled');
    const showTimestampsCheckbox = document.getElementById('showTimestamps');
    const chatThemeSelect = document.getElementById('chatTheme');
    
    autoScrollCheckbox?.addEventListener('change', function() {
        settings.autoScroll = this.checked;
        saveSettings();
    });
    
    soundEnabledCheckbox?.addEventListener('change', function() {
        settings.soundEnabled = this.checked;
        saveSettings();
    });
    
    showTimestampsCheckbox?.addEventListener('change', function() {
        settings.showTimestamps = this.checked;
        saveSettings();
        // Refresh messages to show/hide timestamps
        refreshMessageTimestamps();
    });
    
    chatThemeSelect?.addEventListener('change', function() {
        settings.chatTheme = this.value;
        saveSettings();
        applySettings();
    });
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
    
    settingsPanel?.classList.remove('show');
    overlay?.classList.remove('show');
}

// Message Formatting
function formatMessage(text) {
    let formattedText = text;
    
    // Convert markdown to HTML
    if (typeof marked !== 'undefined') {
        formattedText = marked.parse(formattedText);
    }
    
    // Enhanced info boxes
    formattedText = formattedText.replace(/\[INFO\](.*?)\[\/INFO\]/gs, '<div class="info-box"><strong>ℹ️ Informasi:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[WARNING\](.*?)\[\/WARNING\]/gs, '<div class="warning-box"><strong>⚠️ Peringatan:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[SUCCESS\](.*?)\[\/SUCCESS\]/gs, '<div class="success-box"><strong>✅ Berhasil:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[TIP\](.*?)\[\/TIP\]/gs, '<div class="tip-box"><strong>💡 Tips:</strong><br>$1</div>');
    
    // Format special PuffOff content
    formattedText = formattedText.replace(/\[MOTIVATION\](.*?)\[\/MOTIVATION\]/gs, '<div class="success-box"><strong>💪 Motivasi:</strong><br>$1</div>');
    formattedText = formattedText.replace(/\[HEALTH\](.*?)\[\/HEALTH\]/gs, '<div class="info-box"><strong>❤️ Kesehatan:</strong><br>$1</div>');
    
    return formattedText;
}

// Time and Date Functions
function getCurrentTime() {
    return new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getRelativeTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
}

// Message Management
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
    
    // Add message status for user messages
    if (isUser) {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'message-status status-sent';
        bubbleDiv.appendChild(statusDiv);
    }
    
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

let audioContext = null;
let hasUserInteracted = false;

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
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        console.log('Could not play notification sound:', error);
    }
}

// Typing Indicator
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

// Quick Replies
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
    
    if (message.includes('stress') || message.includes('cemas')) {
        return ['Teknik relaksasi', 'Olahraga ringan', 'Musik tenang'];
    }
    
    return ['Terima kasih', 'Tanya lagi', 'Bantuan lain'];
}

// API Communication dengan debugging yang lebih detail
async function getBotResponse(userMessage) {
    console.log('🤖 Starting getBotResponse with message:', userMessage);
    
    // SELALU gunakan fallback untuk testing - hapus komentar ini setelah API fixed
    console.log('🔄 Using fallback response for testing...');
    return getFallbackResponse(userMessage);
    
    
    try {
        console.log('📡 Making fetch request to API...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('⏰ Request timeout after 10 seconds');
            controller.abort();
        }, 10000);
        
        const requestBody = { 
            message: userMessage,
            history: conversationHistory.slice(-3)
        };
        
        console.log('📤 Sending request body:', requestBody);
        
        const response = await fetch('https://puffoff-api.vercel.app/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', [...response.headers.entries()]);
        
        if (!response.ok) {
            console.error('❌ HTTP error! status:', response.status);
            const errorText = await response.text();
            console.error('❌ Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
            console.log('✅ Parsed JSON response:', data);
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            throw new Error('Invalid JSON response from API');
        }
        
        const botResponse = data.reply || data.response || data.message || data.answer || data.text;
        
        if (!botResponse) {
            console.warn('⚠️ No valid response field found in API response');
            console.log('📊 Available fields:', Object.keys(data));
            throw new Error('No valid response from API');
        }
        
        console.log('🗣️ Bot response found:', botResponse.substring(0, 100) + '...');
        
        // Small delay for natural feel
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return botResponse;
        
    } catch (error) {
        console.error('❌ API Error:', error.name, error.message);
        
        if (error.name === 'AbortError') {
            console.log('🔄 Request timeout - using fallback...');
        } else {
            console.log('🔄 API error - using fallback...');
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
        return getFallbackResponse(userMessage);
    }
    
}

// Fallback Responses yang lebih comprehensive
function getFallbackResponse(userMessage) {
    console.log('🔄 getFallbackResponse called with:', userMessage);
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.includes('halo') || message.includes('hai') || message.includes('hello') || message.includes('hi')) {
        console.log('💡 Using greeting response');
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
    if (message.includes('keinginan merokok') || message.includes('ingin merokok') || message.includes('craving') || message.includes('ngidam rokok')) {
        console.log('💡 Using smoking craving response');
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

## Tips Jangka Panjang:
- Identifikasi trigger kamu
- Siapkan aktivitas pengganti
- Bergabung dengan support group
- Reward diri saat berhasil menahan

[MOTIVATION]Ingat, setiap kali kamu berhasil mengatasi keinginan merokok, kamu semakin kuat! 💪[/MOTIVATION]`;
    }
    
    // Stress management
    if (message.includes('stress') || message.includes('cemas') || message.includes('tegang') || message.includes('gelisah')) {
        console.log('💡 Using stress management response');
        return `# Mengelola Stress Tanpa Rokok 🧘

[HEALTH]Stress adalah trigger utama keinginan merokok. Mari kelola dengan cara sehat![/HEALTH]

## Teknik Relaksasi Cepat:
- **Deep Breathing**: Napas dalam selama 5 menit
- **Progressive Muscle Relaxation**: Tegang-rileks otot secara bertahap
- **Mindfulness**: Fokus pada saat ini, bukan kekhawatiran
- **Grounding 5-4-3-2-1**: 5 hal yang dilihat, 4 yang disentuh, 3 yang didengar, 2 yang dicium, 1 yang dirasa

## Aktivitas Anti-Stress:
- 🚶‍♂️ **Jalan kaki**: 10-15 menit di luar ruangan
- 🎵 **Musik**: Dengarkan musik yang menenangkan
- ✍️ **Journaling**: Tulis perasaan dan pikiran
- 🛁 **Mandi hangat**: Relaksasi untuk tubuh dan pikiran
- 📚 **Baca buku**: Alihkan pikiran ke hal positif

## Jangka Panjang:
- Olahraga teratur (minimal 30 menit/hari)
- Tidur cukup (7-8 jam/malam)
- Hindari kafein berlebihan
- Praktik meditasi rutin

[TIP]Stress adalah normal, yang penting adalah cara kita mengatasinya dengan sehat![/TIP]`;
    }
    
    // Health benefits
    if (message.includes('manfaat') && (message.includes('berhenti merokok') || message.includes('quit') || message.includes('kesehatan'))) {
        console.log('💡 Using health benefits response');
        return `# Manfaat Luar Biasa Berhenti Merokok ❤️

[HEALTH]Tubuhmu mulai membaik dalam hitungan menit setelah rokok terakhir![/HEALTH]

## Timeline Pemulihan:
- **20 menit**: Detak jantung dan tekanan darah turun
- **12 jam**: Kadar karbon monoksida dalam darah normal
- **2 minggu**: Sirkulasi membaik, fungsi paru meningkat
- **1-9 bulan**: Batuk dan sesak napas berkurang
- **1 tahun**: Risiko penyakit jantung turun 50%
- **5 tahun**: Risiko stroke sama dengan non-perokok
- **10 tahun**: Risiko kanker paru turun 50%

## Manfaat yang Langsung Terasa:
- 💰 **Finansial**: Hemat jutaan rupiah per tahun
- 👃 **Penciuman**: Kembali normal dalam 2 minggu
- 👅 **Pengecapan**: Makanan terasa lebih enak
- 🦷 **Gigi**: Lebih putih dan nafas lebih segar
- 👨‍👩‍👧‍👦 **Keluarga**: Melindungi dari bahaya asap rokok sekunder
- 🏃 **Stamina**: Energi dan daya tahan meningkat drastis
- 😴 **Tidur**: Kualitas tidur lebih baik

[SUCCESS]Kamu sudah membuat keputusan terbaik untuk hidupmu! Setiap hari bebas rokok adalah investasi kesehatan! 🌟[/SUCCESS]`;
    }
    
    // Motivation
    if (message.includes('motivasi') || message.includes('semangat') || message.includes('inspirasi')) {
        console.log('💡 Using motivation response');
        return `# Motivasi Harian Bebas Rokok 💪

[MOTIVATION]Kamu lebih kuat dari kebiasaan lama! Setiap hari tanpa rokok adalah kemenangan besar.[/MOTIVATION]

## Quotes Inspiratif:
> "Kekuatan tidak berasal dari kemampuan fisik. Kekuatan berasal dari tekad yang tidak dapat dikalahkan." - Mahatma Gandhi

> "Perubahan dimulai dari ujung zona nyaman kamu."

> "Kamu tidak bisa mengubah masa lalu, tapi kamu bisa mengubah masa depan."

## Ingat Alasan Kuat Kamu:
- ❤️ **Kesehatan**: Hidup lebih lama dan berkualitas
- 👨‍👩‍👧‍👦 **Keluarga**: Menjadi role model yang baik untuk anak
- 💰 **Finansial**: Uang untuk investasi masa depan
- 🌱 **Prestasi Pribadi**: Membuktikan kamu bisa berubah
- 🌍 **Lingkungan**: Turut menjaga bumi dari polusi

## Afirmasi Positif Harian:
- "Saya memilih kesehatan daripada rokok"
- "Setiap napas bebas rokok membuat saya lebih kuat"
- "Saya layak mendapat hidup yang sehat dan bahagia"
- "Saya bangga dengan keputusan berhenti merokok"

[TIP]Buat reminder di HP kamu dengan quotes motivasi ini! Set alarm harian dengan pesan positif![/TIP]`;
    }
    
    // Money savings calculation
    if (message.includes('uang') || message.includes('hemat') || message.includes('penghematan') || message.includes('hitung') || message.includes('biaya')) {
        console.log('💡 Using money savings response');
        return `# Kalkulator Penghematan PuffOff 💰

[SUCCESS]Mari hitung berapa banyak uang yang sudah dan akan kamu hemat![/SUCCESS]

## Asumsi Perhitungan:
- **Harga rokok**: Rp 25.000 per bungkus (rata-rata)
- **Konsumsi**: 1 bungkus per hari
- **Biaya harian**: Rp 25.000

## Perhitungan Penghematan:
- **1 hari**: Rp 25.000
- **1 minggu**: Rp 175.000
- **1 bulan**: Rp 750.000
- **3 bulan**: Rp 2.250.000
- **6 bulan**: Rp 4.500.000
- **1 tahun**: Rp 9.125.000
- **5 tahun**: Rp 45.625.000

## Investasi Alternatif dengan Rp 750.000/bulan:
- 🏠 **DP Rumah**: Dalam 5 tahun bisa terkumpul Rp 45 juta
- 📚 **Pendidikan**: Kursus bahasa asing atau sertifikasi
- 🏥 **Asuransi Kesehatan**: Proteksi keluarga yang lengkap
- 🚗 **Kendaraan**: Cicilan motor atau mobil bekas
- 💎 **Emas**: Investasi yang nilainya cenderung naik
- 📈 **Reksadana**: Investasi untuk masa depan

[TIP]Buat rekening khusus "tabungan rokok" dan transfer Rp 25.000 setiap hari! Lihat hasilnya dalam 1 bulan![/TIP]`;
    }
    
    // How to quit smoking
    if (message.includes('cara berhenti') || message.includes('bagaimana berhenti') || message.includes('tips berhenti') || message.includes('quit smoking')) {
        console.log('💡 Using how to quit response');
        return `# Panduan Lengkap Berhenti Merokok 🎯

[INFO]Berhenti merokok adalah proses, bukan event satu kali. Setiap orang punya cara yang berbeda![/INFO]

## Langkah Persiapan:
1. **Tentukan tanggal quit**: Pilih hari yang tidak stressful
2. **Beritahu orang terdekat**: Minta dukungan keluarga/teman
3. **Buang semua rokok**: Termasuk asbak dan korek api
4. **Identifikasi trigger**: Kapan biasanya kamu merokok?
5. **Siapkan alternatif**: Permen, snack sehat, atau fidget toy

## Metode Berhenti:
- **Cold Turkey**: Berhenti total sekaligus (paling efektif)
- **Gradual**: Kurangi bertahap (lebih mudah tapi kurang efektif)
- **Nicotine Replacement**: Patch, gum, atau vape (konsultasi dokter)

## Strategi Mengatasi Withdrawal:
- Hari 1-3: Yang paling berat, minum banyak air
- Minggu 1: Hindari tempat yang biasa merokok
- Minggu 2-4: Cari hobi baru, olahraga rutin
- Bulan 2-3: Tetap waspada, jangan lengah

## Tips Sukses:
- 🏃‍♂️ Olahraga teratur untuk mengurangi stress
- 🥗 Makan makanan sehat, hindari alkohol
- 😴 Tidur cukup untuk recovery tubuh
- 🧘 Meditasi atau yoga untuk ketenangan pikiran
- 👥 Bergabung dengan support group

[MOTIVATION]Jutaan orang sudah berhasil berhenti merokok. Kamu pasti bisa! 💪[/MOTIVATION]`;
    }
    
    // Default responses with more variety
    console.log('💡 Using default response');
    const defaultResponses = [
        `# Halo! Selamat datang di PuffBot! 👋

Saya **PuffBot**, asisten AI yang siap membantu perjalanan bebas rokok kamu.

## Yang bisa saya bantu:
- 🚫 **Tips mengatasi keinginan merokok**
- ❤️ **Informasi manfaat kesehatan**  
- 💪 **Motivasi dan dukungan harian**
- 💰 **Perhitungan penghematan uang**
- 🎯 **Strategi berhenti merokok**
- 🧘 **Teknik mengelola stress**

[TIP]Coba tanyakan sesuatu seperti "Bagaimana cara mengatasi keinginan merokok?" atau pilih prompt cepat di bawah![/TIP]

**Apa yang ingin kamu ketahui hari ini?** 😊`,

        `# Terima kasih sudah bertanya! 💭

Setiap pertanyaan adalah langkah menuju hidup bebas rokok yang lebih sehat.

## Topik Populer:
- Tips mengatasi craving rokok
- Manfaat kesehatan berhenti merokok  
- Cara mengelola stress tanpa rokok
- Motivasi untuk tetap konsisten
- Penghematan uang dari berhenti merokok

[INFO]Saya siap membantu dengan informasi praktis dan dukungan yang kamu butuhkan![/INFO]

**Ada hal spesifik yang ingin kamu tanyakan?**`,

        `# Bagus sekali kamu bertanya! 🌟

Mencari informasi adalah tanda kamu serius ingin berubah ke hidup yang lebih sehat.

## Saya bisa membantu dengan:
- Strategi praktis berhenti merokok
- Tips mengatasi tantangan withdrawal
- Informasi kesehatan yang akurat
- Motivasi ketika kamu merasa down
- Perhitungan manfaat finansial

[MOTIVATION]Ingat, kamu tidak sendirian dalam perjalanan ini. Jutaan orang sudah berhasil, dan kamu juga pasti bisa! 💪[/MOTIVATION]

**Ceritakan, apa yang paling kamu butuhkan sekarang?**`
    ];
    
    const selectedResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    console.log('🎲 Selected default response:', selectedResponse.substring(0, 50) + '...');
    
    return selectedResponse;
}

// Message Sending
async function handleSendMessage() {
    console.log('🚀 handleSendMessage function called');
    
    if (!hasUserInteracted) {
        hasUserInteracted = true;
        initAudioContext();
    }
    
    if (!chatInput) {
        console.error('❌ Chat input not found!');
        return;
    }
    
    const message = chatInput.value.trim();
    console.log('📝 Message to send:', `"${message}"`);
    
    if (!message) {
        console.warn('⚠️ Empty message, not sending');
        return;
    }
    
    if (isTyping) {
        console.warn('⚠️ Bot is typing, please wait');
        showToast('Tunggu sebentar, bot sedang mengetik...', 'warning');
        return;
    }
    
    console.log('✅ Message validation passed, proceeding...');
    
    try {
        // Add user message
        console.log('👤 Adding user message to chat');
        addMessage(message, true);
        
        // Clear input and set typing state
        chatInput.value = '';
        autoResizeTextarea();
        sendBtn.disabled = true;
        isTyping = true;
        
        console.log('🔄 Input cleared, showing typing indicator');
        
        // Show typing indicator IMMEDIATELY
        showTypingIndicator();
        
        // Get bot response
        console.log('🤖 Calling API...');
        const response = await getBotResponse(message);
        console.log('💬 Bot response received:', response.substring(0, 100) + '...');
        
        // Hide typing indicator
        console.log('⏹️ Hiding typing indicator');
        hideTypingIndicator();
        
        // Add bot response
        addMessage(response, false, true);
        console.log('✅ Bot message added to chat');
        
    } catch (error) {
        console.error('❌ Error in handleSendMessage:', error);
        hideTypingIndicator();
        addMessage('[WARNING]Maaf, terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat.[/WARNING]', false);
        showToast('Terjadi kesalahan, silakan coba lagi', 'error');
    }
    
    isTyping = false;
    sendBtn.disabled = false;
    chatInput.focus();
    console.log('🏁 handleSendMessage completed');
}

function sendQuickMessage(message) {
    console.log('⚡ Quick message:', message);
    
    if (!hasUserInteracted) {
        hasUserInteracted = true;
        initAudioContext();
    }
    
    chatInput.value = message;
    handleSendMessage();
}

// Scroll Management
function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        scrollBtn?.classList.remove('show');
    }
}

// Input Management
function autoResizeTextarea() {
    if (chatInput) {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    }
}

function setupInputListeners() {
    if (!chatInput) return;
    
    // Mark user interaction for audio context
    const markUserInteraction = () => {
        if (!hasUserInteracted) {
            hasUserInteracted = true;
            initAudioContext();
            console.log('👤 User interaction detected - audio enabled');
        }
    };
    
    // Auto-resize textarea and enable/disable send button
    chatInput.addEventListener('input', function() {
        markUserInteraction();
        console.log('📝 Input event triggered:', this.value.length, 'characters');
        
        autoResizeTextarea();
        
        const hasValue = this.value.trim().length > 0;
        if (sendBtn) {
            sendBtn.disabled = !hasValue || isTyping;
            console.log('🔘 Send button state:', hasValue && !isTyping ? 'enabled' : 'disabled');
        }
    });

    // Send message on Enter (but not Shift+Enter)
    chatInput.addEventListener('keypress', function(e) {
        markUserInteraction();
        console.log('⌨️ Keypress:', e.key, 'Shift held:', e.shiftKey);
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('🚀 Enter key - calling handleSendMessage()');
            handleSendMessage();
        }
    });

    // Handle paste events
    chatInput.addEventListener('paste', function(e) {
        markUserInteraction();
        setTimeout(() => {
            autoResizeTextarea();
        }, 10);
    });
    
    // Mark interaction on focus
    chatInput.addEventListener('focus', markUserInteraction);
    chatInput.addEventListener('click', markUserInteraction);
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
        
        // Ctrl/Cmd + / to show shortcuts help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showShortcutsHelp();
        }
    });
}

function showShortcutsHelp() {
    const shortcuts = [
        'Ctrl+K - Focus pada input chat',
        'Enter - Kirim pesan',
        'Shift+Enter - Baris baru',
        'Escape - Tutup modal',
        'Ctrl+/ - Tampilkan bantuan shortcut'
    ];
    
    const helpMessage = `# Keyboard Shortcuts ⌨️

${shortcuts.map(shortcut => `- **${shortcut}**`).join('\n')}

[TIP]Gunakan shortcut ini untuk navigasi yang lebih cepat![/TIP]`;
    
    addMessage(helpMessage, false);
}

// Welcome Message
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
- 👥 **Info komunitas dan support group**

---

[TIP]Cobalah mengetik pertanyaan seperti "Bagaimana cara mengatasi keinginan merokok?" atau pilih prompt cepat di bawah![/TIP]

**Apa yang ingin kamu tanyakan hari ini?** 😊`;
    
    setTimeout(() => {
        addMessage(welcomeMessage, false, true);
    }, 500);
}

// Chat Management
function clearChat() {
    if (confirm('Hapus semua percakapan? Data tidak dapat dikembalikan.')) {
        chatMessages.innerHTML = '';
        conversationHistory = [];
        showWelcomeMessage();
        showToast('Chat berhasil dibersihkan', 'info');
        
        // Save cleared state
        localStorage.removeItem('puffoff_conversation_history');
    }
}

function exportChat() {
    if (conversationHistory.length === 0) {
        showToast('Tidak ada percakapan untuk diekspor', 'warning');
        return;
    }
    
    showExportModal();
}

// Export Functionality
function showExportModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: modalSlideUp 0.3s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideUp {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 25px;">
            <h3 style="color: #1f2937; margin-bottom: 8px; font-size: 1.3rem;">📤 Export Chat</h3>
            <p style="color: #6b7280; font-size: 0.9rem;">Pilih format file yang diinginkan</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <button onclick="exportAsText()" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 16px 20px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                📄 Export sebagai Text (.txt)
            </button>
            
            <button onclick="exportAsHTML()" style="
                background: white;
                color: #667eea;
                border: 2px solid #667eea;
                padding: 16px 20px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            " onmouseover="this.style.background='#667eea'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='#667eea'">
                🌐 Export sebagai HTML
            </button>
            
            <button onclick="exportAsJSON()" style="
                background: #f8fafc;
                color: #374151;
                border: 1px solid #e2e8f0;
                padding: 16px 20px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            " onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f8fafc'">
                ⚙️ Export sebagai JSON (Advanced)
            </button>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="closeExportModal()" style="
                background: transparent;
                color: #6b7280;
                border: none;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 0.9rem;
            ">
                ✕ Batal
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Store modal reference globally
    window.currentExportModal = modal;
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeExportModal();
        }
    });
}

function closeExportModal() {
    if (window.currentExportModal) {
        window.currentExportModal.style.opacity = '0';
        window.currentExportModal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (window.currentExportModal) {
                document.body.removeChild(window.currentExportModal);
                window.currentExportModal = null;
            }
        }, 200);
    }
}

function exportAsText() {
    const timestamp = new Date().toLocaleString('id-ID');
    let textContent = `PERCAKAPAN PUFFOFF AI HELPER
=================================
Diekspor pada: ${timestamp}
Total pesan: ${conversationHistory.length}

`;

    conversationHistory.forEach((msg, index) => {
        const time = new Date(msg.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const sender = msg.isUser ? 'ANDA' : 'PUFFBOT';
        const content = msg.content.replace(/\[.*?\]/g, '').replace(/#{1,6}\s*/g, '').replace(/\*\*(.*?)\*\*/g, '$1');
        
        textContent += `[${time}] ${sender}:
${content}

`;
    });

    textContent += `
=================================
Diekspor dari PuffOff AI Helper
https://puffoff.app
`;

    downloadFile(textContent, `puffoff_chat_${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
    closeExportModal();
    showToast('Chat berhasil diekspor sebagai file teks!', 'success');
}

function exportAsHTML() {
    const timestamp = new Date().toLocaleString('id-ID');
    let htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Percakapan PuffOff AI Helper</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        .header {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .message {
            margin: 15px 0;
            display: flex;
        }
        .message-user {
            justify-content: flex-end;
        }
        .message-bot {
            justify-content: flex-start;
        }
        .message-bubble {
            max-width: 70%;
            padding: 15px 20px;
            border-radius: 18px;
            position: relative;
        }
        .message-user .message-bubble {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 6px;
        }
        .message-bot .message-bubble {
            background: white;
            border: 1px solid #e2e8f0;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .timestamp {
            font-size: 0.8em;
            opacity: 0.7;
            margin-top: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 15px;
            color: #6b7280;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 Percakapan PuffOff AI Helper</h1>
        <p>Diekspor pada: ${timestamp}</p>
        <p>Total pesan: ${conversationHistory.length}</p>
    </div>
    
    <div class="conversation">`;

    conversationHistory.forEach((msg, index) => {
        const time = new Date(msg.timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const messageClass = msg.isUser ? 'message-user' : 'message-bot';
        const cleanContent = msg.content
            .replace(/\[INFO\](.*?)\[\/INFO\]/gs, '<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 8px 0; border-radius: 6px;"><strong>ℹ️ Informasi:</strong><br>$1</div>')
            .replace(/\[TIP\](.*?)\[\/TIP\]/gs, '<div style="background: #faf5ff; border-left: 4px solid #8b5cf6; padding: 12px; margin: 8px 0; border-radius: 6px;"><strong>💡 Tips:</strong><br>$1</div>')
            .replace(/\[SUCCESS\](.*?)\[\/SUCCESS\]/gs, '<div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; margin: 8px 0; border-radius: 6px;"><strong>✅ Berhasil:</strong><br>$1</div>')
            .replace(/\[WARNING\](.*?)\[\/WARNING\]/gs, '<div style="background: #fefce8; border-left: 4px solid #f59e0b; padding: 12px; margin: 8px 0; border-radius: 6px;"><strong>⚠️ Peringatan:</strong><br>$1</div>')
            .replace(/\[MOTIVATION\](.*?)\[\/MOTIVATION\]/gs, '<div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px; margin: 8px 0; border-radius: 6px;"><strong>💪 Motivasi:</strong><br>$1</div>')
            .replace(/\[HEALTH\](.*?)\[\/HEALTH\]/gs, '<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 8px 0; border-radius: 6px;"><strong>❤️ Kesehatan:</strong><br>$1</div>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/#{1,6}\s*(.*?)$/gm, '<h3>$1</h3>')
            .replace(/\n/g, '<br>');
        
        htmlContent += `
        <div class="message ${messageClass}">
            <div class="message-bubble">
                <div class="message-content">${cleanContent}</div>
                <div class="timestamp">${time}</div>
            </div>
        </div>`;
    });

    htmlContent += `
    </div>
    
    <div class="footer">
        Diekspor dari PuffOff AI Helper<br>
        <a href="https://puffoff.app" style="color: #667eea;">https://puffoff.app</a>
    </div>
</body>
</html>`;

    downloadFile(htmlContent, `puffoff_chat_${new Date().toISOString().split('T')[0]}.html`, 'text/html');
    closeExportModal();
    showToast('Chat berhasil diekspor sebagai file HTML!', 'success');
}

function exportAsJSON() {
    const chatData = {
        exported_at: new Date().toISOString(),
        app: 'PuffOff AI Helper',
        version: '2.0',
        conversation_count: conversationHistory.length,
        settings: settings,
        conversations: conversationHistory
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    downloadFile(dataStr, `puffoff_chat_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    closeExportModal();
    showToast('Chat berhasil diekspor sebagai file JSON!', 'success');
}

function downloadFile(content, filename, mimeType) {
    const dataBlob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Voice Input (placeholder for future implementation)
function toggleVoiceInput() {
    const voiceBtn = document.querySelector('.input-btn i.fa-microphone').parentElement;
    
    if (!isVoiceRecording) {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            startVoiceRecognition(voiceBtn);
        } else {
            showToast('Browser tidak mendukung voice recognition', 'warning');
        }
    } else {
        stopVoiceRecognition(voiceBtn);
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
        chatInput.value = transcript;
        autoResizeTextarea();
        sendBtn.disabled = false;
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

// File Attachment (placeholder)
function attachFile() {
    showToast('Fitur upload file akan segera hadir!', 'info');
}

// Toast Notifications
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

// Data Persistence
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
            conversationHistory = JSON.parse(saved);
            // Restore messages to chat
            conversationHistory.forEach(msg => {
                addMessage(msg.content, msg.isUser, false);
            });
        }
    } catch (error) {
        console.warn('Could not load conversation history:', error);
    }
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
