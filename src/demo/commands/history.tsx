import { Fragment } from 'react';
import { Command, RunCommand } from '../..';

const run: RunCommand = (_, { history }) => {
  if (history.length === 0) {
    return 'No history found. Start running commands to fill history!';
  }

  return (
    <dl className="cq-grid cq-grid-cols-auto-full cq-mt-1 -cq-ml-1">
      {history.map((command, index) => (
        <Fragment key={`${command}-${index}`}>
          <dt className="cq-pl-1 cq-pr-6 cq-font-bold">{index}</dt>
          <dd
            className="cq-w-fit hover:cq-underline cq-cursor-pointer"
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
