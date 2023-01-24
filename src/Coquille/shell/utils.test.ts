import { commandToWords, isWordFlagName, sanitizeFlag } from './utils';

describe('commandToWords', function() {
  it.each([
    ['Root command', `command`, ['command']],
    [
      'Sub command, flag with value',
      `command sub command --flag value`,
      ['command', 'sub', 'command', '--flag', 'value'],
    ],
    [
      'Sub command, flag with value in quotation mark',
      `command sub command --flag "a value" --second-flag value`,
      [
        'command',
        'sub',
        'command',
        '--flag',
        'a value',
        '--second-flag',
        'value',
      ],
    ],
  ])('%s', (_, command, expectedValue) => {
    const result = commandToWords(command);

    expect(result).toEqual(expectedValue);
  });
});

describe('isWordFlagName', function() {
  it.each([
    // ✅ Valid flags
    ['Full flag', '--flag', true],
    ['Shorthand flag', '-f', true],
    ['Shorthand flag', '-f', true],
    // ❌ Wrong flags
    ['Argument', 'TEST', false],
    ['command name', 'algolia', false],
  ])('%s', (_, word, expectedValue) => {
    const result = isWordFlagName(word);

    expect(result).toBe(expectedValue);
  });
});

describe('sanitizeFlags', function() {
  it.each([
    ['Full flag', '--flag', 'flag'],
    ['Shorthand flag', '-f', 'f'],
    ['No value', '-', ''],
    ['No value', '--', ''],
    ['Argument', 'TEST', 'TEST'],
    ['command name', 'algolia', 'algolia'],
  ])('%s', (_, word, expectedValue) => {
    const result = sanitizeFlag(word);

    expect(result).toBe(expectedValue);
  });
});
