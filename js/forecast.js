// 7-Day Weather Forecast
let forecastData = null;

// Load 7-day forecast
async function load7DayForecast() {
    if (!farmProfile) {
        return;
    }
    
    try {
        let url = 'php/forecast.php?';
        if (farmProfile.latitude && farmProfile.longitude) {
            url += `lat=${farmProfile.latitude}&lon=${farmProfile.longitude}`;
        } else {
            const locationQuery = `${farmProfile.location},Kenya`;
            url += `location=${encodeURIComponent(locationQuery)}`;
        }
        
        // Add cache buster to prevent cached responses
        url += `&_t=${Date.now()}`;
        
        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        const data = await response.json();
        
        if (data.success) {
            forecastData = data;
            displayForecast(data);
        } else {
            showForecastError(data.message);
        }
    } catch (error) {
        console.error('Error loading forecast:', error);
        showForecastError('Failed to load forecast data');
    }
}

// Display forecast
function displayForecast(data) {
    const container = document.getElementById('forecastContainer');
    if (!container) return;
    
    const forecast = data.forecast;
    
    let html = `
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-900 flex items-center">
                    <i class="fas fa-calendar-week text-blue-500 mr-2"></i>
                    <span data-i18n="weather.forecast">7-Day Forecast</span>
                </h3>
                <button onclick="load7DayForecast()" class="text-primary hover:text-secondary transition">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    `;
    
    forecast.forEach((day, index) => {
        const isToday = index === 0;
        const dayLabel = isToday ? 'Today' : day.day_name.substring(0, 3);
        
        html += `
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center hover:shadow-md transition">
                <p class="font-semibold text-gray-800 mb-2">${dayLabel}</p>
                <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" 
                     alt="${day.description}" 
                     class="w-16 h-16 mx-auto">
                <p class="text-sm text-gray-600 capitalize mb-2">${day.description}</p>
                <div class="space-y-1">
                    <p class="text-lg font-bold text-gray-900">
                        ${day.temp_max}°<span class="text-sm text-gray-600">/${day.temp_min}°</span>
                    </p>
                    <p class="text-xs text-gray-600">
                        <i class="fas fa-tint text-blue-500"></i> ${day.humidity}%
                    </p>
                    ${day.rainfall > 0 ? `
                        <p class="text-xs text-blue-600 font-semibold">
                            <i class="fas fa-cloud-rain"></i> ${day.rainfall}mm
                        </p>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-gray-700">
                    <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                    <span class="font-semibold">Irrigation Tip:</span> 
                    ${getForecastTip(forecast)}
                </p>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Get irrigation tip based on forecast
function getForecastTip(forecast) {
    const lang = currentLanguage || 'en';
    
    // Check for upcoming rain
    const rainyDays = forecast.filter(day => day.rainfall > 2).length;
    if (rainyDays >= 3) {
        return lang === 'sw' 
            ? 'Mvua inatarajiwa kwa siku nyingi. Punguza umwagiliaji.' 
            : 'Rain expected for multiple days. Reduce irrigation.';
    }
    
    // Check for dry spell
    const dryDays = forecast.filter(day => day.rainfall === 0).length;
    if (dryDays >= 5) {
        return lang === 'sw' 
            ? 'Ukame unatarajiwa. Panga umwagiliaji wa kutosha.' 
            : 'Dry spell expected. Plan adequate irrigation.';
    }
    
    // Check for high temperatures
    const hotDays = forecast.filter(day => day.temp_max > 30).length;
    if (hotDays >= 4) {
        return lang === 'sw' 
            ? 'Joto kali linatarajiwa. Ongeza umwagiliaji na fanya asubuhi na jioni.' 
            : 'High temperatures expected. Increase irrigation and water morning/evening.';
    }
    
    // Check for cool weather
    const coolDays = forecast.filter(day => day.temp_max < 20).length;
    if (coolDays >= 4) {
        return lang === 'sw' 
            ? 'Hali ya hewa ya baridi inatarajiwa. Punguza umwagiliaji.' 
            : 'Cool weather expected. Reduce irrigation frequency.';
    }
    
    // Default tip
    return lang === 'sw' 
        ? 'Fuatilia hali ya hewa kila siku na urekebishe umwagiliaji kulingana na hali.' 
        : 'Monitor daily weather and adjust irrigation accordingly.';
}

// Show forecast error
function showForecastError(message) {
    const container = document.getElementById('forecastContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div class="text-center py-4 text-red-600">
                <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                <p>${message}</p>
                <button onclick="load7DayForecast()" 
                    class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition">
                    <i class="fas fa-sync-alt mr-2"></i>Retry
                </button>
            </div>
        </div>
    `;
}

// Create forecast container if it doesn't exist
function createForecastContainer() {
    const weatherSection = document.querySelector('#weatherContent')?.closest('.bg-white');
    if (weatherSection && !document.getElementById('forecastContainer')) {
        const container = document.createElement('div');
        container.id = 'forecastContainer';
        weatherSection.parentNode.insertBefore(container, weatherSection.nextSibling);
    }
}

// Initialize forecast on dashboard load
if (typeof farmProfile !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        createForecastContainer();
        setTimeout(() => {
            if (farmProfile) {
                load7DayForecast();
            }
        }, 1000);
    });
}
