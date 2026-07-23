const fs = require('fs');
const path = require('path');

const roles = ['analyst', 'engineer', 'director'];
const dashboardDir = path.join(__dirname, 'Dashboard');

const meetingLink = `
                <a href="meetings.html" class="nav-link">
                    <span class="material-icons">event</span>
                    <span>Meetings</span>
                </a>`;

roles.forEach(role => {
    // We update index.html and meetings.html
    const filesToUpdate = ['index.html', 'meetings.html'];
    
    filesToUpdate.forEach(file => {
        const filePath = path.join(dashboardDir, role, file);
        if (fs.existsSync(filePath)) {
            let html = fs.readFileSync(filePath, 'utf-8');
            
            // Check if meetings link already exists
            if (!html.includes('href="meetings.html"')) {
                // Find a good place to inject. Usually after the Dashboard link.
                const dashboardLinkStr = '<span>Dashboard</span>\n                </a>';
                const dashboardLinkStr2 = '<span>Dashboard</span>\\s*</a>';
                
                let replaced = false;
                if (html.includes(dashboardLinkStr)) {
                    html = html.replace(dashboardLinkStr, dashboardLinkStr + '\n' + meetingLink);
                    replaced = true;
                } else {
                    const regex = new RegExp('<span>Dashboard</span>\\s*</a>');
                    if (regex.test(html)) {
                        html = html.replace(regex, match => match + '\n' + meetingLink);
                        replaced = true;
                    } else {
                        const sectionStr = '<div class="sidebar-section">Main Menu</div>';
                        if (html.includes(sectionStr)) {
                            html = html.replace(sectionStr, sectionStr + '\n' + meetingLink);
                            replaced = true;
                        }
                    }
                }
                
                if (replaced) {
                    // Make sure in meetings.html, the meetings link is active.
                    if (file === 'meetings.html') {
                        html = html.replace('<a href="meetings.html" class="nav-link">', '<a href="meetings.html" class="nav-link active">');
                        html = html.replace('<a href="index.html" class="nav-link active">', '<a href="index.html" class="nav-link">');
                    }
                    
                    fs.writeFileSync(filePath, html, 'utf-8');
                    console.log(`Updated ${filePath}`);
                } else {
                    console.error(`Could not inject into ${filePath}`);
                }
            }
        }
    });
});
