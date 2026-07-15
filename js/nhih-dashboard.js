/**
 * NHIH MULTI-ROLE DASHBOARD JAVASCRIPT LOGIC
 * Manages client-side state, role switching, widgets rendering, and charts visualization.
 */

// Global state variables
let currentRole = 'director';
let isDarkMode = false;
let activeCharts = {}; // Stores Chart.js instances to destroy/update them on role change

// Notification Center Initial State
let notifications = [
    { id: 1, title: 'Critical Alert: System Uptime', desc: 'Main API Gateway reporting 94.2% latency spike', time: '10 mins ago', type: 'danger', unread: true },
    { id: 2, title: 'New Dataset Uploaded', desc: 'HMIS Monthly Summary for June 2026 uploaded by Data Analyst', time: '1 hour ago', type: 'success', unread: true },
    { id: 3, title: 'Data Quality Check Completed', desc: 'DHIS2 integration sync score reached 92.4%', time: '3 hours ago', type: 'info', unread: false },
    { id: 4, title: 'Workflow Pending Approval', desc: 'Coordinator requested budget reallocation review', time: '5 hours ago', type: 'warning', unread: true },
    { id: 5, title: 'System Backup Successful', desc: 'Full snapshot generated in AWS Cape Town region', time: '1 day ago', type: 'success', unread: false }
];

// Audit trail logs
const auditLogs = [
    { time: '15:04:12', user: 'Hon. Minister', action: 'Approved strategic grant request for Maternal Health Phase 3', ip: '10.12.33.102', status: 'Success' },
    { time: '14:28:45', user: 'Nadia Patel', action: 'Ran SQL query on disease mortality dataset', ip: '10.12.33.144', status: 'Success' },
    { time: '13:10:02', user: 'Devon Lee', action: 'Updated validation rule: Maternal vaccination boundary condition', ip: '10.12.33.89', status: 'Success' },
    { time: '12:00:15', user: 'Marcus Vance', action: 'Resolved Server Latency incident on node DHIS-3', ip: '10.12.32.11', status: 'Success' },
    { time: '10:45:30', user: 'Dr. Sarah Jenkins', action: 'Assigned task [Review Clinic Data] to department lead', ip: '10.12.35.42', status: 'Success' }
];

