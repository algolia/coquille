import { Command, RunCommand } from '../..';

const MOCKED_FILES = ['readme.txt', 'index.js', 'coquille.ts'];

const run: RunCommand = () => (
  <ul>
    {MOCKED_FILES.map((fileName) => (
      <li key={fileName}>{fileName}</li>
    ))}
  </ul>
);

const ls: Command = {
  shortDesc: 'List mocked files and folders',
  args: { nbArgs: 0 },
  run,
};

export default ls;
