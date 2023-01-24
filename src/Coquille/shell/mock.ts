import { Commands } from '../types';

export const commands: Commands = {
  algolia: {
    _: {
      profile: {
        _: {
          add: {
            run: () => null,
            shortDesc: 'Add a new profile configuration to the CLI',
            args: { nbArgs: 0 },
            flags: {
              'app-id': {
                type: 'string',
                shortDesc: 'ID of the application.',
              },
              default: {
                type: 'boolean',
                shortDesc: 'Set the profile as the default one.',
                shorthand: 'd',
              },
              name: {
                type: 'string',
                shortDesc: 'Name of the profile',
                shorthand: 'n',
              },
            },
          },
        },
      },
      indices: {
        flags: {
          clear: {
            type: 'boolean',
            shortDesc: 'Clear index',
            shorthand: 'c',
          },
        },
        _: {
          config: {
            _: {
              export: {
                run: () => null,
                shortDesc: 'algolia config export description',
                args: {
                  nbArgs: 3,
                  suggestions: [
                    { name: 'ARG1', description: 'Arg1 description' },
                    { name: 'ARG2', description: 'Arg2 description' },
                    { name: 'ARG3', description: 'Arg3 description' },
                  ],
                },
                flags: {
                  scope: {
                    type: 'string',
                    shortDesc: 'scope flag description',
                    shorthand: 's',
                    suggestions: [
                      { name: 'synonyms', description: 'synonyms description' },
                      { name: 'rules', description: 'rules description' },
                      { name: 'settings', description: 'settings description' },
                    ],
                    multiple: true,
                  },
                },
              },
              import: {
                run: () => null,
                shortDesc: 'algolia config import description',
                args: { nbArgs: 1 },
                flags: {
                  scope: {
                    type: 'string',
                    shortDesc: 'scope flag description',
                    shorthand: 's',
                    suggestions: [
                      { name: 'synonyms', description: 'synonyms description' },
                      { name: 'rules', description: 'rules description' },
                      { name: 'settings', description: 'settings description' },
                    ],
                    multiple: true,
                  },
                  'forward-to-replicas': {
                    type: 'boolean',
                    shortDesc: 'Forward config import to replicas',
                    shorthand: 'f',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
