import {
  Commands,
  dispatchKeyboardEventInTerminal,
  RunCommand,
  runCommandInTerminal,
} from '../..';
import help from './help';
import history from './history';
import ls from './ls';

const commands: Commands = {
  history,
  ls,
  help,
};

export default commands;

export const runOnStart: RunCommand = (_, shell) => {
  const runHelp = () => runCommandInTerminal({ ...shell, command: 'help' });

  const runHistory = () =>
    runCommandInTerminal({ ...shell, command: 'history' });

  const pressTabKey = () =>
    dispatchKeyboardEventInTerminal({
      input: shell.input,
      event: {
        type: 'keydown',
        eventInitDict: {
          bubbles: true,
          key: 'Tab',
        },
      },
    });

  return (
    <p className="border-white border-[1px] rounded-md p-5">
      Command run on start!
      <br />
      <br />- To list available commands, type{' '}
      <span className="link" onClick={runHelp}>
        help
      </span>
      .
      <br />- To discover commands,{' '}
      <span className="link" onClick={pressTabKey}>
        press tab key
      </span>
      .
      <br />- To navigate through your commands history, type{' '}
      <span className="link" onClick={runHistory}>
        history
      </span>{' '}
      or press key up/down.
    </p>
  );
};
