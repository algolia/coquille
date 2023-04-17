import { ReactNode, RefObject } from 'react';

/**
 * Structure of the commands object that defines
 * commands of the terminal
 */
export type Commands = {
  [name: string]: Command;
};

/**
 * Structure of cli autocomplete suggestions.
 * Takes a name and an optional shorthand and description
 */
export type Suggestion = {
  alias?: string;
  description?: string;
  playDown?: boolean;
  name: string;
};

/**
 * Structure of the data that represent a command
 */
export type Command<F extends FlagValues = FlagValues> = {
  _?: Commands; // Recursive type to represent sub commands
  args?: {
    nbArgs: number; // Number of arguments needed for the command
    suggestions?: Suggestion[]; // Autocomplete suggestions with short description
  };
  flags?: Flags;
  help?: HelpFunction; // Callback called to display command help
  run?: RunCommand<F>;
  shortDesc?: string; // Description of the command
  playDown?: boolean; //Play down the commands when using suggestions
};

export type Flag = {
  multiple?: boolean; // If multiple values are allowed for the flag
  shortDesc: string; // Description of the flag
  shorthand?: string; // Shorthand letter of the flag
  suggestions?: Suggestion[]; // Autocomplete suggestions with short description
  type: 'string' | 'number' | 'boolean'; // Type of the flag value
};

export type Flags = {
  [flagName: string]: Flag;
};

export type FlagType = string | number | boolean;

export type FlagValues = {
  [name: string]: FlagType | FlagType[];
};

/**
 * Structure of the data that represent the command entered by the user
 */
export type ParsedCommand<F extends FlagValues = FlagValues> = {
  args?: string[];
  command: string[];
  flags?: F;
};

/** Function that runs a command
 * @returns a ReactNode that will be displayed as the output of the command
 */
export type RunCommand<F extends FlagValues = FlagValues> = (
  command: ParsedCommand<F>,
  shell: {
    history: string[]; // history of previous commands
    input: RefObject<HTMLInputElement>; // ref of the input
    inputValue: string; // input value of the current command
    setInputValue: (value: string) => void; // set input value
  }
) => Promise<ReactNode> | ReactNode;

/** Function to display help about a command
 * @returns a ReactNode that provides help
 */
export type HelpFunction = (args: {
  flags?: Flags;
  shortDesc?: string;
  subcommands?: Commands;
}) => ReactNode;
