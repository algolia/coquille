import { Commands, Suggestion } from '../../types';
import { commandToWords, isWordFlagName, sanitizeFlag } from '../utils';

type Suggest = (rawCommand: string, commands: Commands) => Suggestion[] | null;

const suggest: Suggest = (rawCommand, commands) => {
  const commandWords = commandToWords(rawCommand);
  const lastCommandCharacter = rawCommand.slice(-1);
  const [firstWord] = commandWords;

  // Root command suggestion
  if (
    commandWords.length === 0 ||
    (commandWords.length === 1 && lastCommandCharacter !== ' ')
  ) {
    let suggestedCommand = Object.keys(commands);
    if (commandWords.length === 1 && lastCommandCharacter !== ' ') {
      suggestedCommand = suggestedCommand.filter((commandName) =>
        commandName.startsWith(firstWord)
      );
    }
    if (suggestedCommand.length > 0) {
      return suggestedCommand.map((rootCommand) => ({
        name: rootCommand,
        description: commands[rootCommand].shortDesc || '',
      }));
    }
  }

  let commandCursor = commands[firstWord];
  // First command is not recognized
  if (!commandCursor) {
    return null;
  }

  const lastWord = commandWords[commandWords.length - 1];
  const nextToLastWord = commandWords[commandWords.length - 2];
  const isLastWordFlag = lastWord ? isWordFlagName(lastWord) : false;
  const isNextToLastWordFlag = nextToLastWord
    ? isWordFlagName(nextToLastWord)
    : false;
  let filledFlags: string[] = [];
  let filledArgs: string[] = [];
  let flagCursor = '';

  // Omit first element: computed just before
  const commandWordsToIterate = commandWords.slice(1);
  for (const [index, currentWord] of commandWordsToIterate.entries()) {
    if (isWordFlagName(currentWord)) {
      const sanitizedFlag = sanitizeFlag(currentWord);
      flagCursor = sanitizedFlag;
      filledFlags = [...filledFlags, sanitizedFlag];
      continue;
    }
    if (commandCursor._ && commandCursor._[currentWord]) {
      // Encountered a command after an arg
      if (filledArgs.length > 0) {
        return null;
      }
      commandCursor = commandCursor._[currentWord];
      continue;
    }

    if (
      index === commandWordsToIterate.length - 1 &&
      lastCommandCharacter !== ' '
    ) {
      continue;
    }
    filledArgs = [...filledArgs, currentWord];
  }

  const argTyped = commandCursor.args?.nbArgs
    ? commandCursor.args.nbArgs <= filledArgs.length
    : true;

  if (lastCommandCharacter !== ' ') {
    // Suggest flags
    if (argTyped && (lastWord.startsWith('--') || lastWord.startsWith('-'))) {
      const flagNameInput = sanitizeFlag(lastWord);
      if (commandCursor.flags) {
        return Object.keys(commandCursor.flags)
          .filter(
            (flag) =>
              !filledFlags.includes(flag) && flag.startsWith(flagNameInput)
          )
          .map((flagName) => ({
            name: `--${flagName}`,
            alias: commandCursor.flags?.[flagName].shorthand
              ? `-${commandCursor.flags?.[flagName].shorthand}`
              : '',
            description: commandCursor.flags?.[flagName].shortDesc || '',
          }));
      }

      return null;
    }
    // Suggest args
    if (commandCursor.args?.suggestions && flagCursor === '') {
      const filteredSuggestions = commandCursor.args.suggestions.filter(
        ({ name }) => name.startsWith(lastWord) && !filledArgs.includes(name)
      );
      return filteredSuggestions.length > 0 ? filteredSuggestions : null;
    }
  } else {
    // Suggest flag values
    if (isLastWordFlag && commandCursor.flags?.[flagCursor]) {
      return commandCursor.flags[flagCursor].suggestions || null;
    }
    if (
      commandCursor.args?.suggestions &&
      flagCursor === '' &&
      filledArgs.length < commandCursor.args.nbArgs
    ) {
      const filteredSuggestions = commandCursor.args.suggestions.filter(
        ({ name }) => !filledArgs.includes(name)
      );
      return filteredSuggestions.length > 0 ? filteredSuggestions : null;
    }

    // Suggest subcommand, flags, args
    let commandAndFlagsSuggestions: Suggestion[] = [];
    if (commandCursor._) {
      for (const subcommand of Object.keys(commandCursor._)) {
        commandAndFlagsSuggestions = [
          ...commandAndFlagsSuggestions,
          {
            name: subcommand,
            description: commandCursor._?.[subcommand].shortDesc || '',
          },
        ];
      }
    }
    if (argTyped && commandCursor.flags) {
      for (const flagName of Object.keys(commandCursor.flags)) {
        if (!filledFlags.includes(flagName)) {
          commandAndFlagsSuggestions = [
            ...commandAndFlagsSuggestions,
            {
              name: `--${flagName}`,
              alias: commandCursor.flags?.[flagName].shorthand
                ? `-${commandCursor.flags?.[flagName].shorthand}`
                : '',
              description: commandCursor.flags?.[flagName].shortDesc || '',
            },
          ];
        }
      }
    }
    if (commandAndFlagsSuggestions.length > 0) {
      return commandAndFlagsSuggestions;
    }

    return null;
  }

  if (isNextToLastWordFlag && commandCursor.flags?.[flagCursor]) {
    // Suggest flag values
    const flagSuggestions = commandCursor.flags[flagCursor].suggestions;
    if (!flagSuggestions) {
      return null;
    }

    let filteredFlagSuggestions = flagSuggestions.filter(({ name }) =>
      name.startsWith(lastWord)
    );
    const enteredValues = lastWord.split(',');
    if (lastCommandCharacter === ',') {
      filteredFlagSuggestions = flagSuggestions.filter(
        ({ name }) => !enteredValues.includes(name)
      );
    } else if (lastWord.includes(',')) {
      const [lastCommaSeparatedWord] = lastWord.split(',').slice(-1);
      filteredFlagSuggestions = flagSuggestions.filter(
        ({ name }) =>
          name.startsWith(lastCommaSeparatedWord) &&
          !enteredValues.includes(name)
      );
    }

    if (filteredFlagSuggestions.length <= 0) {
      return null;
    }

    return filteredFlagSuggestions;
  }

  if (commandCursor._) {
    // Suggest sub command
    let commandsSuggestions: Suggestion[] = [];
    for (const subcommand of Object.keys(commandCursor._)) {
      if (subcommand.startsWith(lastWord)) {
        commandsSuggestions = [
          ...commandsSuggestions,
          {
            name: subcommand,
            description: commandCursor._?.[subcommand].shortDesc || '',
          },
        ];
      }
    }
    if (commandsSuggestions.length > 0) {
      return commandsSuggestions;
    }

    return null;
  }

  return null;
};

export default suggest;
