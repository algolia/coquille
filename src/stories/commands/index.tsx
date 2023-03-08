import {
  Commands,
  dispatchKeyboardEventInTerminal,
  RunCommand,
  runCommandInTerminal,
} from '../..';
import help from './help';
import history from './history';

const commands: Commands = {
  help,
  history,
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
      This is run on terminal start!
      <br />
      <br />- To list available commands, type{' '}
      <span onClick={runHelp}>help</span>
      .
      <br />- To discover commands,{' '}
      <span onClick={pressTabKey}>press tab key</span>
      .
      <br />- To navigate through your commands history, type{' '}
      <span onClick={runHistory}>history</span> or press key up/down.
    </p>
  );
};
