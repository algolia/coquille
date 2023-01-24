import parseCommand from '.';
import { commands } from '../mock';

describe('parse', function() {
  it.each([
    // ✅ Valid commands
    [
      'Command with arg and flag',
      'algolia indices config export TEST --scope synonyms',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'indices', 'config', 'export'],
          args: ['TEST'],
          flags: {
            scope: ['synonyms'],
          },
        },
      },
    ],
    [
      'Command with arg and flags',
      'algolia indices config export TEST --scope synonyms,settings,rules',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'indices', 'config', 'export'],
          args: ['TEST'],
          flags: {
            scope: ['synonyms', 'settings', 'rules'],
          },
        },
      },
    ],
    [
      'Command with args and flag with value',
      'algolia indices config export TEST TEST2 TEST3 --scope synonyms',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'indices', 'config', 'export'],
          args: ['TEST', 'TEST2', 'TEST3'],
          flags: {
            scope: ['synonyms'],
          },
        },
      },
    ],
    [
      'Command with args and flag with multiple values',
      'algolia indices config export TEST TEST2 TEST3 --s synonyms,settings',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'indices', 'config', 'export'],
          args: ['TEST', 'TEST2', 'TEST3'],
          flags: {
            scope: ['synonyms', 'settings'],
          },
        },
      },
    ],
    [
      'Command with arg and different flags',
      'algolia indices config import TEST -s synonyms,settings --forward-to-replicas',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'indices', 'config', 'import'],
          args: ['TEST'],
          flags: {
            scope: ['synonyms', 'settings'],
            'forward-to-replicas': true,
          },
        },
      },
    ],
    [
      'Command without arg and a flag without value',
      'algolia indices config import --forward-to-replicas',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'indices', 'config', 'import'],
          args: [],
          flags: {
            'forward-to-replicas': true,
          },
        },
      },
    ],
    [
      'Command with arg and different flags using shorthands',
      'algolia indices config import TEST -f -s synonyms,settings',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'indices', 'config', 'import'],
          args: ['TEST'],
          flags: {
            'forward-to-replicas': true,
            scope: ['synonyms', 'settings'],
          },
        },
      },
    ],
    [
      'Command with flag using shorthands',
      'algolia profile add -d',
      {
        error: undefined,
        parsedCommand: {
          command: ['algolia', 'profile', 'add'],
          args: [],
          flags: {
            default: true,
          },
        },
      },
    ],
    // ❌ Wrong command
    [
      'Unknown command',
      'test TEST',
      {
        error: '❌ Command test not valid',
        parsedCommand: undefined,
      },
    ],
    [
      'Command with arg and one unregistered flag',
      'algolia indices config import TEST -f --unregistered flagvalue',
      {
        error:
          '❌ Unknown flag "unregistered" for algolia indices config import',
        parsedCommand: undefined,
      },
    ],
    [
      'Non-runnable command with arg and unknown flag',
      'algolia TEST --test abc,def',
      {
        error: '❌ Too much arguments for command "algolia"',
        parsedCommand: undefined,
      },
    ],
    [
      'Command with too much args',
      'algolia indices config import TEST1 TEST2 TEST3 TEST4 -f -s synonyms,settings',
      {
        error:
          '❌ Too much arguments for command "algolia indices config import"',
        parsedCommand: undefined,
      },
    ],
    [
      'Wrong boolean flag value',
      'algolia profile add --default wrongvalue',
      {
        error: "❌ Wrong value for 'default' flag: boolean value expected",
        parsedCommand: undefined,
      },
    ],
    [
      'Wrong multiple string flag values',
      'algolia profile add --name multiple,name,values',
      {
        error: "❌ No multiple values expected for flag 'name'",
        parsedCommand: undefined,
      },
    ],
    [
      'Command without arg and flag without value',
      'algolia indices config import --scope --forward-to-replicas',
      {
        error: "❌ Wrong value for 'scope' flag: string value expected",
        parsedCommand: undefined,
      },
    ],
  ])('%s', (_, fullCommand, expectedValue) => {
    const result = parseCommand(fullCommand, commands);

    expect(result.error).toBe(expectedValue.error);
    expect(result.parsedCommand).toStrictEqual(expectedValue.parsedCommand);
  });
});
