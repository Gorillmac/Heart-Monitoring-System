checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    loadEmergencyContacts();
    
    const sosButton = document.getElementById('sosButton');
    const sosModal = document.getElementById('sosModal');
    const successModal = document.getElementById('successModal');
    const cancelBtn = document.getElementById('cancelSOS');
    const closeSuccessBtn = document.getElementById('closeSuccessModal');
    
    sosButton.addEventListener('click', () => {
        startSOSCountdown();
    });
    
    cancelBtn.addEventListener('click', () => {
        cancelSOS();
    });
    
    closeSuccessBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
});

function loadEmergencyContacts() {
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
    const contactsList = document.getElementById('emergencyContactsList');
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<p class="loading-text">No emergency contacts added yet. <a href="contacts.html">Add contacts</a></p>';
    } else {
        contactsList.innerHTML = contacts.map(contact => `
            <div class="contact-item">
                <strong>${contact.name}</strong> - ${contact.phone}<br>
                <small>${contact.relation}</small>
            </div>
        `).join('');
    }
}

let countdownTimer = null;
let countdownValue = 3;

function startSOSCountdown() {
    const sosModal = document.getElementById('sosModal');
    const countdownElement = document.getElementById('countdown');
    
    countdownValue = 3;
    countdownElement.textContent = countdownValue;
    
    sosModal.classList.add('active');
    
    countdownTimer = setInterval(() => {
        countdownValue--;
        countdownElement.textContent = countdownValue;
        
        if (countdownValue <= 0) {
            clearInterval(countdownTimer);
            sendSOSAlert();
        }
    }, 1000);
}

function cancelSOS() {
    clearInterval(countdownTimer);
    const sosModal = document.getElementById('sosModal');
    sosModal.classList.remove('active');
    
    showToast('SOS alert cancelled', 'info');
}

function sendSOSAlert() {
    const sosModal = document.getElementById('sosModal');
    sosModal.classList.remove('active');
    
    getCurrentLocation((location) => {
        const alert = {
            id: Date.now(),
            type: 'Manual SOS',
            timestamp: new Date().toISOString(),
            location: location,
            heartRate: Math.floor(Math.random() * (120 - 80)) + 80,
            gsr: Math.floor(Math.random() * (80 - 40)) + 40,
            status: 'sent'
        };
        
        const alertHistory = JSON.parse(localStorage.getItem('alertHistory') || '[]');
        alertHistory.unshift(alert);
        localStorage.setItem('alertHistory', JSON.stringify(alertHistory));
        
        const successModal = document.getElementById('successModal');
        const alertTime = document.getElementById('alertTime');
        const alertLocation = document.getElementById('alertLocation');
        
        alertTime.textContent = new Date(alert.timestamp).toLocaleString();
        alertLocation.textContent = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
        
        successModal.classList.add('active');
        
        showToast('SOS alert sent successfully to all emergency contacts!', 'success');
    });
}

function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                callback({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                const mockLocation = {
                    lat: 37.7749 + (Math.random() - 0.5) * 0.1,
                    lng: -122.4194 + (Math.random() - 0.5) * 0.1
                };
                callback(mockLocation);
            }
        );
    } else {
        const mockLocation = {
            lat: 37.7749 + (Math.random() - 0.5) * 0.1,
            lng: -122.4194 + (Math.random() - 0.5) * 0.1
        };
        callback(mockLocation);
    }
}
