import axios from "axios";
import fs from "fs";
import path from "path";
import nacl from "tweetnacl";

const WORKFLOW_ROOT = path.resolve(__dirname, "../../../Flaky Test Workflow");

function readDirRecursive(
  dirPath: string,
  baseLabel: string,
): { githubPath: string; content: string }[] {
  const results: { githubPath: string; content: string }[] = [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const githubPath = `${baseLabel}/${entry.name}`;

    if (entry.isDirectory()) {
      results.push(...readDirRecursive(fullPath, githubPath));
    } else {
      results.push({
        githubPath,
        content: Buffer.from(fs.readFileSync(fullPath)).toString("base64"),
      });
    }
  }

  return results;
}

function buildFilesToInject() {
  const files: { githubPath: string; content: string }[] = [];

  files.push({
    githubPath: ".github/workflows/flakeyradar.yml",
    content: Buffer.from(
      fs.readFileSync(
        path.join(WORKFLOW_ROOT, ".github/workflows/flakeyradar.yaml"),
      ),
    ).toString("base64"),
  });

  files.push(
    ...readDirRecursive(
      path.join(WORKFLOW_ROOT, "scripts/core"),
      "scripts/core",
    ),
  );

  files.push(
    ...readDirRecursive(
      path.join(WORKFLOW_ROOT, "scripts/utils"),
      "scripts/utils",
    ),
  );

  files.push({
    githubPath: "scripts/flakeyradar-runner.js",
    content: Buffer.from(
      fs.readFileSync(
        path.join(WORKFLOW_ROOT, "scripts/flakeyradar-runner.js"),
      ),
    ).toString("base64"),
  });

  return files;
}

const FILES_TO_INJECT = buildFilesToInject();

function encryptSecret(publicKey: string, secretValue: string): string {
  const keyBytes = Buffer.from(publicKey, "base64");

  const secretBytes = Buffer.from(secretValue);

  const encryptedBytes = nacl.box(
    secretBytes,
    new Uint8Array(24),
    new Uint8Array(keyBytes),
    nacl.box.keyPair().secretKey,
  );

  return Buffer.from(encryptedBytes).toString("base64");
}

async function getRepoPublicKey(
  owner: string,
  repo: string,
  accessToken: string,
): Promise<{ key: string; key_id: string }> {
  const { data } = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  return { key: data.key, key_id: data.key_id };
}

async function setRepoSecret(
  owner: string,
  repo: string,
  secretName: string,
  secretValue: string,
  accessToken: string,
): Promise<void> {
  const { key, key_id } = await getRepoPublicKey(owner, repo, accessToken);

  const encryptedValue = encryptSecret(key, secretValue);

  await axios.put(
    `https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`,
    {
      encrypted_value: encryptedValue,
      key_id,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
}

export async function injectWorkflowFiles(
  owner: string,
  repo: string,
  branch: string,
  accessToken: string,
  apiKey: string,
  apiUrl: string,
) {
  for (const file of FILES_TO_INJECT) {
    try {
      await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.githubPath}`,
        {
          message: `chore: add FlakeyRadar file (${file.githubPath}) [skip-flakeyradar]`,
          content: file.content,
          branch,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    } catch (err: any) {
      if (err.response?.status !== 422) {
        throw new Error(
          `Failed to inject ${file.githubPath}: ${err.response?.data?.message}`,
        );
      }
    }
  }

  await setRepoSecret(owner, repo, "FLAKEYRADAR_API_KEY", apiKey, accessToken);
  await setRepoSecret(owner, repo, "FLAKEYRADAR_API_URL", apiUrl, accessToken);
}
