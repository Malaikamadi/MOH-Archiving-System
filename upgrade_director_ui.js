const fs = require('fs');
const path = require('path');

const directorIndex = path.join(__dirname, 'Dashboard', 'director', 'index.html');
let html = fs.readFileSync(directorIndex, 'utf-8');

// The new premium CSS styles specific to the Director Dashboard
const premiumStyles = `
    <style>
        /* Premium Director Dashboard Styles */
        .director-hero {
            background: linear-gradient(135deg, var(--primary) 0%, #3b82f6 50%, #8b5cf6 100%);
            border-radius: var(--radius-xl);
            padding: 40px;
            color: white;
            margin-bottom: 30px;
            box-shadow: var(--shadow-lg);
            position: relative;
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .director-hero::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
            pointer-events: none;
        }
        .hero-text h2 { font-size: 2.2rem; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.5px; }
        .hero-text p { font-size: 1.1rem; opacity: 0.9; max-width: 600px; }
        
        .kpi-grid.premium {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .kpi.premium-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-xl);
            padding: 24px;
            transition: all var(--speed) ease;
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }
        .kpi.premium-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-xl);
            border-color: var(--primary);
        }
        .kpi.premium-card .kpi-icon {
            width: 50px; height: 50px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; margin-bottom: 16px;
        }
        .kpi-data.premium .kpi-val { font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin: 5px 0; }
        .kpi-data.premium .kpi-label { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: var(--text-muted); }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }
        body.dark-theme .glass-card {
            background: rgba(17, 24, 39, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .modern-table th { background: var(--bg-input) !important; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .modern-table td { font-size: 0.9rem; padding: 16px !important; }
        .modern-table tr:hover { background: var(--bg-input); }
    </style>
`;

