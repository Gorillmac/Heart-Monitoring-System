checkAuth();

let map = null;

document.addEventListener('DOMContentLoaded', () => {
    loadAlertHistory();
    
    const closeMapBtn = document.getElementById('closeMapModal');
    const mapModal = document.getElementById('mapModal');
    
    closeMapBtn.addEventListener('click', () => {
        mapModal.classList.remove('active');
    });
    
    mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            mapModal.classList.remove('active');
        }
    });
});

function loadAlertHistory() {
    const alertHistory = JSON.parse(localStorage.getItem('alertHistory') || '[]');
    const alertsList = document.getElementById('alertsList');
    
    if (alertHistory.length === 0) {
        alertsList.innerHTML = '<p class="loading-text">No alerts in history. Your SOS alerts will appear here.</p>';
    } else {
        alertsList.innerHTML = alertHistory.map((alert, index) => {
            const date = new Date(alert.timestamp);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            
            return `
                <div class="alert-item">
                    <div class="alert-header">
                        <span class="alert-type">${alert.type}</span>
                        <span>${formattedDate} at ${formattedTime}</span>
                    </div>
                    <div class="alert-details">
                        <p><strong>Heart Rate:</strong> ${alert.heartRate} BPM</p>
                        <p><strong>GSR Level:</strong> ${alert.gsr} μS</p>
                        <p><strong>Location:</strong> ${alert.location.lat.toFixed(6)}, ${alert.location.lng.toFixed(6)}</p>
                        <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: 600;">Alert ${alert.status}</span></p>
                    </div>
                    <div class="alert-actions">
                        <button class="btn btn-secondary" onclick="showLocationOnMap(${alert.location.lat}, ${alert.location.lng}, '${alert.type}', '${formattedDate} ${formattedTime}')">
                            📍 View on Map
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function showLocationOnMap(lat, lng, alertType, timestamp) {
    const mapModal = document.getElementById('mapModal');
    const mapContainer = document.getElementById('map');
    const locationDetails = document.getElementById('locationDetails');
    
    mapModal.classList.add('active');
    
    setTimeout(() => {
        if (map) {
            map.remove();
        }
        
        map = L.map('map').setView([lat, lng], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);
        
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`<b>${alertType}</b><br>${timestamp}`).openPopup();
        
        const circle = L.circle([lat, lng], {
            color: '#e74c3c',
            fillColor: '#e74c3c',
            fillOpacity: 0.2,
            radius: 200
        }).addTo(map);
        
        locationDetails.innerHTML = `
            <p style="margin-top: 1rem;"><strong>Alert Type:</strong> ${alertType}</p>
            <p><strong>Time:</strong> ${timestamp}</p>
            <p><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
            <p><strong>Map:</strong> <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" style="color: #3498db;">Open in Google Maps</a></p>
        `;
    }, 100);
}
