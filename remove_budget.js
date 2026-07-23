const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'Dashboard', 'director');
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

files.forEach(f => {
    const filePath = path.join(dirPath, f);
    let html = fs.readFileSync(filePath, 'utf-8');

    // Remove the budget overview link
    // The link looks like:
    // <a href="budget.html" class="nav-link">
    //     <span class="material-icons">...</span>
    //     <span>Budget Overview</span>
    // </a>
    // We can use a regex to remove the anchor tag that has href="budget.html"
    const regex = /<a href="budget\.html"[\s\S]*?<\/a>/g;
    if (regex.test(html)) {
        html = html.replace(regex, '');
        fs.writeFileSync(filePath, html, 'utf-8');
        console.log(`Removed budget link from ${f}`);
    }
});
