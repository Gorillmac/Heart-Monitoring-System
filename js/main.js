function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    const publicPages = ['/', '/index.html', '/login.html', '/register.html', '/logout.html'];
    const isPublicPage = publicPages.some(page => currentPage.endsWith(page) || currentPage === '/');
    
    if (!token && !isPublicPage) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (token && isPublicPage && !currentPage.includes('index.html') && currentPage !== '/') {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function setUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
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
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    switch(type) {
        case 'success':
            toast.style.background = '#27ae60';
            break;
        case 'error':
            toast.style.background = '#e74c3c';
            break;
        case 'warning':
            toast.style.background = '#f39c12';
            break;
        default:
            toast.style.background = '#3498db';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateNavUsername() {
    const navUsername = document.getElementById('navUsername');
    if (navUsername) {
        const userData = getUserData();
        if (userData && userData.fullName) {
            navUsername.textContent = userData.fullName.split(' ')[0];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    updateNavUsername();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
