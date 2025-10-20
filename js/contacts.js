checkAuth();

let editingContactId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    const addContactBtn = document.getElementById('addContactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModalBtn = document.getElementById('closeContactModal');
    const cancelBtn = document.getElementById('cancelContactBtn');
    const contactForm = document.getElementById('contactForm');
    
    addContactBtn.addEventListener('click', () => {
        openContactModal();
    });
    
    closeModalBtn.addEventListener('click', () => {
        closeContactModal();
    });
    
    cancelBtn.addEventListener('click', () => {
        closeContactModal();
    });
    
    contactForm.addEventListener('submit', handleSaveContact);
    
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeContactModal();
        }
    });
});

function loadContacts() {
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
    const contactsList = document.getElementById('contactsList');
    
    if (contacts.length === 0) {
        contactsList.innerHTML = '<p class="loading-text">No emergency contacts added yet. Add up to 3 contacts.</p>';
    } else {
        contactsList.innerHTML = contacts.map((contact, index) => `
            <div class="contact-card">
                <div class="contact-info">
                    <h4>${contact.name}</h4>
                    <p><strong>Phone:</strong> ${contact.phone}</p>
                    <p><strong>Relationship:</strong> ${contact.relation}</p>
                    ${contact.email ? `<p><strong>Email:</strong> ${contact.email}</p>` : ''}
                </div>
                <div class="contact-actions">
                    <button class="btn btn-secondary btn-icon-only" onclick="editContact(${index})" title="Edit">✏️</button>
                    <button class="btn btn-danger btn-icon-only" onclick="deleteContact(${index})" title="Delete">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    const addContactBtn = document.getElementById('addContactBtn');
    if (contacts.length >= 3) {
        addContactBtn.disabled = true;
        addContactBtn.textContent = 'Maximum 3 contacts reached';
        addContactBtn.style.opacity = '0.5';
    } else {
        addContactBtn.disabled = false;
        addContactBtn.innerHTML = '<span>+</span> Add Emergency Contact';
        addContactBtn.style.opacity = '1';
    }
}

function openContactModal(contact = null, index = null) {
    const modal = document.getElementById('contactModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('contactForm');
    
    form.reset();
    clearContactErrors();
    
    if (contact) {
        modalTitle.textContent = 'Edit Emergency Contact';
        document.getElementById('contactId').value = index;
        document.getElementById('contactName').value = contact.name;
        document.getElementById('contactPhone').value = contact.phone;
        document.getElementById('contactRelation').value = contact.relation;
        document.getElementById('contactEmail').value = contact.email || '';
        editingContactId = index;
    } else {
        modalTitle.textContent = 'Add Emergency Contact';
        document.getElementById('contactId').value = '';
        editingContactId = null;
    }
    
    modal.classList.add('active');
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    editingContactId = null;
}

function handleSaveContact(e) {
    e.preventDefault();
    
    clearContactErrors();
    
    const formData = {
        name: document.getElementById('contactName').value.trim(),
        phone: document.getElementById('contactPhone').value.trim(),
        relation: document.getElementById('contactRelation').value,
        email: document.getElementById('contactEmail').value.trim()
    };
    
    let isValid = true;
    
    if (formData.name.length < 2) {
        showContactError('contactNameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        showContactError('contactPhoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    if (!formData.relation) {
        showContactError('contactRelationError', 'Please select a relationship');
        isValid = false;
    }
    
    if (isValid) {
        const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
        
        if (editingContactId !== null) {
            contacts[editingContactId] = formData;
            showToast('Contact updated successfully', 'success');
        } else {
            if (contacts.length >= 3) {
                showToast('Maximum 3 contacts allowed', 'error');
                return;
            }
            contacts.push(formData);
            showToast('Contact added successfully', 'success');
        }
        
        localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
        loadContacts();
        closeContactModal();
    }
}

function editContact(index) {
    const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
    openContactModal(contacts[index], index);
}

function deleteContact(index) {
    if (confirm('Are you sure you want to delete this emergency contact?')) {
        const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
        contacts.splice(index, 1);
        localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
        loadContacts();
        showToast('Contact deleted successfully', 'success');
    }
}

function showContactError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearContactErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
}
