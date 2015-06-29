import {expect} from 'chai';

import format from '../src/format';

describe('format', () => {

  describe('camelCase', () => {

    it('String', () => {

      expect(format.camelCase('kebab-case')).to.equal('kebabCase');
    });

    it('Object', () => {

      let obj = format.camelCase({
        'one-two': 'three',
        'four-five': '6'
      });

      expect(obj).to.eql({
        oneTwo: 'three',
        fourFive: '6'
      });
    });

    it('deep Object', () => {

      let obj = format.camelCase({
        'one-two': 'three',
        'four-five': {
          'six-seven': [
            {
              'eight-nine': 'ten'
            },
            'eleven-twelve'
          ]
        }
      });

      expect(obj).to.eql({
        oneTwo: 'three',
        fourFive: {
          sixSeven: [
            {
              eightNine: 'ten'
            },
            'eleven-twelve'
          ],
        }
      });
    });
  });

  describe('snakeCase', () => {

    it('String', () => {

      expect(format.snakeCase('oneTwo')).to.equal('one-two');
    });

    it('Object', () => {

      let obj = format.snakeCase({
        'oneTwo': 'three',
        'fourFive': '6'
      });

      expect(obj).to.eql({
        'one-two': 'three',
        'four-five': '6'
      });
    });

    it('deep Object', () => {

      let obj = format.snakeCase({
        oneTwo: 'three',
        fourFive: {
          sixSeven: [
            {
              eightNine: 'ten'
            },
            'eleven-twelve'
          ],
        }
      });

      expect(obj).to.eql({
        'one-two': 'three',
        'four-five': {
          'six-seven': [
            {
              'eight-nine': 'ten'
            },
            'eleven-twelve'
          ]
        }
      });
    });

    it('keeps leading "-"', () => {

      let cased = format.snakeCase('-createdAt');
      expect(cased).to.equal('-created-at');
    });
  });

});
