import tk from 'timekeeper';
import RecordNameGenerator from './RecordNameGenerator';
import * as chai from 'chai';
import chaiString from 'chai-string';

const { expect } = chai;
chai.use(chaiString);

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
