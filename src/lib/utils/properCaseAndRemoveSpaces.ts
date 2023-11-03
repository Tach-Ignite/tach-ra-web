export function properCaseAndRemoveSpaces(input: string): string {
  const words = input.split(' ');

  const properCasedWords = words.map((word) => {
    const firstLetter = word.length > 0 ? word.charAt(0).toUpperCase() : '';
    const restOfWord = word.length > 1 ? word.slice(1).toLowerCase() : '';
    return firstLetter + restOfWord;
  });

  return properCasedWords.join('');
}
