// IoT Dashboard JavaScript
let sensorData = {
    moisture: 50,
    temperature: 25,
    humidity: 60,
    rainfall: 0
};

let pumpState = {
    active: false,
    mode: 'auto' // 'manual' or 'auto' - default to auto
};

let simulationSettings = {
    updateInterval: 5000, // milliseconds
    weatherCondition: 'sunny',
    moistureFluctuation: 'medium'
};

let deviceConnected = true;
let sensorHistory = [];
let sensorChart = null;
let updateTimer = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication first
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        return; // Stop execution if not authenticated
    }
    
    initializeDashboard();
    startSimulation();
    initializeChart();
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

function initializeDashboard() {
    // Initialize first reading
    updateSensorReadings();
    updatePumpDisplay();
    
    // Start device connectivity check
    setInterval(checkDeviceConnectivity, 10000);
}

function startSimulation() {
    // Clear existing timer
    if (updateTimer) {
        clearInterval(updateTimer);
    }
    
    // Start new simulation loop
    updateTimer = setInterval(() => {
        simulateSensorData();
        updateSensorReadings();
        checkAutoPumpControl();
        addToSensorFeed();
        updateChart();
    }, simulationSettings.updateInterval);
}

function simulateSensorData() {
    // Moisture fluctuation based on settings
    let moistureChange = 0;
    switch(simulationSettings.moistureFluctuation) {
        case 'low':
            moistureChange = (Math.random() - 0.5) * 4; // ±2%
            break;
        case 'medium':
            moistureChange = (Math.random() - 0.5) * 10; // ±5%
            break;
        case 'high':
            moistureChange = (Math.random() - 0.5) * 20; // ±10%
            break;
    }
    
    // Apply pump effect
    if (pumpState.active) {
        moistureChange += 2; // Pump increases moisture
    }
    
    // Apply weather effect
    if (simulationSettings.weatherCondition === 'rainy') {
        moistureChange += 3;
        sensorData.rainfall = Math.random() * 5 + 2;
    } else {
        moistureChange -= 1; // Natural evaporation
        sensorData.rainfall = 0;
    }
    
    // Update moisture (keep in range 0-100)
    sensorData.moisture = Math.max(0, Math.min(100, sensorData.moisture + moistureChange));
    
    // Temperature variation
    let tempBase = simulationSettings.weatherCondition === 'rainy' ? 22 : 28;
    sensorData.temperature = tempBase + (Math.random() - 0.5) * 6;
    
    // Humidity variation
    let humidityBase = simulationSettings.weatherCondition === 'rainy' ? 75 : 55;
    sensorData.humidity = humidityBase + (Math.random() - 0.5) * 20;
    
    // Store in history
    sensorHistory.push({
        timestamp: new Date(),
        moisture: sensorData.moisture,
        temperature: sensorData.temperature,
        humidity: sensorData.humidity
    });
    
    // Keep only last 100 readings
    if (sensorHistory.length > 100) {
        sensorHistory.shift();
    }
}

