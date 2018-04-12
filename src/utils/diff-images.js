const pixelmatch = require('pixelmatch');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const compareScreenshots = (file, dirname) => new Promise(resolve => {
  const doneReading = () => {
    expect(img1.width).toBe(img2.width);
    expect(img1.height).toBe(img2.height);

    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      null,
      img1.width,
      img2.width,
      { threshold: 0.1 }
    )
    expect(numDiffPixels).toBe(0);
    resolve();
  };

  const img1 = fs.createReadStream(path.resolve(dirname, `${file}.screen.png`)).pipe(new PNG());
  const img2 = fs.createReadStream(path.resolve(dirname, `${file}.test-screen.png`)).pipe(new PNG()).on('parsed', doneReading);
});

const makeScreenshot = (page, file, dirname) => page.screenshot({ path: path.resolve(dirname, `${file}.test-screen.png`) });

module.exports = (dirname) => ({
  compareScreenshots: (...params) => compareScreenshots(...params, dirname),
  makeScreenshot: (...params) => makeScreenshot(...params, dirname)
});