// Role Configurations Data
const roleConfigs = {
    director: {
        title: 'Director Dashboard',
        welcome: 'Welcome back, Hon. Minister',
        user: { name: 'Hon. Minister', dept: 'Ministry of Health', avatar: 'HM' },
        menu: [
            { text: 'Executive Dashboard', icon: 'dashboard', active: true },
            { text: 'National KPIs', icon: 'bar_chart' },
            { text: 'Approve Projects', icon: 'assignment_turned_in', badge: 3 },
            { text: 'Approve Data Requests', icon: 'verified_user', badge: 2 },
            { text: 'Review Reports', icon: 'rate_review' },
            { text: 'Strategic Analytics', icon: 'analytics' },
            { text: 'Health Indicators', icon: 'spa' },
            { text: 'View National Map', icon: 'map' },
            { text: 'Risk Dashboard', icon: 'warning' },
            { text: 'Audit Logs', icon: 'history' },
            { text: 'User Overview', icon: 'people_alt' },
            { text: 'Notifications', icon: 'notifications', badge: 4 },
            { text: 'Profile', icon: 'person' },
            { text: 'Logout', icon: 'logout' }
        ],
        kpis: [
            { title: 'Total Datasets', val: '156', change: '+18%', isUp: true, icon: 'folder', color: 'blue' },
            { title: 'Active Data Sources', val: '28', change: '+12%', isUp: true, icon: 'cloud', color: 'green' },
            { title: 'Dashboards Built', val: '42', change: '+9%', isUp: true, icon: 'bar_chart', color: 'purple' },
            { title: 'Data Quality Score', val: '92%', change: '+7%', isUp: true, icon: 'check_circle', color: 'orange' },
            { title: 'Active Users', val: '186', change: '+15%', isUp: true, icon: 'people', color: 'blue' },
            { title: 'Alerts Pending', val: '7', change: '3 Critical', isUp: false, icon: 'warning', color: 'red' }
        ],
        quickActions: [
            { text: 'Approve Pending Projects', icon: 'check_circle', action: 'approveProjects' },
            { text: 'Export Health Indicators PDF', icon: 'picture_as_pdf', action: 'exportPDF' },
            { text: 'View Audit Logs', icon: 'receipt_long', action: 'viewAuditLogs' },
            { text: 'Manage User Permissions', icon: 'admin_panel_settings', action: 'managePermissions' }
        ]
    },
    coordinator: {
        title: 'Coordinator Dashboard',
        welcome: 'Welcome back, Coordinator',
        user: { name: 'Dr. Sarah Jenkins', dept: 'Strategic Operations', avatar: 'SJ' },
        menu: [
            { text: 'Dashboard', icon: 'dashboard', active: true },
            { text: 'Team Management', icon: 'groups' },
            { text: 'Assign Tasks', icon: 'add_task' },
            { text: 'Approve Workflows', icon: 'alt_route', badge: 5 },
            { text: 'Project Tracking', icon: 'view_list' },
            { text: 'Meeting Scheduler', icon: 'schedule' },
            { text: 'Requests', icon: 'question_answer', badge: 2 },
            { text: 'Notifications', icon: 'notifications' },
            { text: 'Reports', icon: 'summarize' },
            { text: 'Calendar', icon: 'calendar_month' },
            { text: 'User Management', icon: 'manage_accounts' },
            { text: 'Logout', icon: 'logout' }
        ],
        kpis: [
            { title: 'Team Performance', val: '88.5%', change: '+4.2%', isUp: true, icon: 'star', color: 'blue' },
            { title: 'Pending Tasks', val: '12', change: '4 Overdue', isUp: false, icon: 'pending_actions', color: 'orange' },
            { title: 'Completed Activities', val: '48', change: '92% Rate', isUp: true, icon: 'done_all', color: 'green' },
            { title: 'Active Projects', val: '9', change: 'On Track', isUp: true, icon: 'assignment', color: 'purple' },
            { title: 'Workflow Approvals', val: '5', change: '2 Pending', isUp: false, icon: 'approval', color: 'orange' },
            { title: 'Dept. Budget Used', val: '64%', change: 'Within limit', isUp: true, icon: 'payments', color: 'blue' }
        ],
        quickActions: [
            { text: 'Assign New Task', icon: 'playlist_add', action: 'assignTask' },
            { text: 'Schedule Sync Meeting', icon: 'video_call', action: 'scheduleMeeting' },
            { text: 'View Workflow Status', icon: 'alt_route', action: 'viewWorkflow' },
            { text: 'Generate Department Report', icon: 'analytics', action: 'genReport' }
        ]
    },
    operations: {
        title: 'Operations Manager Dashboard',
        welcome: 'Welcome back, Operations Manager',
        user: { name: 'Marcus Vance', dept: 'Operations & Service', avatar: 'MV' },
        menu: [
            { text: 'Operations Dashboard', icon: 'dashboard', active: true },
            { text: 'Workflow Monitor', icon: 'monitor_heart' },
            { text: 'Incident Management', icon: 'error_outline', badge: 2 },
            { text: 'Task Assignment', icon: 'assignment_ind' },
            { text: 'System Monitoring', icon: 'dns' },
            { text: 'Integration Status', icon: 'api' },
            { text: 'Data Flow Monitor', icon: 'insights' },
            { text: 'Service Desk', icon: 'support_agent' },
            { text: 'Issue Tracker', icon: 'bug_report', badge: 4 },
            { text: 'Notifications', icon: 'notifications' },
            { text: 'Daily Reports', icon: 'event_note' },
            { text: 'User Activity', icon: 'login' },
            { text: 'Logout', icon: 'logout' }
        ],
        kpis: [
            { title: 'System Uptime', val: '99.85%', change: 'Nominal', isUp: true, icon: 'dns', color: 'green' },
            { title: 'API Status', val: '100% OK', change: '0 Errors', isUp: true, icon: 'api', color: 'blue' },
            { title: 'ETL Pipeline State', val: 'Healthy', change: 'Synced 10m ago', isUp: true, icon: 'sync', color: 'purple' },
            { title: 'Server Memory Free', val: '62%', change: 'Optimal', isUp: true, icon: 'memory', color: 'green' },
            { title: "Today's Incidents", val: '2', change: '1 Active', isUp: false, icon: 'warning', color: 'orange' },
            { title: 'Open Tickets', val: '8', change: '3 High Priority', isUp: false, icon: 'confirmation_number', color: 'red' }
        ],
        quickActions: [
            { text: 'Log System Incident', icon: 'add_alert', action: 'logIncident' },
            { text: 'Restart ETL Service', icon: 'restart_alt', action: 'restartETL' },
            { text: 'Verify Node Health', icon: 'health_and_safety', action: 'verifyNodes' },
            { text: 'Download Server Logs', icon: 'download', action: 'downloadLogs' }
        ]
    },
    program: {
        title: 'Program Lead Dashboard',
        welcome: 'Welcome back, Program Lead',
        user: { name: 'Elena Rostova', dept: 'National Health Programs', avatar: 'ER' },
        menu: [
            { text: 'Dashboard', icon: 'dashboard', active: true },
            { text: 'My Programmes', icon: 'category' },
            { text: 'Programme KPIs', icon: 'insights' },
            { text: 'Submit Data Request', icon: 'drive_file_move_outline' },
            { text: 'Indicator Management', icon: 'tune' },
            { text: 'Review Dashboards', icon: 'preview' },
            { text: 'Reports', icon: 'assessment' },
            { text: 'Programme Calendar', icon: 'calendar_today' },
            { text: 'Resources', icon: 'folder_zip' },
            { text: 'Feedback', icon: 'rate_review' },
            { text: 'Notifications', icon: 'notifications', badge: 1 },
            { text: 'Logout', icon: 'logout' }
        ],
        kpis: [
            { title: 'Active Programmes', val: '8', change: '1 Launching', isUp: true, icon: 'health_and_safety', color: 'blue' },
            { title: 'National Indicators', val: '45', change: 'Synced', isUp: true, icon: 'query_stats', color: 'purple' },
            { title: 'Target Achievement', val: '91.2%', change: '+5.4%', isUp: true, icon: 'track_changes', color: 'green' },
            { title: 'Maternal Care KPI', val: '87%', change: 'Target 90%', isUp: false, icon: 'child_care', color: 'orange' },
            { title: 'Programme Budget', val: '$3.2M', change: '48% Consumed', isUp: true, icon: 'account_balance_wallet', color: 'blue' },
            { title: 'Feedback Influx', val: '14', change: '6 Actionable', isUp: true, icon: 'feedback', color: 'purple' }
        ],
        quickActions: [
            { text: 'Submit Data Request', icon: 'outgoing_mail', action: 'submitRequest' },
            { text: 'Add Programme Indicator', icon: 'add_chart', action: 'addIndicator' },
            { text: 'Upload Programme File', icon: 'upload_file', action: 'uploadFile' },
            { text: 'Email Stakeholders', icon: 'email', action: 'emailStakeholders' }
        ]
    },
    engineer: {
        title: 'Data Engineer Dashboard',
        welcome: 'Welcome back, Data Engineer',
        user: { name: 'Devon Lee', dept: 'Data Infrastructure', avatar: 'DL' },
        menu: [
            { text: 'Dashboard', icon: 'dashboard', active: true },
            { text: 'Data Sources', icon: 'database' },
            { text: 'API Integrations', icon: 'webhook' },
            { text: 'ETL Pipelines', icon: 'account_tree' },
            { text: 'Data Warehouse', icon: 'storage' },
            { text: 'Database Manager', icon: 'settings_suggest' },
            { text: 'Validation Rules', icon: 'fact_check' },
            { text: 'Error Logs', icon: 'bug_report', badge: 3 },
            { text: 'Pipeline Monitor', icon: 'query_stats' },
            { text: 'Upload Dataset', icon: 'publish' },
            { text: 'System Logs', icon: 'description' },
            { text: 'Backup Manager', icon: 'settings_backup_restore' },
            { text: 'Logout', icon: 'logout' }
        ],
        kpis: [
            { title: 'Connected Systems', val: '18', change: 'All online', isUp: true, icon: 'lan', color: 'green' },
            { title: 'API Integration Health', val: '99.9%', change: 'Nominal', isUp: true, icon: 'api', color: 'blue' },
            { title: 'Pipeline Success', val: '99.88%', change: '+0.1%', isUp: true, icon: 'task_alt', color: 'green' },
            { title: 'Warehouse Capacity', val: '4.2TB', change: '24% used', isUp: true, icon: 'storage', color: 'purple' },
            { title: 'Failed Jobs (24h)', val: '0', change: 'Excellent', isUp: true, icon: 'error', color: 'green' },
            { title: 'Processing Queue', val: '12 ms', change: 'Avg Latency', isUp: true, icon: 'hourglass_empty', color: 'blue' }
        ],
        quickActions: [
            { text: 'Upload New Dataset', icon: 'upload_file', action: 'uploadDataset' },
            { text: 'Trigger ETL Job', icon: 'play_circle', action: 'triggerETL' },
            { text: 'Manage Database Rules', icon: 'rule', action: 'manageRules' },
            { text: 'Backup Database Now', icon: 'backup', action: 'backupDB' }
        ]
    },
    analyst: {
        title: 'Data Analyst Dashboard',
        welcome: 'Welcome back, Data Analyst',
        user: { name: 'Nadia Patel', dept: 'Analytics & Insights', avatar: 'NP' },
        menu: [
            { text: 'Dashboard', icon: 'dashboard', active: true },
            { text: 'Analytics', icon: 'analytics' },
            { text: 'Reports', icon: 'assignment' },
            { text: 'Dashboards', icon: 'dashboard_customize' },
            { text: 'SQL Query', icon: 'code' },
            { text: 'Data Explorer', icon: 'explore' },
            { text: 'Visualization Builder', icon: 'legend_toggle' },
            { text: 'Export Reports', icon: 'download' },
            { text: 'Forecasting', icon: 'online_prediction' },
            { text: 'Data Quality', icon: 'verified' },
            { text: 'Indicator Trends', icon: 'trending_up' },
            { text: 'Notifications', icon: 'notifications' },
            { text: 'Logout', icon: 'logout' }
        ],
        kpis: [
            { title: 'Trend Analysis', val: '12 Reports', change: 'Active', isUp: true, icon: 'insights', color: 'blue' },
            { title: 'Disease Outbreaks', val: '3 Monitored', change: 'Normal limits', isUp: true, icon: 'coronavirus', color: 'green' },
            { title: 'Maternal Data Sync', val: '99.4%', change: 'Validated', isUp: true, icon: 'check_circle', color: 'green' },
            { title: 'Quality Score', val: '94.2%', change: '+1.8%', isUp: true, icon: 'high_quality', color: 'purple' },
            { title: 'Active Queries', val: '4 Running', change: '0.4s response', isUp: true, icon: 'terminal', color: 'blue' },
            { title: 'Export Queue', val: '3 Reports', change: 'Generating...', isUp: false, icon: 'hourglass_top', color: 'orange' }
        ],
        quickActions: [
            { text: 'Open SQL Editor', icon: 'terminal', action: 'openSQLEditor' },
            { text: 'Build Custom Chart', icon: 'add_chart', action: 'buildChart' },
            { text: 'Export Weekly Insight', icon: 'file_download', action: 'exportInsight' },
            { text: 'Run Quality Validation', icon: 'fact_check', action: 'runValidation' }
        ]
    }
};

