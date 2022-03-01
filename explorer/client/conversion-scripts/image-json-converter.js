const fs = require('fs');

const contents = fs.readFileSync(
  './testImage.jpg', 
  { encoding: 'base64' }
);

const data = JSON.stringify({"data": contents});

fs.writeFileSync('jpgExample.json', data);
