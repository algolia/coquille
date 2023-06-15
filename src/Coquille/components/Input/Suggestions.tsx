import cx from 'classnames';
import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useRef,
  ForwardRefRenderFunction,
} from 'react';
import { Suggestion } from '../../types';

export type SuggestionsHandle = {
  container: () => HTMLDListElement | null;
  selectedSuggestion: () => HTMLElement | null;
};

interface SuggestionsProps {
  selectedSuggestion: Suggestion | null;
  suggestions: Suggestion[];
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
        'cq-grid cq-grid-cols-2-auto-1fr cq-mt-1 -cq-ml-1 cq-max-h-50p cq-relative cq-pl-1',
        'cq-overflow-scroll cq-no-scrollbar cq-no-scrollbar::-webkit-scrollbar'
      )}
    >
      {suggestions.map(({ name, alias, description, playDown }) => {
        const isSuggestionSelected = Boolean(
          selectedSuggestion &&
            name === selectedSuggestion.name &&
            description === selectedSuggestion.description
        );

        const suggestionClassName = cx({
          'cq-bg-gray-200 text-gray-700': isSuggestionSelected,
          'cq-bg-opacity-50': isSuggestionSelected && playDown,
          'cq-text-gray-300': !isSuggestionSelected,
          'cq-text-opacity-40': playDown && !isSuggestionSelected,
        });

        return (
          <Fragment key={name}>
            <dt
              className={cx(
                'cq-w-full cq-min-w-max cq-pl-1 cq-rounded-l-sm',
                suggestionClassName,
                { 'cq-pr-6': Boolean(name) }
              )}
              ref={isSuggestionSelected ? selectedSuggestionRef : undefined}
            >
              {name}
            </dt>
            <dt className={cx('cq-min-w-max pr-6', suggestionClassName)}>
              {alias}
            </dt>
            <dd
              key={name}
              className={cx(
                'cq-w-fit cq-pr-1 cq-inline cq-rounded-r-sm',
                suggestionClassName
              )}
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
