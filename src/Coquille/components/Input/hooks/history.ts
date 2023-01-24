import { useState } from 'react';

const useHistory = (setValue: (value: string) => void) => {
  // command history
  const [history, setHistory] = useState<string[]>([]);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState<
    number | null
  >(null);

  const navigateHistory = (direction: 'up' | 'down') => {
    if (history.length === 0) {
      return;
    }

    let newSelectedHistoryIndex = selectedHistoryIndex;
    if (direction === 'up') {
      if (selectedHistoryIndex === null) {
        newSelectedHistoryIndex = history.length - 1;
      }
      if (selectedHistoryIndex && selectedHistoryIndex > 0) {
        newSelectedHistoryIndex = selectedHistoryIndex - 1;
      }
    } else if (
      selectedHistoryIndex !== null &&
      selectedHistoryIndex < history.length - 1
    ) {
      newSelectedHistoryIndex = selectedHistoryIndex + 1;
    }

    if (newSelectedHistoryIndex === null) {
      return;
    }
    setSelectedHistoryIndex(newSelectedHistoryIndex);
    setValue(history[newSelectedHistoryIndex]);
  };

  return { history, setHistory, navigateHistory, setSelectedHistoryIndex };
};

export default useHistory;
