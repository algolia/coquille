import cx from 'classnames';
import { Fragment } from 'react';
import { Command, FlagValues, RunCommand, runCommandInTerminal } from '../..';
import { runOnStart } from './index';

const availableCommands = [
  ['help', 'Help about any available commands'],
  ['history', 'Show commands history'],
  ['ls', 'Display mocked files and folders'],
];

interface Flags extends FlagValues {
  init: boolean;
}

const run: RunCommand<Flags> = async (command, shell) => {
  if (command.flags?.init) {
    return <div className="cq-mt-5">{await runOnStart(command, shell)}</div>;
  }

  return (
    <>
      <p>List of available commands:</p>
      <dl className="cq-grid cq-grid-cols-auto-full cq-mt-1 -cq-ml-1">
        {availableCommands.map(([commandName, commandDescription]) => (
          <Fragment key={commandName}>
            <dd
              className={cx(
                'cq-w-full cq-min-w-max cq-pl-1 cq-rounded-l-sm cq-pr-6 cq-font-bold'
              )}
              onClick={() => {
                switch (commandName) {
                  case 'ls':
                    shell.setInputValue('ls');
                    break;
                  case 'help':
                    runCommandInTerminal({ ...shell, command: 'help' });
                    break;
                  case 'history':
                    runCommandInTerminal({ ...shell, command: 'history' });
                    break;
                }
              }}
            >
              {commandName}
            </dd>
            <dt key={commandName} className="cq-w-fit cq-pr-1 cq-rounded-r-sm">
              {`-> ${commandDescription}`}
            </dt>
          </Fragment>
        ))}
      </dl>
    </>
  );
};

const help: Command<Flags> = {
  shortDesc: 'Help about any available commands',
  flags: {
    init: {
      type: 'boolean',
      shorthand: 'i',
      shortDesc: 'Display initial help message',
    },
  },
  args: { nbArgs: 0 },
  run,
  playDown: true,
};

export default help as Command;
