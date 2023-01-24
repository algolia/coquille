import { Flag } from '../../types';
import {
  castValueToType,
  errorObject,
  getFlagNameIfExists,
  getFlagValue,
  getValueType,
  setTrueValue,
} from './utils';

describe('errorObject', () => {
  it.each([
    [
      'Error message',
      '❌ No command found',
      {
        error: '❌ No command found',
        parsedCommand: undefined,
        run: undefined,
      },
    ],
  ])('%s', (_, word, expectedValue) => {
    const result = errorObject(word);

    expect(result).toStrictEqual(expectedValue);
  });
});

describe('getFlagNameIfExists', () => {
  it.each([
    // ✅ Valid flag name/shorthand
    [
      'Valid name',
      'forward-to-replicas',
      {
        scope: {
          shorthand: 's',
          randomKey: 'randomValue',
        },
        'forward-to-replicas': {
          shorthand: 'f',
          randomObject: {
            random: '',
          },
        },
      },
      'forward-to-replicas',
    ],
    [
      'Valid shorthand',
      's',
      {
        scope: {
          shorthand: 's',
          randomKey: 'randomValue',
        },
        'forward-to-replicas': {
          shorthand: 'f',
          randomObject: {
            random: '',
          },
        },
      },
      'scope',
    ],
    // ❌ Wrong flag name/shorthand
    [
      'Wrong name',
      'random',
      {
        scope: {
          shorthand: 's',
          randomKey: 'randomValue',
        },
      },
      '',
    ],
    [
      'Wrong shorthand',
      'z',
      {
        scope: {
          shorthand: 's',
          randomKey: 'randomValue',
        },
      },
      '',
    ],
  ])('%s', (_, word, flags, expectedValue) => {
    const result = getFlagNameIfExists(word, flags);

    expect(result).toStrictEqual(expectedValue);
  });
});

describe('getValueType', () => {
  it.each([
    ['String', 'test value', 'string'],
    ['String with number', 'test-value-12', 'string'],
    ['Number', '12', 'number'],
    ['Float', '12.567', 'number'],
    ['Boolean true', 'true', 'boolean'],
    ['Boolean false', 'false', 'boolean'],
  ])('%s', (_, value, expectedValue) => {
    const result = getValueType(value);

    expect(result).toStrictEqual(expectedValue);
  });
});

describe('castValueToType', () => {
  it.each([
    ['String', 'test value', 'string' as const, 'test value'],
    ['Number', '12', 'number' as const, 12],
    ['Boolean true', 'true', 'boolean' as const, true],
    ['Boolean false', 'false', 'boolean' as const, false],
    ['Number as string', '12', 'string' as const, '12'],
    ['Boolean as string', 'true', 'string' as const, 'true'],
    ['Boolean as string', 'true', 'string' as const, 'true'],
    ['Boolean as number', 'true', 'number' as const, NaN],
    ['String as number', 'test value', 'number' as const, NaN],
    ['String as boolean', 'test value', 'boolean' as const, false],
  ])('%s', (_, value, type, expectedValue) => {
    const result = castValueToType(value, type);

    expect(result).toStrictEqual(expectedValue);
  });
});

describe('setTrueValue', () => {
  it.each([
    ['Multiple', true, [true]],
    ['Single', false, true],
    ['Single undefined', undefined, true],
  ])('%s', (_, multiple, expectedValue) => {
    const result = setTrueValue(multiple);

    expect(result).toEqual(expectedValue);
  });
});

describe('getFlagValue', () => {
  const multipleNumberFlag: Flag = {
    shortDesc: 'Multiple number flag',
    type: 'number',
    multiple: true,
  };
  const singleNumberFlag: Flag = {
    shortDesc: 'Single number flag',
    type: 'number',
  };
  const multipleStringFlag: Flag = {
    shortDesc: 'Multiple string flag',
    type: 'string',
    multiple: true,
  };
  const singleStringFlag: Flag = {
    shortDesc: 'Single string flag',
    type: 'string',
  };
  const multipleBooleanFlag: Flag = {
    shortDesc: 'Multiple boolean flag',
    type: 'boolean',
    multiple: true,
  };
  const singleBooleanFlag: Flag = {
    shortDesc: 'Single boolean flag',
    type: 'boolean',
  };

  it.each([
    // ✅ Correct value
    [
      'Multiple number flag',
      {
        flag: multipleNumberFlag,
        flagName: 'multiple-number-flag',
        value: '12,13,14',
      },
      [null, [12, 13, 14]],
    ],
    [
      'Multiple number flag with one value',
      {
        flag: multipleNumberFlag,
        flagName: 'multiple-number-flag',
        value: '12',
      },
      [null, [12]],
    ],
    [
      'Single number flag with one value',
      {
        flag: singleNumberFlag,
        flagName: 'single-number-flag',
        value: '12',
      },
      [null, 12],
    ],
    [
      'Multiple string flag with one value',
      {
        flag: multipleStringFlag,
        flagName: 'multiple-string-flag',
        value: 'one',
      },
      [null, ['one']],
    ],
    [
      'Single string flag with one value',
      {
        flag: singleStringFlag,
        flagName: 'single-string-flag',
        value: 'one',
      },
      [null, 'one'],
    ],
    [
      'Multiple boolean flag with one value',
      {
        flag: multipleBooleanFlag,
        flagName: 'multiple-boolean-flag',
        value: 'true',
      },
      [null, [true]],
    ],
    [
      'Single boolean flag with one value',
      {
        flag: singleBooleanFlag,
        flagName: 'single-boolean-flag',
        value: 'true',
      },
      [null, true],
    ],
    // ❌ Wrong value
    [
      'Multiple number flag with strings',
      {
        flag: multipleNumberFlag,
        flagName: 'multiple-number-flag',
        value: 'one,two,three',
      },
      [
        "❌ Wrong value for 'multiple-number-flag' flag: number value expected",
        null,
      ],
    ],
    [
      'Single number flag with multiple values',
      {
        flag: singleNumberFlag,
        flagName: 'single-number-flag',
        value: '12,13,14',
      },
      ["❌ No multiple values expected for flag 'single-number-flag'", null],
    ],
    [
      'Single string flag with multiple values',
      {
        flag: singleStringFlag,
        flagName: 'single-string-flag',
        value: 'one,two,three',
      },
      ["❌ No multiple values expected for flag 'single-string-flag'", null],
    ],
    [
      'Multiple boolean flag with multiple string values',
      {
        flag: multipleBooleanFlag,
        flagName: 'multiple-boolean-flag',
        value: 'one,two,three',
      },
      [
        "❌ Wrong value for 'multiple-boolean-flag' flag: boolean value expected",
        null,
      ],
    ],
  ])('%s', (_, args, expectedValue) => {
    const result = getFlagValue(args);

    expect(result).toStrictEqual(expectedValue);
  });
});
