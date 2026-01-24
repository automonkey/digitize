import moment from 'moment';

class RecordNameGenerator {
  generate(userSuppliedName) {
    const date = moment().format('YYYY-MM-DD');
    const baseName = `${date}__${userSuppliedName}`;
    return {
      scaledImageFilename: `${baseName}.jpg`,
      fullResImageFilename: `${baseName}_fullRes.jpg`
    };
  }
}

export default RecordNameGenerator;
