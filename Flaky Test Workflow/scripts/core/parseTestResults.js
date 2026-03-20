const fs = require("fs");

function readJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.log(`Failed to read/parse ${filePath}`);
    return null;
  }
}

function parseTestResults(filePath, framework) {
  const data = readJSON(filePath);
  if (!data) return [];

  if (framework === "jest") {
    return (
      data.testResults?.flatMap((suite) =>
        suite.assertionResults
          ?.filter((t) => t.status === "failed")
          .map((t) => ({
            name: t.fullName,
            message: t.failureMessages?.join("\n") || "",
            file: suite.name,
          })),
      ) || []
    );
  }

  if (framework === "vitest") {
    return (
      data.testResults?.flatMap((suite) =>
        suite.assertionResults
          ?.filter((t) => t.status === "fail")
          .map((t) => ({
            name: t.fullName,
            message: t.errors?.map((e) => e.message).join("\n") || "",
            file: suite.name,
          })),
      ) || []
    );
  }

  if (framework === "mocha") {
    return (data.failures || []).map((t) => ({
      name: t.fullTitle,
      message: t.err?.message || "",
      file: t.file,
    }));
  }

  if (framework === "cypress") {
    return (data.failures || []).map((t) => ({
      name: t.fullTitle,
      message: t.err?.message || "",
      file: t.file,
    }));
  }

  if (framework === "playwright") {
    const results = [];

    data.suites?.forEach((suite) => {
      suite.specs?.forEach((spec) => {
        spec.tests?.forEach((test) => {
          test.results?.forEach((result) => {
            if (result.status === "failed") {
              results.push({
                name: spec.title,
                message: result.error?.message || "",
                file: spec.file,
              });
            }
          });
        });
      });
    });

    return results;
  }

  return [];
}

module.exports = { parseTestResults };
