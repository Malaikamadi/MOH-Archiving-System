const fs = require('fs');
const path = require('path');

const roles = ['analyst', 'engineer', 'director'];
const dashboardDir = path.join(__dirname, 'Dashboard');

// Meeting UI snippet to inject
const meetingsUI = `
            <div class="main-content">
                <div class="card">
                    <div class="card-head">
                        <h3>Meeting Calendar</h3>
                        <div style="display:flex; gap:10px;">
                            <button class="btn-sm" onclick="document.getElementById('minutesModal').classList.add('show')">Add Minutes</button>
                            <button class="btn-sm primary" onclick="document.getElementById('scheduleMeetingModal').classList.add('show')"><span class="material-icons">event</span> Schedule Meeting</button>
                        </div>
                    </div>
                    
                    <div style="padding: 20px;">
                        <!-- Upcoming Meetings Container -->
                        <div id="upcomingMeetingsContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
                            <p style="color:var(--text-muted);">Loading upcoming meetings...</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Schedule Meeting Modal -->
    <div class="modal-bg" id="scheduleMeetingModal">
        <div class="modal-box">
            <div class="modal-top">
                <h4>Schedule a Meeting</h4>
                <button class="icon-btn" onclick="document.getElementById('scheduleMeetingModal').classList.remove('show')"><span class="material-icons">close</span></button>
            </div>
            <div class="modal-mid">
                <div class="fg">
                    <label>Meeting Title</label>
                    <input type="text" id="schedTitle" placeholder="e.g. Weekly Standup">
                </div>
                <div class="grid-2" style="gap: 10px;">
                    <div class="fg">
                        <label>Date</label>
                        <input type="date" id="schedDate">
                    </div>
                    <div class="fg">
                        <label>Time</label>
                        <input type="time" id="schedTime">
                    </div>
                </div>
                <div class="fg">
                    <label>Attendees (Roles)</label>
                    <select id="schedAttendees" multiple style="height:80px;">
                        <option value="Director">Director</option>
                        <option value="Coordinator">Coordinator</option>
                        <option value="Team Lead">Program Lead</option>
                        <option value="Operations Manager">Operations Manager</option>
                        <option value="Data Engineer">Data Engineer</option>
                        <option value="Data Analyst">Data Analyst</option>
                    </select>
                    <small style="color:var(--text-muted); font-size:0.75rem;">Hold Ctrl/Cmd to select multiple</small>
                </div>
                <div class="fg">
                    <label>Zoom Meeting Link</label>
                    <div style="display:flex; gap:8px;">
                        <input type="url" id="schedZoomLink" placeholder="https://zoom.us/j/..." style="flex:1;">
                        <button class="btn-sm" onclick="generateZoomLink()" type="button">Generate Zoom Link</button>
                    </div>
                </div>
            </div>
            <div class="modal-bot">
                <button class="btn-sm" onclick="document.getElementById('scheduleMeetingModal').classList.remove('show')">Cancel</button>
                <button class="btn-sm primary" onclick="scheduleMeeting()"><span class="material-icons">send</span> Schedule</button>
            </div>
        </div>
    </div>

    <!-- Stand-Up Meeting Minutes Template Modal -->
    <div class="modal-bg" id="minutesModal">
        <div class="modal-box" style="max-width:800px; padding:0">
            <div class="modal-top" style="background:#f8fafc; border-bottom:1px solid var(--border-color); padding: 15px 20px;">
                <h4 style="margin:0;">NHIH Stand UP Template</h4>
                <button class="icon-btn" onclick="document.getElementById('minutesModal').classList.remove('show')"><span class="material-icons">close</span></button>
            </div>
            <div class="modal-mid" style="padding: 20px; overflow-y:auto; max-height: 70vh;">
                <!-- Word Doc Header -->
                <div style="text-align:center; margin-bottom: 20px;">
                    <img src="../../Assets/mohs_logo-removebg-preview.png" alt="MoHS Logo" style="height: 80px; width: auto; margin-bottom: 10px;">
                    <h2 style="font-size:1.1rem; font-weight:800; letter-spacing:1px; margin:0; color:#1e293b;">NATIONAL HEALTH INFORMATION HUB</h2>
                </div>
                
                <!-- Fields Section -->
                <div style="display:grid; grid-template-columns:140px 1fr; gap: 10px; align-items:center; margin-bottom: 25px; font-size:0.85rem; color:var(--text-main);">
                    <div style="font-weight:700;">Date:</div>
                    <input type="date" id="minDate" style="border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-main); border-radius:4px; padding:4px 8px; width: 200px;">
                    
                    <div style="font-weight:700;">Time:</div>
                    <input type="time" id="minTime" style="border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-main); border-radius:4px; padding:4px 8px; width: 200px;">
                    
                    <div style="font-weight:700;">Venue:</div>
                    <input type="text" id="minVenue" style="border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-main); border-radius:4px; padding:4px 8px;" placeholder="e.g. Conference Room A">
                    
                    <div style="font-weight:700;">Chaired by:</div>
                    <input type="text" id="minChair" style="border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-main); border-radius:4px; padding:4px 8px;" placeholder="e.g. Director">
                    
                    <div style="font-weight:700;">Minutes Prepared by:</div>
                    <input type="text" id="minPreparedBy" style="border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-main); border-radius:4px; padding:4px 8px;" placeholder="e.g. Coordinator">
                    
                    <div style="font-weight:700; align-self:start; padding-top:6px;">Agenda Items:</div>
                    <textarea id="minAgenda" style="border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-main); border-radius:4px; padding:6px 8px; min-height:60px; font-family:inherit; resize:vertical;"></textarea>
                </div>
                
                <!-- Table Section -->
                <div class="tbl-responsive">
                    <table class="dt" style="border: 1px solid var(--border-color); width:100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background:#475569; color:white;">
                                <th style="border:1px solid var(--border-color); padding:8px; text-align:left;">Issues/ Agenda Items</th>
                                <th style="border:1px solid var(--border-color); padding:8px; text-align:left;">Discussion/Deliberation</th>
                                <th style="border:1px solid var(--border-color); padding:8px; text-align:left;">Action Points and due date</th>
                            </tr>
                        </thead>
                        <tbody id="minTableBody">
                            <tr style="background:var(--bg-card);"><td colspan="3" style="border:1px solid var(--border-color); padding:6px 8px; font-weight:700; color:var(--text-main);">Solution Manager</td></tr>
                            <tr>
                                <td style="border:1px solid var(--border-color); padding:4px;"><input type="text" class="min-input issue" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main);"></td>
                                <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input disc" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
                                <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input action" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
                            </tr>
                            <tr style="background:var(--bg-card);"><td colspan="3" style="border:1px solid var(--border-color); padding:6px 8px; font-weight:700; color:var(--text-main);">Data Engineers</td></tr>
                            <tr>
                                <td style="border:1px solid var(--border-color); padding:4px;"><input type="text" class="min-input issue" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main);"></td>
                                <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input disc" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
                                <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input action" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
                            </tr>
                            <!-- Generic Row -->
                            <tr>
                                <td style="border:1px solid var(--border-color); padding:4px;"><input type="text" class="min-input issue" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main);" placeholder="Other issues..."></td>
                                <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input disc" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
                                <td style="border:1px solid var(--border-color); padding:4px;"><textarea class="min-input action" style="width:100%; border:none; outline:none; background:transparent; color:var(--text-main); resize:vertical; min-height:40px; font-family:inherit;"></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="btn-sm" style="margin-top:10px; font-size:0.75rem;" onclick="addMinuteRow()"><span class="material-icons" style="font-size:1rem;">add</span> Add Row</button>
                </div>
            </div>
            <div class="modal-bot" style="background:#f8fafc; border-top:1px solid var(--border-color); padding: 15px 20px; display:flex; justify-content:flex-end; gap:8px;">
                <button class="btn-sm" onclick="document.getElementById('minutesModal').classList.remove('show')">Cancel</button>
                <button class="btn-sm"><span class="material-icons">download</span> Export Word/PDF</button>
                <button class="btn-sm primary" onclick="submitMinutes()"><span class="material-icons">cloud_upload</span> Save to System</button>
            </div>
        </div>
    </div>

    <script src="../../js/nhih-dashboard.js"></script>
</body>
</html>
`;

roles.forEach(role => {
    const indexPath = path.join(dashboardDir, role, 'index.html');
    const destPath = path.join(dashboardDir, role, 'meetings.html');

    if (!fs.existsSync(indexPath)) {
        console.error('File not found:', indexPath);
        return;
    }

    let html = fs.readFileSync(indexPath, 'utf-8');
    
    // Replace <div class="main-content"> ... </body> ... </html> with the meetingsUI
    const mainContentStart = html.indexOf('<div class="main-content">');
    if (mainContentStart === -1) {
        console.error('Could not find main-content in', role);
        return;
    }

    // Split html up to main-content
    let newHtml = html.substring(0, mainContentStart) + meetingsUI;

    // Fix active link in sidebar (remove active from Dashboard, add to Meeting Scheduler if exists)
    newHtml = newHtml.replace('<a href="index.html" class="nav-link active">', '<a href="index.html" class="nav-link">');
    
    // Change <h1 class="page-title">...</h1> to Meetings & Schedule
    newHtml = newHtml.replace(/<h1 class="page-title">.*?<\/h1>/, '<h1 class="page-title">Meetings & Schedule</h1>');

    fs.writeFileSync(destPath, newHtml, 'utf-8');
    console.log('Created:', destPath);
});