// Mock data tables for widgets
const tableData = {
    director: {
        headers: ['KPI Name', 'Current Value', 'Target', 'Progress', 'Status'],
        rows: [
            ['Maternal Mortality Rate (per 100k)', '420', '300', '71.4%', 'warning'],
            ['Under-5 Mortality Rate (per 1k)', '68', '50', '73.5%', 'warning'],
            ['Fully Immunized Children (%)', '88%', '95%', '92.6%', 'success'],
            ['Institutional Deliveries (%)', '74%', '85%', '87.0%', 'info'],
            ['Antenatal Care 4+ Visits (%)', '62%', '80%', '77.5%', 'danger']
        ]
    },
    coordinator: {
        headers: ['Task Description', 'Assigned To', 'Deadline', 'Progress', 'Status'],
        rows: [
            ['Verify DHIS2 monthly integration data', 'Nadia Patel', '2026-07-20', '80%', 'info'],
            ['Review maternal care indicators validation', 'Elena Rostova', '2026-07-18', '100%', 'success'],
            ['Upgrade PostgreSQL server instance', 'Devon Lee', '2026-07-22', '10%', 'danger'],
            ['Prepare Ministry cabinet presentation', 'Hon. Minister', '2026-07-17', '50%', 'warning'],
            ['Investigate health node latency issues', 'Marcus Vance', '2026-07-19', '90%', 'info']
        ]
    },
    operations: {
        headers: ['Incident ID', 'System / Service', 'Severity', 'Triggered Time', 'Status'],
        rows: [
            ['INC-9821', 'API Gateway Router', 'Critical', 'Today, 14:52', 'danger'],
            ['INC-9819', 'Analytics Cache Engine', 'Medium', 'Today, 11:20', 'info'],
            ['INC-9799', 'DHIS2 Integration Pipeline', 'High', 'Yesterday, 17:05', 'warning'],
            ['INC-9762', 'Reports PDF Generator', 'Low', 'Yesterday, 09:30', 'success'],
            ['INC-9712', 'Active Directory Auth Node', 'Critical', '2 days ago', 'success']
        ]
    },
    program: {
        headers: ['Programme Name', 'Indicator Code', 'Q3 Target', 'Q3 Actual', 'Status'],
        rows: [
            ['National Malaria Initiative', 'NMI-4', '95,000 nets', '89,420 nets', 'info'],
            ['Maternal Health Enhancement', 'MHE-2', '80.0% coverage', '81.4% coverage', 'success'],
            ['Childhood Tuberculosis Protocol', 'CTB-7', '1,200 cases', '750 cases', 'success'],
            ['HIV/AIDS Anti-Retroviral Support', 'HAS-1', '98.0% compliance', '91.2% compliance', 'warning'],
            ['Water & Hygiene Outreach (WASH)', 'WSH-9', '85% facilities', '60% facilities', 'danger']
        ]
    },
    engineer: {
        headers: ['Database / Source', 'Type', 'Record Count', 'Last Sync', 'Health'],
        rows: [
            ['National Health Registry', 'PostgreSQL DB', '14.2M records', '10 mins ago', 'success'],
            ['DHIS2 Integration Hub', 'REST API Client', '6.8M records', '22 mins ago', 'success'],
            ['Maternal Clinic Offline Sync', 'SQLite Sync', '840k records', '1 hour ago', 'warning'],
            ['District Logistics & Supply', 'MS SQL Server', '2.1M records', '3 hours ago', 'success'],
            ['Cold Chain IoT Sensor Network', 'MongoDB Cluster', '58.4M records', '2 mins ago', 'danger']
        ]
    },
    analyst: {
        headers: ['Disease Monitored', 'Incidence (Weekly)', 'Growth Rate', 'Geo Density', 'Alert Level'],
        rows: [
            ['Malaria (Under-5)', '1,842 cases', '+4.2% week-on-week', 'High (Northern District)', 'warning'],
            ['Cholera', '12 cases', '0.0% (Stable)', 'Low (Coastal Clinic)', 'success'],
            ['Measles Outbreak', '34 cases', '+12.4% week-on-week', 'Critical (Urban Center)', 'danger'],
            ['Lassa Fever', '2 cases', 'Stable', 'Low (Eastern Border)', 'info'],
            ['Influenza A', '412 cases', '-3.1% (Decreasing)', 'Moderate (National)', 'success']
        ]
    }
};