function updateSensorReadings() {
    // Update moisture gauge
    const moisture = Math.round(sensorData.moisture);
    document.getElementById('moistureValue').textContent = moisture;
    
    // Update circular progress
    const circle = document.getElementById('moistureCircle');
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (moisture / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    // Update moisture status
    let status, statusClass, advisory;
    if (moisture < 35) {
        status = 'Dry - Irrigation Needed';
        statusClass = 'bg-red-100 text-red-700';
        advisory = 'Soil moisture is critically low. Immediate irrigation recommended.';
        
        if (pumpState.mode === 'auto' && !pumpState.active) {
            showNotification('⚠️ Low moisture detected! Auto-irrigation starting...', 'warning');
        }
    } else if (moisture < 50) {
        status = 'Moderate - Monitor';
        statusClass = 'bg-yellow-100 text-yellow-700';
        advisory = 'Soil moisture is below optimal. Consider irrigation soon.';
    } else if (moisture < 70) {
        status = 'Optimal - Good';
        statusClass = 'bg-green-100 text-green-700';
        advisory = 'Moisture level is optimal for crop growth.';
    } else {
        status = 'Wet - No Irrigation';
        statusClass = 'bg-blue-100 text-blue-700';
        advisory = 'Soil moisture is high. No irrigation needed.';
        
        if (pumpState.active && pumpState.mode === 'auto') {
            showNotification('💧 Optimal moisture reached. Stopping irrigation...', 'info');
        }
    }
    
    document.getElementById('moistureStatus').innerHTML = 
        `<span class="px-4 py-2 rounded-full text-sm font-semibold ${statusClass}">${status}</span>`;
    document.getElementById('moistureAdvisory').textContent = advisory;
    
    // Update weather display
    document.getElementById('tempDisplay').textContent = sensorData.temperature.toFixed(1) + '°C';
    document.getElementById('humidityDisplay').textContent = Math.round(sensorData.humidity) + '%';
    document.getElementById('rainfallDisplay').textContent = sensorData.rainfall.toFixed(1) + ' mm';
}

function checkAutoPumpControl() {
    if (pumpState.mode !== 'auto') return;
    
    const moisture = sensorData.moisture;
    const rainfall = sensorData.rainfall;
    
    // Auto control logic
    if (moisture < 40 && rainfall < 1 && !pumpState.active) {
        // Turn pump ON
        pumpState.active = true;
        updatePumpDisplay();
        showNotification('🔄 Auto-mode: Pump activated due to low moisture', 'success');
    } else if ((moisture > 60 || rainfall > 2) && pumpState.active) {
        // Turn pump OFF
        pumpState.active = false;
        updatePumpDisplay();
        
        if (rainfall > 2) {
            showNotification('🌧️ Auto-mode: Pump stopped due to rainfall', 'info');
        } else {
            showNotification('✅ Auto-mode: Pump stopped - optimal moisture reached', 'success');
        }
    }
}

function setPumpMode(mode) {
    pumpState.mode = mode;
    
    // Update button styles
    if (mode === 'manual') {
        document.getElementById('manualModeBtn').className = 
            'flex-1 py-2 px-4 rounded-lg font-semibold transition bg-primary text-white';
        document.getElementById('autoModeBtn').className = 
            'flex-1 py-2 px-4 rounded-lg font-semibold transition bg-gray-200 text-gray-700';
        document.getElementById('manualControls').classList.remove('hidden');
        document.getElementById('autoControls').classList.add('hidden');
    } else {
        document.getElementById('manualModeBtn').className = 
            'flex-1 py-2 px-4 rounded-lg font-semibold transition bg-gray-200 text-gray-700';
        document.getElementById('autoModeBtn').className = 
            'flex-1 py-2 px-4 rounded-lg font-semibold transition bg-primary text-white';
        document.getElementById('manualControls').classList.add('hidden');
        document.getElementById('autoControls').classList.remove('hidden');
        
        showNotification('🤖 Automatic mode enabled', 'info');
    }
    
    updatePumpDisplay();
}

function togglePump(action) {
    if (pumpState.mode !== 'manual') {
        showNotification('⚠️ Switch to manual mode to control pump', 'warning');
        return;
    }
    
    pumpState.active = (action === 'on');
    updatePumpDisplay();
    
    if (pumpState.active) {
        showNotification('✅ Pump started manually', 'success');
    } else {
        showNotification('⏹️ Pump stopped manually', 'info');
    }
}

function updatePumpDisplay() {
    const icon = document.getElementById('pumpIcon');
    const status = document.getElementById('pumpStatus');
    const reason = document.getElementById('pumpReason');
    
    if (pumpState.active) {
        icon.innerHTML = '<i class="fas fa-water pump-active text-blue-500"></i>';
        status.textContent = 'Pump Active';
        status.className = 'text-2xl font-bold text-blue-500';
        
        if (pumpState.mode === 'auto') {
            reason.textContent = 'Auto-controlled based on moisture level';
        } else {
            reason.textContent = 'Manually activated';
        }
    } else {
        icon.innerHTML = '<i class="fas fa-power-off text-gray-400"></i>';
        status.textContent = 'Pump Idle';
        status.className = 'text-2xl font-bold text-gray-400';
        
        if (pumpState.mode === 'auto') {
            reason.textContent = 'Waiting for moisture threshold';
        } else {
            reason.textContent = 'Awaiting manual command';
        }
    }
}

function addToSensorFeed() {
    const feed = document.getElementById('sensorFeed');
    const time = new Date().toLocaleTimeString();
    
    const entry = document.createElement('div');
    entry.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm';
    entry.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas fa-circle text-green-500 text-xs"></i>
            <span class="text-gray-600">${time}</span>
        </div>
        <div class="flex space-x-4 text-gray-800 font-semibold">
            <span>💧 ${Math.round(sensorData.moisture)}%</span>
            <span>🌡️ ${sensorData.temperature.toFixed(1)}°C</span>
            <span>💨 ${Math.round(sensorData.humidity)}%</span>
        </div>
    `;
    
    feed.insertBefore(entry, feed.firstChild);
    
    // Keep only last 20 entries
    while (feed.children.length > 20) {
        feed.removeChild(feed.lastChild);
    }
}

function initializeChart() {
    const ctx = document.getElementById('sensorChart').getContext('2d');
    
    sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Soil Moisture (%)',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Temperature (°C)',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Humidity (%)',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            animation: {
                duration: 750
            }
        }
    });
}

function updateChart() {
    if (!sensorChart) return;
    
    const range = parseInt(document.getElementById('timeRange').value);
    const recentData = sensorHistory.slice(-range);
    
    sensorChart.data.labels = recentData.map(d => d.timestamp.toLocaleTimeString());
    sensorChart.data.datasets[0].data = recentData.map(d => d.moisture);
    sensorChart.data.datasets[1].data = recentData.map(d => d.temperature);
    sensorChart.data.datasets[2].data = recentData.map(d => d.humidity);
    
    sensorChart.update('none'); // Update without animation for smooth real-time feel
}

function updateChartRange() {
    updateChart();
}

function checkDeviceConnectivity() {
    // Simulate occasional connection issues (5% chance)
    const wasConnected = deviceConnected;
    deviceConnected = Math.random() > 0.05;
    
    const statusDiv = document.getElementById('deviceStatus');
    
    if (deviceConnected) {
        statusDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span class="font-semibold text-gray-800">Devices Connected</span>
                <i class="fas fa-check-circle text-green-500"></i>
            </div>
        `;
        
        if (!wasConnected) {
            showNotification('✅ Device connection restored', 'success');
        }
    } else {
        statusDiv.innerHTML = `
            <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="font-semibold text-gray-800">Connection Lost</span>
                <i class="fas fa-times-circle text-red-500"></i>
            </div>
        `;
        
        showNotification('❌ Device connection lost. Retrying...', 'error');
    }
}

