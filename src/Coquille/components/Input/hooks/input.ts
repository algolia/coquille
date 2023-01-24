import {
  ChangeEventHandler,
  Dispatch,
  ForwardedRef,
  KeyboardEventHandler,
  SetStateAction,
} from 'react';
import commandParse from '../../../shell/parse';
import suggest from '../../../shell/suggest';
import { Commands, Suggestion } from '../../../types';
import { CommandOutputProps } from '../../CommandOutput';

type Args = {
  ref: ForwardedRef<HTMLInputElement>;
  commands: Commands;
  setInputValue: (value: string) => void;
  suggestions: Suggestion[] | null;
  selectedSuggestion: Suggestion | null;
  setSuggestions: (value: SetStateAction<Suggestion[] | null>) => void;
  clearSuggestions: () => void;
  navigateSuggestion: (direction: 'up' | 'down') => void;
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  setSelectedSuggestionIndex: Dispatch<SetStateAction<number | null>>;
  navigateHistory: (direction: 'up' | 'down') => void;
  setSelectedHistoryIndex: (value: SetStateAction<number | null>) => void;
  scrollToBottom: () => void;
  setOutput: Dispatch<SetStateAction<CommandOutputProps[]>>;
};

const useInput = ({
  ref,
  commands,
  setInputValue,
  suggestions,
  selectedSuggestion,
  setSelectedSuggestionIndex,
  setSuggestions,
  clearSuggestions,
  navigateSuggestion,
  history,
  setHistory,
  navigateHistory,
  setSelectedHistoryIndex,
  scrollToBottom,
  setOutput,
}: Args) => {
  const clearInput = () => {
    setInputValue('');
    clearSuggestions();
    setSelectedHistoryIndex(null);
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { value } = event.target;
    event.preventDefault();

    if (value !== '') {
      setSuggestions(suggest(value, commands));
      scrollToBottom();
    } else {
      setSuggestions(null);
      setSelectedHistoryIndex(null);
    }
  };

  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = async event => {
    const { ctrlKey, metaKey, shiftKey, key } = event;
    const { value } = event.target as HTMLInputElement;

    if (ref === null || typeof ref === 'function') {
      return;
    }
    switch (key) {
      case 'Enter':
        // Autocomplete with selected suggestion
        if (selectedSuggestion !== null) {
          const { name: suggestionValue } = selectedSuggestion;
          let commandWords = value.split(' ');
          const lastWord = commandWords[commandWords.length - 1];

          let autocompletedInput = '';
          if (lastWord.includes(',')) {
            // Fill multiple comma separated flag values (add suggestion to last word)
            commandWords[
              commandWords.length - 1
            ] = `${lastWord}${suggestionValue}`;
            autocompletedInput = `${commandWords.join(' ')}`;
          } else {
            // Replace last word with suggestion
            commandWords[commandWords.length - 1] = suggestionValue;
            autocompletedInput = `${commandWords.join(' ')} `;
          }

          setSuggestions(suggest(autocompletedInput, commands));
          setInputValue(autocompletedInput);
          setSelectedSuggestionIndex(null);
          scrollToBottom();
          return;
        }

        if (value === '') {
          return;
        }

        // Run command
        setHistory(prevHistory => [...prevHistory, value]);
        const { error, parsedCommand, run } = commandParse(value, commands);
        let commandOutput: CommandOutputProps;
        if (error) {
          commandOutput = {
            command: value,
            output: error,
          };
        } else {
          if (run && parsedCommand && ref.current) {
            ref.current.disabled = true;
            commandOutput = {
              command: value,
              output: await run(parsedCommand, {
                input: ref,
                inputValue: value,
                setInputValue,
                history,
              }),
            };
            ref.current.disabled = false;
            ref.current.focus();
          }
        }
        setOutput(prevOutput => [...prevOutput, commandOutput]);
        clearInput();
        scrollToBottom();
        break;
      case 'Tab':
        event.preventDefault();
        // Suggest or navigate in suggestions
        if (!suggestions) {
          setSuggestions(suggest(value, commands));
          scrollToBottom();
          return;
        }
        if (shiftKey) {
          navigateSuggestion('up');
          return;
        }
        if (suggestions.length === 1) {
          // Autofill when there's only one suggestion
        }
        navigateSuggestion('down');
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (suggestions) {
          navigateSuggestion('up');
          return;
        }
        navigateHistory('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        // Navigate in suggestions
        if (suggestions) {
          navigateSuggestion('down');
          return;
        }
        navigateHistory('down');
        break;
      case 'Escape':
        setSelectedSuggestionIndex(null);
        break;
      // Keyboard shortcuts
      case 'u':
        if (ctrlKey) {
          clearInput();
        }
        break;
      case 'l':
        if (ctrlKey) {
          setOutput([]);
        }
        break;
      case 'a':
        if (metaKey) {
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  };

  return { onInputChange, onInputKeyDown };
};

export default useInput;