const premiumMainContent = `
            <div class="main-content">
                <!-- Premium Hero Section -->
                <div class="director-hero">
                    <div class="hero-text">
                        <h2>Welcome back, Dr. Tom Sesay</h2>
                        <p>Here is your executive overview of the National Health Information Hub operations, strategic initiatives, and pending approvals.</p>
                    </div>
                    <div style="text-align: right; z-index: 1;">
                        <button class="btn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.4); backdrop-filter: blur(10px);"><span class="material-icons">download</span> Download Executive Brief</button>
                    </div>
                </div>

                <!-- Premium Executive KPI Row -->
                <div class="kpi-grid premium">
                    <div class="kpi premium-card">
                        <div class="kpi-icon blue" style="background: rgba(11, 94, 215, 0.1); color: #0B5ED7;"><span class="material-icons">folder_shared</span></div>
                        <div class="kpi-data premium">
                            <span class="kpi-label">Documents Archived</span>
                            <span class="kpi-val">12,450</span>
                            <span class="kpi-trend up"><span class="material-icons">arrow_upward</span> +320 this week</span>
                        </div>
                    </div>
                    <div class="kpi premium-card">
                        <div class="kpi-icon green" style="background: rgba(16, 185, 129, 0.1); color: #10b981;"><span class="material-icons">account_tree</span></div>
                        <div class="kpi-data premium">
                            <span class="kpi-label">Active Projects</span>
                            <span class="kpi-val">8</span>
                            <span class="kpi-trend up"><span class="material-icons">check_circle</span> 2 ahead of schedule</span>
                        </div>
                    </div>
                    <div class="kpi premium-card">
                        <div class="kpi-icon orange" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;"><span class="material-icons">data_usage</span></div>
                        <div class="kpi-data premium">
                            <span class="kpi-label">Data Ingested (30d)</span>
                            <span class="kpi-val">4.2 TB</span>
                            <span class="kpi-trend up"><span class="material-icons">arrow_upward</span> +15% volume</span>
                        </div>
                    </div>
                    <div class="kpi premium-card">
                        <div class="kpi-icon purple" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;"><span class="material-icons">groups</span></div>
                        <div class="kpi-data premium">
                            <span class="kpi-label">Hub Staff Efficiency</span>
                            <span class="kpi-val">94%</span>
                            <span class="kpi-trend up"><span class="material-icons">trending_up</span> SLA adherence</span>
                        </div>
                    </div>
                </div>

                <!-- Row 1: Document Growth & Pending Approvals -->
                <div class="grid-2">
                    <div class="card glass-card">
                        <div class="card-head">
                            <h3>Document Archival Growth (YTD)</h3>
                        </div>
                        <div class="chart-wrap" style="height:300px;">
                            <canvas id="docChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="card glass-card">
                        <div class="card-head">
                            <h3>Pending Approvals</h3>
                            <span class="badge-s danger" style="font-size:.6rem">4 Pending</span>
                        </div>
                        <div class="activity-list" style="max-height: 300px; overflow-y: auto; padding-right: 10px;">
                            <div class="activity-item" style="background: var(--bg-input); padding: 15px; border-radius: 12px; margin-bottom: 10px;">
                                <div class="activity-dot orange"></div>
                                <div class="activity-text">
                                    <strong>Data Request: WHO Census</strong>
                                    <span style="display:block; margin: 4px 0;">From: Data Analysis Team</span>
                                    <span class="atime">Submitted 2 hours ago</span>
                                    <div style="margin-top:12px; display:flex; gap:8px">
                                        <button class="btn-sm primary" onclick="showToast('Request approved!', 'success')">Approve</button>
                                        <button class="btn-sm" onclick="showToast('Request rejected', 'error')">Reject</button>
                                    </div>
                                </div>
                            </div>
                            <div class="activity-item" style="background: var(--bg-input); padding: 15px; border-radius: 12px;">
                                <div class="activity-dot orange"></div>
                                <div class="activity-text">
                                    <strong>Project: Rural Clinic Digitization</strong>
                                    <span style="display:block; margin: 4px 0;">Timeline: 18 months</span>
                                    <span class="atime">Submitted yesterday</span>
                                    <div style="margin-top:12px; display:flex; gap:8px">
                                        <button class="btn-sm primary" onclick="document.getElementById('approveModal').classList.add('show')">Review</button>
                                        <button class="btn-sm" onclick="showToast('Request rejected', 'error')">Reject</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Row 2: Hub Work Progress -->
                <div class="card glass-card" style="margin-top: 30px;">
                    <div class="card-head">
                        <h3>Hub Work Progress (Active Projects)</h3>
                        <button class="btn-sm"><span class="material-icons">open_in_new</span> Full Report</button>
                    </div>
                    <div class="tbl-responsive">
                        <table class="dt modern-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align:left; padding: 12px;">Project</th>
                                    <th style="text-align:left; padding: 12px;">Lead</th>
                                    <th style="text-align:left; padding: 12px;">Deadline</th>
                                    <th style="text-align:left; padding: 12px;">Progress</th>
                                    <th style="text-align:left; padding: 12px;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>DHIS2 Data Migration</strong></td>
                                    <td>Sarah Kamara</td>
                                    <td>Oct 30, 2026</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px">
                                            <div class="prog-wrap" style="width:100px; height: 8px;">
                                                <div class="prog-fill blue" style="width:75%"></div>
                                            </div>
                                            <span style="font-size:.75rem;font-weight:700">75%</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-s info">On Track</span></td>
                                </tr>
                                <tr style="border-top: 1px solid var(--border-color);">
                                    <td><strong>Hospital API Integration</strong></td>
                                    <td>Data Eng Team</td>
                                    <td>Nov 15, 2026</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px">
                                            <div class="prog-wrap" style="width:100px; height: 8px;">
                                                <div class="prog-fill green" style="width:40%"></div>
                                            </div>
                                            <span style="font-size:.75rem;font-weight:700">40%</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-s warning">Delayed</span></td>
                                </tr>
                                <tr style="border-top: 1px solid var(--border-color);">
                                    <td><strong>Legacy Archive Digitization</strong></td>
                                    <td>Operations Dept</td>
                                    <td>Oct 20, 2026</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px">
                                            <div class="prog-wrap" style="width:100px; height: 8px;">
                                                <div class="prog-fill orange" style="width:92%"></div>
                                            </div>
                                            <span style="font-size:.75rem;font-weight:700">92%</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-s success">Near Completion</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Row 3: Health Indicators -->
                <div class="card glass-card" style="margin-top: 30px; margin-bottom: 30px;">
                    <div class="card-head">
                        <h3>National Health Indicator Progress (Q2 2026)</h3>
                        <button class="btn-sm"><span class="material-icons">filter_list</span> Filter</button>
                    </div>
                    <div class="tbl-responsive">
                        <table class="dt modern-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="text-align:left; padding: 12px;">Indicator</th>
                                    <th style="text-align:left; padding: 12px;">Target (2026)</th>
                                    <th style="text-align:left; padding: 12px;">Current</th>
                                    <th style="text-align:left; padding: 12px;">Progress</th>
                                    <th style="text-align:left; padding: 12px;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Skilled Birth Attendance</strong></td>
                                    <td>90%</td>
                                    <td>85%</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px">
                                            <div class="prog-wrap" style="width:100px; height: 8px;">
                                                <div class="prog-fill blue" style="width:94%"></div>
                                            </div>
                                            <span style="font-size:.75rem;font-weight:700">94%</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-s warning">On Track</span></td>
                                </tr>
                                <tr style="border-top: 1px solid var(--border-color);">
                                    <td><strong>Infant Immunization Rate</strong></td>
                                    <td>95%</td>
                                    <td>96%</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px">
                                            <div class="prog-wrap" style="width:100px; height: 8px;">
                                                <div class="prog-fill green" style="width:100%"></div>
                                            </div>
                                            <span style="font-size:.75rem;font-weight:700">101%</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-s success">Achieved</span></td>
                                </tr>
                                <tr style="border-top: 1px solid var(--border-color);">
                                    <td><strong>Malaria Incidence (under 5)</strong></td>
                                    <td>&lt; 10%</td>
                                    <td>14%</td>
                                    <td>
                                        <div style="display:flex;align-items:center;gap:6px">
                                            <div class="prog-wrap" style="width:100px; height: 8px;">
                                                <div class="prog-fill red" style="width:60%"></div>
                                            </div>
                                            <span style="font-size:.75rem;font-weight:700">60%</span>
                                        </div>
                                    </td>
                                    <td><span class="badge-s danger">Needs Attention</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>`;

// Insert the premium styles before </head>
if (!html.includes('<!-- Premium Director Dashboard Styles -->')) {
    html = html.replace('</head>', premiumStyles + '\n</head>');
}

// Replace everything inside <div class="main-content"> ... </div> with the new premiumMainContent
const startContent = html.indexOf('<div class="main-content">');
const endContent = html.indexOf('</main>'); // We stop at </main> since <div class="main-content"> closes just before it usually.
// Wait, looking at the structure, the <main class="main-wrap"> contains <header> and <div class="main-content">.
// Then main-content closes, then </main>.
// So the end of main content is exactly before </main>.

if (startContent !== -1 && endContent !== -1) {
    const beforeContent = html.substring(0, startContent);
    const afterContent = html.substring(endContent); // starting at </main>
    html = beforeContent + premiumMainContent + '\n        ' + afterContent;
}

// Also remove the budgetChart javascript logic if it exists since it's removed from UI.
const scriptRegex = /\/\/ Budget Allocation Doughnut[\s\S]*?\}\);[\s\S]*?\}/;
if (scriptRegex.test(html)) {
    html = html.replace(scriptRegex, '}');
}

fs.writeFileSync(directorIndex, html, 'utf-8');
console.log('Successfully upgraded Director dashboard view UI');
