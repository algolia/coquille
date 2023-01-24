import { ReactNode } from 'react';
import {
  Command,
  Commands,
  FlagValues,
  ParsedCommand,
  RunCommand,
} from '../../types';
import { commandToWords, isWordFlagName, sanitizeFlag } from '../utils';
import {
  errorObject,
  getFlagNameIfExists,
  getFlagValue,
  setTrueValue,
} from './utils';

type Parse = (
  rawCommand: string,
  commands: Commands
) =>
  | { error: ReactNode; parsedCommand: undefined; run: undefined }
  | { error: undefined; parsedCommand: ParsedCommand; run: RunCommand };

const parse: Parse = (rawCommand, commands) => {
  const commandWords = commandToWords(rawCommand);
  // Algorithm cursors
  let isParsingCommand = true;
  let isParsingArgs = false;
  let isParsingFlags = false;
  let currentFlagName = '';
  let commandCursor: Command;
  // Return values
  let command: string[] = [];
  let args: string[] = [];
  let flags: FlagValues = {};

  // Check the root command
  const [firstWord] = commandWords;
  if (!commands[firstWord]) {
    return errorObject(`❌ Command ${firstWord} not valid`);
  }
  command = [firstWord];
  commandCursor = commands[firstWord];

  // Omit first element: computed just before
  const commandWordsToIterate = commandWords.slice(1);
  for (const [index, currentWord] of commandWordsToIterate.entries()) {
    const isCurrentWordFlag = isWordFlagName(currentWord);
    const isCurrentWordLast = index === commandWordsToIterate.length - 1;

    if (isParsingCommand) {
      // Is a sub command
      if (commandCursor._ && commandCursor._[currentWord]) {
        command = [...command, currentWord];
        commandCursor = commandCursor._[currentWord];
        continue;
      }
      // Is a flag
      if (isCurrentWordFlag) {
        if (!commandCursor.flags) {
          return errorObject(`❌ No flag expected for ${command.join(' ')}`);
        }
        const sanitizedFlagName = sanitizeFlag(currentWord);
        const flagName = getFlagNameIfExists(
          sanitizedFlagName,
          commandCursor.flags
        );
        if (!flagName) {
          return errorObject(
            `❌ Unknown flag "${currentWord}" for ${command.join(' ')}`
          );
        }
        // Last word: flag is set to true (no value passed)
        if (isCurrentWordLast && commandCursor.flags?.[flagName]) {
          if (commandCursor.flags[flagName].type !== 'boolean') {
            return errorObject(
              `❌ Wrong value for '${flagName}' flag: ${commandCursor.flags[flagName].type} value expected`
            );
          }
          flags = {
            ...flags,
            [flagName]: setTrueValue(commandCursor.flags[flagName].multiple),
          };
          continue;
        }

        currentFlagName = flagName;
        isParsingCommand = false;
        isParsingFlags = true;
        continue;
      }
      // Is an arg
      if (
        !commandCursor.args?.nbArgs ||
        args.length >= commandCursor.args.nbArgs
      ) {
        return errorObject(
          `❌ Too much arguments for command "${command.join(' ')}"`
        );
      }
      isParsingCommand = false;
      isParsingArgs = true;
      args = [currentWord];
      continue;
    }
    if (isParsingArgs) {
      if (isCurrentWordFlag) {
        if (!commandCursor.flags) {
          return errorObject(`❌ No flag expected for ${command.join(' ')}`);
        }
        isParsingArgs = false;
        isParsingFlags = true;
        const rawFlagName = sanitizeFlag(currentWord);
        const flagName = getFlagNameIfExists(rawFlagName, commandCursor.flags);
        if (!flagName) {
          return errorObject(
            `❌ Unknown flag "${rawFlagName}" for ${command.join(' ')}`
          );
        }

        currentFlagName = flagName;
        continue;
      }
      // Is an arg
      if (
        !commandCursor.args?.nbArgs ||
        args.length > commandCursor.args.nbArgs
      ) {
        return errorObject(
          `❌ Too much arguments for command "${command.join(' ')}"`
        );
      }
      args = [...args, currentWord];
      continue;
    }
    if (isParsingFlags) {
      if (isCurrentWordFlag) {
        if (!commandCursor.flags) {
          return errorObject(`❌ No flag expected for ${command.join(' ')}`);
        }

        const sanitizedFlagName = sanitizeFlag(currentWord);
        const flagName = getFlagNameIfExists(
          sanitizedFlagName,
          commandCursor.flags
        );
        if (!flagName) {
          return errorObject(
            `❌ Unknown flag "${sanitizedFlagName}" for ${command.join(' ')}`
          );
        }

        // Last word is a boolean flag
        if (isCurrentWordLast) {
          if (currentFlagName !== '' && !flags[currentFlagName]) {
            if (commandCursor.flags[currentFlagName].type !== 'boolean') {
              return errorObject(
                `❌ Wrong value for '${currentFlagName}' flag: ${commandCursor.flags[currentFlagName].type} value expected`
              );
            }
            flags = {
              ...flags,
              [currentFlagName]: setTrueValue(
                commandCursor.flags[currentFlagName].multiple
              ),
            };
          }
          if (commandCursor.flags[flagName].type !== 'boolean') {
            return errorObject(
              `❌ Wrong value for '${flagName}' flag: ${commandCursor.flags[currentFlagName].type} value expected`
            );
          }
          flags[flagName] = setTrueValue(
            commandCursor.flags[flagName].multiple
          );
          continue;
        }
        // Previous flag is boolean
        if (
          currentFlagName !== '' &&
          commandCursor.flags[currentFlagName].type === 'boolean'
        ) {
          flags[currentFlagName] = setTrueValue(
            commandCursor.flags[currentFlagName].multiple
          );
        }
        currentFlagName = flagName;
        continue;
      }
      // Fill current flag value
      const currentFlag = commandCursor.flags?.[currentFlagName];
      if (!currentFlag) {
        return errorObject(
          `❌ Unknown flag '${currentFlagName}' for ${command.join(' ')}`
        );
      }
      const [error, flagValue] = getFlagValue({
        flagName: currentFlagName,
        flag: currentFlag,
        value: currentWord,
      });
      if (error != null) {
        return errorObject(error);
      }
      flags[currentFlagName] = flagValue;
      currentFlagName = '';
    }
  }

  const { run, help, shortDesc, _, flags: commandFlags } = commandCursor;
  if (run) {
    return {
      error: undefined,
      parsedCommand: { command, flags, args },
      run,
    };
  }
  if (help) {
    return errorObject(
      help({ shortDesc, subcommands: _, flags: commandFlags })
    );
  }
  return errorObject(
    `❌ Cannot run command: '${command.join(' ')}' is not runnable`
  );
};

export default parse;
