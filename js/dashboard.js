checkAuth();

let heartRateChart = null;
let gsrChart = null;
let isMonitoring = false;
let monitoringInterval = null;
let monitoringStartTime = null;
let timeInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    const userData = getUserData();
    
    if (userData) {
        document.getElementById('userName').textContent = userData.fullName;
    }
    
    initCharts();
    
    const startBtn = document.getElementById('startMonitoringBtn');
    const stopBtn = document.getElementById('stopMonitoringBtn');
    
    startBtn.addEventListener('click', startMonitoring);
    stopBtn.addEventListener('click', stopMonitoring);
});

function initCharts() {
    const heartRateCtx = document.getElementById('heartRateChart').getContext('2d');
    const gsrCtx = document.getElementById('gsrChart').getContext('2d');
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: false
            },
            x: {
                display: true
            }
        },
        animation: {
            duration: 750
        }
    };
    
    heartRateChart = new Chart(heartRateCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Heart Rate (BPM)',
                data: [],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 150
                }
            }
        }
    });
    
    gsrChart = new Chart(gsrCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'GSR (μS)',
                data: [],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                ...chartOptions.scales,
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

function startMonitoring() {
    isMonitoring = true;
    monitoringStartTime = Date.now();
    
    document.getElementById('startMonitoringBtn').style.display = 'none';
    document.getElementById('stopMonitoringBtn').style.display = 'inline-block';
    
    document.getElementById('systemStatus').textContent = 'Active';
    document.getElementById('systemStatus').className = 'status-badge status-active';
    
    showToast('Monitoring started successfully', 'success');
    
    updateSensorData();
    monitoringInterval = setInterval(updateSensorData, 2000);
    
    updateMonitoringTime();
    timeInterval = setInterval(updateMonitoringTime, 1000);
}

function stopMonitoring() {
    isMonitoring = false;
    
    document.getElementById('startMonitoringBtn').style.display = 'inline-block';
    document.getElementById('stopMonitoringBtn').style.display = 'none';
    
    document.getElementById('systemStatus').textContent = 'Inactive';
    document.getElementById('systemStatus').className = 'status-badge status-inactive';
    
    clearInterval(monitoringInterval);
    clearInterval(timeInterval);
    
    showToast('Monitoring stopped', 'info');
}

function updateSensorData() {
    const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    const gsr = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    
    document.getElementById('currentHeartRate').textContent = heartRate;
    document.getElementById('currentGSR').textContent = gsr;
    
    const now = new Date();
    const timeLabel = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
    
    heartRateChart.data.labels.push(timeLabel);
    heartRateChart.data.datasets[0].data.push(heartRate);
    
    if (heartRateChart.data.labels.length > 20) {
        heartRateChart.data.labels.shift();
        heartRateChart.data.datasets[0].data.shift();
    }
    
    heartRateChart.update();
    
    gsrChart.data.labels.push(timeLabel);
    gsrChart.data.datasets[0].data.push(gsr);
    
    if (gsrChart.data.labels.length > 20) {
        gsrChart.data.labels.shift();
        gsrChart.data.datasets[0].data.shift();
    }
    
    gsrChart.update();
    
    if (heartRate > 120 || gsr > 70) {
        document.getElementById('healthStatus').textContent = 'Elevated';
        document.getElementById('healthStatus').style.color = '#f39c12';
    } else {
        document.getElementById('healthStatus').textContent = 'Normal';
        document.getElementById('healthStatus').style.color = '#27ae60';
    }
}

function updateMonitoringTime() {
    if (!monitoringStartTime) return;
    
    const elapsed = Date.now() - monitoringStartTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    
    const timeString = String(hours).padStart(2, '0') + ':' + 
                      String(minutes).padStart(2, '0') + ':' + 
                      String(seconds).padStart(2, '0');
    
    document.getElementById('monitoringTime').textContent = timeString;}