function showNotification(message, type) {
    const container = document.getElementById('notificationsContainer');
    
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification-enter ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function updateSimulationSettings() {
    simulationSettings.updateInterval = parseInt(document.getElementById('updateInterval').value) * 1000;
    simulationSettings.weatherCondition = document.getElementById('weatherCondition').value;
    simulationSettings.moistureFluctuation = document.getElementById('moistureFluctuation').value;
    
    // Restart simulation with new settings
    startSimulation();
    
    showNotification('⚙️ Simulation settings updated', 'info');
}

function toggleSimulationPanel() {
    const panel = document.getElementById('simulationPanel');
    const icon = document.getElementById('simPanelIcon');
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        icon.className = 'fas fa-chevron-up';
    } else {
        panel.classList.add('hidden');
        icon.className = 'fas fa-chevron-down';
    }
}

async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            const formData = new FormData();
            formData.append('action', 'logout');
            
            const response = await fetch('php/auth.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                window.location.href = 'index.html';
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Redirect anyway on error
            window.location.href = 'index.html';
        }
    }
}

// Initialize simulation panel as collapsed
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('simulationPanel').classList.add('hidden');
        initializeAnalytics();
    }, 100);
});

// ==================== ADVANCED ANALYTICS ====================

let analyticsData = {
    waterUsage: {
        today: 0,
        yesterday: 0,
        thisWeek: [],
        thisMonth: [],
        daily: [],
        weekly: [],
        monthly: []
    },
    costs: {
        waterCostPerLiter: 0.5, // KSh per liter
        manualIrrigationCost: 5000, // KSh per month
        automatedCost: 2000, // KSh per month
        savings: 0
    },
    roi: {
        initialInvestment: 50000,
        monthlySavings: 0,
        totalSavings: 0,
        months: 0
    },
    efficiency: 0,
    yieldIncrease: 0
};

let waterTrendChart = null;
let comparativeChart = null;
let seasonalChart = null;

// Initialize analytics
function initializeAnalytics() {
    // Generate sample historical data
    generateSampleData();
    
    // Initialize charts
    initializeWaterTrendChart();
    initializeComparativeChart();
    initializeSeasonalChart();
    
    // Start analytics updates
    setInterval(updateAnalytics, 10000); // Update every 10 seconds
    updateAnalytics();
}

