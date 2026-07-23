/**
 * NHIH DESIGN SYSTEM - Shared JavaScript
 * Core functionality for all NHIH dashboards
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSidebar();
    initDropdowns();
    initCharts();
    updateDateTime();
    setInterval(updateDateTime, 60000);
});

// Theme Management
function initTheme() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    // Check local storage or system preference
    const isDark = localStorage.getItem('nhih_theme') === 'dark' ||
        (!localStorage.getItem('nhih_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.body.classList.add('dark-theme');
        themeBtn.querySelector('.material-icons').textContent = 'light_mode';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isNowDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('nhih_theme', isNowDark ? 'dark' : 'light');
        themeBtn.querySelector('.material-icons').textContent = isNowDark ? 'light_mode' : 'dark_mode';

        // Update charts if they exist
        updateChartThemes(isNowDark);
    });
}

// Sidebar Management
function initSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!menuToggle || !sidebar || !overlay) return;

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
}

// Dropdowns (Notifications & Profile)
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = toggle.getAttribute('data-target');
            const dropdown = document.getElementById(targetId);

            // Close others
            document.querySelectorAll('.dropdown.show').forEach(dd => {
                if (dd.id !== targetId) dd.classList.remove('show');
            });

            if (dropdown) dropdown.classList.toggle('show');
        });
    });

    // Close on click outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown.show').forEach(dd => {
            dd.classList.remove('show');
        });
    });

    // Prevent closing when clicking inside dropdown
    document.querySelectorAll('.dropdown').forEach(dd => {
        dd.addEventListener('click', (e) => e.stopPropagation());
    });
}

// Date & Time
function updateDateTime() {
    const dtElements = document.querySelectorAll('.current-datetime');
    if (!dtElements.length) return;

    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formatted = now.toLocaleDateString('en-US', options);

    dtElements.forEach(el => el.textContent = formatted);
}

// Chart.js Default Config & Initialization
function initCharts() {
    if (typeof Chart === 'undefined') return;

    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#1e293b' : '#e2e8f0';

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;
    Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#1e293b' : '#1e293b';
    Chart.defaults.plugins.tooltip.titleColor = '#fff';
    Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;

    // Trigger specific dashboard chart initializations if they exist
    if (typeof renderDashboardCharts === 'function') {
        renderDashboardCharts();
    }
}

function updateChartThemes(isDark) {
    if (typeof Chart === 'undefined') return;

    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#1e293b' : '#e2e8f0';

    Chart.instances.forEach(chart => {
        chart.options.color = textColor;
        if (chart.options.scales) {
            if (chart.options.scales.x) chart.options.scales.x.grid.color = gridColor;
            if (chart.options.scales.y) chart.options.scales.y.grid.color = gridColor;
        }
        chart.update();
    });
}

// Utility: Show Toast Notification
function showToast(message, type = 'info') {
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };
    const colors = {
        success: 'var(--success)',
        error: 'var(--danger)',
        warning: 'var(--warning)',
        info: 'var(--primary)'
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeft = `4px solid ${colors[type]}`;

    toast.innerHTML = `
        <span class="material-icons" style="color: ${colors[type]}">${icons[type]}</span>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Meeting Minutes Template Logic
function addMinuteRow() {
    const tbody = document.getElementById('minTableBody');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td style="border:1px solid var(--border-color); padding:4px;"><input type="text" class="min-input issue" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main);" placeholder="New issue..."></td>
        <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input disc" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
        <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input action" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
    `;
    tbody.appendChild(tr);
}

async function submitMinutes() {
    const payload = {
        date: document.getElementById('minDate')?.value || '',
        time: document.getElementById('minTime')?.value || '',
        venue: document.getElementById('minVenue')?.value || '',
        chairedBy: document.getElementById('minChair')?.value || '',
        preparedBy: document.getElementById('minPreparedBy')?.value || '',
        agenda: document.getElementById('minAgenda')?.value || '',
        items: []
    };

    const rows = document.querySelectorAll('#minTableBody tr');
    let currentCategory = '';

    rows.forEach(row => {
        if (row.cells.length === 1) {
            // It's a category header row
            currentCategory = row.cells[0].innerText;
        } else if (row.cells.length === 3) {
            // It's a data row
            const issueInput = row.querySelector('.issue');
            const discInput = row.querySelector('.disc');
            const actionInput = row.querySelector('.action');

            // Only add if there is some data in the row
            if ((issueInput && issueInput.value.trim()) ||
                (discInput && discInput.value.trim()) ||
                (actionInput && actionInput.value.trim()) || currentCategory) {

                payload.items.push({
                    category: currentCategory,
                    issue: issueInput ? issueInput.value.trim() : '',
                    discussion: discInput ? discInput.value.trim() : '',
                    action: actionInput ? actionInput.value.trim() : ''
                });
            }
        }
    });

    try {
        const response = await fetch('/api/minutes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast('Minutes saved successfully!', 'success');
            document.getElementById('minutesModal').classList.remove('show');
            // Optional: reset form
        } else {
            showToast('Failed to save minutes. Server error.', 'error');
        }
    } catch (err) {
        console.error('Error submitting minutes:', err);
        showToast('Connection error. Is the backend server running?', 'error');
    }
}

// Project/Task Management Logic
async function submitTask() {
    const id = document.getElementById('taskId')?.value || null;
    const title = document.getElementById('taskTitle')?.value || '';
    const description = document.getElementById('taskDesc')?.value || '';
    const assigneeRole = document.getElementById('taskRole')?.value || '';
    const status = document.getElementById('taskStatus')?.value || 'Not Started';
    const progress = parseInt(document.getElementById('taskProgress')?.value || '0', 10);

    if (!title) {
        showToast('Task Title is required.', 'warning');
        return;
    }

    const payload = {
        id: id,
        title: title,
        description: description,
        assigneeRole: assigneeRole,
        status: status,
        progress: progress,
        updatedAt: new Date().toISOString()
    };

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showToast('Task saved successfully!', 'success');
            document.getElementById('addProjectModal').classList.remove('show');
            // Reset form
            if (document.getElementById('taskId')) document.getElementById('taskId').value = '';
            if (document.getElementById('taskTitle')) document.getElementById('taskTitle').value = '';
            if (document.getElementById('taskDesc')) document.getElementById('taskDesc').value = '';
            if (document.getElementById('taskProgress')) document.getElementById('taskProgress').value = '0';
        } else {
            showToast('Failed to save task. Server error.', 'error');
        }
    } catch (err) {
        console.error('Error submitting task:', err);
        showToast('Connection error. Is the backend server running?', 'error');
    }
}

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) return;
        const tasks = await response.json();

        // 1. Populate Coordinator/Table view if present
        const tbody = document.getElementById('projectsTableBody');
        if (tbody) {
            tbody.innerHTML = '';
            tasks.forEach(task => {
                const tr = document.createElement('tr');
                let progColor = 'blue';
                if (task.progress >= 100) progColor = 'green';
                else if (task.progress < 40) progColor = 'orange';

                let badgeClass = 'info';
                if (task.status === 'Completed') badgeClass = 'success';
                else if (task.status === 'On Hold') badgeClass = 'warning';
                else if (task.status === 'Not Started') badgeClass = 'danger';

                tr.innerHTML = `
                    <td><strong>${task.title}</strong></td>
                    <td>${task.assigneeRole}</td>
                    <td>
                        <div style="display:flex; align-items:center; gap:8px">
                            <div class="prog-wrap" style="width:100px">
                                <div class="prog-fill ${progColor}" style="width: ${task.progress}%"></div>
                            </div>
                            <span style="font-size:0.7rem; font-weight:600">${task.progress}%</span>
                        </div>
                    </td>
                    <td style="font-size:.72rem; color:var(--text-muted)">${new Date(task.updatedAt).toLocaleDateString()}</td>
                    <td><span class="badge-s ${badgeClass}">${task.status}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // 2. Populate Director/List view if present
        const dirList = document.getElementById('directorProjectsList');
        if (dirList) {
            dirList.innerHTML = '';
            tasks.forEach((task, index) => {
                let progColor = 'blue';
                if (task.progress >= 100) progColor = 'green';
                else if (task.progress < 40) progColor = 'orange';

                const div = document.createElement('div');
                div.style.marginBottom = '1.5rem';
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <div class="avatar" style="width:28px; height:28px; font-size:0.7rem; background:var(--primary);">P${index + 1}</div>
                            <strong>${task.title}</strong>
                        </div>
                        <span style="font-size:0.8rem; font-weight:600; color:var(--text-main);">${task.progress}%</span>
                    </div>
                    <div class="prog-wrap" style="height:8px;">
                        <div class="prog-fill ${progColor}" style="width:${task.progress}%"></div>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Lead: ${task.assigneeRole} | Status: ${task.status}</p>
                `;
                dirList.appendChild(div);
            });
        }

    } catch (err) {
        console.error('Error loading tasks:', err);
    }
}

// Ensure loadTasks runs on relevant pages
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});
