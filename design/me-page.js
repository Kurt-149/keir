let currentPages = {
    'to-ship': 1,
    'to-receive': 1,
    'completed': 1,
    'orders': 1,
    'reviews': 1,
    'notifications': 1
};

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const selected = document.getElementById(`section-${sectionName}`);
    if (selected) selected.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    const activeNav = document.querySelector(`[href="#${sectionName}"]`);
    if (activeNav) activeNav.classList.add('active');

    loadSectionData(sectionName);
    
    history.pushState(null, null, `#${sectionName}`);
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'to-ship':        loadOrders('pending',   1); break;
        case 'to-receive':     loadOrders('shipped',   1); break;
        case 'completed':      loadOrders('delivered', 1); break;
        case 'orders':         loadOrders('all',       1); break;
        case 'reviews':        loadReviews(1);             break;
        case 'notifications':  loadNotifications(1);       break;
    }
}

function loadOrders(status, page) {
    page = page || 1;
    const map = {
        pending:   'toShipOrders',
        shipped:   'toReceiveOrders',
        delivered: 'completedOrders',
        all:       'allOrders'
    };
    const container = document.getElementById(map[status]);
    if (!container) return;

    const section = status === 'all' ? 'orders' :
                    status === 'pending' ? 'to-ship' :
                    status === 'shipped' ? 'to-receive' : 'completed';
    currentPages[section] = page;

    container.innerHTML = '<div class="loading">Loading orders...</div>';

    fetch(`../backend/get-order.php?status=${status}&page=${page}`, { credentials: 'include' })
        .then(res => {
            if (!res.ok) return res.json().catch(() => null).then(b => { throw new Error(`HTTP ${res.status}: ${b?.message || res.statusText}`); });
            return res.json();
        })
        .then(data => {
            if (!data.success) throw new Error(data.message || 'Failed to load orders');

            let html = '';
            if (Array.isArray(data.orders) && data.orders.length > 0) {
                if (data.pagination) {
                    html += `<div class="section-count">Total ${getStatusLabel(status)}: ${data.pagination.total_orders}</div>`;
                }
                html += data.orders.map(createOrderCard).join('');
                if (data.pagination && data.pagination.total_pages > 1) {
                    html += createPagination(data.pagination, status, section);
                }
            } else {
                html = emptyState(`No ${getStatusLabel(status).toLowerCase()} found`);
            }
            container.innerHTML = html;
        })
        .catch(err => {
            console.error('Load orders error:', err);
            container.innerHTML = emptyState('Error loading orders. Please try again.');
        });
}

function createPagination(pagination, status, section) {
    const { current_page, total_pages } = pagination;
    if (total_pages <= 1) return '';

    let html = '<div class="pagination">';
    html += `<span class="pagination-info">Page ${current_page} of ${total_pages}</span>`;
    html += current_page > 1
        ? `<button class="pagination-btn" onclick="loadOrders('${status}', ${current_page - 1})">‹ Previous</button>`
        : '<button class="pagination-btn disabled" disabled>‹ Previous</button>';
    html += current_page < total_pages
        ? `<button class="pagination-btn" onclick="loadOrders('${status}', ${current_page + 1})">Next ›</button>`
        : '<button class="pagination-btn disabled" disabled>Next ›</button>';
    html += '</div>';
    return html;
}

function getStatusLabel(status) {
    return { pending: 'Pending Orders', shipped: 'Orders to Receive', delivered: 'Completed Orders', all: 'Orders' }[status] || 'Orders';
}

