const fs = require('fs');
const path = require('node:path');

const PATH = path.join(__dirname, '/styles');

fs.promises.readdir(PATH, { withFileTypes: true })
  .then(filenames => {
    const NEWPATH = path.join(__dirname, '/project-dist', '/bundle.css');
    const writable = fs.createWriteStream(NEWPATH);
    for (let filename of filenames) {
      const FILEPATH = path.join(__dirname, '/styles', filename.name);
      if (!filename.isDirectory() && path.extname(FILEPATH) === '.css') {
        const readable = fs.createReadStream(FILEPATH);
        readable.setEncoding('utf8');
        readable.on('data', (chunk) => {
          writable.write(chunk);
        });
      }
    }
  })
  
  .catch(err => {
    console.log(err);
  });