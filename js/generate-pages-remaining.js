#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');

const sidebars = {
  director: `
                <div class="sidebar-section">Governance</div>
                <a href="index.html" class="nav-link">
                    <span class="material-icons">dashboard</span>
                    <span>Executive Dashboard</span>
                </a>
                <a href="national-kpis.html" class="nav-link">
                    <span class="material-icons">leaderboard</span>
                    <span>National KPIs</span>
                </a>
                <a href="strategic-analytics.html" class="nav-link">
                    <span class="material-icons">insights</span>
                    <span>Strategic Analytics</span>
                </a>
                <a href="health-indicators.html" class="nav-link">
                    <span class="material-icons">monitor_heart</span>
                    <span>Health Indicators</span>
                </a>
                <a href="view-national-map.html" class="nav-link">
                    <span class="material-icons">map</span>
                    <span>View National Map</span>
                </a>
                <div class="sidebar-section">Approvals & Reports</div>
                <a href="approve-projects.html" class="nav-link">
                    <span class="material-icons">fact_check</span>
                    <span>Approve Projects</span>
                    <span class="nav-badge">4</span>
                </a>
                <a href="approve-data-requests.html" class="nav-link">
                    <span class="material-icons">security</span>
                    <span>Approve Data Requests</span>
                    <span class="nav-badge">7</span>
                </a>
                <a href="review-reports.html" class="nav-link">
                    <span class="material-icons">assignment_turned_in</span>
                    <span>Review Reports</span>
                </a>
                <div class="sidebar-section">Administration</div>
                <a href="budget.html" class="nav-link">
                    <span class="material-icons">account_balance</span>
                    <span>Budget Overview</span>
                </a>
                <a href="staff-overview.html" class="nav-link">
                    <span class="material-icons">groups</span>
                    <span>Staff Overview</span>
                </a>
                <a href="compliance.html" class="nav-link">
                    <span class="material-icons">policy</span>
                    <span>Compliance</span>
                </a>
                <a href="audit-logs.html" class="nav-link">
                    <span class="material-icons">history</span>
                    <span>Audit Logs</span>
                </a>`,
  coordinator: `
                <div class="sidebar-section">Main Menu</div>
                <a href="index.html" class="nav-link">
                    <span class="material-icons">dashboard</span>
                    <span>Dashboard</span>
                </a>
                <a href="team-management.html" class="nav-link">
                    <span class="material-icons">groups</span>
                    <span>Team Management</span>
                </a>
                <div class="sidebar-section">Coordination</div>
                <a href="assign-tasks.html" class="nav-link">
                    <span class="material-icons">assignment_ind</span>
                    <span>Assign Tasks</span>
                </a>
                <a href="approve-workflows.html" class="nav-link">
                    <span class="material-icons">checklist_rtl</span>
                    <span>Approve Workflows</span>
                    <span class="nav-badge">12</span>
                </a>
                <a href="project-tracking.html" class="nav-link">
                    <span class="material-icons">track_changes</span>
                    <span>Project Tracking</span>
                </a>
                <a href="meeting-scheduler.html" class="nav-link">
                    <span class="material-icons">event</span>
                    <span>Meeting Scheduler</span>
                </a>
                <div class="sidebar-section">System</div>
                <a href="requests.html" class="nav-link">
                    <span class="material-icons">inbox</span>
                    <span>Requests</span>
                </a>
                <a href="reports.html" class="nav-link">
                    <span class="material-icons">description</span>
                    <span>Reports</span>
                </a>
                <a href="user-management.html" class="nav-link">
                    <span class="material-icons">manage_accounts</span>
                    <span>User Management</span>
                </a>`,
  operations: `
                <div class="sidebar-section">Hub Operations</div>
                <a href="index.html" class="nav-link">
                    <span class="material-icons">dashboard</span>
                    <span>Hub Overview</span>
                </a>
                <a href="datacenter.html" class="nav-link">
                    <span class="material-icons">router</span>
                    <span>Data Center Status</span>
                </a>
                <a href="network.html" class="nav-link">
                    <span class="material-icons">lan</span>
                    <span>Network & Security</span>
                </a>
                <div class="sidebar-section">IT Support & Staffing</div>
                <a href="hardware-assets.html" class="nav-link">
                    <span class="material-icons">memory</span>
                    <span>Hardware Assets</span>
                </a>
                <a href="vendors.html" class="nav-link">
                    <span class="material-icons">handshake</span>
                    <span>Vendor Contracts</span>
                </a>
                <a href="meetings.html" class="nav-link">
                    <span class="material-icons">event</span>
                    <span>Meetings</span>
                </a>
                <div class="sidebar-section">System Administration</div>
                <a href="NHIH_operation_maintaiannace.html" class="nav-link">
                    <span class="material-icons">build</span>
                    <span>Maintenance</span>
                </a>
                <a href="compliance.html" class="nav-link">
                    <span class="material-icons">verified_user</span>
                    <span>Security & Compliance</span>
                </a>
                <a href="settings.html" class="nav-link">
                    <span class="material-icons">settings</span>
                    <span>Settings</span>
                </a>`
};