function createOrderCard(order) {
    const items = Array.isArray(order.items) ? order.items : [];
    const orderNumber = order.order_number || `ORDER-${order.id || 'UNKNOWN'}`;

    let itemsHtml = '';
    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            itemsHtml += createOrderItem(items[i]);
        }
    } else {
        itemsHtml = '<div class="empty-text">No items in this order</div>';
    }

    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${escapeHtml(orderNumber)}</div>
                    <div class="order-date">${formatDate(order.created_at)}</div>
                </div>
                <span class="order-status status-${order.status}">${capitalizeStatus(order.status)}</span>
            </div>
            <div class="order-items">
                ${itemsHtml}
            </div>
            <div class="order-footer">
                <div class="order-total">P${formatPrice(order.total_amount)}</div>
                <button class="btn-review" onclick="viewOrderDetails('${escapeHtml(orderNumber)}')">View Details</button>
            </div>
        </div>
    `;
}

function createOrderItem(item) {
    const variants = [item.selected_color, item.selected_size].filter(Boolean).join(' / ');
    const hasDiscount = item.original_price && parseFloat(item.original_price) > parseFloat(item.price);

    return `
        <div class="order-item">
            <div class="order-item-image">
                ${item.image_url
                    ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.product_name)}" onerror="this.style.display='none';this.parentElement.classList.add('no-image')">`
                    : getImagePlaceholder()}
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${escapeHtml(item.product_name || 'Unknown Product')}</div>
                ${variants ? `<div class="order-item-variant-row"><span class="order-item-variant-label">Color:</span><div class="order-item-variant">${escapeHtml(variants)}</div></div>` : ''}
                <div class="order-item-qty">Quantity: ${parseInt(item.quantity) || 0}</div>
            </div>
            <div class="order-item-price">
                <span class="order-item-current">P${formatPrice(item.price)}</span>
                ${hasDiscount ? `<div class="order-item-original">P${formatPrice(item.original_price)}</div>` : ''}
            </div>
        </div>
    `;
}

function getImagePlaceholder() {
    return `<div class="no-image-placeholder"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#cbd5e1"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg></div>`;
}

function loadReviews(page) {
    page = page || 1;
    const container = document.getElementById('reviewsList');
    if (!container) return;

    currentPages['reviews'] = page;
    container.innerHTML = '<div class="loading">Loading reviews...</div>';

    fetch(`../backend/get-user-review.php?page=${page}`, { credentials: 'include' })
        .then(res => {
            if (!res.ok) return res.json().catch(() => null).then(b => { throw new Error(`HTTP ${res.status}: ${b?.message || res.statusText}`); });
            return res.json();
        })
        .then(data => {
            if (!data.success) throw new Error(data.message || 'Failed to load reviews');

            let html = '';
            if (Array.isArray(data.reviews) && data.reviews.length > 0) {
                if (data.pagination) {
                    html += `<div class="section-count">Total Reviews: ${data.pagination.total_reviews}</div>`;
                }
                html += data.reviews.map(createReviewCard).join('');
                if (data.pagination && data.pagination.total_pages > 1) {
                    html += createReviewPagination(data.pagination);
                }
            } else {
                html = emptyState('No reviews yet. Complete an order to leave a review!');
            }
            container.innerHTML = html;
        })
        .catch(err => {
            console.error('Load reviews error:', err);
            container.innerHTML = emptyState('Error loading reviews. Please try again.');
        });
}

function createReviewPagination(pagination) {
    const { current_page, total_pages } = pagination;
    if (total_pages <= 1) return '';

    let html = '<div class="pagination">';
    html += `<span class="pagination-info">Page ${current_page} of ${total_pages}</span>`;
    html += current_page > 1
        ? `<button class="pagination-btn" onclick="loadReviews(${current_page - 1})">‹ Previous</button>`
        : '<button class="pagination-btn disabled" disabled>‹ Previous</button>';
    html += current_page < total_pages
        ? `<button class="pagination-btn" onclick="loadReviews(${current_page + 1})">Next ›</button>`
        : '<button class="pagination-btn disabled" disabled>Next ›</button>';
    html += '</div>';
    return html;
}

