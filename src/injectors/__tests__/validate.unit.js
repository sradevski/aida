import validate from '../validate';
import sampleDefinition from '../../utils/sampleDefinition';

describe('The validate injector', () => {
  test('returns an empty object when an empty object or undefined are passed', () => {
    console.log(validate(sampleDefinition).getValidators());
    //expect(populateWithFaker({})).toEqual({});
  });
});
