import React, { FC, ReactNode } from 'react';

export type Output = {
  command?: string;
  output: ReactNode;
  promptPrefix?: ReactNode;
};

export interface CommandOutputProps extends Output {
  className?: string;
}

const CommandOutput: FC<CommandOutputProps> = ({
  command,
  output,
  promptPrefix,
  className,
}) => {
  const sanitizedCommand = command && command.trim();

  const copyCommandToClipboard = () => {
    if (sanitizedCommand) {
      navigator.clipboard.writeText(sanitizedCommand);
    }
  };

  return (
    <pre className={className}>
      {command ? (
        <code className="flex mb-1">
          {promptPrefix}
          <span
            className="font-mono flex hover:underline cursor-pointer"
            onClick={copyCommandToClipboard}
            title={`Copy ${command} to clipboard`}
          >
            {sanitizedCommand}
          </span>
        </code>
      ) : null}
      {output}
    </pre>
  );
};

export default CommandOutput;
