export const buildHelperMocks = (
  helperNames: string[],
  mockPrefix: string,
  sourceModule: string,
): string => {
  const spyLines = helperNames
    .map((name) => {
      if (name === "sleep") {
        return `  ${mockPrefix}.spyOn(helpers, 'sleep').mockResolvedValue(undefined);`;
      }
      if (name === "fetchWithTimeout") {
        return (
          `  ${mockPrefix}.spyOn(helpers, 'fetchWithTimeout').mockImplementation(\n` +
          `    async (fn: () => Promise<unknown>, _timeout: number) => fn()\n` +
          `  );`
        );
      }
      if (name === "withRetry") {
        return (
          `  ${mockPrefix}.spyOn(helpers, 'withRetry').mockImplementation(\n` +
          `    async (fn: () => Promise<unknown>) => fn()\n` +
          `  );`
        );
      }
      if (name === "waitForEvent") {
        return `  ${mockPrefix}.spyOn(helpers, 'waitForEvent').mockResolvedValue(undefined);`;
      }
      return `  ${mockPrefix}.spyOn(helpers, '${name}').mockResolvedValue(undefined);`;
    })
    .join("\n");

  return (
    `import * as helpers from '${sourceModule}';\n\n` +
    `beforeEach(() => {\n` +
    `${spyLines}\n` +
    `});`
  );
};
