import tk from 'timekeeper';
import RecordNameGenerator from './RecordNameGenerator';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));

it('uses supplied name for scaled image', () => {
  const { scaledImageFilename } = new RecordNameGenerator().generate('somefile');
  expect(scaledImageFilename).to.endWith('somefile.jpg');
});

it('uses supplied name for full res image with _fullRes suffix', () => {
  const { fullResImageFilename } = new RecordNameGenerator().generate('somefile');
  expect(fullResImageFilename).to.endWith('somefile_fullRes.jpg');
});

it('prepends date', () => {
  tk.freeze(1516742238817);
  const { scaledImageFilename, fullResImageFilename } = new RecordNameGenerator().generate();
  expect(scaledImageFilename).to.startWith('2018-01-23__');
  expect(fullResImageFilename).to.startWith('2018-01-23__');
  tk.reset();
});
