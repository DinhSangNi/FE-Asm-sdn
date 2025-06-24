export const isInteger = (str: string): boolean => {
  return /^-?\d+$/.test(str.trim());
};