const users = {
  director: { name: 'Director', initials: 'DR', role: 'Director', bg: 'var(--primary)' },
  coordinator: { name: 'Coordinator', initials: 'CO', role: 'Coordinator', bg: 'var(--success)' },
  operations: { name: 'Prince Mafinda', initials: 'PM', role: 'Operations Manager', bg: 'var(--warning)' }
};

const pages = [
  // DIRECTOR
  { role: 'director', file: 'national-kpis.html', title: 'National KPIs', subtitle: 'View national health key performance indicators', content: `
    <div class="kpi-grid">
        <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">local_hospital</span></div><div class="kpi-data"><span class="kpi-label">Health Facilities</span><span class="kpi-val">1,248</span></div></div>
        <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">vaccines</span></div><div class="kpi-data"><span class="kpi-label">Vaccination Rate</span><span class="kpi-val">84%</span></div></div>
        <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">pregnant_woman</span></div><div class="kpi-data"><span class="kpi-label">Maternal Care</span><span class="kpi-val">91%</span></div></div>
    </div>
    <div class="card"><div class="card-head"><h3>KPI Performance Trends</h3></div><div class="chart-wrap" style="height:300px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b">Chart Data Loading...</div></div>` },
  { role: 'director', file: 'strategic-analytics.html', title: 'Strategic Analytics', subtitle: 'Deep dive into national health analytics', content: `
    <div class="grid-2">
        <div class="card"><div class="card-head"><h3>Disease Burden</h3></div><div class="chart-wrap" style="height:250px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b">Analytics Visualizations</div></div>
        <div class="card"><div class="card-head"><h3>Resource Allocation</h3></div><div class="chart-wrap" style="height:250px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b">Analytics Visualizations</div></div>
    </div>` },
  { role: 'director', file: 'health-indicators.html', title: 'Health Indicators', subtitle: 'Monitor specific health demographic indicators', content: `
    <div class="card">
        <div class="card-head"><h3>Core Health Indicators</h3><button class="btn-sm primary"><span class="material-icons">download</span> Export Data</button></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Indicator</th><th>Target</th><th>Current Value</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td>Infant Mortality Rate (per 1,000)</td><td>< 50</td><td>54</td><td><span class="badge-s warning">Near Target</span></td></tr>
                <tr><td>Under-5 Mortality Rate</td><td>< 70</td><td>68</td><td><span class="badge-s success">On Track</span></td></tr>
                <tr><td>Life Expectancy</td><td>> 60 years</td><td>59.8</td><td><span class="badge-s warning">Near Target</span></td></tr>
            </tbody>
        </table></div>
    </div>` },
  { role: 'director', file: 'view-national-map.html', title: 'National Map', subtitle: 'Geographic distribution of health data', content: `
    <div class="card" style="padding:0">
        <div style="height:600px;background:url('../../Assets/sierra_leone_map.png') center/contain no-repeat #e2e8f0;display:flex;align-items:center;justify-content:center;position:relative">
            <div style="position:absolute;top:20px;right:20px;background:white;padding:15px;border-radius:8px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)">
                <h4>Map Layers</h4>
                <div style="margin-top:10px"><label><input type="checkbox" checked> Health Facilities</label></div>
                <div><label><input type="checkbox"> Disease Outbreaks</label></div>
                <div><label><input type="checkbox"> Population Density</label></div>
            </div>
            <span style="background:rgba(255,255,255,0.8);padding:10px 20px;border-radius:20px;font-weight:600">Interactive Map Component</span>
        </div>
    </div>` },
  { role: 'director', file: 'approve-projects.html', title: 'Approve Projects', subtitle: 'Review and authorize pending health projects', content: `
    <div class="card">
        <div class="card-head"><h3>Pending Projects (4)</h3></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Project Title</th><th>Department</th><th>Budget</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
                <tr><td><strong>Malaria Net Distribution</strong></td><td>Public Health</td><td>SLL 450M</td><td><span class="badge-s warning">Awaiting Approval</span></td><td><button class="btn-sm primary">Review</button></td></tr>
                <tr><td><strong>Western Area EMR Rollout</strong></td><td>IT / HOS</td><td>SLL 800M</td><td><span class="badge-s warning">Awaiting Approval</span></td><td><button class="btn-sm primary">Review</button></td></tr>
            </tbody>
        </table></div>
    </div>` },
  { role: 'director', file: 'approve-data-requests.html', title: 'Approve Data Requests', subtitle: 'Manage requests for data access', content: `
    <div class="card">
        <div class="card-head"><h3>Pending Data Requests (7)</h3></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Requested By</th><th>Organization</th><th>Dataset</th><th>Purpose</th><th>Actions</th></tr></thead>
            <tbody>
                <tr><td>Dr. A. Smith</td><td>WHO</td><td>Q2 Immunization Data</td><td>Research Analysis</td><td><button class="btn-sm primary"><span class="material-icons">check</span></button> <button class="btn-sm danger"><span class="material-icons">close</span></button></td></tr>
                <tr><td>S. Kamara</td><td>UNICEF</td><td>Maternal Health (Bo)</td><td>Program Planning</td><td><button class="btn-sm primary"><span class="material-icons">check</span></button> <button class="btn-sm danger"><span class="material-icons">close</span></button></td></tr>
            </tbody>
        </table></div>
    </div>` },
  { role: 'director', file: 'review-reports.html', title: 'Review Reports', subtitle: 'Executive review of submitted operational reports', content: `
    <div class="card">
        <div class="card-head"><h3>Submitted Reports</h3></div>
        <div class="activity-list">
            <div class="activity-item"><div class="activity-dot blue"></div><div class="activity-text"><strong>Monthly HMIS Summary</strong><span>Submitted by Programme Lead</span><span class="atime">Today</span></div><button class="btn-sm">Read</button></div>
            <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Q2 Financial Audit</strong><span>Submitted by Finance Dept</span><span class="atime">Yesterday</span></div><button class="btn-sm">Read</button></div>
        </div>
    </div>` },
  { role: 'director', file: 'budget.html', title: 'Budget Overview', subtitle: 'Monitor financial allocation and expenditure', content: `
    <div class="kpi-grid">
        <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">account_balance</span></div><div class="kpi-data"><span class="kpi-label">Total Budget</span><span class="kpi-val">SLL 4.2B</span></div></div>
        <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">payments</span></div><div class="kpi-data"><span class="kpi-label">Allocated</span><span class="kpi-val">SLL 3.1B</span></div></div>
        <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">warning</span></div><div class="kpi-data"><span class="kpi-label">Pending Approval</span><span class="kpi-val">SLL 450M</span></div></div>
    </div>
    <div class="card"><div class="card-head"><h3>Departmental Expenditure</h3></div><div class="chart-wrap" style="height:300px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b">Budget Chart Data</div></div>` },
  { role: 'director', file: 'staff-overview.html', title: 'Staff Overview', subtitle: 'High-level view of MoHS staffing', content: `
    <div class="kpi-grid">
        <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">groups</span></div><div class="kpi-data"><span class="kpi-label">Total Staff</span><span class="kpi-val">4,280</span></div></div>
        <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">medical_services</span></div><div class="kpi-data"><span class="kpi-label">Clinical Staff</span><span class="kpi-val">2,950</span></div></div>
        <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">admin_panel_settings</span></div><div class="kpi-data"><span class="kpi-label">Admin Staff</span><span class="kpi-val">1,330</span></div></div>
    </div>` },
  { role: 'director', file: 'compliance.html', title: 'Policy & Compliance', subtitle: 'National health policy compliance tracking', content: `
    <div class="card">
        <div class="card-head"><h3>Compliance Audits</h3></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Policy Framework</th><th>Last Audit</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td>Data Privacy Act (DPA)</td><td>June 2026</td><td><span class="badge-s success">98% Compliant</span></td></tr>
                <tr><td>WHO Reporting Standards</td><td>July 2026</td><td><span class="badge-s success">100% Compliant</span></td></tr>
                <tr><td>Facility Safety Protocols</td><td>May 2026</td><td><span class="badge-s warning">85% Compliant</span></td></tr>
            </tbody>
        </table></div>
    </div>` },
  { role: 'director', file: 'audit-logs.html', title: 'Audit Logs', subtitle: 'System-wide audit trail for governance', content: `
    <div class="card">
        <div class="card-head"><h3>System Audit Trail</h3><div class="search-box"><span class="material-icons">search</span><input type="text" placeholder="Search logs..."></div></div>
        <div class="console">
            <div class="dim">[2026-07-22 09:15:22]</div><div class="ok">Dr. J. Koroma (Engineer) accessed production database.</div>
            <div class="dim">[2026-07-22 08:30:00]</div><div class="warn">Data export initiated by S. Kamara (Analyst) - 45,000 rows.</div>
            <div class="dim">[2026-07-21 16:45:10]</div><div class="ok">Project Budget 'Malaria 2026' approved by Director.</div>
        </div>
    </div>` },
  // These files exist as placeholders but weren't in the exact button list. Generate basic UI for them.
  { role: 'director', file: 'uptime.html', title: 'System Uptime', subtitle: 'National system availability metrics', content: '<div class="card"><h3>System Uptime Analytics</h3><p>All core systems operating normally at 99.98% uptime.</p></div>' },
  { role: 'director', file: 'audit.html', title: 'Audit Overview', subtitle: 'Financial and operations audits', content: '<div class="card"><h3>Recent Audits</h3><p>No critical findings in recent audits.</p></div>' },
  { role: 'director', file: 'work-progress.html', title: 'Work Progress', subtitle: 'High level tracking of initiatives', content: '<div class="card"><h3>Initiative Tracking</h3><p>All major Q3 initiatives are currently on track.</p></div>' },
  { role: 'director', file: 'reports.html', title: 'Operational Reports', subtitle: 'Detailed departmental reports', content: '<div class="card"><h3>Report Directory</h3><p>Access all internal operational reports here.</p></div>' },
  { role: 'director', file: 'hub-documents.html', title: 'Hub Documents', subtitle: 'Central document repository', content: '<div class="card"><h3>Document Repository</h3><p>Strategic plans and policy documents are stored securely.</p></div>' },
  { role: 'director', file: 'user-overview.html', title: 'User Overview', subtitle: 'System user metrics', content: '<div class="card"><h3>Active Users</h3><p>2,450 active users this week.</p></div>' },
  { role: 'director', file: 'data-quality.html', title: 'Data Quality Index', subtitle: 'Overall data integrity scoring', content: '<div class="card"><h3>Data Quality</h3><p>Current national data quality index score: 94/100.</p></div>' },

  // COORDINATOR
  { role: 'coordinator', file: 'reports.html', title: 'Coordination Reports', subtitle: 'Generate and review coordination reports', content: `
    <div class="card">
        <div class="card-head"><h3>Recent Reports</h3><button class="btn-sm primary"><span class="material-icons">add</span> Generate Report</button></div>
        <div class="activity-list">
            <div class="activity-item"><div class="activity-dot blue"></div><div class="activity-text"><strong>Team Productivity - Q2</strong><span>Generated by Coordinator</span></div><button class="btn-sm">Download</button></div>
            <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Workflow Efficiency Metrics</strong><span>Generated by System</span></div><button class="btn-sm">Download</button></div>
        </div>
    </div>` },
  { role: 'coordinator', file: 'assign-tasks.html', title: 'Assign Tasks', subtitle: 'Allocate work to team members', content: `
    <div class="grid-2">
        <div class="card">
            <div class="card-head"><h3>New Task Assignment</h3></div>
            <div class="card-body">
                <div style="margin-bottom:15px"><label style="display:block;margin-bottom:5px">Task Name</label><input type="text" class="input" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:4px"></div>
                <div style="margin-bottom:15px"><label style="display:block;margin-bottom:5px">Assignee</label><select class="input" style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:4px"><option>Daniel (Analyst)</option><option>Dr. Joseph (Engineer)</option></select></div>
                <button class="btn-sm primary" style="width:100%">Assign Task</button>
            </div>
        </div>
        <div class="card">
            <div class="card-head"><h3>Recent Assignments</h3></div>
            <div class="activity-list">
                <div class="activity-item"><div class="activity-text"><strong>Fix Data Pipeline</strong><span>Assigned to Dr. Joseph</span><span class="atime">Due Tomorrow</span></div></div>
            </div>
        </div>
    </div>` },
  { role: 'coordinator', file: 'requests.html', title: 'System Requests', subtitle: 'Manage incoming requests', content: `
    <div class="card">
        <div class="card-head"><h3>Inbox</h3></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Request</th><th>From</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
                <tr><td>Need access to Bo District datasets</td><td>H. Kamara</td><td>Today</td><td><button class="btn-sm primary">Approve</button></td></tr>
                <tr><td>Leave request for next week</td><td>S. Beareh</td><td>Yesterday</td><td><button class="btn-sm primary">Approve</button></td></tr>
            </tbody>
        </table></div>
    </div>` },
  { role: 'coordinator', file: 'meeting-scheduler.html', title: 'Meeting Scheduler', subtitle: 'Organize team syncs and standups', content: `
    <div class="card">
        <div class="card-head"><h3>Calendar</h3><button class="btn-sm primary">Schedule Meeting</button></div>
        <div style="height:400px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b">Calendar Component</div>
    </div>` },
  { role: 'coordinator', file: 'user-management.html', title: 'User Management', subtitle: 'Manage user access and roles', content: `
    <div class="card">
        <div class="card-head"><h3>Active Users</h3><button class="btn-sm primary">Add User</button></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Last Login</th></tr></thead>
            <tbody>
                <tr><td>Ibrahim Sorie Turay</td><td>Programme Lead</td><td><span class="badge-s success">Active</span></td><td>Today, 08:30 AM</td></tr>
                <tr><td>Dr. Joseph Koroma</td><td>Data Engineer</td><td><span class="badge-s success">Active</span></td><td>Today, 09:15 AM</td></tr>
                <tr><td>Prince Mafinda</td><td>Operations Mgr</td><td><span class="badge-s success">Active</span></td><td>Today, 07:45 AM</td></tr>
            </tbody>
        </table></div>
    </div>` },

  // OPERATIONS
  { role: 'operations', file: 'vendors.html', title: 'Vendor Contracts', subtitle: 'Manage technology and service vendors', content: `
    <div class="card">
        <div class="card-head"><h3>Active Vendors</h3><button class="btn-sm primary"><span class="material-icons">add</span> Add Vendor</button></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Vendor Name</th><th>Service Provided</th><th>Contract End</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td><strong>SAND Technology</strong></td><td>Solutions Management</td><td>Dec 31, 2026</td><td><span class="badge-s success">Active</span></td></tr>
                <tr><td><strong>Orange SL</strong></td><td>ISP & Connectivity</td><td>Jun 30, 2027</td><td><span class="badge-s success">Active</span></td></tr>
                <tr><td><strong>Dell Enterprise</strong></td><td>Hardware Support</td><td>Nov 15, 2026</td><td><span class="badge-s warning">Renewing</span></td></tr>
            </tbody>
        </table></div>
    </div>` },
  { role: 'operations', file: 'hardware-assets.html', title: 'Hardware Assets', subtitle: 'Manage physical IT infrastructure', content: `
    <div class="kpi-grid">
        <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">dns</span></div><div class="kpi-data"><span class="kpi-label">Servers</span><span class="kpi-val">12</span></div></div>
        <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">laptop_mac</span></div><div class="kpi-data"><span class="kpi-label">Workstations</span><span class="kpi-val">84</span></div></div>
        <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">router</span></div><div class="kpi-data"><span class="kpi-label">Network Gear</span><span class="kpi-val">32</span></div></div>
    </div>
    <div class="card">
        <div class="card-head"><h3>Inventory Management</h3></div>
        <p>Full hardware inventory tracking system loaded.</p>
    </div>` },
  { role: 'operations', file: 'network.html', title: 'Network & Security', subtitle: 'Monitor network performance and firewalls', content: `
    <div class="grid-2">
        <div class="card"><div class="card-head"><h3>Network Throughput</h3></div><div class="chart-wrap" style="height:250px;background:#f8fafc;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#64748b">Network Graph</div></div>
        <div class="card"><div class="card-head"><h3>Firewall Alerts</h3></div>
            <div class="activity-list">
                <div class="activity-item"><div class="activity-dot red"></div><div class="activity-text"><strong>Port Scan Detected</strong><span>Origin: External IP</span><span class="atime">1 hr ago</span></div></div>
                <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>VPN Tunnel Established</strong><span>MoHS HQ connection stable</span><span class="atime">5 hrs ago</span></div></div>
            </div>
        </div>
    </div>` },
  { role: 'operations', file: 'NHIH_operation_maintaiannace.html', title: 'Maintenance Schedule', subtitle: 'Track system maintenance windows', content: `
    <div class="card">
        <div class="card-head"><h3>Scheduled Maintenance</h3><button class="btn-sm primary">Schedule Task</button></div>
        <div class="tbl-responsive"><table class="dt">
            <thead><tr><th>Task</th><th>System</th><th>Window</th><th>Status</th></tr></thead>
            <tbody>
                <tr><td><strong>UPS Battery Check</strong></td><td>Data Center</td><td>Saturday 10 PM</td><td><span class="badge-s warning">Scheduled</span></td></tr>
                <tr><td><strong>OS Patching</strong></td><td>Database Servers</td><td>Sunday 2 AM</td><td><span class="badge-s warning">Scheduled</span></td></tr>
            </tbody>
        </table></div>
    </div>` },
  { role: 'operations', file: 'datacenter.html', title: 'Data Center Status', subtitle: 'Monitor physical data center environment', content: `
    <div class="kpi-grid">
        <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">thermostat</span></div><div class="kpi-data"><span class="kpi-label">Temperature</span><span class="kpi-val">21°C</span></div></div>
        <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">water_drop</span></div><div class="kpi-data"><span class="kpi-label">Humidity</span><span class="kpi-val">45%</span></div></div>
        <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">bolt</span></div><div class="kpi-data"><span class="kpi-label">Power Draw</span><span class="kpi-val">4.2 kW</span></div></div>
    </div>` },
  { role: 'operations', file: 'compliance.html', title: 'Security & Compliance', subtitle: 'IT operations security audits', content: `
    <div class="card">
        <div class="card-head"><h3>Security Posture</h3></div>
        <p>All physical access controls and IT security protocols are functioning normally.</p>
    </div>` },
  { role: 'operations', file: 'settings.html', title: 'Operations Settings', subtitle: 'Configure dashboard parameters', content: `
    <div class="card">
        <div class="card-head"><h3>System Settings</h3></div>
        <p>Configuration panel for alert thresholds and notification preferences.</p>
    </div>` }
];

