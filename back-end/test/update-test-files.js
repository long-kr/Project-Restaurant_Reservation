const fs = require('fs');
const path = require('path');

const testFiles = [
  'us-02-create-reservations-future-date.test.js',
  'us-03-create-reservations-eligible-timeframe.test.js',
  'us-04-seat-reservation.test.js',
  'us-05-finish-occupied-table.test.js',
  'us-06-reservation-status.test.js',
  'us-07-search-reservations.test.js',
  'us-08-change-existing-reservation.test.js'
];

testFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the afterAll block with the new version
  content = content.replace(
    /afterAll\(async \(\) => \{[\s\S]*?\}\);/,
    `afterAll(async () => {
\t\tawait knex.migrate.rollback(undefined, true);
\t\tawait knex.destroy();
\t});`
  );
  
  fs.writeFileSync(filePath, content);
});
