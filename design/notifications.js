let notificationPages = {
    currentPage: 1
};

function toggleNotifDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
    const dd = document.getElementById('notifDropdown');
    if (!dd) return;
    
    const isOpen = dd.classList.contains('open');
    dd.classList.toggle('open', !isOpen);
    
    if (!isOpen) {
        setTimeout(() => {
            document.addEventListener('click', closeOnOutside);
        }, 10);
    } else {
        document.removeEventListener('click', closeOnOutside);
    }
}

function closeOnOutside(e) {
    const dd = document.getElementById('notifDropdown');
    const btn = document.getElementById('notifBellBtn');
    if (!dd || !btn) return;
    
    if (!dd.contains(e.target) && !btn.contains(e.target)) {
        closeNotifDropdown();
    }
}

function closeNotifDropdown() {
    const dd = document.getElementById('notifDropdown');
    if (dd) dd.classList.remove('open');
    document.removeEventListener('click', closeOnOutside);
}

function markAllRead() {
    fetch('../backend/mark-notifications-read.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            document.querySelectorAll('.notif-dd-item.unread').forEach(el => {
                el.classList.remove('unread');
            });
            document.querySelectorAll('.notif-dd-dot').forEach(el => {
                el.classList.add('read');
            });
            document.querySelector('.notif-red-dot')?.remove();
            
            if (typeof showToast === 'function') {
                showToast('All notifications marked as read', 'success');
            }
        }
    }).catch(() => {});
}

function markNotifRead(id) {
    fetch('../backend/mark-notifications-read.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + id
    }).catch(() => {});
}

function handleNotificationClick(id, type, message) {
    markNotifRead(id);
    closeNotifDropdown();
    
    // Go to me-page.php with notification ID in hash
    window.location.href = '/public/me-page.php#notification-' + id;
}

function showNotifReason(reason) {
    document.querySelector('.notif-reason-modal')?.remove();
    const modal = document.createElement('div');
    modal.className = 'notif-reason-modal';
    modal.innerHTML = `
        <div class="notif-reason-content">
            <div class="notif-reason-header">
                <span>Message from Admin</span>
                <button onclick="this.closest('.notif-reason-modal').remove(); document.body.style.overflow='';">✕</button>
            </div>
            <p class="notif-reason-text">${reason}</p>
        </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    const notifBtn = document.getElementById('notifBellBtn');
    if (notifBtn) {
        notifBtn.removeEventListener('click', toggleNotifDropdown);
        notifBtn.addEventListener('click', toggleNotifDropdown);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNotifDropdown();
        }
    });
});

function highlightNotification(id) {
    const notificationElement = document.getElementById(`notification-${id}`);
    if (notificationElement) {
        notificationElement.classList.add('highlight');
        notificationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            notificationElement.classList.remove('highlight');
        }, 2000);
    }
}