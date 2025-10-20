document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

function handleRegister(e) {
    e.preventDefault();
    
    clearErrors();
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        username: document.getElementById('username').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    let isValid = true;
    
    if (formData.fullName.length < 2) {
        showError('fullNameError', 'Full name must be at least 2 characters');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (formData.username.length < 3) {
        showError('usernameError', 'Username must be at least 3 characters');
        isValid = false;
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        showError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
        showError('passwordError', 'Password must be at least 8 characters with letters and numbers');
        isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        isValid = false;
    }
    
    if (!formData.agreeTerms) {
        showError('termsError', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    if (isValid) {
        const userData = {
            fullName: formData.fullName,
            email: formData.email,
            username: formData.username,
            phone: formData.phone,
            dateOfBirth: '',
            address: ''
        };
        
        const token = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        localStorage.setItem('emergencyContacts', JSON.stringify([]));
        localStorage.setItem('alertHistory', JSON.stringify([]));
        
        showToast('Registration successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    clearErrors();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;
    
    if (username.length < 3) {
        showError('usernameError', 'Please enter a valid username or email');
        isValid = false;
    }
    
    if (password.length < 6) {
        showError('passwordError', 'Please enter your password');
        isValid = false;
    }
    
    if (isValid) {
        const existingUserData = localStorage.getItem('userData');
        
        if (existingUserData) {
            const token = 'mock_jwt_token_' + Date.now();
            localStorage.setItem('authToken', token);
            
            showToast('Login successful! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            const mockUserData = {
                fullName: 'Demo User',
                email: 'demo@heartmonitor.com',
                username: username,
                phone: '+1234567890',
                dateOfBirth: '1990-01-01',
                address: '123 Health Street, Wellness City'
            };
            
            const token = 'mock_jwt_token_' + Date.now();
            localStorage.setItem('authToken', token);
            localStorage.setItem('userData', JSON.stringify(mockUserData));
            
            if (!localStorage.getItem('emergencyContacts')) {
                localStorage.setItem('emergencyContacts', JSON.stringify([]));
            }
            if (!localStorage.getItem('alertHistory')) {
                localStorage.setItem('alertHistory', JSON.stringify([]));
            }
            
            showToast('Login successful! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        const input = errorElement.previousElementSibling;
        if (input && input.tagName === 'INPUT') {
            input.classList.add('error');
        }
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
    
    const errorInputs = document.querySelectorAll('input.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    toast.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
