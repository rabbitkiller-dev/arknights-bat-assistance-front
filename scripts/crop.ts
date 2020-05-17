import {State} from 'gm';

const path = require('path');
const fs = require('fs');
const gm = require('gm');

const sprite = path.join('F:\\素材\\明日方舟1001-2020-05\\人物立绘');
// const sprite = path.join('F:\\素材\\明日方舟1001-2020-05\\arknights-hg-1001\\assets\\AB\\Android\\charpack\\ex\\Texture2D');
const exportPath = path.join(__dirname, 'assets');
if (!fs.existsSync(exportPath)) {
  fs.mkdirSync(exportPath);
}


// gm(path.join(sprite, 'char_122_beagle_1.png.merge.png'))
//   .crop(229, 181, 429, 120)
//   .write(path.join(exportPath, 'char_122_beagle_1.png.merge.png'), (err) => {
//     if (!err) {
//       console.log('done');
//     } else {
//       console.log(err);
//     }
//   });
async function start() {
  const names = fs.readdirSync(sprite).splice(0, 5);
  for (const name of names) {
    if (name === '0_YouCanDel') {
      break;
    }
    await crop(name);
  }
}

function crop(name) {
  return new Promise((resolve, reject) => {
    let width = 1024;
    let height = 1024;
    gm(path.join(sprite, name))
      .size((err, value) => {
        width = value.width;
        height = value.height;
      })
      // .resize(width * 2, height * 2)
      .crop(180, 180, 410, 230)
      .write(path.join(exportPath, name), (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
  });
}

async function gmWriteIntoPromise(state: State, filename: string) {
  return new Promise((resolve, reject) => {
    state.write(filename, (err) => {
      if (!err) {
        resolve();
      } else {
        reject(err);
      }
    });
  });
}

start();

async function start2() {
  await gmWriteIntoPromise(gm(path.join(sprite, 'char_172_svrash_1.png.merge.png')).crop(180, 180, 410), path.join(exportPath, 'char_172_svrash_1.png.merge.png'))
}
start2();
