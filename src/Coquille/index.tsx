import cx from 'classnames';
import {
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import CommandOutput, { Output } from './components/CommandOutput';
import Input from './components/Input';
import { runCommandInTerminal } from './helpers';
import './index.css';
import { Commands, ParsedCommand, RunCommand } from './types';

interface CoquilleProps {
  className?: string;
  commands: Commands;
  promptPrefix?: ReactNode;
  runOnStart?: RunCommand;
  onCommandRun?: (rawCommand: string, parsedCommand?: ParsedCommand) => void;
}

export type CoquilleHandle = {
  runCommand: (command: string) => void;
};

const Coquille: ForwardRefRenderFunction<CoquilleHandle, CoquilleProps> = (
  { className, promptPrefix, commands, runOnStart, onCommandRun },
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
    scrollToBottom;
  }, [output]);

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
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      onFocus={focusInput}
      className={cx(
        className,
        'cq-overflow-scroll cq-no-scrollbar cq-no-scrollbar::-webkit-scrollbar'
      )}
    >
      {/* Output history */}
      {output.map((commandOutput, index) => (
        <CommandOutput
          key={`${commandOutput.command}-${index}`}
          promptPrefix={promptPrefix}
          className="cq-mb-4 overflow-auto"
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
        onCommandRun={onCommandRun}
      />
    </div>
  );
};

export default forwardRef(Coquille);
