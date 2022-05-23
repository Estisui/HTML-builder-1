const fs = require('fs');
const path = require('node:path');

function copyDir() {
  const PATH = path.join(__dirname, '/files');
  const NEWPATH = path.join(__dirname, '/files-copy');
  
  fs.promises.mkdir(NEWPATH, { recursive: true })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      fs.promises.readdir(NEWPATH)
        .then(filenames => {
          for (let filename of filenames) {
            const NEWFILEPATH = path.join(NEWPATH, filename);
          
            fs.promises.unlink(NEWFILEPATH)
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          fs.promises.readdir(PATH)
            .then(filenames => {
              for (let filename of filenames) {
                const FILEPATH = path.join(PATH, filename);
                const NEWFILEPATH = path.join(NEWPATH, filename);
              
                fs.promises.copyFile(FILEPATH, NEWFILEPATH)
                  .catch(err => {
                    console.log(err);
                  });
              }
            })
            .catch(err => {
              console.log(err);
            });
        });  
    });
}

copyDir();