function createReviewCard(review) {
    const rating = parseInt(review.rating) || 0;
    const stars = Array.from({ length: 5 }, (_, i) =>
        `<span class="star ${i < rating ? 'filled' : ''}">★</span>`
    ).join('');

    let statusBadge = '';
    if (review.status === 'pending')  statusBadge = '<span class="review-status-pending">Pending Approval</span>';
    if (review.status === 'rejected') statusBadge = '<span class="review-status-rejected">Rejected</span>';

    return `
        <div class="review-card">
            <div class="review-header">
                <div class="review-rating">${stars}${statusBadge}</div>
                <div class="review-actions">
                    <div class="review-date">${formatDate(review.created_at)}</div>
                    <button class="btn-view-review" onclick="viewReviewOnProduct(${review.product_id}, ${review.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
                        </svg>
                        View
                    </button>
                </div>
            </div>
            <div class="review-product-name">
                ${review.image_url ? `<img src="${escapeHtml(review.image_url)}" alt="${escapeHtml(review.product_name)}" class="review-product-image" onerror="this.style.display='none'">` : ''}
                <strong>${escapeHtml(review.product_name || 'Unknown Product')}</strong>
            </div>
            <div class="review-text">${escapeHtml(review.comment || 'No comment provided')}</div>
        </div>
    `;
}

function viewReviewOnProduct(productId, reviewId) {
    window.location.href = `product-details.php?id=${productId}#review-${reviewId}`;
}

function loadNotifications(page) {
    page = page || 1;
    const container = document.getElementById('notificationsContent');
    if (!container) return;
    
    currentPages['notifications'] = page;
    container.innerHTML = '<div class="loading">Loading notifications...</div>';

    fetch(`../backend/get-notifications.php?page=${page}&per_page=10`, { credentials: 'include' })
        .then(r => r.json())
        .then(data => {
            if (!data.success) throw new Error(data.message || 'Failed');
            
            const notifs = data.notifications || [];
            const pg = data.pagination || null;

            if (!notifs.length) {
                container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔕</div><p class="empty-text">No notifications yet</p></div>';
                return;
            }

            const ico = { order: '📦', promo: '🏷️', review: '★', alert: '⚠️' };
            let html = pg ? `<div class="section-count">Total Notifications: ${pg.total_notifications}</div>` : '';

            html += '<div class="notif-full-list">';
            
            notifs.forEach(function(n) {
                const t = n.type || 'order';
                const i = ico[t] || '📦';
                const unr = !n.is_read;
                const parts = n.message.split(' | ');
                const mainMsg = parts[0];
                const noteMsg = parts.slice(1).join(' | ');

                // ADD CLICK HANDLER HERE - same as bell notifications
                html += `<div class="notif-full-item ${unr ? 'unread' : ''}" onclick="handleNotificationClick(${n.id}, '${t}', '${escapeHtml(n.message)}')" data-notification-id="${n.id}" id="notification-${n.id}">`
                     + `<div class="notif-full-icon ${t}">${i}</div>`
                     + `<div class="notif-full-body">`
                     + `<div class="notif-full-msg">${escapeHtml(mainMsg)}</div>`;
                
                if (noteMsg) {
                    html += `<button class="notif-reason-btn" onclick="event.stopPropagation(); showNotifReason('${escapeHtml(noteMsg)}')">View Reason</button>`;
                }
                
                html += `<div class="notif-full-time">${n.time_ago || ''}</div>`
                     + `</div>`
                     + `<div class="notif-full-dot ${unr ? '' : 'read'}"></div>`
                     + `</div>`;
            });
            
            html += '</div>';

            if (pg && pg.total_pages > 1) {
                const cur = pg.current_page, tot = pg.total_pages;
                html += '<div class="pagination">'
                     + `<span class="pagination-info">Page ${cur} of ${tot}</span>`
                     + (cur > 1 ? `<button class="pagination-btn" onclick="loadNotifications(${cur - 1})">‹ Previous</button>`
                                : '<button class="pagination-btn disabled" disabled>‹ Previous</button>')
                     + (cur < tot ? `<button class="pagination-btn" onclick="loadNotifications(${cur + 1})">Next ›</button>`
                                  : '<button class="pagination-btn disabled" disabled>Next ›</button>')
                     + '</div>';
            }

            container.innerHTML = html;

            const hash = window.location.hash;
            if (hash && hash.startsWith('#notification-')) {
                const notifId = hash.replace('#notification-', '');
                const notifElement = document.getElementById(`notification-${notifId}`);
                if (notifElement) {
                    notifElement.classList.add('highlight');
                    notifElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        notifElement.classList.remove('highlight');
                    }, 2000);
                }
            }
        })
        .catch(function(err) {
            console.error('Load notifications error:', err);
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p class="empty-text">Error loading notifications. Please try again.</p></div>';
        });
}

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
        credentials: 'include',
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
            const navBadge = document.querySelector('a[href="#notifications"] .badge');
            if (navBadge) navBadge.remove();
            
            if (typeof showToast === 'function') {
                showToast('All notifications marked as read', 'success');
            }
            
            if (document.getElementById('section-notifications')?.classList.contains('active')) {
                loadNotifications(1);
            }
        }
    }).catch(() => {});
}