// Initial setup on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check local storage for dark theme preference
    if (localStorage.getItem('dark-theme') === 'true') {
        document.body.classList.add('dark-theme');
        isDarkMode = true;
    }
    
    // Setup events
    setupEventHandlers();
    
    // Render initial role (Director)
    switchUserRole('director');
    
    // Render initial notification feed
    renderNotifications();
    
    // Render initial audit logs
    renderAuditLogs();
});

// Setup UI Interaction Event Listeners
function setupEventHandlers() {
    // Mobile menu sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Theme toggle
    const themeToggles = document.querySelectorAll('.theme-toggle');
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
    
    // Notifications Drawer Toggle
    const notifBtn = document.getElementById('notifIconBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
            // Close other dropdowns
            document.getElementById('userProfileDropdown')?.classList.remove('active');
        });
    }
    
    // Profile Dropdown Toggle
    const profileBtn = document.getElementById('userProfileBtn');
    const profileDropdown = document.getElementById('userProfileDropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
            // Close other dropdowns
            document.getElementById('notifDropdown')?.classList.remove('active');
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.getElementById('notifDropdown')?.classList.remove('active');
        document.getElementById('userProfileDropdown')?.classList.remove('active');
    });
    
    // SQL query simulation
    document.getElementById('btnRunQuery')?.addEventListener('click', simulateSQLQuery);
    
    // Visualization builder toggle
    document.getElementById('chartSelectType')?.addEventListener('change', (e) => {
        updateDataAnalystCustomChart(e.target.value);
    });
    
    // Global search filters active table
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterTables(e.target.value);
        });
        
        // Ctrl + K listener
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }
}

// Switching Roles Functionality
function switchUserRole(roleKey) {
    if (!roleConfigs[roleKey]) return;
    currentRole = roleKey;
    
    // Update role select panel highlight
    document.querySelectorAll('.role-switch-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-role') === roleKey) {
            item.classList.add('active');
        }
    });
    
    const config = roleConfigs[roleKey];
    
    // Update Header and profile info
    document.getElementById('welcomeMessage').innerText = config.welcome;
    document.getElementById('headerUserAvatar').innerText = config.user.avatar;
    document.getElementById('headerUserName').innerText = config.user.name;
    document.getElementById('headerUserRole').innerText = config.user.dept;
    
    // Update Dropdown header
    document.getElementById('dropUserTitle').innerText = config.user.name;
    document.getElementById('dropUserSub').innerText = config.user.dept;
    
    // Render dynamic sidebar items matching USER_REQUEST
    renderSidebarNav(config.menu);
    
    // Render horizontal core KPI cards
    renderKPICards(config.kpis);
    
    // Render Quick Actions
    renderQuickActions(config.quickActions);
    
    // Render Specific Dashboard views & charts
    renderDashboardView(roleKey);
    
    // Clear sidebar mobile state
    document.getElementById('sidebar')?.classList.remove('active');
    document.getElementById('sidebarOverlay')?.classList.remove('active');
}

// Sidebar links render
function renderSidebarNav(menuItems) {
    const navContainer = document.getElementById('sidebarNavList');
    if (!navContainer) return;
    
    navContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = `nav-item-modern ${item.active ? 'active' : ''}`;
        
        // Add click behavior mock
        a.addEventListener('click', (e) => {
            e.preventDefault();
            navContainer.querySelectorAll('.nav-item-modern').forEach(link => link.classList.remove('active'));
            a.classList.add('active');
            
            if (item.text === 'Logout') {
                alert('Logging out of active session...');
                window.location.href = '../index.html';
            } else {
                showToast(`Navigated to: ${item.text}`);
            }
        });
        
        let badgeHtml = '';
        if (item.badge) {
            badgeHtml = `<span class="badge" style="position:static; border:none; min-width:18px; height:18px; margin-left:auto; display:flex;">${item.badge}</span>`;
        }
        
        a.innerHTML = `
            <span class="nav-icon-box material-icons">${item.icon}</span>
            <span>${item.text}</span>
            ${badgeHtml}
        `;
        navContainer.appendChild(a);
    });
}

