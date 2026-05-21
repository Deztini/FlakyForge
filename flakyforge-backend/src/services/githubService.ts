import axios, { AxiosError } from "axios";
import { ApiError } from "../utils/ApiError";

const GITHUB_API = "https://api.github.com";

const buildHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
  "X-GitHub-Api-Version": "2026-03-10",
});

interface GitHubFileResponse {
  content: string;
  sha: string;
  name: string;
  path: string;
}

interface FileContent {
  content: string;
  sha: string;
}

interface PullRequestResult {
  prNumber: number;
  prUrl: string;
}

const decodeBase64 = (encoded: string): string =>
  Buffer.from(encoded, "base64").toString("utf-8");

const encodeBase64 = (content: string): string =>
  Buffer.from(content, "utf-8").toString("base64");

const handleGithubError = (error: unknown, fallbackMessage: string): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const githubMessage = error.response?.data?.message || fallbackMessage;

    if (status === 401) {
      throw ApiError.unauthorized("Invalid GitHub token");
    }

    if (status === 404) {
      throw ApiError.notFound(githubMessage);
    }

    if (status === 422) {
      throw ApiError.badRequest(githubMessage);
    }

    throw ApiError.internal(githubMessage);
  }

  throw ApiError.internal(fallbackMessage);
};

const spliceFixIntoFile = (
  fileContent: string,
  testName: string,
  fixedCode: string,
): string => {
  const lines = fileContent.split("\n");

  const escapedName = testName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const testStartPattern = new RegExp(
    `(it|test)\\s*\\(\\s*['"\`]${escapedName}['"\`]`,
  );

  const startLineIndex = lines.findIndex((line) => testStartPattern.test(line));

  if (startLineIndex === -1) {
    throw ApiError.notFound(
      `Could not locate test "${testName}" in the file. The test name may have changed.`,
    );
  }

  let braceCount = 0;
  let endLineIndex = startLineIndex;
  let foundOpeningBrace = false;

  for (let i = startLineIndex; i < lines.length; i++) {
    const line = lines[i];

    for (const char of line) {
      if (char === "{") {
        braceCount++;
        foundOpeningBrace = true;
      }
      if (char === "}") braceCount--;
    }

    if (foundOpeningBrace && braceCount === 0) {
      endLineIndex = i;
      break;
    }
  }

  const before = lines.slice(0, startLineIndex).join("\n");
  const after = lines.slice(endLineIndex + 1).join("\n");

  return `${before}\n${fixedCode.trim()}\n${after}`;
};

const createOrReplaceBranch = async (
  token: string,
  fullName: string,
  branchName: string,
  sha: string,
) => {
  try {
    await axios.post(
      `${GITHUB_API}/repos/${fullName}/git/refs`,
      {
        ref: `refs/heads/${branchName}`,
        sha,
      },
      {
        headers: buildHeaders(token),
      },
    );
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 422 &&
      error.response?.data?.message === "Reference already exists"
    ) {
      await axios.delete(
        `${GITHUB_API}/repos/${fullName}/git/refs/heads/${branchName}`,
        {
          headers: buildHeaders(token),
        },
      );

      await axios.post(
        `${GITHUB_API}/repos/${fullName}/git/refs`,
        {
          ref: `refs/heads/${branchName}`,
          sha,
        },
        {
          headers: buildHeaders(token),
        },
      );

      return;
    }

    throw error;
  }
};

export const GithubService = {
  async getFileContent(
    token: string,
    fullName: string,
    filePath: string,
    branch: string,
  ) {
    try {
      const { data } = await axios.get<GitHubFileResponse>(
        `${GITHUB_API}/repos/${fullName}/contents/${filePath}`,
        {
          headers: buildHeaders(token),
          params: { ref: branch },
        },
      );

      return {
        content: decodeBase64(data.content),
        sha: data.sha,
      };
    } catch (error) {
      return handleGithubError(error, `Failed to fetch file "${filePath}"`);
    }
  },

  async createBranch(
    token: string,
    fullName: string,
    baseBranch: string,
    newBranchName: string,
  ) {
    try {
      const { data: refData } = await axios.get<{ object: { sha: string } }>(
        `${GITHUB_API}/repos/${fullName}/git/ref/heads/${baseBranch}`,
        { headers: buildHeaders(token) },
      );

      const baseSha = refData.object.sha;

      await this.createOrReplaceBranch(token, fullName, newBranchName, baseSha);
    } catch (error) {
      handleGithubError(error, `Failed to create branch "${newBranchName}"`);
    }
  },

  async createOrReplaceBranch(
    token: string,
    fullName: string,
    branchName: string,
    sha: string,
  ) {
    try {
      await axios.post(
        `${GITHUB_API}/repos/${fullName}/git/refs`,
        {
          ref: `refs/heads/${branchName}`,
          sha,
        },
        {
          headers: buildHeaders(token),
        },
      );
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 422 &&
        error.response?.data?.message === "Reference already exists"
      ) {
        await axios.delete(
          `${GITHUB_API}/repos/${fullName}/git/refs/heads/${branchName}`,
          {
            headers: buildHeaders(token),
          },
        );

        await axios.post(
          `${GITHUB_API}/repos/${fullName}/git/refs`,
          {
            ref: `refs/heads/${branchName}`,
            sha,
          },
          {
            headers: buildHeaders(token),
          },
        );

        return;
      }

      throw error;
    }
  },

  async commitFix(
    token: string,
    fullName: string,
    filePath: string,
    originalContent: string,
    fixedTestCode: string,
    testName: string,
    branchName: string,
    fileSha: string,
  ) {
    try {
      const updatedContent = spliceFixIntoFile(
        originalContent,
        testName,
        fixedTestCode,
      );

      await axios.put(
        `${GITHUB_API}/repos/${fullName}/contents/${filePath}`,
        {
          message: `fix: resolve flaky test "${testName}"`,
          content: encodeBase64(updatedContent),
          sha: fileSha,
          branch: branchName,
        },
        { headers: buildHeaders(token) },
      );
    } catch (error) {
      handleGithubError(error, `Failed to commit fix to "${branchName}"`);
    }
  },

  async openPullRequest(
    token: string,
    fullName: string,
    baseBranch: string,
    fixBranch: string,
    testName: string,
    explanation: string,
  ) {
    try {
      const { data: pr } = await axios.post<{
        number: number;
        html_url: string;
      }>(
        `${GITHUB_API}/repos/${fullName}/pulls`,
        {
          title: `fix: resolve flaky test "${testName}"`,
          body: explanation,
          head: fixBranch,
          base: baseBranch,
        },
        { headers: buildHeaders(token) },
      );

      return {
        prNumber: pr.number,
        prUrl: pr.html_url,
      };
    } catch (error) {
      return handleGithubError(error, "Failed to open pull request");
    }
  },

  async getPullRequest(token: string, prNumber: number, fullName: string) {
    try {
      const { data } = await axios.get(
        `${GITHUB_API}/repos/${fullName}/pulls/${prNumber}`,
        { headers: buildHeaders(token) },
      );
      return data;
    } catch (error) {
      return handleGithubError(error, `Failed to fetch PR #${prNumber}`);
    }
  },
};
