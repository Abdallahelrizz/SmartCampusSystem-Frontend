// Utility functions

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

function formatTime(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Time';
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return 'Invalid Time';
    }
}

function showAlert(message, type = 'info', container = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const targetContainer = container || document.querySelector('.container') || document.querySelector('.auth-card') || document.body;
    
    // Create alert container if it doesn't exist
    let alertContainer = targetContainer.querySelector('#alertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        targetContainer.insertBefore(alertContainer, targetContainer.firstChild);
    }
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
    
    // Scroll to alert
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="spinner"></div><div class="loading">Loading...</div>';
    }
}

function hideLoading(element) {
    if (element) {
        element.innerHTML = '';
    }
}

function validateEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

function validatePassword(password) {
    if (!password || password.length < 8) return false;
    if (!/(?=.*[A-Z])/.test(password)) return false;
    if (!/(?=.*[0-9])/.test(password)) return false;
    if (!/(?=.*[!@#$%^&*])/.test(password)) return false;
    return true;
}

function getStatusBadge(status, context = '') {
    if (!status) return '<span class="badge badge-info">Unknown</span>';
    
    // For issues, "closed" means resolved/completed (good - green)
    // For facilities/resources, "closed" means unavailable (bad - red)
    let statusKey = status.toLowerCase();
    if (statusKey === 'closed' && context === 'issue') {
        // Issue closed = resolved/completed (good)
        const displayStatus = 'Resolved';
        return `<span class="badge badge-success">${displayStatus}</span>`;
    }
    
    const statusMap = {
        'active': 'badge-success',
        'pending': 'badge-warning',
        'approved': 'badge-success',
        'rejected': 'badge-danger',
        'cancelled': 'badge-danger',
        'in_progress': 'badge-info',
        'resolved': 'badge-success',
        'closed': 'badge-danger',  // For facilities/resources - unavailable (bad)
        'available': 'badge-success',
        'unavailable': 'badge-danger',
        'occupied': 'badge-warning',
        'under_maintenance': 'badge-warning',
        'reserved': 'badge-info'
    };
    
    const badgeClass = statusMap[statusKey] || 'badge-info';
    const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return `<span class="badge ${badgeClass}">${displayStatus}</span>`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function truncateText(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Make functions available globally
window.formatDate = formatDate;
window.formatTime = formatTime;
window.showAlert = showAlert;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.getStatusBadge = getStatusBadge;
window.debounce = debounce;
window.formatCurrency = formatCurrency;
window.truncateText = truncateText;
window.escapeHtml = escapeHtml;
