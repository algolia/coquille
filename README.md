# 🐚 Coquille

[<img src="https://icons.veryicon.com/png/o/photographic/ant-design-official-icon-library/codesandbox-square-f.png" width="50"/>](https://codesandbox.io/s/coquille-example-354c7c)

Coquille is React component that renders a terminal on the browser with some built-in features.

Algolia web CLI is built on top of Coquille! [See more here](https://github.com/algolia/cli-browser).

## ✨ Features

- Suggestions (command, sub command, arguments, flags, flag values)
- Command parsing (with usage of brackets `"` for values)
- Terminal shortcuts ([see full list below](#shortcuts))

## 📖 Documentation

### Guide

Get started example to integrate Coquille to your codebase

### Usage

#### Shortcuts

- `CTRL+L`: clear terminal
- `CTRL+U`: erase current line
- `CTRL+A`: place cursor to the beginning of the line

#### Interactions

- Real time suggestions for commands, sub commands, arguments, flag names, flag values (single or comma separated)
- Click on previous command to copy it to clipboard
- Reading commands configuration to display errors when a wrong command (wrong flag or argument) is run

### Integration

#### Props interface

```typescript
interface CoquilleProps {
  commands: Commands; // commands object defined below
  promptPrefix?: ReactNode; // customizable prompt prefix
  runOnStart?: RunCommand; // command to run on component mount
}
```

#### Example

To define a command with typed flags:

```typescript
import { Command, FlagValues, RunCommand } from './types';

interface Flags extends FlagValues {
  l: boolean;
}

const run: RunCommand<Flags> = async ({ flags }) => {
  if (flags && flags.l) {
    // ...
  }

  return <p>...</p>;
};

const ls: Command<Flags> = {
  shortDesc: 'ls – list directory contents',
  args: { nbArgs: 0 },
  flags: {
    l: {
      type: 'boolean',
      shortDesc:
        'List files in the long format, as described in the The Long Format subsection below',
    },
  },
  run,
};

export default ls as Command;
```

#### Commands definition

The shell uses a `commands` object props to parse, define and run commands in the Terminal:

```typescript
/**
 * Structure of the commands object that defines
 * commands of the terminal
 */
type Commands = {
  [name: string]: Command;
};

/**
 * Structure of the data that represent a command
 */
type Command<F extends FlagValues = FlagValues> = {
  shortDesc?: string; // Description of the command
  help?: HelpFunction;
  run?: RunCommand<F>;
  args?: {
    nbArgs: number; // Number of arguments needed for the command
    suggestions?: Suggestion[]; // Autocomplete suggestions with short description
  };
  flags?: Flags;
  _?: Commands; // Recursive type to represent sub commands
};

/**
 * Structure of cli autocomplete suggestions.
 * Takes a name and an optional alias and description
 */
type Suggestion = {
  name: string;
  alias?: string;
  description?: string;
};

type FlagType = string | number | boolean;
type FlagValues = {
  [name: string]: FlagType | FlagType[];
};

type Flags = {
  [flagName: string]: Flag;
};

type Flag = {
  shortDesc: string; // Description of the flag
  type: 'string' | 'number' | 'boolean'; // Type of the flag value
  multiple?: boolean; // If multiple values are allowed for the flag
  shorthand?: string; // Shorthand letter of the flag
  suggestions?: Suggestion[]; // Autocomplete suggestions with short description
};

/**
 * Structure of the data that represent the command entered by the user
 */
type ParsedCommand<F extends FlagValues = FlagValues> = {
  command: string[];
  args?: string[];
  flags?: F;
};

/** Function that runs a command
 * @returns a ReactNode that will be displayed as the output of the command
 */
type RunCommand<F extends FlagValues = FlagValues> = (
  command: ParsedCommand<F>,
  shell: {
    input: RefObject<HTMLInputElement>; // ref of the input
    inputValue: string; // input value of the current command
    setInputValue: (value: string) => void; // set input value
    history: string[]; // history of previous commands
  }
) => Promise<ReactNode> | ReactNode;

/** Function to display help about a command
 * @returns a ReactNode that provides help
 */
export type HelpFunction = (args: {
  shortDesc?: string;
  subcommands?: Commands;
  flags?: Flags;
}) => ReactNode;
```

### Helpers

#### Functions

- `runCommandInTerminal`: run the specified command in the terminal programmatically. Useful to create button that runs a command (in a help command output for example).

```typescript
RunCommandInTerminal = (args: {
  command: string;
  input: React.RefObject<HTMLInputElement>;
  setInputValue: (value: string) => void;
}) => void;
```

- `dispatchKeyboardEventInTerminal`: dispatch the specified keyboard event in the terminal programmatically. Useful to simulate user action (in an interactive demo for example).

```typescript
DispatchKeyboardEventInTerminal = (args: {
  event: { type: string; eventInitDict?: KeyboardEventInit };
  input: React.RefObject<HTMLInputElement>;
}) => void;
```

#### Components

- `<Help />`: renders the help standard output of a command.

**Example:**

```jsx
<Help
  // Given by the help callback function of the command
  shortDesc={...}
  subcommands={...}
  flags={...}
  // Customized usage, examples and learnMore
  usage="algolia <command> <subcommand> [flags]"
  examples={[
    `$ algolia search MY_INDEX --query "foo"`,
    `$ algolia profile list`,
    `$ algolia indices list`,
  ]}
  learnMore={
    <>
      <p>
        {`Use 'algolia <command> <subcommand> --help' for more information about a command.`}
      </p>
      <p>
        Read the documentation at{" "}
        <Link href="https://algolia.com/doc/tools/cli">
          https://algolia.com/doc/tools/cli
        </Link>
      </p>
    </>
  }
/>
```

## 🛟 Support

Found a bug? [Open a new issue](https://github.com/algolia/coquille/issues/new) and help us to improve the code!
