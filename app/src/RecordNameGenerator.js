import moment from 'moment';

class RecordNameGenerator {
  generate(userSuppliedName) {
    const date = moment().format('YYYY-MM-DD');
    return `${date}__${userSuppliedName}.jpg`;
  }
}

export default RecordNameGenerator;
