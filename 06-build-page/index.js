/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('node:path');

const TEMPLATEPATH = path.join(__dirname, '/template.html');
const COMPONENTSPATH = path.join(__dirname, '/components');
const ASSETSPATH = path.join(__dirname, '/assets');
const NEWASSETSPATH = path.join(__dirname, '/project-dist', '/assets');

function getHTMLContent() {
  const readable = fs.createReadStream(TEMPLATEPATH);
  readable.setEncoding('utf8');
  let HTML = '';

  readable.on('data', (chunk) => {
    HTML += chunk;
  });

  readable.on('close', () => {
    replaceHTMLContent(HTML);
  });
}

function replaceHTMLContent(oldHTML) {
  let HTML = oldHTML;
  const regex = /{{.*?}}/g;
  const tags = HTML.match(regex);
  for (let tag in tags) {
    let TAGNAME = tags[tag].slice(2, -2);
    const TAGPATH = path.join(COMPONENTSPATH, `/${TAGNAME}.html`);
    const readableTag = fs.createReadStream(TAGPATH);
    readableTag.setEncoding('utf8');
    let HTMLTAG = '';
    readableTag.on('data', (chunk) => {
      HTMLTAG += chunk;
    });
    readableTag.on('close', () => {
      HTML = HTML.replace(tags[tag], HTMLTAG);
      if (tag == tags.length-1) {
        saveNewHtml(HTML);
      }
    });
  }
}

function saveNewHtml(HTML) {
  fs.promises.mkdir(path.join(__dirname, '/project-dist'), { recursive: true })
    .catch(err => {
      console.log(err);
    });
  const INDEXPATH = path.join(__dirname, '/project-dist', '/index.html');
  const writable = fs.createWriteStream(INDEXPATH);
  writable.write(HTML);
  mergeStyles();
}

function mergeStyles() {
  const STYLESPATH = path.join(__dirname, '/styles');
  fs.promises.readdir(STYLESPATH, { withFileTypes: true })
    .then(filenames => {
      const NEWPATH = path.join(__dirname, '/project-dist', '/style.css');
      const writable = fs.createWriteStream(NEWPATH);
      for (let filename of filenames) {
        const FILEPATH = path.join(__dirname, '/styles', filename.name);
        if (!filename.isDirectory() && path.extname(FILEPATH) === '.css') {
          const readable = fs.createReadStream(FILEPATH);
          readable.setEncoding('utf8');
          readable.on('data', (chunk) => {
            writable.write(chunk);
          });
          if (filename, filenames[filenames.length - 1]) {
            readable.on('close', () => {
              copyDir(path.join(ASSETSPATH, '/fonts'), path.join(NEWASSETSPATH, '/fonts'));
              copyDir(path.join(ASSETSPATH, '/img'), path.join(NEWASSETSPATH, '/img'));
              copyDir(path.join(ASSETSPATH, '/svg'), path.join(NEWASSETSPATH, '/svg'));
            });
          } 
        }
      }
      
    })
  
    .catch(err => {
      console.log(err);
    });
}

function copyDir(PATH, NEWPATH) {
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
              .catch(_err => {
                // console.log(err);
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
                  .catch(_err => {
                    // console.log(err);
                  });
              }
            })
            .catch(err => {
              console.log(err);
            });
        });  
    });
}

getHTMLContent();