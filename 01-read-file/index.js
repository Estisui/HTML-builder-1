const fs = require('fs');
const path = require('node:path');

const PATH = path.join(__dirname, '/text.txt');
const readable = fs.createReadStream(PATH);
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  console.log(chunk);
});