function markNotifRead(id) {
    fetch('../backend/mark-notifications-read.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + id
    }).catch(() => {});
}

function handleNotificationClick(id, type, message) {
    markNotifRead(id);
    
    const orderMatch = message.match(/(ORD-\d{8}-[A-Z0-9]{8})/);
    
    if (orderMatch && orderMatch[1]) {
        viewOrderDetails(orderMatch[1]);
    } else {
        showSection('notifications');
    }
    
    closeNotifDropdown();
}

function viewOrderDetails(orderNumber) {
    console.log('Viewing order details for:', orderNumber);
    
    fetch(`../backend/get-order-details.php?order_number=${encodeURIComponent(orderNumber)}`, { credentials: 'include' })
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        })
        .then(data => {
            console.log('Order data received:', data);
            if (data.success) {
                showOrderDetailsModal(data.order);
            } else {
                alert(data.message || 'Failed to load order details');
            }
        })
        .catch(err => {
            console.error('Error loading order details:', err);
            alert('Error loading order details. Please try again.');
        });
}

function showOrderDetailsModal(order) {
    document.querySelector('.order-modal')?.remove();

    const items = Array.isArray(order.items) ? order.items : [];

    const itemsHtml = items.map(item => {
        const hasDiscount = item.original_price && parseFloat(item.original_price) > parseFloat(item.price);
        const discountPct = hasDiscount
            ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
            : 0;
        const variants = [item.selected_color, item.selected_size].filter(Boolean).join(' / ');

        return `
            <div class="modal-order-item">
                <div class="modal-item-image">
                    ${item.image_url
                        ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.product_name)}">`
                        : getImagePlaceholder()}
                </div>
                <div class="modal-item-details">
                    <div class="modal-item-name">${escapeHtml(item.product_name)}</div>
                    ${variants ? `<div class="order-item-variant-row"><span class="order-item-variant-label">Color & Size: </span><div class="order-item-variant">${escapeHtml(variants)}</div></div>` : ''}
                    <div class="modal-item-qty">Quantity: ${parseInt(item.quantity)}</div>
                    <div class="modal-item-pricing">
                        <span class="modal-price-current">P${formatPrice(item.price)}</span>
                        ${hasDiscount ? `
                            <span class="modal-price-original">P${formatPrice(item.original_price)}</span>
                            <span class="modal-discount-badge">-${discountPct}%</span>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-item-subtotal">P${formatPrice(item.subtotal)}</div>
            </div>
        `;
    }).join('');

    const shippingFee = parseFloat(order.shipping_fee) || 0;
    const subtotal    = parseFloat(order.subtotal)     || 0;
    const tax         = parseFloat(order.tax_amount)   || 0;

    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="order-modal-content">
            <div class="order-modal-header">
                <div>
                    <h2>Order Details</h2>
                    <p class="modal-order-number">#${escapeHtml(order.order_number)}</p>
                </div>
                <button class="order-modal-close" id="modalCloseBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                    </svg>
                </button>
            </div>

            <div class="order-modal-body">
                <div class="modal-meta-row">
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Date</span>
                        <span class="modal-meta-value">${formatDate(order.created_at)}</span>
                    </div>
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Status</span>
                        <span class="order-status status-${order.status}">${capitalizeStatus(order.status)}</span>
                    </div>
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Payment</span>
                        <span class="modal-meta-value">${order.payment_method.toUpperCase()}</span>
                    </div>
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Pay Status</span>
                        <span class="modal-meta-value">${capitalizeStatus(order.payment_status || 'pending')}</span>
                    </div>
                </div>

                <div class="modal-section">
                    <h3>Shipping Information</h3>
                    <div class="modal-shipping-grid">
                        <div><span class="modal-meta-label">Name</span><span>${escapeHtml(order.shipping_name)}</span></div>
                        <div><span class="modal-meta-label">Phone</span><span>${escapeHtml(order.shipping_phone)}</span></div>
                        <div><span class="modal-meta-label">Email</span><span>${escapeHtml(order.shipping_email)}</span></div>
                        <div><span class="modal-meta-label">Address</span><span>${escapeHtml(order.shipping_address)}, ${escapeHtml(order.shipping_city)} ${escapeHtml(order.shipping_postal)}</span></div>
                    </div>
                </div>

                <div class="modal-section">
                    <h3>Items Ordered</h3>
                    <div class="modal-items-list">${itemsHtml}</div>
                </div>

                <div class="modal-price-breakdown">
                    <div class="modal-price-row">
                        <span>Subtotal</span>
                        <span>P${formatPrice(subtotal)}</span>
                    </div>
                    <div class="modal-price-row">
                        <span>Shipping Fee</span>
                        ${shippingFee === 0
                            ? '<span class="modal-free-ship">FREE</span>'
                            : `<span>P${formatPrice(shippingFee)}</span>`}
                    </div>
                    <div class="modal-price-row">
                        <span>Tax (12% VAT)</span>
                        <span>P${formatPrice(tax)}</span>
                    </div>
                    <div class="modal-price-divider"></div>
                    <div class="modal-price-row modal-price-total">
                        <span>Total</span>
                        <span>P${formatPrice(order.total_amount)}</span>
                    </div>
                </div>

                ${order.notes ? `
                    <div class="modal-section">
                        <h3>Order Notes</h3>
                        <p class="modal-notes">${escapeHtml(order.notes)}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    modal.querySelector('#modalCloseBtn').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
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

    const editForm = document.getElementById('editProfileForm');

    if (editForm) {
        const profilePictureInput   = document.getElementById('profile_picture');
        const profilePicturePreview = document.getElementById('profilePicturePreview');

        if (profilePictureInput && profilePicturePreview) {
            profilePictureInput.addEventListener('change', function (e) {
                const file = e.target.files[0];
                if (!file) return;
                if (!file.type.match('image.*')) { alert('Please select an image file'); this.value = ''; return; }
                if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); this.value = ''; return; }

                const reader = new FileReader();
                reader.onload = function (e) {
                    if (profilePicturePreview.tagName === 'IMG') {
                        profilePicturePreview.src = e.target.result;
                    } else {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = 'Profile Picture';
                        img.id = 'profilePicturePreview';
                        profilePicturePreview.parentNode.replaceChild(img, profilePicturePreview);
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            if (formData.get('new_password') !== formData.get('confirm_password')) {
                alert('New passwords do not match!');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            fetch('../backend/update-profile.php', { method: 'POST', credentials: 'include', body: formData })
                .then(r => r.json())
                .then(data => {
                    if (data.success) { alert('Profile updated successfully!'); location.reload(); }
                    else { alert(data.message || 'Failed to update profile'); submitBtn.disabled = false; submitBtn.textContent = originalText; }
                })
                .catch(() => { alert('An error occurred'); submitBtn.disabled = false; submitBtn.textContent = originalText; });
        });
    }

    const searchToggle = document.querySelector('.mobile-search-toggle');
    const mobileSearchBar = document.getElementById('mobileSearchBar');
    if (searchToggle && mobileSearchBar) {
        searchToggle.addEventListener('click', function () {
            const hidden = !mobileSearchBar.style.display || mobileSearchBar.style.display === 'none';
            mobileSearchBar.style.display = hidden ? 'block' : 'none';
            if (hidden) {
                mobileSearchBar.style.animation = 'slideDown 0.3s ease';
                const inp = mobileSearchBar.querySelector('input');
                if (inp) inp.focus();
            }
        });
    }

    const valid = ['profile','edit-profile','to-ship','to-receive','completed','orders','reviews','notifications','settings'];
    let hash = window.location.hash.replace('#', '');
    
    if (hash.startsWith('notification-')) {
        const notificationId = hash.replace('notification-', '');
        
        showSection('notifications');
        
        setTimeout(() => {
            loadNotifications(1);
            setTimeout(() => {
                const notifElement = document.getElementById(`notification-${notificationId}`);
                if (notifElement) {
                    notifElement.classList.add('highlight');
                    notifElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        notifElement.classList.remove('highlight');
                    }, 2000);
                }
            }, 500);
        }, 100);
    } else if (valid.indexOf(hash) !== -1) {
        showSection(hash);
    } else {
        showSection('profile');
    }
});

function confirmDeleteAccount() {
    if (!confirm('Are you absolutely sure you want to delete your account?\n\nThis action CANNOT be undone!\n\nAll your orders, reviews, and personal data will be PERMANENTLY deleted.')) return;
    if (prompt('Type "DELETE" in ALL CAPS to confirm account deletion:') !== 'DELETE') { alert('Account deletion cancelled'); return; }
    const password = prompt('Enter your password to confirm:');
    if (!password) { alert('Password required to delete account'); return; }

    const deleteBtn = document.querySelector('.danger-zone .btn-danger');
    if (deleteBtn) { deleteBtn.disabled = true; deleteBtn.textContent = 'Deleting...'; }

    fetch('../backend/delete-account.php', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'password=' + encodeURIComponent(password)
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) { alert('Your account has been deleted. You will now be logged out.'); window.location.href = '../index.php'; }
            else { alert(data.message || 'Failed to delete account'); if (deleteBtn) { deleteBtn.disabled = false; deleteBtn.textContent = 'Delete Account'; } }
        })
        .catch(() => { alert('An error occurred'); if (deleteBtn) { deleteBtn.disabled = false; deleteBtn.textContent = 'Delete Account'; } });
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(price) {
    const num = parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
}

function capitalizeStatus(status) {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
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
        if (e.target === modal) { modal.remove(); document.body.style.overflow = ''; }
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function emptyState(text) {
    return `<div class="empty-state"><div class="empty-icon">📦</div><p class="empty-text">${escapeHtml(text)}</p></div>`;
}
// Profile Image Lightbox Functions
function openProfileImageLightbox() {
    const avatarImg = document.querySelector('.user-avatar img');
    if (!avatarImg) {
        alert('No profile image to display');
        return;
    }
    
    const lightbox = document.getElementById('profileImageLightbox');
    const lightboxImg = document.getElementById('profileLightboxImage');
    
    lightboxImg.src = avatarImg.src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProfileImageLightbox() {
    const lightbox = document.getElementById('profileImageLightbox');
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProfileImageLightbox();
    }
});
function openEditProfileImageLightbox() {
    const previewImg = document.getElementById('profilePicturePreview');
    if (!previewImg || previewImg.tagName !== 'IMG') {
        alert('No profile image to display');
        return;
    }
    
    const lightbox = document.getElementById('profileImageLightbox');
    const lightboxImg = document.getElementById('profileLightboxImage');
    
    lightboxImg.src = previewImg.src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}