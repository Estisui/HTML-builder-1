const fs = require('fs');
const path = require('node:path');

const PATH = path.join(__dirname, '/secret-folder');

fs.promises.readdir(PATH, { withFileTypes: true })
  .then(filenames => {
    for (let filename of filenames) {
      if (!filename.isDirectory()) {
        const FILEPATH = path.join(__dirname, '/secret-folder', filename.name);
        fs.stat(FILEPATH, (error, stats) => {
          if (error) {
            console.log(error);
          }
          else {
            const FILENAME = filename.name;
            const EXTNAME = path.extname(FILEPATH);
            const FILESIZE = stats.size;
            console.log(`${FILENAME.slice(0, FILENAME.length - EXTNAME.length)} - ${EXTNAME.substring(1)} - ${FILESIZE} bytes`);
          }
        });
      }
    }
  })
  
  .catch(err => {
    console.log(err);
  });