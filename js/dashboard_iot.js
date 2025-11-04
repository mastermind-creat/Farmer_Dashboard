// IoT Dashboard JavaScript
let sensorData = {
    moisture: 50,
    temperature: 25,
    humidity: 60,
    rainfall: 0
};

let pumpState = {
    active: false,
    mode: 'manual' // 'manual' or 'auto'
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
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    startSimulation();
    initializeChart();
});

function initializeDashboard() {
    // Check authentication (simplified for demo)
    // In production, verify session with backend
    
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

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}

// Initialize simulation panel as collapsed
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('simulationPanel').classList.add('hidden');
    }, 100);
});
