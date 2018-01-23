import tk from 'timekeeper';
import RecordNameGenerator from './RecordNameGenerator';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-string'));

it('uses supplied name', () => {
  const recordName = new RecordNameGenerator().generate('somefile');
  expect(recordName).to.endWith('somefile.jpg');
});

it('prepends date', () => {
  tk.freeze(1516742238817);
  const recordName = new RecordNameGenerator().generate();
  expect(recordName).to.startWith('2018-01-23__');
  tk.reset();
});
