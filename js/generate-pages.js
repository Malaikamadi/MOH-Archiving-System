#!/usr/bin/env node
/**
 * NHIH Page Generator - Creates all empty dashboard sub-pages
 * Based on the RACI matrix roles and responsibilities
 */
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..');

// Common sidebar snippets per role
const sidebars = {
  program_lead: `
                <div class="sidebar-section">Programme Management</div>
                <a href="index.html" class="nav-link">
                    <span class="material-icons">dashboard</span>
                    <span>Dashboard</span>
                </a>
                <a href="meetings.html" class="nav-link">
                    <span class="material-icons">event</span>
                    <span>Meetings & Standups</span>
                </a>
                <a href="facility_report.html" class="nav-link">
                    <span class="material-icons">local_hospital</span>
                    <span>Facility Reporting</span>
                </a>
                <div class="sidebar-section">Data Oversight</div>
                <a href="../analyst/data_validation.html" class="nav-link">
                    <span class="material-icons">fact_check</span>
                    <span>Data Validation</span>
                </a>
                <a href="information_product_review.html" class="nav-link">
                    <span class="material-icons">auto_stories</span>
                    <span>Information Products</span>
                </a>
                <a href="../engineer/Data_Visualization.html" class="nav-link">
                    <span class="material-icons">bar_chart</span>
                    <span>Dashboard & Data Viz</span>
                </a>
                <div class="sidebar-section">Infrastructure</div>
                <a href="infrastructure_management.html" class="nav-link">
                    <span class="material-icons">dns</span>
                    <span>Infrastructure (HOS)</span>
                </a>
                <a href="NHIH_operations.html" class="nav-link">
                    <span class="material-icons">build</span>
                    <span>NHIH Operations</span>
                </a>
                <a href="Data_Security.html" class="nav-link">
                    <span class="material-icons">security</span>
                    <span>Data Security</span>
                </a>`,
  engineer: `
                <div class="sidebar-section">Main Menu</div>
                <a href="index.html" class="nav-link">
                    <span class="material-icons">dashboard</span>
                    <span>Dashboard</span>
                </a>
                <a href="data-sources.html" class="nav-link">
                    <span class="material-icons">storage</span>
                    <span>Data Sources</span>
                </a>
                <div class="sidebar-section">Engineering</div>
                <a href="validation-rules.html" class="nav-link">
                    <span class="material-icons">rule</span>
                    <span>Validation Rules</span>
                </a>
                <a href="upload-dataset.html" class="nav-link">
                    <span class="material-icons">upload_file</span>
                    <span>Upload Dataset</span>
                </a>
                <a href="pipeline-monitor.html" class="nav-link">
                    <span class="material-icons">monitoring</span>
                    <span>Pipeline Monitor</span>
                </a>
                <a href="Data_Visualization.html" class="nav-link">
                    <span class="material-icons">insert_chart</span>
                    <span>Data Visualization</span>
                </a>
                <div class="sidebar-section">Infrastructure</div>
                <a href="HOS.html" class="nav-link">
                    <span class="material-icons">dns</span>
                    <span>Infrastructure (HOS)</span>
                </a>
                <a href="Data_security.html" class="nav-link">
                    <span class="material-icons">security</span>
                    <span>Data Security</span>
                </a>
                <a href="EMR.html" class="nav-link">
                    <span class="material-icons">medical_information</span>
                    <span>EMR Development</span>
                </a>
                <a href="configuration.html" class="nav-link">
                    <span class="material-icons">settings</span>
                    <span>Configuration</span>
                </a>`,
  analyst: `
                <div class="sidebar-section">Main Menu</div>
                <a href="index.html" class="nav-link">
                    <span class="material-icons">dashboard</span>
                    <span>Dashboard</span>
                </a>
                <a href="datasets.html" class="nav-link">
                    <span class="material-icons">table_chart</span>
                    <span>Datasets</span>
                </a>
                <a href="data_validation.html" class="nav-link">
                    <span class="material-icons">fact_check</span>
                    <span>Data Validation</span>
                </a>
                <div class="sidebar-section">Analytics</div>
                <a href="facility.html" class="nav-link">
                    <span class="material-icons">local_hospital</span>
                    <span>Facility Performance</span>
                </a>
                <a href="my-reports.html" class="nav-link">
                    <span class="material-icons">assessment</span>
                    <span>My Reports</span>
                </a>
                <a href="report-templates.html" class="nav-link">
                    <span class="material-icons">description</span>
                    <span>Report Templates</span>
                </a>
                <a href="data-requests.html" class="nav-link">
                    <span class="material-icons">send</span>
                    <span>Data Requests</span>
                </a>
                <div class="sidebar-section">System</div>
                <a href="settings.html" class="nav-link">
                    <span class="material-icons">settings</span>
                    <span>Settings</span>
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
  program_lead: { name: 'Ibrahim Sorie Turay', initials: 'IT', role: 'Programme Lead', bg: 'var(--success)' },
  engineer: { name: 'Dr. Joseph Koroma', initials: 'JK', role: 'Data Engineer', bg: 'var(--purple)' },
  analyst: { name: 'Daniel Gassim Kay Jah', initials: 'DK', role: 'Data Analyst', bg: 'var(--info)' },
  operations: { name: 'Prince Mafinda', initials: 'PM', role: 'Operations Manager', bg: 'var(--warning)' }
};

// Page content definitions
const pages = [
  // === PROGRAM LEAD ===
  {
    role: 'program_lead', file: 'meetings.html', title: 'Meetings & Standups',
    subtitle: 'Schedule team meetings and review executive summaries',
    activeNav: 'meetings.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">event</span></div><div class="kpi-data"><span class="kpi-label">This Week</span><span class="kpi-val">8</span><span class="kpi-trend up"><span class="material-icons">arrow_upward</span> 2 more</span></div></div>
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">check_circle</span></div><div class="kpi-data"><span class="kpi-label">Completed</span><span class="kpi-val">45</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">schedule</span></div><div class="kpi-data"><span class="kpi-label">Upcoming</span><span class="kpi-val">3</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">groups</span></div><div class="kpi-data"><span class="kpi-label">Team Members</span><span class="kpi-val">7</span></div></div>
                </div>
                <div class="grid-2">
                    <div class="card">
                        <div class="card-head">
                            <h3>Upcoming Meetings</h3>
                            <button class="btn-sm primary"><span class="material-icons">add</span> New Meeting</button>
                        </div>
                        <div class="tbl-responsive">
                            <table class="dt">
                                <thead><tr><th>Meeting</th><th>Date</th><th>Time</th><th>Attendees</th><th>Status</th></tr></thead>
                                <tbody>
                                    <tr><td><strong>Daily Standup</strong></td><td>Mon–Fri</td><td>09:00 AM</td><td>All Staff (7)</td><td><span class="badge-s info">Recurring</span></td></tr>
                                    <tr><td><strong>Weekly Data Review</strong></td><td>Every Wed</td><td>02:00 PM</td><td>Analysts, Engineers</td><td><span class="badge-s info">Recurring</span></td></tr>
                                    <tr><td><strong>Bi-weekly Executive Summary</strong></td><td>Jul 25, 2026</td><td>10:00 AM</td><td>Director, Coordinator</td><td><span class="badge-s warning">Pending</span></td></tr>
                                    <tr><td><strong>Monthly Programme Review</strong></td><td>Aug 1, 2026</td><td>11:00 AM</td><td>All Leads</td><td><span class="badge-s purple">Scheduled</span></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-head">
                            <h3>Recent Meeting Minutes</h3>
                            <span class="view-all">View All</span>
                        </div>
                        <div class="activity-list">
                            <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Weekly Data Review — Jul 18</strong><span>Data validation issues resolved for Bo District. Pipeline fix deployed by Eng team.</span><span class="atime">3 days ago</span></div></div>
                            <div class="activity-item"><div class="activity-dot blue"></div><div class="activity-text"><strong>Executive Summary — Jul 14</strong><span>Presented Q2 KPI dashboard to Director. Approved expanded facility coverage.</span><span class="atime">1 week ago</span></div></div>
                            <div class="activity-item"><div class="activity-dot orange"></div><div class="activity-text"><strong>Infrastructure Standup — Jul 12</strong><span>HOS server migration on track. UPS replacement scheduled for Aug.</span><span class="atime">9 days ago</span></div></div>
                        </div>
                    </div>
                </div>`
  },
  {
    role: 'program_lead', file: 'facility_report.html', title: 'Facility Reporting',
    subtitle: 'Review and follow up on facility reporting performance',
    activeNav: 'facility_report.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">local_hospital</span></div><div class="kpi-data"><span class="kpi-label">Facilities Reporting</span><span class="kpi-val">1,082</span><span class="kpi-trend up"><span class="material-icons">arrow_upward</span> 94% compliance</span></div></div>
                    <div class="kpi"><div class="kpi-bar red"></div><div class="kpi-icon red"><span class="material-icons">report_problem</span></div><div class="kpi-data"><span class="kpi-label">Overdue Reports</span><span class="kpi-val">67</span><span class="kpi-trend down"><span class="material-icons">arrow_downward</span> 6% non-compliant</span></div></div>
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">bar_chart</span></div><div class="kpi-data"><span class="kpi-label">Data Quality</span><span class="kpi-val">91%</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">calendar_month</span></div><div class="kpi-data"><span class="kpi-label">Period</span><span class="kpi-val">Q2 2026</span></div></div>
                </div>
                <div class="card">
                    <div class="card-head">
                        <h3>Facility Reporting Status by District</h3>
                        <div style="display:flex;gap:6px"><button class="btn-sm"><span class="material-icons">download</span> Export</button><button class="btn-sm primary"><span class="material-icons">mail</span> Send Reminders</button></div>
                    </div>
                    <div class="tbl-responsive">
                        <table class="dt">
                            <thead><tr><th>District</th><th>Total Facilities</th><th>Submitted</th><th>Pending</th><th>Rate</th><th>Status</th></tr></thead>
                            <tbody>
                                <tr><td><strong>Western Area Urban</strong></td><td>142</td><td>138</td><td>4</td><td>97%</td><td><span class="badge-s success">On Track</span></td></tr>
                                <tr><td><strong>Bo</strong></td><td>98</td><td>92</td><td>6</td><td>94%</td><td><span class="badge-s success">On Track</span></td></tr>
                                <tr><td><strong>Kenema</strong></td><td>85</td><td>78</td><td>7</td><td>92%</td><td><span class="badge-s warning">Needs Follow-up</span></td></tr>
                                <tr><td><strong>Kailahun</strong></td><td>72</td><td>60</td><td>12</td><td>83%</td><td><span class="badge-s danger">Below Target</span></td></tr>
                                <tr><td><strong>Bombali</strong></td><td>68</td><td>64</td><td>4</td><td>94%</td><td><span class="badge-s success">On Track</span></td></tr>
                                <tr><td><strong>Port Loko</strong></td><td>76</td><td>65</td><td>11</td><td>86%</td><td><span class="badge-s warning">Needs Follow-up</span></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="grid-2">
                    <div class="card"><div class="card-head"><h3>Reporting Trend</h3></div><div class="chart-wrap"><canvas id="facilityChart"></canvas></div></div>
                    <div class="card"><div class="card-head"><h3>Follow-up Actions</h3></div>
                        <div class="activity-list">
                            <div class="activity-item"><div class="activity-dot red"></div><div class="activity-text"><strong>Kailahun District — 12 pending</strong><span>Contact DHO re: missing monthly reports from 4 CHCs</span><span class="atime">Action needed</span></div></div>
                            <div class="activity-item"><div class="activity-dot orange"></div><div class="activity-text"><strong>Port Loko District — 11 pending</strong><span>Schedule call with district data clerk for catch-up submission</span><span class="atime">Due in 2 days</span></div></div>
                            <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Bo District — Resolved</strong><span>6 pending reports submitted after reminder was sent</span><span class="atime">Completed yesterday</span></div></div>
                        </div>
                    </div>
                </div>`,
    chart: `const ctx=document.getElementById('facilityChart');if(ctx){new Chart(ctx,{type:'line',data:{labels:['Jan','Feb','Mar','Apr','May','Jun'],datasets:[{label:'Facilities Reporting (%)',data:[88,89,91,90,93,94],borderColor:'#0B5ED7',backgroundColor:'rgba(11,94,215,0.1)',fill:true,tension:0.4},{label:'Target',data:[95,95,95,95,95,95],borderColor:'#ef4444',borderDash:[5,5]}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'}},scales:{y:{min:80,max:100}}}});}`
  },
  {
    role: 'program_lead', file: 'Data_Security.html', title: 'Data Security & Compliance',
    subtitle: 'Review security posture and compliance audit results',
    activeNav: 'Data_Security.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">shield</span></div><div class="kpi-data"><span class="kpi-label">Security Score</span><span class="kpi-val">94%</span><span class="kpi-trend up"><span class="material-icons">arrow_upward</span> 3% improved</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">gpp_maybe</span></div><div class="kpi-data"><span class="kpi-label">Open Findings</span><span class="kpi-val">5</span></div></div>
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">policy</span></div><div class="kpi-data"><span class="kpi-label">Policies Active</span><span class="kpi-val">12</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">history</span></div><div class="kpi-data"><span class="kpi-label">Last Audit</span><span class="kpi-val">Jun 15</span></div></div>
                </div>
                <div class="card">
                    <div class="card-head"><h3>Compliance Checklist — Q3 2026</h3><button class="btn-sm primary"><span class="material-icons">download</span> Export Report</button></div>
                    <div class="tbl-responsive">
                        <table class="dt">
                            <thead><tr><th>Control Area</th><th>Requirement</th><th>Status</th><th>Owner</th></tr></thead>
                            <tbody>
                                <tr><td><strong>Access Control</strong></td><td>Role-based access enforced on all systems</td><td><span class="badge-s success">Compliant</span></td><td>Eng Team</td></tr>
                                <tr><td><strong>Data Encryption</strong></td><td>AES-256 at rest, TLS 1.3 in transit</td><td><span class="badge-s success">Compliant</span></td><td>Eng Team</td></tr>
                                <tr><td><strong>Backup & Recovery</strong></td><td>Daily backups with 30-day retention</td><td><span class="badge-s success">Compliant</span></td><td>Ops Team</td></tr>
                                <tr><td><strong>User Activity Logging</strong></td><td>All user actions logged and auditable</td><td><span class="badge-s warning">Partial</span></td><td>Eng Team</td></tr>
                                <tr><td><strong>Vulnerability Scanning</strong></td><td>Monthly scans on all public endpoints</td><td><span class="badge-s danger">Overdue</span></td><td>Ops Team</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>`
  },
  {
    role: 'program_lead', file: 'NHIH_operations.html', title: 'NHIH Operations & Device Maintenance',
    subtitle: 'Monitor daily operations and device health across NHIH',
    activeNav: 'NHIH_operations.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">check_circle</span></div><div class="kpi-data"><span class="kpi-label">Systems Online</span><span class="kpi-val">14/15</span></div></div>
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">devices</span></div><div class="kpi-data"><span class="kpi-label">Active Devices</span><span class="kpi-val">128</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">build</span></div><div class="kpi-data"><span class="kpi-label">Maintenance Due</span><span class="kpi-val">6</span></div></div>
                    <div class="kpi"><div class="kpi-bar red"></div><div class="kpi-icon red"><span class="material-icons">error</span></div><div class="kpi-data"><span class="kpi-label">Open Issues</span><span class="kpi-val">3</span></div></div>
                </div>
                <div class="grid-2">
                    <div class="card"><div class="card-head"><h3>Device Inventory & Status</h3><button class="btn-sm"><span class="material-icons">download</span> Export</button></div>
                        <div class="tbl-responsive"><table class="dt">
                            <thead><tr><th>Device</th><th>Location</th><th>Status</th><th>Next Maintenance</th></tr></thead>
                            <tbody>
                                <tr><td><strong>Server — Primary</strong></td><td>NHIH Data Center</td><td><span class="badge-s success">Online</span></td><td>Aug 15, 2026</td></tr>
                                <tr><td><strong>Server — Backup</strong></td><td>MoH HQ</td><td><span class="badge-s success">Online</span></td><td>Aug 15, 2026</td></tr>
                                <tr><td><strong>UPS — Primary</strong></td><td>NHIH Data Center</td><td><span class="badge-s warning">Battery Low</span></td><td>Jul 28, 2026</td></tr>
                                <tr><td><strong>Network Switch #3</strong></td><td>Floor 2</td><td><span class="badge-s danger">Offline</span></td><td>Immediate</td></tr>
                                <tr><td><strong>Workstation Pool (24)</strong></td><td>Open Office</td><td><span class="badge-s success">Active</span></td><td>Sep 1, 2026</td></tr>
                            </tbody>
                        </table></div>
                    </div>
                    <div class="card"><div class="card-head"><h3>Operational Log</h3></div>
                        <div class="activity-list">
                            <div class="activity-item"><div class="activity-dot red"></div><div class="activity-text"><strong>Network Switch #3 went offline</strong><span>Port 2, Floor 2 — Prince Mafinda investigating</span><span class="atime">2 hours ago</span></div></div>
                            <div class="activity-item"><div class="activity-dot orange"></div><div class="activity-text"><strong>UPS battery replacement scheduled</strong><span>Primary UPS at data center — vendor confirmed</span><span class="atime">Yesterday</span></div></div>
                            <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Monthly server patching completed</strong><span>All security patches applied to Primary & Backup servers</span><span class="atime">3 days ago</span></div></div>
                        </div>
                    </div>
                </div>`
  },
  {
    role: 'program_lead', file: 'information_product_review.html', title: 'Information Products',
    subtitle: 'Review and approve information products and publications',
    activeNav: 'information_product_review.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">auto_stories</span></div><div class="kpi-data"><span class="kpi-label">Products Generated</span><span class="kpi-val">34</span><span class="kpi-trend up"><span class="material-icons">arrow_upward</span> 8 this quarter</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">pending_actions</span></div><div class="kpi-data"><span class="kpi-label">Pending Review</span><span class="kpi-val">4</span></div></div>
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">published_with_changes</span></div><div class="kpi-data"><span class="kpi-label">Published</span><span class="kpi-val">28</span></div></div>
                </div>
                <div class="card">
                    <div class="card-head"><h3>Information Products Pipeline</h3><button class="btn-sm primary"><span class="material-icons">add</span> New Product</button></div>
                    <div class="tbl-responsive"><table class="dt">
                        <thead><tr><th>Product Name</th><th>Type</th><th>Author</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            <tr><td><strong>Q2 HMIS Bulletin</strong></td><td><span class="badge-s info">Bulletin</span></td><td>Sorie I. Kamara</td><td><span class="badge-s warning">In Review</span></td><td><button class="btn-sm primary"><span class="material-icons">visibility</span> Review</button></td></tr>
                            <tr><td><strong>Malaria Surveillance Report</strong></td><td><span class="badge-s purple">Report</span></td><td>Daniel G. Kay Jah</td><td><span class="badge-s warning">In Review</span></td><td><button class="btn-sm primary"><span class="material-icons">visibility</span> Review</button></td></tr>
                            <tr><td><strong>Maternal Health Infographic</strong></td><td><span class="badge-s success">Infographic</span></td><td>Daniel G. Kay Jah</td><td><span class="badge-s success">Published</span></td><td><button class="btn-sm"><span class="material-icons">download</span></button></td></tr>
                            <tr><td><strong>District Scorecard — Q2</strong></td><td><span class="badge-s info">Scorecard</span></td><td>Sorie I. Kamara</td><td><span class="badge-s success">Published</span></td><td><button class="btn-sm"><span class="material-icons">download</span></button></td></tr>
                        </tbody>
                    </table></div>
                </div>`
  },
  {
    role: 'program_lead', file: 'infrastructure_management.html', title: 'Infrastructure Management (HOS)',
    subtitle: 'Monitor and manage Health Operations Server infrastructure',
    activeNav: 'infrastructure_management.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">dns</span></div><div class="kpi-data"><span class="kpi-label">HOS Uptime</span><span class="kpi-val">99.9%</span></div></div>
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">storage</span></div><div class="kpi-data"><span class="kpi-label">Storage Used</span><span class="kpi-val">68%</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">memory</span></div><div class="kpi-data"><span class="kpi-label">CPU Load</span><span class="kpi-val">42%</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">speed</span></div><div class="kpi-data"><span class="kpi-label">Response Time</span><span class="kpi-val">180ms</span></div></div>
                </div>
                <div class="grid-2">
                    <div class="card"><div class="card-head"><h3>Server Health Overview</h3></div><div class="chart-wrap"><canvas id="serverChart"></canvas></div></div>
                    <div class="card"><div class="card-head"><h3>Resource Allocation</h3></div>
                        <div class="qa-list">
                            <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:4px;font-weight:600"><span>CPU Usage</span><span>42%</span></div><div class="prog-wrap"><div class="prog-fill blue" style="width:42%"></div></div></div>
                            <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:4px;font-weight:600"><span>Memory (RAM)</span><span>74%</span></div><div class="prog-wrap"><div class="prog-fill orange" style="width:74%"></div></div></div>
                            <div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:4px;font-weight:600"><span>Disk Storage</span><span>68%</span></div><div class="prog-wrap"><div class="prog-fill purple" style="width:68%"></div></div></div>
                            <div><div style="display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:4px;font-weight:600"><span>Network I/O</span><span>35%</span></div><div class="prog-wrap"><div class="prog-fill green" style="width:35%"></div></div></div>
                        </div>
                    </div>
                </div>`,
    chart: `const ctx=document.getElementById('serverChart');if(ctx){new Chart(ctx,{type:'line',data:{labels:['00:00','04:00','08:00','12:00','16:00','20:00'],datasets:[{label:'CPU %',data:[15,12,35,48,42,28],borderColor:'#0B5ED7',tension:0.4},{label:'Memory %',data:[65,64,70,78,74,68],borderColor:'#f59e0b',tension:0.4}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{min:0,max:100}}}});}`
  },

  // === ENGINEER ===
  {
    role: 'engineer', file: 'Data_Visualization.html', title: 'Dashboard Development & Data Visualization',
    subtitle: 'Manage dashboards and visualization components',
    activeNav: 'Data_Visualization.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">insert_chart</span></div><div class="kpi-data"><span class="kpi-label">Active Dashboards</span><span class="kpi-val">42</span></div></div>
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">widgets</span></div><div class="kpi-data"><span class="kpi-label">Chart Components</span><span class="kpi-val">186</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">build</span></div><div class="kpi-data"><span class="kpi-label">In Development</span><span class="kpi-val">5</span></div></div>
                </div>
                <div class="card">
                    <div class="card-head"><h3>Dashboard Registry</h3><button class="btn-sm primary"><span class="material-icons">add</span> New Dashboard</button></div>
                    <div class="tbl-responsive"><table class="dt">
                        <thead><tr><th>Dashboard Name</th><th>Owner</th><th>Charts</th><th>Last Updated</th><th>Status</th></tr></thead>
                        <tbody>
                            <tr><td><strong>National HMIS Overview</strong></td><td>Director</td><td>12</td><td>Today</td><td><span class="badge-s success">Live</span></td></tr>
                            <tr><td><strong>Maternal Health Tracker</strong></td><td>Programme Lead</td><td>8</td><td>Jul 18</td><td><span class="badge-s success">Live</span></td></tr>
                            <tr><td><strong>Malaria Surveillance</strong></td><td>Analyst Team</td><td>15</td><td>Jul 15</td><td><span class="badge-s success">Live</span></td></tr>
                            <tr><td><strong>District Performance Scorecard</strong></td><td>Coordinator</td><td>6</td><td>In Progress</td><td><span class="badge-s warning">Development</span></td></tr>
                            <tr><td><strong>Supply Chain Monitor</strong></td><td>Ops Manager</td><td>—</td><td>Planned</td><td><span class="badge-s purple">Design</span></td></tr>
                        </tbody>
                    </table></div>
                </div>`
  },
  {
    role: 'engineer', file: 'Data_security.html', title: 'Data Security & Access Control',
    subtitle: 'Manage encryption, access policies, and security configurations',
    activeNav: 'Data_security.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">lock</span></div><div class="kpi-data"><span class="kpi-label">Encryption</span><span class="kpi-val">AES-256</span></div></div>
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">vpn_key</span></div><div class="kpi-data"><span class="kpi-label">Active API Keys</span><span class="kpi-val">18</span></div></div>
                    <div class="kpi"><div class="kpi-bar red"></div><div class="kpi-icon red"><span class="material-icons">gpp_bad</span></div><div class="kpi-data"><span class="kpi-label">Failed Auth (24h)</span><span class="kpi-val">23</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">admin_panel_settings</span></div><div class="kpi-data"><span class="kpi-label">User Roles</span><span class="kpi-val">6</span></div></div>
                </div>
                <div class="grid-2">
                    <div class="card"><div class="card-head"><h3>Security Audit Log</h3><button class="btn-sm"><span class="material-icons">download</span> Export</button></div>
                        <div class="console">
                            <div class="dim">[2026-07-21 14:30:12]</div><div class="ok">✓ SSL certificate renewed — valid until 2027-07-21</div>
                            <div class="dim">[2026-07-21 13:15:00]</div><div class="warn">⚠ 5 failed login attempts from IP 196.45.xxx.xx — rate limited</div>
                            <div class="dim">[2026-07-21 12:00:00]</div><div class="ok">✓ Database backup encrypted and stored — SHA-256 verified</div>
                            <div class="dim">[2026-07-21 10:45:22]</div><div class="ok">✓ API key rotated for DHIS2 integration</div>
                            <div class="dim">[2026-07-20 23:00:00]</div><div class="err">✗ Unauthorized access attempt on /admin/users — blocked by firewall</div>
                        </div>
                    </div>
                    <div class="card"><div class="card-head"><h3>Access Control Matrix</h3></div>
                        <div class="tbl-responsive"><table class="dt">
                            <thead><tr><th>Role</th><th>Read</th><th>Write</th><th>Delete</th><th>Admin</th></tr></thead>
                            <tbody>
                                <tr><td><strong>Director</strong></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s danger">✗</span></td><td><span class="badge-s danger">✗</span></td></tr>
                                <tr><td><strong>Programme Lead</strong></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s danger">✗</span></td><td><span class="badge-s danger">✗</span></td></tr>
                                <tr><td><strong>Data Engineer</strong></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td></tr>
                                <tr><td><strong>Data Analyst</strong></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s danger">✗</span></td><td><span class="badge-s danger">✗</span></td></tr>
                                <tr><td><strong>Operations Mgr</strong></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td><td><span class="badge-s success">✓</span></td></tr>
                            </tbody>
                        </table></div>
                    </div>
                </div>`
  },
  {
    role: 'engineer', file: 'EMR.html', title: 'EMR Design & Development',
    subtitle: 'Electronic Medical Records system design and deployment tracking',
    activeNav: 'EMR.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">medical_information</span></div><div class="kpi-data"><span class="kpi-label">EMR Version</span><span class="kpi-val">v3.2.1</span></div></div>
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">local_hospital</span></div><div class="kpi-data"><span class="kpi-label">Facilities Deployed</span><span class="kpi-val">84</span><span class="kpi-trend up"><span class="material-icons">arrow_upward</span> 12 this quarter</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">bug_report</span></div><div class="kpi-data"><span class="kpi-label">Open Bugs</span><span class="kpi-val">7</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">update</span></div><div class="kpi-data"><span class="kpi-label">Next Release</span><span class="kpi-val">Aug 5</span></div></div>
                </div>
                <div class="grid-2">
                    <div class="card"><div class="card-head"><h3>Development Roadmap</h3></div>
                        <div class="tbl-responsive"><table class="dt">
                            <thead><tr><th>Feature</th><th>Sprint</th><th>Progress</th><th>Status</th></tr></thead>
                            <tbody>
                                <tr><td><strong>Patient Registration Module</strong></td><td>Sprint 14</td><td><div style="display:flex;align-items:center;gap:6px"><div class="prog-wrap" style="width:80px"><div class="prog-fill green" style="width:100%"></div></div><span style="font-size:.7rem;font-weight:600">Done</span></div></td><td><span class="badge-s success">Released</span></td></tr>
                                <tr><td><strong>Lab Results Integration</strong></td><td>Sprint 15</td><td><div style="display:flex;align-items:center;gap:6px"><div class="prog-wrap" style="width:80px"><div class="prog-fill blue" style="width:70%"></div></div><span style="font-size:.7rem;font-weight:600">70%</span></div></td><td><span class="badge-s info">In Progress</span></td></tr>
                                <tr><td><strong>Offline Mode Support</strong></td><td>Sprint 16</td><td><div style="display:flex;align-items:center;gap:6px"><div class="prog-wrap" style="width:80px"><div class="prog-fill orange" style="width:25%"></div></div><span style="font-size:.7rem;font-weight:600">25%</span></div></td><td><span class="badge-s warning">Design</span></td></tr>
                                <tr><td><strong>Pharmacy Module</strong></td><td>Sprint 17</td><td><div style="display:flex;align-items:center;gap:6px"><div class="prog-wrap" style="width:80px"><div class="prog-fill purple" style="width:0%"></div></div><span style="font-size:.7rem;font-weight:600">0%</span></div></td><td><span class="badge-s purple">Planned</span></td></tr>
                            </tbody>
                        </table></div>
                    </div>
                    <div class="card"><div class="card-head"><h3>Deployment Map</h3></div>
                        <div class="activity-list">
                            <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Connaught Hospital — v3.2.1</strong><span>Deployed Jul 15 · All modules active</span></div></div>
                            <div class="activity-item"><div class="activity-dot green"></div><div class="activity-text"><strong>Princess Christian Maternity — v3.2.0</strong><span>Deployed Jul 8 · Update pending</span></div></div>
                            <div class="activity-item"><div class="activity-dot orange"></div><div class="activity-text"><strong>Bo Government Hospital — v3.1.4</strong><span>Deployed May 22 · Connectivity issues</span></div></div>
                            <div class="activity-item"><div class="activity-dot blue"></div><div class="activity-text"><strong>Kenema Government Hospital</strong><span>Scheduled for deployment — Aug 1</span></div></div>
                        </div>
                    </div>
                </div>`
  },
  {
    role: 'engineer', file: 'HOS.html', title: 'Infrastructure Management (HOS)',
    subtitle: 'Health Operations Server monitoring and administration',
    activeNav: 'HOS.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">cloud_done</span></div><div class="kpi-data"><span class="kpi-label">HOS Status</span><span class="kpi-val">Online</span></div></div>
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">timer</span></div><div class="kpi-data"><span class="kpi-label">Uptime</span><span class="kpi-val">99.97%</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">speed</span></div><div class="kpi-data"><span class="kpi-label">Avg Latency</span><span class="kpi-val">145ms</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">storage</span></div><div class="kpi-data"><span class="kpi-label">Disk Usage</span><span class="kpi-val">2.4 TB</span></div></div>
                </div>
                <div class="grid-2">
                    <div class="card"><div class="card-head"><h3>Server Performance (24h)</h3></div><div class="chart-wrap"><canvas id="hosChart"></canvas></div></div>
                    <div class="card"><div class="card-head"><h3>Service Status</h3></div>
                        <div class="status-grid" style="grid-template-columns:1fr">
                            <div class="status-item"><div class="si-info"><span class="si-name">DHIS2 Instance</span><span class="si-desc">Port 8080 · 2.4s response</span></div><span class="badge-s success">Running</span></div>
                            <div class="status-item"><div class="si-info"><span class="si-name">PostgreSQL 15</span><span class="si-desc">Port 5432 · 142 connections</span></div><span class="badge-s success">Running</span></div>
                            <div class="status-item"><div class="si-info"><span class="si-name">Redis Cache</span><span class="si-desc">Port 6379 · 89% hit rate</span></div><span class="badge-s success">Running</span></div>
                            <div class="status-item"><div class="si-info"><span class="si-name">Nginx Proxy</span><span class="si-desc">Port 443 · SSL Active</span></div><span class="badge-s success">Running</span></div>
                            <div class="status-item"><div class="si-info"><span class="si-name">ETL Scheduler (Cron)</span><span class="si-desc">12 jobs · Next run 15:00</span></div><span class="badge-s info">Idle</span></div>
                        </div>
                    </div>
                </div>`,
    chart: `const ctx=document.getElementById('hosChart');if(ctx){new Chart(ctx,{type:'line',data:{labels:['00:00','04:00','08:00','12:00','16:00','20:00'],datasets:[{label:'CPU %',data:[18,15,45,52,40,22],borderColor:'#0B5ED7',tension:0.4,fill:false},{label:'RAM %',data:[60,58,72,80,75,65],borderColor:'#8b5cf6',tension:0.4}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{min:0,max:100}}}});}`
  },

  // === ANALYST ===
  {
    role: 'analyst', file: 'data_validation.html', title: 'Data Validation',
    subtitle: 'Review data quality checks and validation results',
    activeNav: 'data_validation.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">check_circle</span></div><div class="kpi-data"><span class="kpi-label">Validation Score</span><span class="kpi-val">91%</span><span class="kpi-trend up"><span class="material-icons">arrow_upward</span> 3% improved</span></div></div>
                    <div class="kpi"><div class="kpi-bar red"></div><div class="kpi-icon red"><span class="material-icons">error_outline</span></div><div class="kpi-data"><span class="kpi-label">Errors Found</span><span class="kpi-val">234</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">warning</span></div><div class="kpi-data"><span class="kpi-label">Warnings</span><span class="kpi-val">89</span></div></div>
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">dataset</span></div><div class="kpi-data"><span class="kpi-label">Records Checked</span><span class="kpi-val">145K</span></div></div>
                </div>
                <div class="card">
                    <div class="card-head"><h3>Validation Results — Latest Run</h3><div style="display:flex;gap:6px"><button class="btn-sm primary"><span class="material-icons">play_arrow</span> Re-run</button><button class="btn-sm"><span class="material-icons">download</span> Export</button></div></div>
                    <div class="tbl-responsive"><table class="dt">
                        <thead><tr><th>Dataset</th><th>Records</th><th>Passed</th><th>Errors</th><th>Score</th><th>Status</th></tr></thead>
                        <tbody>
                            <tr><td><strong>HMIS Monthly Summary</strong></td><td>45,200</td><td>44,120</td><td>1,080</td><td>97.6%</td><td><span class="badge-s success">Clean</span></td></tr>
                            <tr><td><strong>Maternal Health Records</strong></td><td>12,400</td><td>11,850</td><td>550</td><td>95.6%</td><td><span class="badge-s success">Clean</span></td></tr>
                            <tr><td><strong>Facility Registry</strong></td><td>1,248</td><td>1,200</td><td>48</td><td>96.2%</td><td><span class="badge-s success">Clean</span></td></tr>
                            <tr><td><strong>Lab Test Results</strong></td><td>28,600</td><td>25,400</td><td>3,200</td><td>88.8%</td><td><span class="badge-s warning">Needs Review</span></td></tr>
                            <tr><td><strong>Supply Chain Data</strong></td><td>8,900</td><td>7,200</td><td>1,700</td><td>80.9%</td><td><span class="badge-s danger">Critical</span></td></tr>
                        </tbody>
                    </table></div>
                </div>
                <div class="grid-2">
                    <div class="card"><div class="card-head"><h3>Error Type Breakdown</h3></div><div class="chart-wrap"><canvas id="validationChart"></canvas></div></div>
                    <div class="card"><div class="card-head"><h3>Common Validation Errors</h3></div>
                        <div class="activity-list">
                            <div class="activity-item"><div class="activity-dot red"></div><div class="activity-text"><strong>Missing date_of_birth (1,420 records)</strong><span>Lab Results & Supply Chain datasets</span></div></div>
                            <div class="activity-item"><div class="activity-dot orange"></div><div class="activity-text"><strong>Duplicate patient_id (890 records)</strong><span>Maternal Health Records — Bo & Kenema districts</span></div></div>
                            <div class="activity-item"><div class="activity-dot orange"></div><div class="activity-text"><strong>Out of range values (650 records)</strong><span>Temperature readings > 42°C flagged in Lab Results</span></div></div>
                        </div>
                    </div>
                </div>`,
    chart: `const ctx=document.getElementById('validationChart');if(ctx){new Chart(ctx,{type:'doughnut',data:{labels:['Missing Values','Duplicates','Out of Range','Format Errors','Referential'],datasets:[{data:[1420,890,650,180,60],backgroundColor:['#ef4444','#f59e0b','#8b5cf6','#0B5ED7','#06b6d4'],borderWidth:0,spacing:3,borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,cutout:'60%',plugins:{legend:{position:'bottom'}}}});}`
  },
  {
    role: 'analyst', file: 'facility.html', title: 'Facility Performance',
    subtitle: 'Analyze health facility performance metrics and trends',
    activeNav: 'facility.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">local_hospital</span></div><div class="kpi-data"><span class="kpi-label">Total Facilities</span><span class="kpi-val">1,248</span></div></div>
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">trending_up</span></div><div class="kpi-data"><span class="kpi-label">Avg Performance</span><span class="kpi-val">87%</span><span class="kpi-trend up"><span class="material-icons">arrow_upward</span> 5% vs last quarter</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">warning</span></div><div class="kpi-data"><span class="kpi-label">Below Threshold</span><span class="kpi-val">48</span></div></div>
                    <div class="kpi"><div class="kpi-bar purple"></div><div class="kpi-icon purple"><span class="material-icons">stars</span></div><div class="kpi-data"><span class="kpi-label">Top Performers</span><span class="kpi-val">156</span></div></div>
                </div>
                <div class="card">
                    <div class="card-head"><h3>Facility Performance Ranking</h3><div style="display:flex;gap:6px"><button class="btn-sm"><span class="material-icons">filter_list</span> Filter</button><button class="btn-sm"><span class="material-icons">download</span> Export</button></div></div>
                    <div class="tbl-responsive"><table class="dt">
                        <thead><tr><th>Facility Name</th><th>District</th><th>Type</th><th>Reporting Rate</th><th>Data Quality</th><th>Overall Score</th></tr></thead>
                        <tbody>
                            <tr><td><strong>Connaught Hospital</strong></td><td>Western Urban</td><td>Tertiary</td><td>100%</td><td>96%</td><td><span class="badge-s success">98%</span></td></tr>
                            <tr><td><strong>PCMH</strong></td><td>Western Urban</td><td>Tertiary</td><td>100%</td><td>94%</td><td><span class="badge-s success">97%</span></td></tr>
                            <tr><td><strong>Bo Government Hospital</strong></td><td>Bo</td><td>Secondary</td><td>95%</td><td>91%</td><td><span class="badge-s success">93%</span></td></tr>
                            <tr><td><strong>Kenema Gov. Hospital</strong></td><td>Kenema</td><td>Secondary</td><td>88%</td><td>85%</td><td><span class="badge-s warning">87%</span></td></tr>
                            <tr><td><strong>Makeni Regional</strong></td><td>Bombali</td><td>Secondary</td><td>82%</td><td>79%</td><td><span class="badge-s warning">81%</span></td></tr>
                            <tr><td><strong>Kabala CHC</strong></td><td>Koinadugu</td><td>Primary</td><td>65%</td><td>58%</td><td><span class="badge-s danger">62%</span></td></tr>
                        </tbody>
                    </table></div>
                </div>
                <div class="card"><div class="card-head"><h3>Performance Trend by District</h3></div><div class="chart-wrap"><canvas id="facilityTrendChart"></canvas></div></div>`,
    chart: `const ctx=document.getElementById('facilityTrendChart');if(ctx){new Chart(ctx,{type:'bar',data:{labels:['Western Urban','Bo','Kenema','Bombali','Port Loko','Kailahun'],datasets:[{label:'Reporting Rate',data:[98,94,88,90,86,72],backgroundColor:'#0B5ED7'},{label:'Data Quality',data:[96,91,85,82,80,65],backgroundColor:'#10b981'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true,max:100}}}});}`
  },

  // === OPERATIONS ===
  {
    role: 'operations', file: 'meetings.html', title: 'Meetings & Schedule',
    subtitle: 'Manage team meetings and standup schedules',
    activeNav: 'meetings.html',
    content: `
                <div class="kpi-grid">
                    <div class="kpi"><div class="kpi-bar blue"></div><div class="kpi-icon blue"><span class="material-icons">event</span></div><div class="kpi-data"><span class="kpi-label">This Week</span><span class="kpi-val">5</span></div></div>
                    <div class="kpi"><div class="kpi-bar green"></div><div class="kpi-icon green"><span class="material-icons">check_circle</span></div><div class="kpi-data"><span class="kpi-label">Attended</span><span class="kpi-val">38</span></div></div>
                    <div class="kpi"><div class="kpi-bar orange"></div><div class="kpi-icon orange"><span class="material-icons">schedule</span></div><div class="kpi-data"><span class="kpi-label">Next Meeting</span><span class="kpi-val">Today 2PM</span></div></div>
                </div>
                <div class="card">
                    <div class="card-head"><h3>Meeting Schedule</h3><button class="btn-sm primary"><span class="material-icons">add</span> Schedule Meeting</button></div>
                    <div class="tbl-responsive"><table class="dt">
                        <thead><tr><th>Meeting</th><th>Day/Date</th><th>Time</th><th>Lead</th><th>Status</th></tr></thead>
                        <tbody>
                            <tr><td><strong>Daily Ops Standup</strong></td><td>Mon–Fri</td><td>09:00 AM</td><td>Prince Mafinda</td><td><span class="badge-s info">Recurring</span></td></tr>
                            <tr><td><strong>Infrastructure Review</strong></td><td>Every Thursday</td><td>02:00 PM</td><td>Les Kimball Kamara</td><td><span class="badge-s info">Recurring</span></td></tr>
                            <tr><td><strong>Vendor Sync — SAND Tech</strong></td><td>Jul 25, 2026</td><td>11:00 AM</td><td>Prince Mafinda</td><td><span class="badge-s warning">Upcoming</span></td></tr>
                            <tr><td><strong>Security Audit Prep</strong></td><td>Aug 1, 2026</td><td>10:00 AM</td><td>Dr. J. Koroma</td><td><span class="badge-s purple">Scheduled</span></td></tr>
                        </tbody>
                    </table></div>
                </div>`
  },
  {
    role: 'program_lead', file: 'dashboard.html', title: 'redirect', subtitle: '', activeNav: '',
    content: '<script>window.location.href = "index.html";</script>'
  }
];

// Template generator
function generatePage(pg) {
  if (pg.title === 'redirect') {
    return `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=index.html"></head><body>${pg.content}</body></html>`;
  }
  
  const user = users[pg.role];
  const sidebar = sidebars[pg.role].replace(
    `href="${pg.activeNav}" class="nav-link"`,
    `href="${pg.activeNav}" class="nav-link active"`
  );

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
                        <div class="dropdown notif-dd" id="notifDropdown">
                            <div class="dd-head"><h4>Notifications</h4><button>Mark all read</button></div>
                            <div class="dd-body">
                                <div class="dd-item unread">
                                    <div class="ni-icon" style="background:var(--primary-light);color:var(--primary)"><span class="material-icons">info</span></div>
                                    <div class="ni-text"><span class="ni-title">System Update</span><span class="ni-desc">Dashboard refreshed with latest data</span><span class="ni-time">1 hour ago</span></div>
                                </div>
                            </div>
                            <div class="dd-foot"><a href="#">View All</a></div>
                        </div>
                    </div>
                    <div class="profile-wrap">
                        <div class="user-pill dropdown-toggle" data-target="profileDropdown">
                            <div class="avatar" style="background:${user.bg}">${user.initials}</div>
                            <div class="user-info"><div class="uname">${user.name}</div><div class="urole">${user.role}</div></div>
                            <span class="material-icons" style="font-size:1.2rem;color:var(--text-muted)">expand_more</span>
                        </div>
                        <div class="dropdown profile-dd" id="profileDropdown">
                            <div class="dd-item pd-item"><span class="material-icons">person</span> My Profile</div>
                            <a href="../../index.html" class="dd-item pd-item danger"><span class="material-icons">logout</span> Logout</a>
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
    ${pg.chart ? `<script>function renderDashboardCharts(){${pg.chart}}<\/script>` : ''}
</body>
</html>`;
}

// Generate all pages
let count = 0;
pages.forEach(pg => {
  const filePath = path.join(BASE, 'Dashboard', pg.role, pg.file);
  const html = generatePage(pg);
  fs.writeFileSync(filePath, html, 'utf8');
  count++;
  console.log(`✓ Created: Dashboard/${pg.role}/${pg.file}`);
});

console.log(`\n✅ Generated ${count} pages successfully.`);
