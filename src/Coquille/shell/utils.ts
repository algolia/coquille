export const commandToWords = (command: string) => {
  let commandWords: string[] = [];
  let currentWord: string = '';
  let isParsingDoubleQuotationWord = false;
  let isParsingSingleQuotationWord = false;

  for (let i = 0; i <= command.length - 1; i++) {
    const char = command[i];
    const isLastChar = i === command.length - 1;

    if (char === `"` && !isParsingSingleQuotationWord) {
      // End of word with double quotation mark
      if (isParsingDoubleQuotationWord) {
        commandWords = [...commandWords, currentWord];
        currentWord = '';
        isParsingDoubleQuotationWord = false;
        continue;
      }
      isParsingDoubleQuotationWord = true;
      continue;
    }
    if (char === `'` && !isParsingDoubleQuotationWord) {
      // End of word single quotation mark
      if (isParsingSingleQuotationWord) {
        commandWords = [...commandWords, currentWord];
        currentWord = '';
        isParsingSingleQuotationWord = false;
        continue;
      }
      isParsingSingleQuotationWord = true;
      continue;
    }
    if (isParsingSingleQuotationWord || isParsingDoubleQuotationWord) {
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
