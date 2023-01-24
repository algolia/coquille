import { useRef, useState } from 'react';
import { SuggestionsHandle } from '../Suggestions';
import { Suggestion } from '../../../types';

const useSuggestions = () => {
  // Suggestions container ref
  const suggestionsRef = useRef<SuggestionsHandle>(null);
  // command/arg/flag suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<
    number | null
  >(null);

  const scrollToSelectedSuggestion = () => {
    setTimeout(() => {
      if (!suggestionsRef.current) {
        return;
      }

      const suggestionContainer = suggestionsRef.current.container();
      const selectedSuggestion = suggestionsRef.current.selectedSuggestion();
      if (!suggestionContainer || !selectedSuggestion) {
        return;
      }

      const parentPos = suggestionContainer.getBoundingClientRect();
      const childPos = selectedSuggestion.getBoundingClientRect();
      const isSuggestionOutOfContainerView =
        childPos.top - parentPos.top < 0 ||
        childPos.bottom - parentPos.bottom > 0;
      if (!isSuggestionOutOfContainerView) {
        return;
      }

      suggestionContainer.scrollTo({
        top: selectedSuggestion.offsetTop,
        behavior: 'smooth',
      });
    }, 0);
  };

  const clearSuggestions = () => {
    setSuggestions(null);
    setSelectedSuggestionIndex(null);
  };

  const navigateSuggestion = (direction: 'up' | 'down') => {
    if (!suggestions) {
      return;
    }
    // Navigate on suggestions
    const maxSuggestionIndex = suggestions.length - 1;

    if (direction === 'up') {
      if (selectedSuggestionIndex === null || selectedSuggestionIndex - 1 < 0) {
        setSelectedSuggestionIndex(maxSuggestionIndex);
        scrollToSelectedSuggestion();
        return;
      }
      setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
      scrollToSelectedSuggestion();
      return;
    }

    if (
      selectedSuggestionIndex === null ||
      selectedSuggestionIndex + 1 > maxSuggestionIndex
    ) {
      setSelectedSuggestionIndex(0);
      scrollToSelectedSuggestion();
      return;
    }
    setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
    scrollToSelectedSuggestion();
  };

  return {
    suggestionsRef,
    clearSuggestions,
    navigateSuggestion,
    suggestions,
    setSuggestions,
    setSelectedSuggestionIndex,
    selectedSuggestion:
      suggestions && suggestions.length > 0 && selectedSuggestionIndex !== null
        ? suggestions[selectedSuggestionIndex]
        : null,
  };
};

export default useSuggestions;