// Core KPI Cards render
function renderKPICards(kpis) {
    const container = document.getElementById('kpisGridContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    kpis.forEach(kpi => {
        const trendIcon = kpi.isUp ? 'arrow_upward' : 'arrow_downward';
        const trendClass = kpi.isUp ? 'up' : 'down';
        
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.innerHTML = `
            <div class="metric-card-indicator ${kpi.color}"></div>
            <div class="metric-icon-box ${kpi.color}">
                <span class="material-icons">${kpi.icon}</span>
            </div>
            <div class="metric-details">
                <span class="metric-title">${kpi.title}</span>
                <span class="metric-value">${kpi.val}</span>
                <div class="metric-trend ${trendClass}">
                    <span class="material-icons" style="font-size:0.85rem">${trendIcon}</span>
                    <span>${kpi.change}</span>
                    <span class="metric-sublabel">vs last month</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Quick Actions render
function renderQuickActions(actions) {
    const container = document.getElementById('quickActionsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = 'action-btn-item';
        btn.innerHTML = `
            <span class="material-icons">${action.icon}</span>
            <span>${action.text}</span>
        `;
        btn.addEventListener('click', () => triggerAction(action.action));
        container.appendChild(btn);
    });
}

// Role Dashboard View Render
function renderDashboardView(roleKey) {
    // Hide all role views
    document.querySelectorAll('.role-dashboard-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show active role view
    const activeView = document.getElementById(`view_${roleKey}`);
    if (activeView) {
        activeView.classList.add('active');
    }
    
    // Render dynamic data table for this role
    renderRoleTable(roleKey);
    
    // Initialize specific Charts for the active role
    initRoleCharts(roleKey);
}

// Renders the interactive tabular component
function renderRoleTable(roleKey) {
    const config = tableData[roleKey];
    const tableContainer = document.getElementById(`table_container_${roleKey}`);
    if (!config || !tableContainer) return;
    
    let headersHtml = config.headers.map(h => `<th>${h}</th>`).join('');
    
    let rowsHtml = config.rows.map(row => {
        let cols = row.map((col, idx) => {
            if (idx === row.length - 1) {
                // Status column badge rendering
                let badgeClass = 'info';
                if (col === 'success' || col.includes('OK') || col.includes('Synced')) badgeClass = 'success';
                if (col === 'warning' || col.includes('Net') || col.includes('Active')) badgeClass = 'warning';
                if (col === 'danger' || col.includes('Critical')) badgeClass = 'danger';
                return `<td><span class="status-badge ${badgeClass}">${col}</span></td>`;
            }
            return `<td>${col}</td>`;
        }).join('');
        return `<tr>${cols}</tr>`;
    }).join('');
    
    tableContainer.innerHTML = `
        <div class="table-responsive">
            <table class="modern-table">
                <thead>
                    <tr>${headersHtml}</tr>
                </thead>
                <tbody class="searchable-tbody">
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
}

// Toggle Light / Dark theme styling
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-theme', isDarkMode);
    localStorage.setItem('dark-theme', isDarkMode);
    
    // Update theme icons
    const themeIcons = document.querySelectorAll('.theme-toggle span');
    themeIcons.forEach(icon => {
        icon.innerText = isDarkMode ? 'light_mode' : 'dark_mode';
    });
    
    showToast(isDarkMode ? 'Dark Mode Activated' : 'Light Mode Activated');
    
    // Reinitialize active charts to redraw labels and grids with correct colors
    initRoleCharts(currentRole);
}

// Chart.js Theme helpers
function getChartColors() {
    if (isDarkMode) {
        return {
            text: '#94a3b8',
            grid: '#223047',
            blue: '#0B5ED7',
            green: '#10b981',
            yellow: '#f59e0b',
            cyan: '#06b6d4',
            red: '#ef4444'
        };
    } else {
        return {
            text: '#64748b',
            grid: '#e2e8f0',
            blue: '#0B5ED7',
            green: '#10b981',
            yellow: '#f59e0b',
            cyan: '#06b6d4',
            red: '#ef4444'
        };
    }
}

