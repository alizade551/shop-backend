export const extractFromText = (text: string, regex: RegExp) => {
  const matches = text.match(regex);
  const lastIndex = matches ? matches.length - 1 : -1;
  return lastIndex >= 0 ? matches[lastIndex] : null;
};
