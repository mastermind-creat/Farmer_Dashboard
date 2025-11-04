// Voice Commands System
let recognition = null;
let isListening = false;
let voiceButton = null;

// Initialize Speech Recognition
function initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'sw' ? 'sw-KE' : 'en-US';
        
        recognition.onstart = () => {
            isListening = true;
            updateVoiceButton();
            showVoiceIndicator();
        };
        
        recognition.onend = () => {
            isListening = false;
            updateVoiceButton();
            hideVoiceIndicator();
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('Voice command:', transcript);
            processVoiceCommand(transcript);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            updateVoiceButton();
            hideVoiceIndicator();
            
            if (event.error === 'no-speech') {
                showNotification(t('voice.noSpeech') || 'No speech detected', 'warning');
            }
        };
        
        return true;
    }
    return false;
}

// Toggle voice recognition
function toggleVoiceRecognition() {
    if (!recognition) {
        if (!initVoiceRecognition()) {
            showNotification(t('voice.notSupported'), 'error');
            return;
        }
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// Process voice commands
function processVoiceCommand(command) {
    const lang = currentLanguage;
    
    // Weather commands
    if (matchCommand(command, ['weather', 'hali ya hewa', 'what is the weather', 'hali gani'])) {
        speakWeather();
        return;
    }
    
    // Irrigation commands
    if (matchCommand(command, ['irrigation', 'umwagiliaji', 'water', 'maji', 'recommendation', 'pendekezo'])) {
        speakIrrigation();
        return;
    }
    
    // Pump control commands
    if (matchCommand(command, ['start pump', 'anzisha pampu', 'turn on pump', 'washa pampu'])) {
        if (typeof togglePump === 'function') {
            togglePump('on');
            speak(lang === 'sw' ? 'Pampu imeanzishwa' : 'Pump started');
        }
        return;
    }
    
    if (matchCommand(command, ['stop pump', 'simamisha pampu', 'turn off pump', 'zima pampu'])) {
        if (typeof togglePump === 'function') {
            togglePump('off');
            speak(lang === 'sw' ? 'Pampu imesimamishwa' : 'Pump stopped');
        }
        return;
    }
    
    // Moisture level
    if (matchCommand(command, ['moisture', 'unyevu', 'soil moisture', 'unyevu wa udongo'])) {
        speakMoisture();
        return;
    }
    
    // Navigation commands
    if (matchCommand(command, ['dashboard', 'dashibodi', 'go to dashboard'])) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    if (matchCommand(command, ['iot', 'iot dashboard', 'dashibodi ya iot'])) {
        window.location.href = 'dashboard_iot.html';
        return;
    }
    
    // Refresh commands
    if (matchCommand(command, ['refresh', 'onyesha upya', 'reload', 'update'])) {
        location.reload();
        return;
    }
    
    // Help command
    if (matchCommand(command, ['help', 'msaada', 'commands', 'amri'])) {
        speakHelp();
        return;
    }
    
    // Unknown command
    speak(lang === 'sw' ? 'Samahani, sikuelewa amri hiyo' : 'Sorry, I didn\'t understand that command');
}

// Match command with keywords
function matchCommand(command, keywords) {
    return keywords.some(keyword => command.includes(keyword));
}

// Speak weather information
function speakWeather() {
    if (typeof weatherData !== 'undefined' && weatherData) {
        const lang = currentLanguage;
        const temp = weatherData.temperature;
        const humidity = weatherData.humidity;
        const desc = weatherData.description;
        
        let message;
        if (lang === 'sw') {
            message = `Hali ya hewa ni ${desc}. Joto ni digrii ${temp}. Unyevu ni asilimia ${humidity}.`;
        } else {
            message = `The weather is ${desc}. Temperature is ${temp} degrees celsius. Humidity is ${humidity} percent.`;
        }
        
        speak(message);
    } else {
        speak(currentLanguage === 'sw' ? 'Data ya hali ya hewa haipatikani' : 'Weather data not available');
    }
}

// Speak irrigation recommendation
function speakIrrigation() {
    const advisoryElement = document.getElementById('irrigationRecommendation');
    if (advisoryElement) {
        const text = advisoryElement.textContent;
        speak(text);
    } else {
        speak(currentLanguage === 'sw' ? 'Mapendekezo ya umwagiliaji hayapatikani' : 'Irrigation recommendation not available');
    }
}

// Speak moisture level
function speakMoisture() {
    const moistureElement = document.getElementById('moistureValue');
    if (moistureElement) {
        const moisture = moistureElement.textContent;
        const lang = currentLanguage;
        const message = lang === 'sw' 
            ? `Unyevu wa udongo ni asilimia ${moisture}` 
            : `Soil moisture is ${moisture} percent`;
        speak(message);
    } else {
        speak(currentLanguage === 'sw' ? 'Data ya unyevu haipatikani' : 'Moisture data not available');
    }
}

// Speak help information
function speakHelp() {
    const lang = currentLanguage;
    let message;
    
    if (lang === 'sw') {
        message = 'Unaweza kusema: Hali ya hewa, Umwagiliaji, Anzisha pampu, Simamisha pampu, Unyevu, Dashibodi, au Onyesha upya';
    } else {
        message = 'You can say: Weather, Irrigation, Start pump, Stop pump, Moisture, Dashboard, or Refresh';
    }
    
    speak(message);
}

// Text-to-speech
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'sw' ? 'sw-KE' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        speechSynthesis.speak(utterance);
    }
}

// Show voice indicator
function showVoiceIndicator() {
    let indicator = document.getElementById('voiceIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'voiceIndicator';
        indicator.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center space-x-3';
        indicator.innerHTML = `
            <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span class="font-semibold">${t('voice.listening')}</span>
            <i class="fas fa-microphone"></i>
        `;
        document.body.appendChild(indicator);
    }
}

// Hide voice indicator
function hideVoiceIndicator() {
    const indicator = document.getElementById('voiceIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Update voice button appearance
function updateVoiceButton() {
    if (voiceButton) {
        if (isListening) {
            voiceButton.classList.add('bg-red-500', 'text-white');
            voiceButton.classList.remove('bg-white', 'text-gray-700');
        } else {
            voiceButton.classList.remove('bg-red-500', 'text-white');
            voiceButton.classList.add('bg-white', 'text-gray-700');
        }
    }
}

// Create voice button
function createVoiceButton() {
    const button = document.createElement('button');
    button.id = 'voiceButton';
    button.className = 'fixed bottom-20 right-4 bg-white text-gray-700 p-4 rounded-full shadow-lg hover:shadow-xl transition z-40';
    button.innerHTML = '<i class="fas fa-microphone text-xl"></i>';
    button.onclick = toggleVoiceRecognition;
    button.title = 'Voice Commands';
    
    document.body.appendChild(button);
    voiceButton = button;
    
    return button;
}

// Initialize voice system on page load
document.addEventListener('DOMContentLoaded', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        createVoiceButton();
    }
});
