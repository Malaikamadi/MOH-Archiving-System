// ============================================
// TOAST NOTIFICATIONS
// ============================================
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
            <div class="toast-progress"></div>
        `;

        this.container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);

        return toast;
    }

    success(message, duration) { return this.show(message, 'success', duration); }
    error(message, duration) { return this.show(message, 'error', duration); }
    warning(message, duration) { return this.show(message, 'warning', duration); }
    info(message, duration) { return this.show(message, 'info', duration); }
}

// Global toast instance
const Toast = new ToastManager();

// ============================================
// LOADING STATES
// ============================================
class LoadingManager {
    static showOverlay(message = 'Loading...') {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p class="loading-message">${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.querySelector('.loading-message').textContent = message;
        overlay.classList.add('active');
    }

    static hideOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    static showButton(button, loadingText = 'Loading...') {
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="btn-spinner"></span> ${loadingText}`;
    }

    static hideButton(button) {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }

    static showSkeleton(element) {
        element.classList.add('skeleton-loading');
    }

    static hideSkeleton(element) {
        element.classList.remove('skeleton-loading');
    }
}

// ============================================
// DARK MODE
// ============================================
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('moh-theme') || 'light';
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateToggleButton();
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('moh-theme', this.theme);
        this.updateToggleButton();
        Toast.info(`${this.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`);
    }

    updateToggleButton() {
        const toggles = document.querySelectorAll('.theme-toggle');
        toggles.forEach(toggle => {
            if (this.theme === 'dark') {
                toggle.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
            } else {
                toggle.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
            }
        });
    }
}

const Theme = new ThemeManager();

// ============================================
// NOTIFICATION CENTER
// ============================================
class NotificationCenter {
    constructor() {
        this.notifications = [];
        this.unreadCount = 0;
        this.isOpen = false;
        this.loadNotifications();
    }

    loadNotifications() {
        // Sample notifications - in production, fetch from API
        this.notifications = [
            {
                id: 1,
                type: 'document',
                title: 'Document Approved',
                message: 'National Health Policy 2026 has been approved',
                time: '5 minutes ago',
                read: false,
                icon: 'check'
            },
            {
                id: 2,
                type: 'meeting',
                title: 'Meeting Reminder',
                message: 'Cabinet Health Committee Meeting starts in 1 hour',
                time: '1 hour ago',
                read: false,
                icon: 'calendar'
            },
            {
                id: 3,
                type: 'upload',
                title: 'New Document Uploaded',
                message: 'WHO Partnership Agreement uploaded by Secretary',
                time: '2 hours ago',
                read: false,
                icon: 'upload'
            },
            {
                id: 4,
                type: 'approval',
                title: 'Pending Approval',
                message: '3 documents are waiting for your approval',
                time: '3 hours ago',
                read: true,
                icon: 'clock'
            },
            {
                id: 5,
                type: 'system',
                title: 'System Update',
                message: 'System maintenance scheduled for tonight at 11 PM',
                time: 'Yesterday',
                read: true,
                icon: 'settings'
            }
        ];
        this.unreadCount = this.notifications.filter(n => !n.read).length;
        this.updateBadge();
    }

    updateBadge() {
        const badges = document.querySelectorAll('.notif-count');
        badges.forEach(badge => {
            badge.textContent = this.unreadCount;
            badge.style.display = this.unreadCount > 0 ? 'flex' : 'none';
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('active', this.isOpen);
        }
    }

    close() {
        this.isOpen = false;
        const dropdown = document.querySelector('.notification-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.unreadCount--;
            this.updateBadge();
            this.render();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.unreadCount = 0;
        this.updateBadge();
        this.render();
        Toast.success('All notifications marked as read');
    }

    getIconSvg(icon) {
        const icons = {
            check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
            calendar: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
            upload: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
            clock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
            settings: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
        };
        return icons[icon] || icons.check;
    }

    render() {
        const dropdown = document.querySelector('.notification-dropdown');
        if (!dropdown) return;

        const notificationList = dropdown.querySelector('.notification-list');
        if (!notificationList) return;

        notificationList.innerHTML = this.notifications.map(n => `
            <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="NotificationManager.markAsRead(${n.id})">
                <div class="notification-icon ${n.type}">${this.getIconSvg(n.icon)}</div>
                <div class="notification-content">
                    <h4>${n.title}</h4>
                    <p>${n.message}</p>
                    <span class="notification-time">${n.time}</span>
                </div>
                ${!n.read ? '<span class="notification-dot"></span>' : ''}
            </div>
        `).join('');
    }
}

const NotificationManager = new NotificationCenter();

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.isModalOpen = false;
        this.init();
    }