// Render dynamic charts via Chart.js
function initRoleCharts(roleKey) {
    // Clear and destroy existing charts to avoid memory leaks or overlay issues
    Object.keys(activeCharts).forEach(key => {
        activeCharts[key].destroy();
        delete activeCharts[key];
    });
    
    const colors = getChartColors();
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: colors.text, font: { family: 'Inter', size: 11 } }
            }
        },
        scales: {
            x: {
                grid: { color: colors.grid },
                ticks: { color: colors.text, font: { family: 'Inter', size: 10 } }
            },
            y: {
                grid: { color: colors.grid },
                ticks: { color: colors.text, font: { family: 'Inter', size: 10 } }
            }
        }
    };
    
    if (roleKey === 'director') {
        // 1. System Performance (Line Chart)
        const ctxPerf = document.getElementById('chart_director_perf')?.getContext('2d');
        if (ctxPerf) {
            activeCharts.director_perf = new Chart(ctxPerf, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        { label: 'System Uptime (%)', data: [99.8, 99.7, 99.9, 99.85, 99.9, 99.95], borderColor: colors.blue, backgroundColor: 'rgba(11, 94, 215, 0.05)', fill: true, tension: 0.3 },
                        { label: 'Data Quality Sync (%)', data: [88, 89, 91, 90.5, 92, 94], borderColor: colors.green, backgroundColor: 'transparent', tension: 0.3 }
                    ]
                },
                options: chartOptions
            });
        }
        
        // 2. Maternal Health Indicators (Double Line/Area)
        const ctxMaternal = document.getElementById('chart_director_maternal')?.getContext('2d');
        if (ctxMaternal) {
            activeCharts.director_maternal = new Chart(ctxMaternal, {
                type: 'line',
                data: {
                    labels: ['2021', '2022', '2023', '2024', '2025', '2026 (YTD)'],
                    datasets: [
                        { label: 'Maternal Mortality (per 100k)', data: [580, 520, 480, 440, 420, 395], borderColor: colors.red, backgroundColor: 'rgba(239, 68, 68, 0.05)', fill: true, tension: 0.2 },
                        { label: 'Institutional Deliveries (%)', data: [58, 63, 67, 71, 74, 78], borderColor: colors.cyan, backgroundColor: 'transparent', tension: 0.2 }
                    ]
                },
                options: chartOptions
            });
        }
    } else if (roleKey === 'coordinator') {
        // Team Performance (Bar Chart)
        const ctxTeam = document.getElementById('chart_coordinator_team')?.getContext('2d');
        if (ctxTeam) {
            activeCharts.coordinator_team = new Chart(ctxTeam, {
                type: 'bar',
                data: {
                    labels: ['Admin', 'Engineering', 'Analytics', 'Programs', 'Operations'],
                    datasets: [
                        { label: 'Completed Tasks', data: [15, 24, 30, 18, 22], backgroundColor: colors.blue },
                        { label: 'Pending Workflows', data: [3, 5, 2, 4, 3], backgroundColor: colors.yellow }
                    ]
                },
                options: chartOptions
            });
        }
        
        // Dept Performance (Pie Chart)
        const ctxDept = document.getElementById('chart_coordinator_dept')?.getContext('2d');
        if (ctxDept) {
            activeCharts.coordinator_dept = new Chart(ctxDept, {
                type: 'doughnut',
                data: {
                    labels: ['Primary Health Care', 'ICT Systems', 'Strategic Planning', 'Support Center'],
                    datasets: [{
                        data: [40, 25, 20, 15],
                        backgroundColor: [colors.blue, colors.green, colors.yellow, colors.cyan]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: colors.text } }
                    }
                }
            });
        }
    } else if (roleKey === 'operations') {
        // Server Latency
        const ctxServer = document.getElementById('chart_operations_server')?.getContext('2d');
        if (ctxServer) {
            activeCharts.operations_server = new Chart(ctxServer, {
                type: 'line',
                data: {
                    labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
                    datasets: [
                        { label: 'Database Latency (ms)', data: [4, 6, 5, 18, 12, 5], borderColor: colors.red, backgroundColor: 'transparent', tension: 0.1 },
                        { label: 'API Gateway Latency (ms)', data: [12, 14, 15, 28, 20, 14], borderColor: colors.blue, backgroundColor: 'transparent', tension: 0.1 }
                    ]
                },
                options: chartOptions
            });
        }
    } else if (roleKey === 'program') {
        // Programme KPIs (Radar Chart)
        const ctxProg = document.getElementById('chart_program_kpis')?.getContext('2d');
        if (ctxProg) {
            activeCharts.program_kpis = new Chart(ctxProg, {
                type: 'radar',
                data: {
                    labels: ['Budget Spent', 'Immunization Coverage', 'Cold Chain Compliance', 'Staff Availability', 'Outbreak Preparedness'],
                    datasets: [
                        { label: 'Malaria Campaign', data: [75, 88, 92, 85, 90], borderColor: colors.blue, backgroundColor: 'rgba(11, 94, 215, 0.1)' },
                        { label: 'Maternal Care Phase 2', data: [90, 74, 80, 95, 78], borderColor: colors.green, backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: colors.text } }
                    },
                    scales: {
                        r: {
                            grid: { color: colors.grid },
                            angleLines: { color: colors.grid },
                            pointLabels: { color: colors.text, font: { family: 'Inter', size: 10 } }
                        }
                    }
                }
            });
        }
    } else if (roleKey === 'engineer') {
        // Warehouse storage (Doughnut)
        const ctxStorage = document.getElementById('chart_engineer_storage')?.getContext('2d');
        if (ctxStorage) {
            activeCharts.engineer_storage = new Chart(ctxStorage, {
                type: 'doughnut',
                data: {
                    labels: ['Used capacity (Postgres)', 'Logs storage (MongoDB)', 'Analytical warehouse', 'Free Disk Space'],
                    datasets: [{
                        data: [25, 15, 40, 20],
                        backgroundColor: [colors.blue, colors.yellow, colors.green, colors.grid]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: colors.text } }
                    }
                }
            });
        }
    } else if (roleKey === 'analyst') {
        // Disease trend analytics
        const ctxTrends = document.getElementById('chart_analyst_trends')?.getContext('2d');
        if (ctxTrends) {
            activeCharts.analyst_trends = new Chart(ctxTrends, {
                type: 'line',
                data: {
                    labels: ['Week 20', 'Week 21', 'Week 22', 'Week 23', 'Week 24', 'Week 25'],
                    datasets: [
                        { label: 'Malaria Incidence', data: [1420, 1510, 1605, 1540, 1712, 1842], borderColor: colors.blue, backgroundColor: 'transparent', tension: 0.2 },
                        { label: 'Measles Outbreaks', data: [8, 12, 15, 24, 28, 34], borderColor: colors.red, backgroundColor: 'transparent', tension: 0.2 }
                    ]
                },
                options: chartOptions
            });
        }
        
        // Custom interactive chart
        updateDataAnalystCustomChart('bar');
    }
}

