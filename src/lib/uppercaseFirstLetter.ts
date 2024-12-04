export const capitalizeWords = (sentence: string) => {
  return sentence.replace(/\b\w/g, (char) => char.toUpperCase());
};
