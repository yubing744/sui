const fs = require('fs');

const contents = fs.readFileSync('./testImage.jpg', { encoding: 'base64' });

fs.writeFileSync('output.txt', contents);
