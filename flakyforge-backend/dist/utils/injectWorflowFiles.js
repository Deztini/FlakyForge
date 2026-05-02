"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectWorkflowFiles = injectWorkflowFiles;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
const WORKFLOW_ROOT = path_1.default.resolve(__dirname, "../../../Flaky Test Workflow");
function readDirRecursive(dirPath, baseLabel) {
    const results = [];
    const entries = fs_1.default.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path_1.default.join(dirPath, entry.name);
        const githubPath = `${baseLabel}/${entry.name}`;
        if (entry.isDirectory()) {
            results.push(...readDirRecursive(fullPath, githubPath));
        }
        else {
            results.push({
                githubPath,
                content: Buffer.from(fs_1.default.readFileSync(fullPath)).toString("base64"),
            });
        }
    }
    return results;
}
function buildFilesToInject() {
    const files = [];
    files.push({
        githubPath: ".github/workflows/flakeyradar.yml",
        content: Buffer.from(fs_1.default.readFileSync(path_1.default.join(WORKFLOW_ROOT, ".github/workflows/flakeyradar.yaml"))).toString("base64"),
    });
    files.push(...readDirRecursive(path_1.default.join(WORKFLOW_ROOT, "scripts/core"), "scripts/core"));
    files.push(...readDirRecursive(path_1.default.join(WORKFLOW_ROOT, "scripts/utils"), "scripts/utils"));
    files.push({
        githubPath: "scripts/flakeyradar-runner.js",
        content: Buffer.from(fs_1.default.readFileSync(path_1.default.join(WORKFLOW_ROOT, "scripts/flakeyradar-runner.js"))).toString("base64"),
    });
    return files;
}
const FILES_TO_INJECT = buildFilesToInject();
function encryptSecret(publicKey, secretValue) {
    return __awaiter(this, void 0, void 0, function* () {
        yield libsodium_wrappers_1.default.ready;
        const sodium = libsodium_wrappers_1.default;
        const keyBytes = sodium.from_base64(publicKey, sodium.base64_variants.ORIGINAL);
        const secretBytes = sodium.from_string(secretValue);
        const encryptedBytes = sodium.crypto_box_seal(secretBytes, keyBytes);
        return sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);
    });
}
function getRepoPublicKey(owner, repo, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(`https://api.github.com/repos/${owner}/${repo}/actions/secrets/public-key`, { headers: { Authorization: `Bearer ${accessToken}` } });
        return { key: data.key, key_id: data.key_id };
    });
}
function setRepoSecret(owner, repo, secretName, secretValue, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const { key, key_id } = yield getRepoPublicKey(owner, repo, accessToken);
        const encryptedValue = yield encryptSecret(key, secretValue);
        yield axios_1.default.put(`https://api.github.com/repos/${owner}/${repo}/actions/secrets/${secretName}`, {
            encrypted_value: encryptedValue,
            key_id,
        }, { headers: { Authorization: `Bearer ${accessToken}` } });
    });
}
function injectWorkflowFiles(owner, repo, branch, accessToken, apiKey, apiUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        for (const file of FILES_TO_INJECT) {
            try {
                yield axios_1.default.put(`https://api.github.com/repos/${owner}/${repo}/contents/${file.githubPath}`, {
                    message: `chore: add FlakeyRadar file (${file.githubPath}) [skip-flakeyradar]`,
                    content: file.content,
                    branch,
                }, { headers: { Authorization: `Bearer ${accessToken}` } });
            }
            catch (err) {
                if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) !== 422) {
                    throw new Error(`Failed to inject ${file.githubPath}: ${(_c = (_b = err.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message}`);
                }
            }
        }
        yield setRepoSecret(owner, repo, "FLAKEYRADAR_API_KEY", apiKey, accessToken);
        yield setRepoSecret(owner, repo, "FLAKEYRADAR_API_URL", apiUrl, accessToken);
    });
}
