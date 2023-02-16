import cx from 'classnames';
import {
  ForwardRefRenderFunction,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import '../index.css';
import CommandOutput, { Output } from './components/CommandOutput';
import Input from './components/Input';
import { runCommandInTerminal } from './helpers';
import { Commands, RunCommand } from './types';

interface CoquilleProps {
  className?: string;
  commands: Commands;
  promptPrefix?: ReactNode;
  runOnStart?: RunCommand;
}

export type CoquilleHandle = {
  runCommand: (command: string) => void;
};

const Coquille: ForwardRefRenderFunction<CoquilleHandle, CoquilleProps> = (
  { className, promptPrefix, commands, runOnStart },
  ref
) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setInputValue = (value: string) => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.value = value;
  };

  useImperativeHandle(ref, () => ({
    runCommand: (command: string) => {
      runCommandInTerminal({ command, input: inputRef, setInputValue });
    },
  }));

  // I/O
  const [output, setOutput] = useState<Output[]>([]);

  useEffect(() => {
    focusInput();
    if (runOnStart) {
      const initRun = async () => {
        const inputValue = inputRef.current?.value || '';
        const commandOutput: Output = {
          output: await runOnStart(
            { command: [] },
            {
              input: inputRef,
              inputValue,
              setInputValue,
              history: [],
            }
          ),
        };
        setOutput([commandOutput]);
      };
      initRun();
    }
  }, [runOnStart]);

  const focusInput = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.focus({ preventScroll: true });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 0);
  };

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      onFocus={focusInput}
      className={cx(
        className,
        'overflow-scroll no-scrollbar no-scrollbar::-webkit-scrollbar'
      )}
    >
      {/* Output history */}
      {output.map((commandOutput, index) => (
        <CommandOutput
          key={`${commandOutput.command}-${index}`}
          promptPrefix={promptPrefix}
          className="mb-4 overflow-auto"
          {...commandOutput}
        />
      ))}
      {/* Input with suggestions */}
      <Input
        ref={inputRef}
        commands={commands}
        setInputValue={setInputValue}
        setOutput={setOutput}
        scrollToBottom={scrollToBottom}
        promptPrefix={promptPrefix}
      />
    </div>
  );
};

export default Coquille;
