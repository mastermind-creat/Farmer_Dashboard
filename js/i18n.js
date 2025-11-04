// Internationalization (i18n) - Multi-Language Support
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.dashboard': 'Dashboard',
        'nav.iot': 'IoT Dashboard',
        'nav.logout': 'Logout',
        
        // Homepage
        'home.title': 'Smart Irrigation Advisory for Small-Scale Farmers',
        'home.subtitle': 'Optimize water usage with real-time weather data and intelligent recommendations',
        'home.cta': 'Get Started Now - It\'s Free',
        'home.features': 'Features',
        'home.howItWorks': 'How It Works',
        
        // Features
        'feature.weather': 'Real-Time Weather',
        'feature.weather.desc': 'Get live weather updates for your farm location',
        'feature.advisory': 'Smart Advisory',
        'feature.advisory.desc': 'AI-powered irrigation recommendations',
        'feature.analytics': 'Data Analytics',
        'feature.analytics.desc': 'Track water usage and optimize irrigation',
        'feature.iot': 'IoT Integration',
        'feature.iot.desc': 'Connect sensors for automated monitoring',
        
        // Dashboard
        'dashboard.welcome': 'Welcome to Your Dashboard',
        'dashboard.profile': 'Farm Profile',
        'dashboard.weather': 'Weather Data',
        'dashboard.irrigation': 'Irrigation Advisory',
        'dashboard.analytics': 'Analytics',
        'dashboard.tips': 'Daily Tips',
        
        // Weather
        'weather.temperature': 'Temperature',
        'weather.humidity': 'Humidity',
        'weather.rainfall': 'Rainfall',
        'weather.wind': 'Wind Speed',
        'weather.forecast': '7-Day Forecast',
        'weather.loading': 'Loading weather data...',
        'weather.error': 'Failed to load weather data',
        
        // Irrigation
        'irrigation.recommendation': 'Recommendation',
        'irrigation.waterAmount': 'Water Amount',
        'irrigation.frequency': 'Frequency',
        'irrigation.status': 'Status',
        'irrigation.optimal': 'Optimal',
        'irrigation.required': 'Required',
        'irrigation.notNeeded': 'Not Needed',
        
        // Profile
        'profile.farmName': 'Farm Name',
        'profile.county': 'County',
        'profile.cropType': 'Crop Type',
        'profile.soilType': 'Soil Type',
        'profile.farmSize': 'Farm Size',
        'profile.save': 'Save Profile',
        'profile.cancel': 'Cancel',
        'profile.setup': 'Set Up Profile',
        
        // IoT
        'iot.soilMoisture': 'Soil Moisture',
        'iot.pumpControl': 'Pump Control',
        'iot.manual': 'Manual',
        'iot.automatic': 'Automatic',
        'iot.startPump': 'Start Pump',
        'iot.stopPump': 'Stop Pump',
        'iot.pumpActive': 'Pump Active',
        'iot.pumpIdle': 'Pump Idle',
        'iot.sensorFeed': 'Live Sensor Feed',
        'iot.analytics': 'Sensor Analytics',
        
        // Common
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.close': 'Close',
        'common.refresh': 'Refresh',
        'common.login': 'Login',
        'common.register': 'Register',
        'common.email': 'Email',
        'common.password': 'Password',
        'common.fullName': 'Full Name',
        
        // Counties
        'county.select': 'Select County',
        'county.nairobi': 'Nairobi',
        'county.mombasa': 'Mombasa',
        'county.kisumu': 'Kisumu',
        
        // Crops
        'crop.maize': 'Maize',
        'crop.beans': 'Beans',
        'crop.tomatoes': 'Tomatoes',
        'crop.cabbage': 'Cabbage',
        'crop.potatoes': 'Potatoes',
        
        // Soil
        'soil.sandy': 'Sandy',
        'soil.loamy': 'Loamy',
        'soil.clay': 'Clay',
        'soil.silt': 'Silt',
        
        // Messages
        'msg.loginSuccess': 'Login successful!',
        'msg.registerSuccess': 'Registration successful!',
        'msg.profileSaved': 'Profile saved successfully!',
        'msg.error': 'An error occurred. Please try again.',
        
        // Voice Commands
        'voice.listening': 'Listening...',
        'voice.speak': 'Speak now',
        'voice.notSupported': 'Voice commands not supported in this browser'
    },
    
    sw: {
        // Navigation
        'nav.home': 'Nyumbani',
        'nav.dashboard': 'Dashibodi',
        'nav.iot': 'Dashibodi ya IoT',
        'nav.logout': 'Toka',
        
        // Homepage
        'home.title': 'Ushauri wa Umwagiliaji Mahiri kwa Wakulima Wadogo',
        'home.subtitle': 'Boresha matumizi ya maji kwa data ya hali ya hewa ya wakati halisi na mapendekezo mahiri',
        'home.cta': 'Anza Sasa - Ni Bure',
        'home.features': 'Vipengele',
        'home.howItWorks': 'Jinsi Inavyofanya Kazi',
        
        // Features
        'feature.weather': 'Hali ya Hewa ya Wakati Halisi',
        'feature.weather.desc': 'Pata sasisho za hali ya hewa za shamba lako',
        'feature.advisory': 'Ushauri Mahiri',
        'feature.advisory.desc': 'Mapendekezo ya umwagiliaji yanayoendeshwa na AI',
        'feature.analytics': 'Uchanganuzi wa Data',
        'feature.analytics.desc': 'Fuatilia matumizi ya maji na uboreshe umwagiliaji',
        'feature.iot': 'Ujumuishaji wa IoT',
        'feature.iot.desc': 'Unganisha vihisi kwa ufuatiliaji otomatiki',
        
        // Dashboard
        'dashboard.welcome': 'Karibu kwenye Dashibodi Yako',
        'dashboard.profile': 'Wasifu wa Shamba',
        'dashboard.weather': 'Data ya Hali ya Hewa',
        'dashboard.irrigation': 'Ushauri wa Umwagiliaji',
        'dashboard.analytics': 'Uchanganuzi',
        'dashboard.tips': 'Vidokezo vya Kila Siku',
        
        // Weather
        'weather.temperature': 'Joto',
        'weather.humidity': 'Unyevu',
        'weather.rainfall': 'Mvua',
        'weather.wind': 'Kasi ya Upepo',
        'weather.forecast': 'Utabiri wa Siku 7',
        'weather.loading': 'Inapakia data ya hali ya hewa...',
        'weather.error': 'Imeshindwa kupakia data ya hali ya hewa',
        
        // Irrigation
        'irrigation.recommendation': 'Pendekezo',
        'irrigation.waterAmount': 'Kiasi cha Maji',
        'irrigation.frequency': 'Mara kwa Mara',
        'irrigation.status': 'Hali',
        'irrigation.optimal': 'Bora',
        'irrigation.required': 'Inahitajika',
        'irrigation.notNeeded': 'Haihitajiki',
        
        // Profile
        'profile.farmName': 'Jina la Shamba',
        'profile.county': 'Kaunti',
        'profile.cropType': 'Aina ya Mazao',
        'profile.soilType': 'Aina ya Udongo',
        'profile.farmSize': 'Ukubwa wa Shamba',
        'profile.save': 'Hifadhi Wasifu',
        'profile.cancel': 'Ghairi',
        'profile.setup': 'Weka Wasifu',
        
        // IoT
        'iot.soilMoisture': 'Unyevu wa Udongo',
        'iot.pumpControl': 'Udhibiti wa Pampu',
        'iot.manual': 'Mwongozo',
        'iot.automatic': 'Otomatiki',
        'iot.startPump': 'Anzisha Pampu',
        'iot.stopPump': 'Simamisha Pampu',
        'iot.pumpActive': 'Pampu Inafanya Kazi',
        'iot.pumpIdle': 'Pampu Haifanyi Kazi',
        'iot.sensorFeed': 'Mtiririko wa Vihisi vya Moja kwa Moja',
        'iot.analytics': 'Uchanganuzi wa Vihisi',
        
        // Common
        'common.loading': 'Inapakia...',
        'common.error': 'Hitilafu',
        'common.success': 'Mafanikio',
        'common.save': 'Hifadhi',
        'common.cancel': 'Ghairi',
        'common.close': 'Funga',
        'common.refresh': 'Onyesha Upya',
        'common.login': 'Ingia',
        'common.register': 'Jisajili',
        'common.email': 'Barua Pepe',
        'common.password': 'Nywila',
        'common.fullName': 'Jina Kamili',
        
        // Counties
        'county.select': 'Chagua Kaunti',
        'county.nairobi': 'Nairobi',
        'county.mombasa': 'Mombasa',
        'county.kisumu': 'Kisumu',
        
        // Crops
        'crop.maize': 'Mahindi',
        'crop.beans': 'Maharagwe',
        'crop.tomatoes': 'Nyanya',
        'crop.cabbage': 'Kabichi',
        'crop.potatoes': 'Viazi',
        
        // Soil
        'soil.sandy': 'Mchanga',
        'soil.loamy': 'Loam',
        'soil.clay': 'Udongo wa Tope',
        'soil.silt': 'Silt',
        
        // Messages
        'msg.loginSuccess': 'Umeingia kikamilifu!',
        'msg.registerSuccess': 'Usajili umefanikiwa!',
        'msg.profileSaved': 'Wasifu umehifadhiwa kikamilifu!',
        'msg.error': 'Hitilafu imetokea. Tafadhali jaribu tena.',
        
        // Voice Commands
        'voice.listening': 'Inasikiliza...',
        'voice.speak': 'Sema sasa',
        'voice.notSupported': 'Amri za sauti hazitumiki kwenye kivinjari hiki'
    }
};