function generatePage(pg) {
  const user = users[pg.role];
  let sidebar = sidebars[pg.role];
  
  // For Director, replace active class logic
  // The director sidebar doesn't have an active class defined everywhere, so we replace it intelligently
  sidebar = sidebar.replace('class="nav-link active"', 'class="nav-link"'); // clear current active
  sidebar = sidebar.replace(`href="${pg.file}" class="nav-link"`, `href="${pg.file}" class="nav-link active"`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pg.title} | NHIH</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="../../css/nhih-dashboard.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
</head>
<body>
    <div class="nhih-app">
        <div class="sidebar-overlay" id="sidebarOverlay"></div>
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-head">
                <div class="sidebar-logo"><img src="../../Assets/mohs_logo-removebg-preview.png" alt="MoHS"></div>
                <div class="sidebar-brand"><h2>NHIH</h2><span>Ministry of Health</span></div>
            </div>
            <div class="sidebar-nav">${sidebar}
            </div>
            <div class="sidebar-foot">
                <div class="session-card">
                    <div class="session-status"><span class="dot-online"></span> Active Session</div>
                    <div class="session-time">Last login: Today, 08:30 AM</div>
                </div>
            </div>
        </aside>

        <main class="main-wrap">
            <header class="top-header">
                <div class="header-left">
                    <div class="menu-toggle" id="menuToggle"><span></span><span></span><span></span></div>
                    <div>
                        <h1 class="page-title">${pg.title}</h1>
                        <p class="welcome-sub">${pg.subtitle}</p>
                    </div>
                </div>
                <div class="header-right">
                    <div class="search-box">
                        <span class="material-icons">search</span>
                        <input type="text" placeholder="Search...">
                    </div>
                    <button class="icon-btn" id="themeToggle"><span class="material-icons">dark_mode</span></button>
                    <div class="notif-wrap">
                        <button class="icon-btn dropdown-toggle" data-target="notifDropdown">
                            <span class="material-icons">notifications</span><span class="hdr-badge">3</span>
                        </button>
                    </div>
                    <div class="profile-wrap">
                        <div class="user-pill dropdown-toggle" data-target="profileDropdown">
                            <div class="avatar" style="background:${user.bg}">${user.initials}</div>
                            <div class="user-info"><div class="uname">${user.name}</div><div class="urole">${user.role}</div></div>
                            <span class="material-icons" style="font-size:1.2rem;color:var(--text-muted)">expand_more</span>
                        </div>
                    </div>
                </div>
            </header>

            <div class="main-content">
${pg.content}
            </div>
        </main>
    </div>
    <script src="../../js/nhih-dashboard.js"><\/script>
</body>
</html>`;
}

let count = 0;
pages.forEach(pg => {
  const filePath = path.join(BASE, 'Dashboard', pg.role, pg.file);
  fs.writeFileSync(filePath, generatePage(pg), 'utf8');
  count++;
  console.log(`✓ Created: Dashboard/${pg.role}/${pg.file}`);
});

// Also fix Director index.html to have the correct sidebar (it's 880 lines so we'll just rewrite the sidebar part)
const dirIndex = path.join(BASE, 'Dashboard', 'director', 'index.html');
if (fs.existsSync(dirIndex)) {
    let content = fs.readFileSync(dirIndex, 'utf8');
    const sbStart = content.indexOf('<div class="sidebar-nav">');
    const sbEnd = content.indexOf('<div class="sidebar-foot">');
    if (sbStart !== -1 && sbEnd !== -1) {
        let activeSidebar = sidebars.director;
        // make sure index.html is active
        activeSidebar = activeSidebar.replace('href="index.html" class="nav-link"', 'href="index.html" class="nav-link active"');
        content = content.substring(0, sbStart) + '<div class="sidebar-nav">\n' + activeSidebar + '\n            </div>\n            ' + content.substring(sbEnd);
        fs.writeFileSync(dirIndex, content, 'utf8');
        console.log('✓ Updated Director index.html sidebar');
    }
}

console.log(`\n✅ Generated ${count} pages successfully.`);
