import {
  Dispatch,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
  forwardRef,
  useEffect,
} from 'react';
import { Commands, ParsedCommand } from '../../types';
import { CommandOutputProps } from '../CommandOutput';
import Suggestions from './Suggestions';
import useHistory from './hooks/history';
import useInput from './hooks/input';
import useSuggestions from './hooks/suggestions';

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onKeyDown'
  > {
  commands: Commands;
  scrollToBottom: () => void;
  setInputValue: (value: string) => void;
  setOutput: Dispatch<SetStateAction<CommandOutputProps[]>>;
  promptPrefix?: ReactNode;
  onCommandRun?: (rawCommand: string, parsedCommand?: ParsedCommand) => void;
}

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    promptPrefix,
    commands,
    setInputValue,
    setOutput,
    scrollToBottom,
    onCommandRun,
    ...inputProps
  },
  ref
) => {
  // Suggestions
  const {
    suggestionsRef,
    clearSuggestions,
    navigateSuggestion,
    suggestions,
    setSelectedSuggestionIndex,
    setSuggestions,
    selectedSuggestion,
  } = useSuggestions();
  // History
  const { history, setHistory, setSelectedHistoryIndex, navigateHistory } =
    useHistory(setInputValue);
  // Input
  const { onInputChange, onInputKeyDown } = useInput({
    ref,
    commands,
    setInputValue,
    suggestions,
    selectedSuggestion,
    setSuggestions,
    setSelectedSuggestionIndex,
    clearSuggestions,
    navigateSuggestion,
    history,
    setHistory,
    navigateHistory,
    setSelectedHistoryIndex,
    scrollToBottom,
    setOutput,
    onCommandRun,
  });

  useEffect(() => {
    scrollToBottom();
  }, [suggestions]);

  return (
    <>
      {/* Input field */}
      <pre className="cq-flex">
        {promptPrefix ? <span>{promptPrefix}</span> : null}
        <input
          ref={ref}
          type="text"
          className="cq-w-full cq-bg-transparent cq-border-none cq-outline-none cq-flex-grow"
          onChange={onInputChange}
          onKeyDown={onInputKeyDown}
          spellCheck={false}
          {...inputProps}
        />
      </pre>
      {/* Suggestions display */}
      {suggestions && suggestions.length >= 0 ? (
        <Suggestions
          ref={suggestionsRef}
          suggestions={suggestions}
          selectedSuggestion={selectedSuggestion}
        />
      ) : null}
    </>
  );
};

export default forwardRef(Input);
