import { Fragment } from 'react';
import { Command, RunCommand } from '../..';

const run: RunCommand = (_, { history }) => {
  if (history.length === 0) {
    return 'No history found. Start running commands to fill history!';
  }

  return (
    <dl className="grid grid-cols-auto-full mt-1 -ml-1">
      {history.map((command, index) => (
        <Fragment key={`${command}-${index}`}>
          <dt className="pl-1 pr-6 font-bold">{index}</dt>
          <dd
            className="w-fit hover:underline cursor-pointer"
            onClick={() => navigator.clipboard.writeText(command)}
          >
            {command}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
};

const history: Command = {
  shortDesc: 'Show commands history',
  args: { nbArgs: 0 },
  run,
};

export default history;
