const pixelmatch = require('pixelmatch');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const compareScreenshots = (file, dirname) => new Promise(resolve => {
  const inputPathName = path.resolve(dirname, `${file}.screen.png`);
  const testPathName = path.resolve(dirname, `${file}.test-screen.png`);
  const img1 = fs.createReadStream(inputPathName).pipe(new PNG()).on('parsed', doneReading);
  const img2 = fs.createReadStream(testPathName).pipe(new PNG()).on('parsed', doneReading);
  let filesRead = 0;

  function doneReading() {
    if (++filesRead < 2) {
      return;
    }

    expect(img1.width).toBe(img2.width);
    expect(img1.height).toBe(img2.height);

    const diff = new PNG({ width: img1.width, height: img1.height });

    const numDiffPixels = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      img1.width,
      img2.width,
      { threshold: 0.1 }
    )

    if (numDiffPixels !== 0) {
      const diffPathName = path.resolve(dirname, `${file}.diff-screen.png`);
      diff.pack().pipe(fs.createWriteStream(diffPathName)).on('finish', () => resolve());
    } else {
      expect(numDiffPixels).toBe(0);
      resolve();
    }
  };
});

const makeScreenshot = (page, file, dirname) => page.screenshot({ path: path.resolve(dirname, `${file}.test-screen.png`) });

module.exports = (dirname) => ({
  compareScreenshots: (...params) => compareScreenshots(...params, dirname),
  makeScreenshot: (...params) => makeScreenshot(...params, dirname)
});