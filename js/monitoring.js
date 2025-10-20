checkAuth();

let isMonitoring = false;
let monitoringInterval = null;
let monitoringStartTime = null;
let timeInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    loadMonitoringState();
    
    const startBtn = document.getElementById('startMonitoringBtn');
    const stopBtn = document.getElementById('stopMonitoringBtn');
    
    startBtn.addEventListener('click', startMonitoring);
    stopBtn.addEventListener('click', stopMonitoring);
});

function loadMonitoringState() {
    const monitoringState = localStorage.getItem('monitoringActive');
    const startTime = localStorage.getItem('monitoringStartTime');
    
    if (monitoringState === 'true' && startTime) {
        isMonitoring = true;
        monitoringStartTime = parseInt(startTime);
        
        document.getElementById('startMonitoringBtn').style.display = 'none';
        document.getElementById('stopMonitoringBtn').style.display = 'inline-block';
        
        document.getElementById('systemStatus').textContent = 'Active';
        document.getElementById('systemStatus').className = 'status-badge status-active';
        
        updateSensorData();
        monitoringInterval = setInterval(updateSensorData, 2000);
        
        updateMonitoringTime();
        timeInterval = setInterval(updateMonitoringTime, 1000);
    }
}

function startMonitoring() {
    isMonitoring = true;
    monitoringStartTime = Date.now();
    
    localStorage.setItem('monitoringActive', 'true');
    localStorage.setItem('monitoringStartTime', monitoringStartTime.toString());
    localStorage.setItem('loginTime', monitoringStartTime.toString());
    
    document.getElementById('startMonitoringBtn').style.display = 'none';
    document.getElementById('stopMonitoringBtn').style.display = 'inline-block';
    
    document.getElementById('systemStatus').textContent = 'Active';
    document.getElementById('systemStatus').className = 'status-badge status-active';
    
    showToast('Monitoring started successfully! Your vital signs are now being tracked.', 'success');
    
    updateSensorData();
    monitoringInterval = setInterval(updateSensorData, 2000);
    
    updateMonitoringTime();
    timeInterval = setInterval(updateMonitoringTime, 1000);
}

function stopMonitoring() {
    isMonitoring = false;
    
    localStorage.setItem('monitoringActive', 'false');
    localStorage.removeItem('monitoringStartTime');
    
    document.getElementById('startMonitoringBtn').style.display = 'inline-block';
    document.getElementById('stopMonitoringBtn').style.display = 'none';
    
    document.getElementById('systemStatus').textContent = 'Inactive';
    document.getElementById('systemStatus').className = 'status-badge status-inactive';
    
    clearInterval(monitoringInterval);
    clearInterval(timeInterval);
    
    document.getElementById('currentHeartRate').textContent = '--';
    document.getElementById('currentGSR').textContent = '--';
    document.getElementById('healthStatus').textContent = 'Stopped';
    document.getElementById('monitoringDuration').textContent = 'Duration: 00:00:00';
    
    showToast('Monitoring stopped', 'info');
}

function updateSensorData() {
    const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    const gsr = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    
    document.getElementById('currentHeartRate').textContent = heartRate;
    document.getElementById('currentGSR').textContent = gsr;
    
    if (heartRate > 120 || gsr > 70) {
        document.getElementById('healthStatus').textContent = 'Elevated';
        document.getElementById('healthStatus').style.color = '#f39c12';
        
        if (Math.random() > 0.9) {
            showToast('⚠️ Elevated vital signs detected!', 'warning');
        }
    } else if (heartRate < 65) {
        document.getElementById('healthStatus').textContent = 'Low';
        document.getElementById('healthStatus').style.color = '#3498db';
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
    
    document.getElementById('monitoringDuration').textContent = 'Duration: ' + timeString;}