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
        <code className="cq-flex cq-mb-1">
          {promptPrefix}
          <span
            className="cq-font-mono cq-flex hover:cq-underline cq-cursor-pointer"
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