    init() {
        // Register default shortcuts
        this.register('ctrl+k', 'Search', () => {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        });

        this.register('ctrl+n', 'New Document', () => {
            window.location.href = 'document-create.html';
        });

        this.register('ctrl+d', 'Toggle Dark Mode', () => {
            Theme.toggle();
        });

        this.register('escape', 'Close Modal/Dropdown', () => {
            this.closeModals();
        });

        this.register('ctrl+/', 'Show Shortcuts', () => {
            this.showHelp();
        });

        // Listen for keydown events
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }

    register(keys, description, callback) {
        this.shortcuts.set(keys.toLowerCase(), { description, callback });
    }

    handleKeydown(e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            if (e.key === 'Escape') {
                e.target.blur();
            }
            return;
        }

        let key = '';
        if (e.ctrlKey || e.metaKey) key += 'ctrl+';
        if (e.shiftKey) key += 'shift+';
        if (e.altKey) key += 'alt+';
        key += e.key.toLowerCase();

        const shortcut = this.shortcuts.get(key);
        if (shortcut) {
            e.preventDefault();
            shortcut.callback();
        }
    }

    closeModals() {
        // Close notification dropdown
        NotificationManager.close();

        // Close any open modals
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showHelp() {
        let modal = document.getElementById('shortcuts-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'shortcuts-modal';
            modal.className = 'shortcuts-modal';
            modal.innerHTML = `
                <div class="shortcuts-content">
                    <div class="shortcuts-header">
                        <h3>⌨️ Keyboard Shortcuts</h3>
                        <button class="shortcuts-close" onclick="Shortcuts.closeHelp()">×</button>
                    </div>
                    <div class="shortcuts-body">
                        ${Array.from(this.shortcuts.entries()).map(([key, data]) => `
                            <div class="shortcut-item">
                                <span class="shortcut-keys">${key.split('+').map(k => `<kbd>${k}</kbd>`).join(' + ')}</span>
                                <span class="shortcut-desc">${data.description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.classList.add('active');
        this.isModalOpen = true;
    }

    closeHelp() {
        const modal = document.getElementById('shortcuts-modal');
        if (modal) {
            modal.classList.remove('active');
            this.isModalOpen = false;
        }
    }
}

const Shortcuts = new KeyboardShortcuts();

// ============================================
// DOCUMENT PREVIEW MODAL
// ============================================
class DocumentPreview {
    static show(title, type, content) {
        let modal = document.getElementById('document-preview-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'document-preview-modal';
            modal.className = 'document-preview-modal';
            modal.innerHTML = `
                <div class="preview-overlay" onclick="DocumentPreview.close()"></div>
                <div class="preview-container">
                    <div class="preview-header">
                        <div class="preview-title">
                            <span class="preview-icon"></span>
                            <h3></h3>
                        </div>
                        <div class="preview-actions">
                            <button class="preview-btn" onclick="DocumentPreview.download()">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Download
                            </button>
                            <button class="preview-btn" onclick="DocumentPreview.print()">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="6 9 6 2 18 2 18 9"/>
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                    <rect x="6" y="14" width="12" height="8"/>
                                </svg>
                                Print
                            </button>
                            <button class="preview-close" onclick="DocumentPreview.close()">×</button>
                        </div>
                    </div>
                    <div class="preview-body">
                        <div class="preview-content"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.querySelector('.preview-title h3').textContent = title;
        modal.querySelector('.preview-content').innerHTML = content || `
            <div class="preview-placeholder">
                <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
                <p>Document preview loading...</p>
                <span>Preview not available for this document type</span>
            </div>
        `;
        modal.classList.add('active');
    }

    static close() {
        const modal = document.getElementById('document-preview-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    static download() {
        Toast.success('Download started...');
    }

    static print() {
        window.print();
    }
}

// ============================================
// SESSION TIMEOUT
// ============================================
class SessionManager {
    constructor(timeoutMinutes = 30) {
        this.timeout = timeoutMinutes * 60 * 1000;
        this.warningTime = 5 * 60 * 1000; // 5 minutes before timeout
        this.lastActivity = Date.now();
        this.timer = null;
        this.warningShown = false;
        this.init();
    }

    init() {
        // Track user activity
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.resetTimer());
        });

        this.startTimer();
    }

    resetTimer() {
        this.lastActivity = Date.now();
        this.warningShown = false;
        this.hideWarning();
    }

    startTimer() {
        this.timer = setInterval(() => {
            const elapsed = Date.now() - this.lastActivity;
            const remaining = this.timeout - elapsed;

            if (remaining <= 0) {
                this.logout();
            } else if (remaining <= this.warningTime && !this.warningShown) {
                this.showWarning(Math.ceil(remaining / 60000));
                this.warningShown = true;
            }
        }, 1000);
    }

    showWarning(minutes) {
        let warning = document.getElementById('session-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'session-warning';
            warning.className = 'session-warning';
            warning.innerHTML = `
                <div class="session-warning-content">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div>
                        <strong>Session Expiring</strong>
                        <p>Your session will expire in <span id="session-countdown">${minutes}</span> minutes due to inactivity.</p>
                    </div>
                    <button onclick="SessionTimeout.extend()">Stay Logged In</button>
                </div>
            `;
            document.body.appendChild(warning);
        }
        warning.classList.add('active');
    }

    hideWarning() {
        const warning = document.getElementById('session-warning');
        if (warning) {
            warning.classList.remove('active');
        }
    }

    extend() {
        this.resetTimer();
        Toast.success('Session extended');
    }

    logout() {
        clearInterval(this.timer);
        Toast.warning('Session expired. Redirecting to login...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

const SessionTimeout = new SessionManager(30);

// ============================================
// BREADCRUMBS
// ============================================
class BreadcrumbManager {
    static generate(items) {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;

        breadcrumb.innerHTML = items.map((item, index) => {
            const isLast = index === items.length - 1;
            return `
                ${isLast
                    ? `<span class="breadcrumb-current">${item.label}</span>`
                    : `<a href="${item.href}" class="breadcrumb-link">${item.label}</a>
                       <span class="breadcrumb-separator">/</span>`
                }
            `;
        }).join('');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
    // Format date
    formatDate(date, format = 'short') {
        const d = new Date(date);
        const options = format === 'short'
            ? { day: '2-digit', month: 'short', year: 'numeric' }
            : { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
        return d.toLocaleDateString('en-GB', options);
    },

    // Format time ago
    timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Toast.success('Copied to clipboard');
        } catch (err) {
            Toast.error('Failed to copy');
        }
    },

    // Confirm dialog
    confirm(message) {
        return new Promise((resolve) => {
            let modal = document.getElementById('confirm-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'confirm-modal';
                modal.className = 'confirm-modal';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div class="confirm-content">
                    <div class="confirm-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <p>${message}</p>
                    <div class="confirm-buttons">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-confirm">Confirm</button>
                    </div>
                </div>
            `;

            modal.classList.add('active');

            modal.querySelector('.btn-cancel').onclick = () => {
                modal.classList.remove('active');
                resolve(false);
            };

            modal.querySelector('.btn-confirm').onclick = () => {
                modal.classList.remove('active');
                resolve(true);
            };
        });
    }
};

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize notification dropdown toggle
    document.querySelectorAll('.notification-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            NotificationManager.toggle();
            NotificationManager.render();
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-wrapper')) {
            NotificationManager.close();
        }
    });

    // Theme toggle initialization
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => Theme.toggle());
    });

    console.log('🏥 MoH Archiving System - Utilities Loaded v1.1.0');
});