// Interactive custom chart builder for Data Analyst
function updateDataAnalystCustomChart(type = 'bar') {
    if (currentRole !== 'analyst') return;
    
    if (activeCharts.analyst_custom) {
        activeCharts.analyst_custom.destroy();
    }
    
    const colors = getChartColors();
    const ctxCustom = document.getElementById('chart_analyst_custom')?.getContext('2d');
    if (!ctxCustom) return;
    
    activeCharts.analyst_custom = new Chart(ctxCustom, {
        type: type,
        data: {
            labels: ['Clinic A', 'Clinic B', 'Clinic C', 'Clinic D', 'Clinic E'],
            datasets: [{
                label: 'Data Quality Compliance Score (%)',
                data: [96.4, 91.2, 88.5, 94.8, 92.1],
                backgroundColor: type === 'line' ? 'transparent' : colors.green,
                borderColor: colors.green,
                fill: type === 'line',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: colors.text } }
            },
            scales: {
                x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
                y: { grid: { color: colors.grid }, ticks: { color: colors.text }, min: 50, max: 100 }
            }
        }
    });
}

// Notification Drawer items rendering
function renderNotifications() {
    const list = document.getElementById('notifList');
    if (!list) return;
    
    list.innerHTML = '';
    
    let unreadCount = 0;
    
    notifications.forEach(n => {
        if (n.unread) unreadCount++;
        
        let icon = 'notifications';
        let colorClass = 'blue';
        if (n.type === 'danger') { icon = 'warning'; colorClass = 'red'; }
        if (n.type === 'success') { icon = 'check_circle'; colorClass = 'green'; }
        if (n.type === 'warning') { icon = 'notification_important'; colorClass = 'orange'; }
        
        const item = document.createElement('div');
        item.className = `notif-item ${n.unread ? 'unread' : ''}`;
        item.innerHTML = `
            <div class="notif-icon-box ${colorClass}" style="background-color: var(--${n.type}-light); color: var(--${n.type})">
                <span class="material-icons" style="font-size:1.15rem">${icon}</span>
            </div>
            <div class="notif-content">
                <span class="notif-title">${n.title}</span>
                <span class="notif-desc">${n.desc}</span>
                <span class="notif-time">${n.time}</span>
            </div>
        `;
        
        // Clicking notification marks it as read
        item.addEventListener('click', () => {
            n.unread = false;
            renderNotifications();
            showToast(`Marked as read: ${n.title}`);
        });
        
        list.appendChild(item);
    });
    
    // Update badge counter
    const badge = document.getElementById('notifBadgeCount');
    if (badge) {
        if (unreadCount > 0) {
            badge.innerText = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Mark all read button function
function markAllNotificationsRead() {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
    showToast('All notifications marked as read.');
}

// Audit trail table renderer (global)
function renderAuditLogs() {
    const container = document.getElementById('auditLogsTableContainer');
    if (!container) return;
    
    let rowsHtml = auditLogs.map(log => {
        return `
            <tr>
                <td>${log.time}</td>
                <td><strong>${log.user}</strong></td>
                <td>${log.action}</td>
                <td><code>${log.ip}</code></td>
                <td><span class="status-badge success">${log.status}</span></td>
            </tr>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="table-responsive">
            <table class="modern-table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Activity Action</th>
                        <th>IP Address</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
}

// Live Search Filter for Active Dashboard Table
function filterTables(query) {
    const searchVal = query.toLowerCase().trim();
    // Filter the rows in the currently active table body
    const activeTableBody = document.querySelector(`.role-dashboard-view.active .searchable-tbody`);
    if (!activeTableBody) return;
    
    const rows = activeTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchVal) ? '' : 'none';
    });
}

// SQL Editor query simulator
function simulateSQLQuery() {
    const query = document.getElementById('txtSqlQuery').value.trim();
    if (!query) {
        alert('Please enter a SQL query first.');
        return;
    }
    
    const consoleLog = document.getElementById('sqlConsoleResult');
    if (!consoleLog) return;
    
    consoleLog.innerHTML = '<span style="color:var(--text-muted)">Executing query on National Health Warehouse...</span>';
    
    setTimeout(() => {
        if (query.toLowerCase().includes('select') && query.toLowerCase().includes('maternal')) {
            consoleLog.innerHTML = `
                <div style="color:var(--success); font-weight:600; margin-bottom:0.5rem;">Query executed successfully in 14ms (3 rows returned)</div>
                <table class="modern-table" style="font-size:0.75rem">
                    <thead>
                        <tr><th>facility_id</th><th>facility_name</th><th>deliveries_count</th><th>compliance_rate</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>FAC-041</td><td>Bo District General Hospital</td><td>1,240</td><td>94.2%</td></tr>
                        <tr><td>FAC-042</td><td>Kenema Maternity Clinic</td><td>842</td><td>88.6%</td></tr>
                        <tr><td>FAC-043</td><td>Freetown Health Center</td><td>3,124</td><td>96.1%</td></tr>
                    </tbody>
                </table>
            `;
            // Add audit log
            addAuditLog('Executed custom SQL query on maternal health dataset');
        } else if (query.toLowerCase().includes('select') && query.toLowerCase().includes('disease')) {
            consoleLog.innerHTML = `
                <div style="color:var(--success); font-weight:600; margin-bottom:0.5rem;">Query executed successfully in 8ms (2 rows returned)</div>
                <table class="modern-table" style="font-size:0.75rem">
                    <thead>
                        <tr><th>disease_name</th><th>weekly_cases</th><th>outbreak_status</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Malaria (Under-5)</td><td>1,842</td><td>Monitored</td></tr>
                        <tr><td>Measles</td><td>34</td><td>Critical Alert</td></tr>
                    </tbody>
                </table>
            `;
            addAuditLog('Executed custom SQL query on disease statistics dataset');
        } else {
            consoleLog.innerHTML = `
                <div style="color:var(--success); font-weight:600; margin-bottom:0.5rem;">Query executed successfully in 5ms. (0 rows returned)</div>
                <div style="color:var(--text-muted); font-style:italic;">No records matched your filters. Verify query conditions.</div>
            `;
            addAuditLog(`Executed query: "${query.substring(0, 30)}..."`);
        }
    }, 800);
}

// Add logs to global Audit Trail
function addAuditLog(actionText) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const currentUser = roleConfigs[currentRole].user.name;
    
    // Add to top of list
    auditLogs.unshift({
        time: timeStr,
        user: currentUser,
        action: actionText,
        ip: '127.0.0.1 (Local Session)',
        status: 'Success'
    });
    
    // Keep max 8 logs
    if (auditLogs.length > 8) {
        auditLogs.pop();
    }
    
    renderAuditLogs();
}

// Toast notification helper
function showToast(message) {
    // Create element
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'var(--bg-sidebar)';
    toast.style.color = '#ffffff';
    toast.style.padding = '0.75rem 1.25rem';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.fontSize = '0.85rem';
    toast.style.fontWeight = '500';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.zIndex = '9999';
    toast.style.border = '1px solid rgba(255,255,255,0.1)';
    toast.innerHTML = `<span class="material-icons" style="font-size:1.1rem; color:var(--primary)">info</span> <span>${message}</span>`;
    
    document.body.appendChild(toast);
    
    // Fade out and remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Trigger quick action functions with Modals or alerts
function triggerAction(actionName) {
    // Audit log
    addAuditLog(`Invoked action: ${actionName}`);
    
    if (actionName === 'approveProjects') {
        const confirmApprove = confirm('Are you sure you want to approve all 3 pending strategic projects?');
        if (confirmApprove) {
            showToast('All pending projects approved.');
            notifications.push({
                id: Date.now(),
                title: 'Projects Approved',
                desc: 'All pending strategic projects have been approved by Hon. Minister',
                time: 'Just now',
                type: 'success',
                unread: true
            });
            renderNotifications();
        }
    } else if (actionName === 'exportPDF') {
        showToast('Preparing health indicators export...');
        setTimeout(() => {
            window.print(); // Native print allows user to save dashboard layout as PDF
        }, 500);
    } else if (actionName === 'viewAuditLogs') {
        document.getElementById('auditTrailSection')?.scrollIntoView({ behavior: 'smooth' });
        showToast('Scrolled to Audit Logs section');
    } else if (actionName === 'managePermissions') {
        openQuickModal('Manage System Permissions', `
            <div class="form-group">
                <label class="form-label">Select User Role</label>
                <select class="form-input">
                    <option>Directorate Admin</option>
                    <option>Coordinator</option>
                    <option>Data Engineer</option>
                    <option>Data Analyst</option>
                </select>
            </div>
            <div class="form-group" style="margin-top:0.5rem">
                <label class="form-label">Permission Policy</label>
                <select class="form-input">
                    <option>Read/Write (Full Sync)</option>
                    <option>Read Only</option>
                    <option>Restricted Access</option>
                </select>
            </div>
        `, 'Update Policy');
    } else if (actionName === 'assignTask') {
        openQuickModal('Assign Strategic Task', `
            <div class="form-group">
                <label class="form-label">Task Name</label>
                <input type="text" class="form-input" placeholder="e.g. Audit clinic reporting guidelines" value="Verify vaccine cold chain compliance">
            </div>
            <div class="form-group">
                <label class="form-label">Assignee</label>
                <select class="form-input">
                    <option>Nadia Patel (Analyst)</option>
                    <option>Devon Lee (Engineer)</option>
                    <option>Marcus Vance (Operations)</option>
                </select>
            </div>
        `, 'Assign Task');
    } else if (actionName === 'scheduleMeeting') {
        openQuickModal('Schedule Stakeholder Sync', `
            <div class="form-group">
                <label class="form-label">Meeting Title</label>
                <input type="text" class="form-input" value="MOH-NHIH Biweekly Integration Review">
            </div>
            <div class="form-group">
                <label class="form-label">Date & Time</label>
                <input type="datetime-local" class="form-input" value="2026-07-20T10:00">
            </div>
        `, 'Schedule Sync');
    } else if (actionName === 'logIncident') {
        openQuickModal('Log Infrastructure Incident', `
            <div class="form-group">
                <label class="form-label">Incident Headline</label>
                <input type="text" class="form-input" value="Primary warehouse memory threshold warning">
            </div>
            <div class="form-group">
                <label class="form-label">Severity Level</label>
                <select class="form-input">
                    <option>Critical (P1)</option>
                    <option>High (P2)</option>
                    <option>Medium (P3)</option>
                </select>
            </div>
        `, 'Submit Incident');
    } else if (actionName === 'restartETL') {
        if (confirm('Verify: Restart ETL Sync Service immediately? This disrupts active pipeline jobs.')) {
            showToast('ETL Sync Service restarted. Reconnecting data nodes...');
        }
    } else if (actionName === 'uploadDataset') {
        openQuickModal('Upload Healthcare Dataset (CSV/JSON)', `
            <div class="form-group">
                <label class="form-label">Target Warehouse Schema</label>
                <select class="form-input">
                    <option>national_kpis_maternal</option>
                    <option>disease_incidence_weekly</option>
                    <option>clinic_inventory_status</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Choose File</label>
                <input type="file" class="form-input">
            </div>
        `, 'Upload File');
    } else if (actionName === 'triggerETL') {
        showToast('Daily scheduled ETL pipeline manually triggered. Processing...');
    } else if (actionName === 'openSQLEditor') {
        document.getElementById('sqlConsoleWidget')?.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('txtSqlQuery')?.focus();
        showToast('SQL editor focussed');
    } else if (actionName === 'buildChart') {
        document.getElementById('chartSelectType')?.focus();
        showToast('Chart builder selector focused');
    } else {
        showToast(`Action triggered: ${actionName}`);
    }
}

// Modal helper
function openQuickModal(title, bodyHtml, confirmText = 'Submit') {
    const modal = document.getElementById('globalModalOverlay');
    if (!modal) return;
    
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalConfirmBtn').innerText = confirmText;
    
    modal.classList.add('active');
    
    // Wire close
    const closeModal = () => modal.classList.remove('active');
    document.getElementById('modalCancelBtn').onclick = closeModal;
    
    document.getElementById('modalConfirmBtn').onclick = () => {
        closeModal();
        showToast(`Process completed: ${title}`);
        addAuditLog(`Executed action: ${title}`);
    };
}
