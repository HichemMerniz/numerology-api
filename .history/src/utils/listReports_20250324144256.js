const fs = require('fs');
const path = require('path');

// Path to the reports directory
const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');

// Check if directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  console.error(`Reports directory does not exist: ${REPORTS_DIR}`);
  process.exit(1);
}

// List all PDF files
const files = fs.readdirSync(REPORTS_DIR);
const pdfFiles = files.filter(file => file.endsWith('.pdf'));

console.log('\nAvailable PDF Reports:');
console.log('====================\n');

if (pdfFiles.length === 0) {
  console.log('No PDF reports found.');
} else {
  pdfFiles.forEach((file, index) => {
    const filePath = path.join(REPORTS_DIR, file);
    const stats = fs.statSync(filePath);
    const fileSizeKB = Math.round(stats.size / 1024);
    const createdAt = stats.birthtime.toLocaleString();
    const fileId = file.replace('.pdf', '');
    
    console.log(`${index + 1}. ${file}`);
    console.log(`   Size: ${fileSizeKB} KB`);
    console.log(`   Created: ${createdAt}`);
    console.log(`   View URL: http://localhost:3000/api/reports/${fileId}`);
    console.log(`   Download URL: http://localhost:3000/api/pdf/download/${fileId}`);
    console.log();
  });
} 