// Generate sample historical data
function generateSampleData() {
    // Daily data for the past 30 days
    for (let i = 30; i >= 0; i--) {
        const baseUsage = 150 + Math.random() * 50;
        analyticsData.waterUsage.daily.push({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
            usage: baseUsage
        });
    }
    
    // Weekly data for the past 12 weeks
    for (let i = 12; i >= 0; i--) {
        const baseUsage = 1000 + Math.random() * 300;
        analyticsData.waterUsage.weekly.push({
            week: `Week ${13 - i}`,
            usage: baseUsage
        });
    }
    
    // Monthly data for the past 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 11; i >= 0; i--) {
        const monthIndex = (new Date().getMonth() - i + 12) % 12;
        const baseUsage = 4000 + Math.random() * 1000;
        analyticsData.waterUsage.monthly.push({
            month: months[monthIndex],
            usage: baseUsage
        });
    }
}

// Update analytics data
function updateAnalytics() {
    // Calculate water usage
    const pumpRunTime = pumpState.active ? 5 : 0; // 5 liters per update when pump is on
    analyticsData.waterUsage.today += pumpRunTime;
    
    // Calculate efficiency based on moisture levels
    const targetMoisture = 60;
    const moistureDiff = Math.abs(sensorData.moisture - targetMoisture);
    analyticsData.efficiency = Math.max(0, 100 - moistureDiff * 2);
    
    // Calculate yield prediction based on optimal moisture maintenance
    if (sensorData.moisture >= 50 && sensorData.moisture <= 70) {
        analyticsData.yieldIncrease = Math.min(25, analyticsData.yieldIncrease + 0.5);
    } else {
        analyticsData.yieldIncrease = Math.max(0, analyticsData.yieldIncrease - 0.2);
    }
    
    // Calculate cost savings
    const manualWaterUsage = analyticsData.waterUsage.today * 1.5; // Manual uses 50% more
    const waterSaved = manualWaterUsage - analyticsData.waterUsage.today;
    const costSaved = waterSaved * analyticsData.costs.waterCostPerLiter;
    analyticsData.costs.savings = costSaved * 30; // Monthly projection
    
    // Calculate ROI
    analyticsData.roi.monthlySavings = analyticsData.costs.manualIrrigationCost - analyticsData.costs.automatedCost;
    analyticsData.roi.months++;
    analyticsData.roi.totalSavings = analyticsData.roi.monthlySavings * (analyticsData.roi.months / 2880); // Approximate months
    
    // Update UI
    updateAnalyticsUI();
}

// Update analytics UI
function updateAnalyticsUI() {
    // Water usage card
    document.getElementById('waterUsedToday').textContent = Math.round(analyticsData.waterUsage.today) + ' L';
    const trend = analyticsData.waterUsage.today > analyticsData.waterUsage.yesterday ? '↑' : '↓';
    const trendPercent = analyticsData.waterUsage.yesterday > 0 
        ? Math.abs(((analyticsData.waterUsage.today - analyticsData.waterUsage.yesterday) / analyticsData.waterUsage.yesterday) * 100).toFixed(0)
        : 0;
    document.getElementById('waterTrend').textContent = `${trend} ${trendPercent}%`;
    
    // Cost savings card
    document.getElementById('costSavings').textContent = 'KSh ' + Math.round(analyticsData.costs.savings).toLocaleString();
    
    // Efficiency card
    document.getElementById('efficiency').textContent = Math.round(analyticsData.efficiency) + '%';
    
    // Yield prediction card
    document.getElementById('yieldPrediction').textContent = '+' + analyticsData.yieldIncrease.toFixed(1) + '%';
    
    // ROI Analysis
    document.getElementById('monthlySavings').textContent = 'KSh ' + analyticsData.roi.monthlySavings.toLocaleString();
    const paybackMonths = (analyticsData.roi.initialInvestment / analyticsData.roi.monthlySavings).toFixed(1);
    document.getElementById('paybackPeriod').textContent = paybackMonths + ' months';
    const roiPercent = ((analyticsData.roi.totalSavings / analyticsData.roi.initialInvestment) * 100).toFixed(1);
    document.getElementById('totalROI').textContent = roiPercent + '%';
    
    // Comparative analytics
    const yourUsage = Math.round(analyticsData.waterUsage.today * 30); // Monthly
    const countyAvg = Math.round(yourUsage * 1.4); // County uses 40% more
    document.getElementById('yourFarmUsage').textContent = yourUsage.toLocaleString() + ' L';
    document.getElementById('countyAverage').textContent = countyAvg.toLocaleString() + ' L';
}

