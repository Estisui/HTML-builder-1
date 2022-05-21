const fs = require('fs');
const path = require('node:path');
const { stdin } = require('process');

const PATH = path.join(__dirname, '/text.txt');
const DATA = fs.createWriteStream(PATH);
stdin.setEncoding('utf8');

console.log('Type in smth');

stdin.on('data', (chunk) => {
  if (chunk.trim() == 'exit') {
    console.log('Bye');
    process.exit();
  } else {
    DATA.write(chunk);
  }
});

process.on('SIGINT', () => {
  console.log('Bye');
  process.exit();
});