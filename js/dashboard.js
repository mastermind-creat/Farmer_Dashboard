// Dashboard JavaScript
let farmProfile = null;
let weatherData = null;
let waterChart = null;
let weatherChart = null;

// Educational tips
const irrigationTips = [
    "Water your crops early in the morning or late evening to minimize evaporation losses.",
    "Check soil moisture before irrigating - stick your finger 2-3 inches into the soil.",
    "Mulching around plants helps retain soil moisture and reduces water needs by up to 50%.",
    "Drip irrigation systems can save up to 60% more water compared to traditional methods.",
    "Sandy soils need more frequent watering but in smaller amounts compared to clay soils.",
    "Overwatering can be as harmful as underwatering - it leads to root rot and nutrient leaching.",
    "Collect rainwater in tanks or ponds for irrigation during dry periods.",
    "Group plants with similar water needs together for more efficient irrigation.",
    "Regular weeding reduces competition for water between crops and weeds.",
    "Monitor weather forecasts to avoid irrigating before expected rainfall."
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    displayRandomTip();
    await loadFarmProfile();
    await loadWeatherData();
    await loadIrrigationHistory();
});

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('php/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=check'
        });
        
        const data = await response.json();
        
        // If not authenticated, redirect to login
        if (!data.authenticated) {
            console.log('User not authenticated, redirecting to login...');
            window.location.href = 'login.html';
            return false;
        }
        
        // Display user name
        if (data.user && data.user.name) {
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = data.user.name;
            }
        }
        
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login on error
        window.location.href = 'login.html';
        return false;
    }
}

