import {
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from 'react';
import React, { Dispatch, forwardRef } from 'react';
import { Commands } from '../../types';
import { CommandOutputProps } from '../CommandOutput';
import useHistory from './hooks/history';
import useInput from './hooks/input';
import useSuggestions from './hooks/suggestions';
import Suggestions from './Suggestions';

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'onKeyDown'
  > {
  commands: Commands;
  setInputValue: (value: string) => void;
  setOutput: Dispatch<SetStateAction<CommandOutputProps[]>>;
  scrollToBottom: () => void;
  promptPrefix?: ReactNode;
}

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    promptPrefix,
    commands,
    setInputValue,
    setOutput,
    scrollToBottom,
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
  const {
    history,
    setHistory,
    setSelectedHistoryIndex,
    navigateHistory,
  } = useHistory(setInputValue);
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
  });

  return (
    <>
      {/* Input field */}
      <pre className="flex">
        {promptPrefix ? <span>{promptPrefix}</span> : null}
        <input
          ref={ref}
          type="text"
          className="w-full bg-transparent border-none outline-none flex-grow"
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
