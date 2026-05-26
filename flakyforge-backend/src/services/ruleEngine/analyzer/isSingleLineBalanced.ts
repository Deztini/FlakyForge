export const isSingleLineBalanced = (line: string): boolean => {
  const opens = (line.match(/\(/g) || []).length;
  const closes = (line.match(/\)/g) || []).length;
  return opens === closes;
};
 