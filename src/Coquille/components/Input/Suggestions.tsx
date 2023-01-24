import cx from 'classnames';
import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
} from 'react';
import { ForwardRefRenderFunction } from 'react';
import { Suggestion } from '../../types';

export type SuggestionsHandle = {
  container: () => HTMLDListElement | null;
  selectedSuggestion: () => HTMLElement | null;
};

interface SuggestionsProps {
  suggestions: Suggestion[];
  selectedSuggestion: Suggestion | null;
}

const Suggestions: ForwardRefRenderFunction<
  SuggestionsHandle,
  SuggestionsProps
> = ({ suggestions, selectedSuggestion }, ref) => {
  const containerRef = useRef<HTMLDListElement>(null);
  const selectedSuggestionRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => ({
    container: () => containerRef.current,
    selectedSuggestion: () => selectedSuggestionRef.current,
  }));

  return (
    <dl
      ref={containerRef}
      className={cx(
        'grid grid-cols-2-auto-1fr mt-1 -ml-1 max-h-50p relative',
        'overflow-scroll no-scrollbar no-scrollbar::-webkit-scrollbar'
      )}
    >
      {suggestions.map(({ name, alias, description }) => {
        const isSuggestionSelected = Boolean(
          selectedSuggestion &&
            name === selectedSuggestion.name &&
            description === selectedSuggestion.description
        );

        return (
          <Fragment key={name}>
            <dt
              className={cx('w-full min-w-max pl-1 rounded-l-sm', {
                'bg-gray-200 text-gray-700': isSuggestionSelected,
                'text-gray-400': !isSuggestionSelected,
                'pr-6': Boolean(name),
              })}
              ref={isSuggestionSelected ? selectedSuggestionRef : undefined}
            >
              {name}
            </dt>
            <dt
              className={cx('min-w-max pr-6', {
                'bg-gray-200 text-gray-700': isSuggestionSelected,
                'text-gray-400': !isSuggestionSelected,
              })}
            >
              {alias}
            </dt>
            <dd
              key={name}
              className={cx('w-fit pr-1 inline rounded-r-sm', {
                'bg-gray-200 text-gray-700': isSuggestionSelected,
                'text-gray-400': !isSuggestionSelected,
              })}
            >
              {description ? `-> ${description}` : null}
            </dd>
          </Fragment>
        );
      })}
    </dl>
  );
};

export default forwardRef(Suggestions);
