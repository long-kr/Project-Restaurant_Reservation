const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'test');
const files = fs.readdirSync(testDir).filter(file => file.endsWith('.test.js'));

files.forEach(file => {
  const filePath = path.join(testDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the knex.release() line
  content = content.replace(/\s*await knex\.release\(\);/, '');
  
  fs.writeFileSync(filePath, content);
});