// Current language
let currentLanguage = localStorage.getItem('language') || 'en';

// Get translation
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Set language
function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageTranslations();
        
        // Update voice recognition language if available
        if (typeof recognition !== 'undefined' && recognition) {
            recognition.lang = lang === 'sw' ? 'sw-KE' : 'en-US';
        }
        
        // Show success notification
        const msg = lang === 'sw' ? 'Lugha imebadilishwa kuwa Kiswahili' : 'Language changed to English';
        alert(msg); // Use alert for now to ensure it shows
        
        console.log('Language changed to:', lang);
    }
}

// Update all translations on page
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update document title if exists
    const titleElement = document.querySelector('[data-i18n-title]');
    if (titleElement) {
        const key = titleElement.getAttribute('data-i18n-title');
        document.title = t(key);
    }
}

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePageTranslations();
    updateLanguageSelector();
});

// Update language selector UI
function updateLanguageSelector() {
    const selector = document.getElementById('languageSelector');
    if (selector) {
        selector.value = currentLanguage;
    }
}

// Create language switcher
function createLanguageSwitcher() {
    return `
        <div class="flex items-center space-x-2">
            <i class="fas fa-language text-gray-600"></i>
            <select id="languageSelector" onchange="setLanguage(this.value)" 
                class="px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="sw" ${currentLanguage === 'sw' ? 'selected' : ''}>Kiswahili</option>
            </select>
        </div>
    `;
}
