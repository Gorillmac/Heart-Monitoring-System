checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
    setupTabs();
    
    document.getElementById('personalInfoForm').addEventListener('submit', handlePersonalInfoUpdate);
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);
    document.getElementById('preferencesForm').addEventListener('submit', handlePreferencesUpdate);
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

function loadProfileData() {
    const userData = getUserData();
    
    if (userData) {
        document.getElementById('fullName').value = userData.fullName || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('dateOfBirth').value = userData.dateOfBirth || '';
        document.getElementById('address').value = userData.address || '';
    }
    
    const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
    document.getElementById('emailNotifications').checked = preferences.emailNotifications !== false;
    document.getElementById('smsNotifications').checked = preferences.smsNotifications !== false;
    document.getElementById('autoSOS').checked = preferences.autoSOS === true;
    document.getElementById('heartRateThreshold').value = preferences.heartRateThreshold || 120;
    document.getElementById('gsrThreshold').value = preferences.gsrThreshold || 50;
}

function handlePersonalInfoUpdate(e) {
    e.preventDefault();
    
    clearFormErrors('personalInfoForm');
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        address: document.getElementById('address').value.trim()
    };
    
    let isValid = true;
    
    if (formData.fullName.length < 2) {
        showFormError('fullNameError', 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        showFormError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (isValid) {
        const userData = getUserData();
        const updatedData = { ...userData, ...formData };
        setUserData(updatedData);
        updateNavUsername();
        showToast('Profile updated successfully', 'success');
    }
}

function handlePasswordChange(e) {
    e.preventDefault();
    
    clearFormErrors('passwordForm');
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    let isValid = true;
    
    if (currentPassword.length < 6) {
        showFormError('currentPasswordError', 'Please enter your current password');
        isValid = false;
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        showFormError('newPasswordError', 'Password must be at least 8 characters with letters and numbers');
        isValid = false;
    }
    
    if (newPassword !== confirmNewPassword) {
        showFormError('confirmNewPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    if (isValid) {
        showToast('Password changed successfully', 'success');
        document.getElementById('passwordForm').reset();
    }
}

function handlePreferencesUpdate(e) {
    e.preventDefault();
    
    const preferences = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        autoSOS: document.getElementById('autoSOS').checked,
        heartRateThreshold: parseInt(document.getElementById('heartRateThreshold').value),
        gsrThreshold: parseInt(document.getElementById('gsrThreshold').value)
    };
    
    localStorage.setItem('preferences', JSON.stringify(preferences));
    showToast('Preferences saved successfully', 'success');
}

function showFormError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
}