// Initialize Water Trend Chart
function initializeWaterTrendChart() {
    const ctx = document.getElementById('waterTrendChart');
    if (!ctx) return;
    
    waterTrendChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: analyticsData.waterUsage.daily.slice(-7).map(d => d.date.toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
                label: 'Water Usage (Liters)',
                data: analyticsData.waterUsage.daily.slice(-7).map(d => d.usage),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Liters'
                    }
                }
            }
        }
    });
}

// Initialize Comparative Chart
function initializeComparativeChart() {
    const ctx = document.getElementById('comparativeChart');
    if (!ctx) return;
    
    comparativeChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Your Farm', 'County Average'],
            datasets: [{
                label: 'Monthly Water Usage (Liters)',
                data: [4500, 6300],
                backgroundColor: ['#3b82f6', '#9ca3af']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Liters'
                    }
                }
            }
        }
    });
}

// Initialize Seasonal Chart
function initializeSeasonalChart() {
    const ctx = document.getElementById('seasonalChart');
    if (!ctx) return;
    
    seasonalChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: analyticsData.waterUsage.monthly.map(m => m.month),
            datasets: [{
                label: 'Historical Usage',
                data: analyticsData.waterUsage.monthly.map(m => m.usage),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Predicted Usage',
                data: [null, null, null, null, null, null, null, null, null, null, 4200, 4500, 4800],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Liters'
                    }
                }
            }
        }
    });
}

// Update water trends based on period selection
function updateWaterTrends() {
    const period = document.getElementById('waterTrendPeriod').value;
    let labels, data;
    
    if (period === 'daily') {
        labels = analyticsData.waterUsage.daily.slice(-7).map(d => d.date.toLocaleDateString('en-US', { weekday: 'short' }));
        data = analyticsData.waterUsage.daily.slice(-7).map(d => d.usage);
    } else if (period === 'weekly') {
        labels = analyticsData.waterUsage.weekly.slice(-8).map(w => w.week);
        data = analyticsData.waterUsage.weekly.slice(-8).map(w => w.usage);
    } else {
        labels = analyticsData.waterUsage.monthly.map(m => m.month);
        data = analyticsData.waterUsage.monthly.map(m => m.usage);
    }
    
    waterTrendChart.data.labels = labels;
    waterTrendChart.data.datasets[0].data = data;
    waterTrendChart.update();
}

// Export analytics report
function exportAnalytics() {
    const reportData = {
        date: new Date().toLocaleDateString(),
        waterUsage: {
            today: Math.round(analyticsData.waterUsage.today),
            monthly: Math.round(analyticsData.waterUsage.today * 30)
        },
        costSavings: Math.round(analyticsData.costs.savings),
        efficiency: Math.round(analyticsData.efficiency),
        yieldIncrease: analyticsData.yieldIncrease.toFixed(1),
        roi: {
            monthlySavings: analyticsData.roi.monthlySavings,
            paybackPeriod: (analyticsData.roi.initialInvestment / analyticsData.roi.monthlySavings).toFixed(1),
            totalROI: ((analyticsData.roi.totalSavings / analyticsData.roi.initialInvestment) * 100).toFixed(1)
        }
    };
    
    // Create CSV content
    let csvContent = "Farm Weather Advisory - IoT Analytics Report\n";
    csvContent += `Generated: ${reportData.date}\n\n`;
    csvContent += "Water Usage\n";
    csvContent += `Today,${reportData.waterUsage.today} L\n`;
    csvContent += `Monthly (Projected),${reportData.waterUsage.monthly} L\n\n`;
    csvContent += "Financial Analysis\n";
    csvContent += `Monthly Savings,KSh ${reportData.costSavings}\n`;
    csvContent += `Monthly Savings (ROI),KSh ${reportData.roi.monthlySavings}\n`;
    csvContent += `Payback Period,${reportData.roi.paybackPeriod} months\n`;
    csvContent += `Total ROI,${reportData.roi.totalROI}%\n\n`;
    csvContent += "Performance Metrics\n";
    csvContent += `System Efficiency,${reportData.efficiency}%\n`;
    csvContent += `Yield Increase,+${reportData.yieldIncrease}%\n`;
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Analytics report exported successfully!', 'success');
}
