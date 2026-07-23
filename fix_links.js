const fs = require('fs');
const path = require('path');

const dir = '/Users/malaikamadi/MOH-ARCHIVING-SYSTEM/Dashboard/program_lead';

const replacements = [
    {
        from: '../analyst/data_validation.html',
        to: 'data_validation.html'
    },
    {
        from: '../engineer/Data_Visualization.html',
        to: 'Data_Visualization.html'
    }
];

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        replacements.forEach(r => {
            if (content.includes(r.from)) {
                content = content.split(r.from).join(r.to);
                modified = true;
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed', file);
        }
    }
});