// Load farm profile
async function loadFarmProfile() {
    try {
        const response = await fetch('php/farm_profile.php?action=get');
        const data = await response.json();
        
        if (data.success) {
            farmProfile = data.profile;
            document.getElementById('profileAlert').classList.add('hidden');
            populateProfileForm();
        } else {
            document.getElementById('profileAlert').classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error loading farm profile:', error);
        document.getElementById('profileAlert').classList.remove('hidden');
    }
}

// Load weather data
async function loadWeatherData() {
    if (!farmProfile) {
        return;
    }
    
    try {
        let url = 'php/weather.php?';
        if (farmProfile.latitude && farmProfile.longitude) {
            url += `lat=${farmProfile.latitude}&lon=${farmProfile.longitude}`;
        } else {
            // Add "Kenya" to county name for accurate weather data
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
            weatherData = data;
            displayWeather(data);
            await calculateIrrigation(data);
        } else {
            document.getElementById('weatherContent').innerHTML = `
                <div class="text-center py-4 text-red-600">
                    <i class="fas fa-exclamation-triangle text-3xl mb-2"></i>
                    <p>${data.message}</p>
                    <p class="text-sm mt-2">Please check your API key in config/config.php</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading weather:', error);
        document.getElementById('weatherContent').innerHTML = `
            <div class="text-center py-4 text-red-600">
                <p>Failed to load weather data</p>
            </div>
        `;
    }
}

// Display weather
function displayWeather(data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
    
    document.getElementById('weatherContent').innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <div>
                <p class="text-gray-600 text-sm">${data.location}</p>
                <p class="text-5xl font-bold text-gray-900">${data.temperature}°C</p>
                <p class="text-gray-600 capitalize">${data.description}</p>
            </div>
            <img src="${iconUrl}" alt="Weather icon" class="w-24 h-24">
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-gray-600 text-sm">Humidity</p>
                <p class="text-xl font-bold text-gray-900">${data.humidity}%</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-gray-600 text-sm">Wind Speed</p>
                <p class="text-xl font-bold text-gray-900">${data.wind_speed} m/s</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-gray-600 text-sm">Rainfall</p>
                <p class="text-xl font-bold text-gray-900">${data.rainfall} mm</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
                <p class="text-gray-600 text-sm">Feels Like</p>
                <p class="text-xl font-bold text-gray-900">${data.feels_like}°C</p>
            </div>
        </div>
    `;
}

// Calculate irrigation recommendation
async function calculateIrrigation(weather) {
    if (!farmProfile) return;
    
    try {
        const formData = new FormData();
        formData.append('action', 'calculate');
        formData.append('crop_type', farmProfile.crop_type);
        formData.append('soil_type', farmProfile.soil_type);
        formData.append('temperature', weather.temperature);
        formData.append('humidity', weather.humidity);
        formData.append('rainfall', weather.rainfall);
        
        const response = await fetch('php/irrigation_advisory.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayAdvisory(data);
        }
    } catch (error) {
        console.error('Error calculating irrigation:', error);
    }
}

// Display irrigation advisory
function displayAdvisory(data) {
    const waterAmount = data.water_amount;
    let statusColor = 'green';
    let statusIcon = 'check-circle';
    
    if (waterAmount === 0) {
        statusColor = 'blue';
        statusIcon = 'info-circle';
    } else if (waterAmount > 5) {
        statusColor = 'red';
        statusIcon = 'exclamation-triangle';
    } else if (waterAmount > 3) {
        statusColor = 'yellow';
        statusIcon = 'exclamation-circle';
    }
    
    document.getElementById('advisoryContent').innerHTML = `
        <div class="text-center mb-4">
            <i class="fas fa-${statusIcon} text-${statusColor}-500 text-5xl mb-2"></i>
            <p class="text-3xl font-bold text-gray-900">${waterAmount} L/m²</p>
            <p class="text-gray-600">Recommended Water Amount</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <p class="font-semibold text-gray-900 mb-2">Frequency: ${data.frequency}</p>
            <p class="text-gray-700 text-sm">${data.recommendation}</p>
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">Base Need</p>
                <p class="font-bold">${data.details.base_need} L/m²</p>
            </div>
            <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">Soil Factor</p>
                <p class="font-bold">×${data.details.soil_factor}</p>
            </div>
            <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">Temp Factor</p>
                <p class="font-bold">×${data.details.temp_factor}</p>
            </div>
            <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">Rainfall</p>
                <p class="font-bold">-${data.details.rainfall_deduction} mm</p>
            </div>
        </div>
    `;
}

// Load irrigation history and create charts
async function loadIrrigationHistory() {
    try {
        const response = await fetch('php/irrigation_advisory.php?action=history&limit=7');
        const data = await response.json();
        
        if (data.success && data.logs.length > 0) {
            createCharts(data.logs);
        } else {
            createEmptyCharts();
        }
    } catch (error) {
        console.error('Error loading history:', error);
        createEmptyCharts();
    }
}

// Create charts
function createCharts(logs) {
    const dates = logs.reverse().map(log => {
        const date = new Date(log.irrigation_date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const waterAmounts = logs.map(log => parseFloat(log.water_amount));
    const temperatures = logs.map(log => parseFloat(log.temperature));
    const humidity = logs.map(log => parseFloat(log.humidity));
    
    // Water Usage Chart
    const waterCtx = document.getElementById('waterChart').getContext('2d');
    if (waterChart) waterChart.destroy();
    waterChart = new Chart(waterCtx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Water Amount (L/m²)',
                data: waterAmounts,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    
    // Weather Conditions Chart
    const weatherCtx = document.getElementById('weatherChart').getContext('2d');
    if (weatherChart) weatherChart.destroy();
    weatherChart = new Chart(weatherCtx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temperatures,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    yAxisID: 'y'
                },
                {
                    label: 'Humidity (%)',
                    data: humidity,
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    title: { display: true, text: 'Temperature (°C)' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Humidity (%)' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// Create empty charts
function createEmptyCharts() {
    const emptyDates = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    const emptyData = [0, 0, 0, 0, 0, 0, 0];
    
    const waterCtx = document.getElementById('waterChart').getContext('2d');
    waterChart = new Chart(waterCtx, {
        type: 'line',
        data: {
            labels: emptyDates,
            datasets: [{
                label: 'Water Amount (L/m²)',
                data: emptyData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
    
    const weatherCtx = document.getElementById('weatherChart').getContext('2d');
    weatherChart = new Chart(weatherCtx, {
        type: 'bar',
        data: {
            labels: emptyDates,
            datasets: [{
                label: 'No Data Available',
                data: emptyData,
                backgroundColor: 'rgba(156, 163, 175, 0.5)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true }
            }
        }
    });
}

// Display random tip
function displayRandomTip() {
    const randomTip = irrigationTips[Math.floor(Math.random() * irrigationTips.length)];
    document.getElementById('dailyTip').textContent = randomTip;
}

// Profile modal functions
function showProfileModal() {
    document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
}

function populateProfileForm() {
    if (!farmProfile) return;
    
    document.getElementById('farm_name').value = farmProfile.farm_name || '';
    document.getElementById('location').value = farmProfile.location || '';
    document.getElementById('crop_type').value = farmProfile.crop_type || '';
    document.getElementById('soil_type').value = farmProfile.soil_type || '';
    document.getElementById('farm_size').value = farmProfile.farm_size || '';
}

// Profile form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('action', 'create');
    formData.append('farm_name', document.getElementById('farm_name').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('crop_type', document.getElementById('crop_type').value);
    formData.append('soil_type', document.getElementById('soil_type').value);
    formData.append('farm_size', document.getElementById('farm_size').value);
    
    try {
        const response = await fetch('php/farm_profile.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            closeProfileModal();
            
            // Reload profile and refresh all weather data
            await loadFarmProfile();
            await loadWeatherData();
            
            // Reload 7-day forecast if function exists
            if (typeof load7DayForecast === 'function') {
                await load7DayForecast();
            }
            
            alert('Farm profile saved successfully! Weather data updated for ' + document.getElementById('location').value);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile');
    }
});

// Refresh weather
async function refreshWeather() {
    document.getElementById('weatherContent').innerHTML = `
        <div class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-4xl text-primary"></i>
            <p class="mt-2 text-gray-600">Refreshing weather data...</p>
        </div>
    `;
    await loadWeatherData();
    
    // Also refresh 7-day forecast
    if (typeof load7DayForecast === 'function') {
        await load7DayForecast();
    }
}

// Logout function
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            const formData = new FormData();
            formData.append('action', 'logout');
            
            await fetch('php/auth.php', {
                method: 'POST',
                body: formData
            });
            
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = 'index.html';
        }
    }
}
