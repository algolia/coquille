export const commandToWords = (command: string) => {
  let commandWords: string[] = [];
  let currentWord: string = '';
  let isParsingQuotationWord = false;

  for (let i = 0; i <= command.length - 1; i++) {
    const char = command[i];
    const isLastChar = i === command.length - 1;

    if (char === `"`) {
      // End of word with quotation mark
      if (isParsingQuotationWord) {
        commandWords = [...commandWords, currentWord];
        currentWord = '';
        isParsingQuotationWord = false;
        continue;
      }
      isParsingQuotationWord = true;
      continue;
    }
    if (isParsingQuotationWord) {
      currentWord += char;
      continue;
    }
    if (char === ' ') {
      if (currentWord) {
        // End of word
        commandWords = [...commandWords, currentWord];
        currentWord = '';
      }
      continue;
    }
    if (isLastChar) {
      commandWords = [...commandWords, `${currentWord}${char}`];
      continue;
    }
    currentWord += char;
  }

  return commandWords;
};

export const isWordFlagName = (flagName: string): boolean =>
  flagName[0] === '-';

export const sanitizeFlag = (rawFlag: string): string =>
  rawFlag.replace(/^-+/, '');
