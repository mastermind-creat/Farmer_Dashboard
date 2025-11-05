// Dashboard-specific translations
function translateDashboard() {
    const lang = currentLanguage || 'en';
    
    // Navigation
    const iotLink = document.querySelector('a[href="dashboard_iot.html"]');
    if (iotLink) {
        iotLink.innerHTML = lang === 'sw' 
            ? '<i class="fas fa-microchip mr-2"></i>Dashibodi ya IoT'
            : '<i class="fas fa-microchip mr-2"></i>IoT Dashboard';
    }
    
    // Welcome section
    const welcomeTitle = document.querySelector('.text-3xl.font-bold.text-gray-900');
    if (welcomeTitle && welcomeTitle.textContent.includes('Welcome')) {
        welcomeTitle.textContent = lang === 'sw' 
            ? 'Karibu kwenye Dashibodi Yako'
            : 'Welcome to Your Dashboard';
    }
    
    const welcomeSubtitle = document.querySelector('.text-gray-600');
    if (welcomeSubtitle && welcomeSubtitle.textContent.includes('Monitor')) {
        welcomeSubtitle.textContent = lang === 'sw'
            ? 'Fuatilia mahitaji ya umwagiliaji wa shamba lako na hali ya hewa'
            : 'Monitor your farm\'s irrigation needs and weather conditions';
    }
    
    // Weather card title
    const weatherTitle = document.querySelector('h2.text-2xl');
    if (weatherTitle && weatherTitle.textContent.includes('Weather')) {
        weatherTitle.textContent = lang === 'sw' ? 'Hali ya Hewa ya Sasa' : 'Current Weather';
    }
    
    // Irrigation Advisory title
    const irrigationTitles = document.querySelectorAll('h2.text-2xl');
    irrigationTitles.forEach(title => {
        if (title.textContent.includes('Irrigation Advisory')) {
            title.textContent = lang === 'sw' ? 'Ushauri wa Umwagiliaji' : 'Irrigation Advisory';
        }
    });
    
    // Profile modal
    const profileTitle = document.querySelector('#profileModal h2');
    if (profileTitle) {
        profileTitle.textContent = lang === 'sw' ? 'Wasifu wa Shamba' : 'Farm Profile';
    }
    
    // Buttons
    const saveButtons = document.querySelectorAll('button[type="submit"]');
    saveButtons.forEach(btn => {
        if (btn.textContent.includes('Save Profile')) {
            btn.textContent = lang === 'sw' ? 'Hifadhi Wasifu' : 'Save Profile';
        }
    });
    
    const cancelButtons = document.querySelectorAll('button[onclick*="close"]');
    cancelButtons.forEach(btn => {
        if (btn.textContent.includes('Cancel')) {
            btn.textContent = lang === 'sw' ? 'Ghairi' : 'Cancel';
        }
    });
    
    // Form labels
    translateFormLabels(lang);
}

function translateFormLabels(lang) {
    const labels = document.querySelectorAll('label');
    
    labels.forEach(label => {
        const text = label.textContent.trim();
        
        if (text.includes('Farm Name')) {
            label.innerHTML = lang === 'sw' 
                ? 'Jina la Shamba' 
                : 'Farm Name';
        } else if (text.includes('County')) {
            label.innerHTML = lang === 'sw' 
                ? 'Kaunti <span class="text-red-500">*</span>' 
                : 'County <span class="text-red-500">*</span>';
        } else if (text.includes('Crop Type')) {
            label.innerHTML = lang === 'sw' 
                ? 'Aina ya Mazao <span class="text-red-500">*</span>' 
                : 'Crop Type <span class="text-red-500">*</span>';
        } else if (text.includes('Soil Type')) {
            label.innerHTML = lang === 'sw' 
                ? 'Aina ya Udongo <span class="text-red-500">*</span>' 
                : 'Soil Type <span class="text-red-500">*</span>';
        } else if (text.includes('Farm Size')) {
            label.innerHTML = lang === 'sw' 
                ? 'Ukubwa wa Shamba (ekari)' 
                : 'Farm Size (acres)';
        }
    });
    
    // Translate select options
    translateSelectOptions(lang);
}

function translateSelectOptions(lang) {
    // County select
    const countySelect = document.querySelector('#location');
    if (countySelect && countySelect.options[0]) {
        countySelect.options[0].text = lang === 'sw' ? 'Chagua Kaunti' : 'Select County';
    }
    
    // Crop select
    const cropSelect = document.querySelector('#crop_type');
    if (cropSelect) {
        const crops = {
            '': lang === 'sw' ? 'Chagua Mazao' : 'Select Crop',
            'maize': lang === 'sw' ? 'Mahindi' : 'Maize',
            'beans': lang === 'sw' ? 'Maharagwe' : 'Beans',
            'tomatoes': lang === 'sw' ? 'Nyanya' : 'Tomatoes',
            'cabbage': lang === 'sw' ? 'Kabichi' : 'Cabbage',
            'potatoes': lang === 'sw' ? 'Viazi' : 'Potatoes',
            'wheat': lang === 'sw' ? 'Ngano' : 'Wheat',
            'rice': lang === 'sw' ? 'Mchele' : 'Rice',
            'vegetables': lang === 'sw' ? 'Mboga' : 'Vegetables',
            'fruits': lang === 'sw' ? 'Matunda' : 'Fruits'
        };
        
        Array.from(cropSelect.options).forEach(option => {
            if (crops[option.value] !== undefined) {
                option.text = crops[option.value];
            }
        });
    }
    
    // Soil select
    const soilSelect = document.querySelector('#soil_type');
    if (soilSelect) {
        const soils = {
            '': lang === 'sw' ? 'Chagua Udongo' : 'Select Soil',
            'sandy': lang === 'sw' ? 'Mchanga' : 'Sandy',
            'loamy': lang === 'sw' ? 'Loam' : 'Loamy',
            'clay': lang === 'sw' ? 'Udongo wa Tope' : 'Clay',
            'silt': lang === 'sw' ? 'Silt' : 'Silt'
        };
        
        Array.from(soilSelect.options).forEach(option => {
            if (soils[option.value] !== undefined) {
                option.text = soils[option.value];
            }
        });
    }
}

// Override setLanguage to include dashboard translations
const originalSetLanguage = setLanguage;
setLanguage = function(lang) {
    originalSetLanguage(lang);
    translateDashboard();
    
    // Sync both language selectors
    const desktopSelector = document.getElementById('languageSelector');
    const mobileSelector = document.getElementById('languageSelectorMobile');
    if (desktopSelector) desktopSelector.value = lang;
    if (mobileSelector) mobileSelector.value = lang;
};

// Translate on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        translateDashboard();
        
        // Sync selectors on load
        const lang = currentLanguage || 'en';
        const desktopSelector = document.getElementById('languageSelector');
        const mobileSelector = document.getElementById('languageSelectorMobile');
        if (desktopSelector) desktopSelector.value = lang;
        if (mobileSelector) mobileSelector.value = lang;
    }, 500);
});
