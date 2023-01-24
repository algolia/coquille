import React from 'react';

type DispatchKeyboardEventInTerminal = (args: {
  event: { eventInitDict?: KeyboardEventInit; type: string };
  input: React.RefObject<HTMLInputElement>;
}) => void;
export const dispatchKeyboardEventInTerminal: DispatchKeyboardEventInTerminal =
  ({ event, input }) => {
    if (!input.current) {
      return;
    }
    input.current.focus();
    input.current.dispatchEvent(
      new KeyboardEvent(event.type, event.eventInitDict)
    );
  };

type RunCommandInTerminal = (args: {
  command: string;
  input: React.RefObject<HTMLInputElement>;
  setInputValue: (value: string) => void;
}) => void;
export const runCommandInTerminal: RunCommandInTerminal = ({
  command,
  input,
  setInputValue,
}) => {
  if (!input.current) {
    return;
  }
  setInputValue(command);
  input.current.focus();
  dispatchKeyboardEventInTerminal({
    input,
    event: {
      type: 'keydown',
      eventInitDict: {
        bubbles: true,
        key: 'Enter',
      },
    },
  });
};
