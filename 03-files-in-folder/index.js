const fs = require('fs');
const path = require('node:path');

const PATH = path.join(__dirname, '/secret-folder');

fs.promises.readdir(PATH, { withFileTypes: true })
  .then(filenames => {
    for (let filename of filenames) {
      if (!filename.isDirectory()) {
        console.log(filename.stat());
      }
    }
  })
  
  .catch(err => {
    console.log(err);
  });