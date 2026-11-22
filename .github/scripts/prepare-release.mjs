import { appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const [tag, eventSha] = process.argv.slice(2);
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)(\.(0|[1-9]\d*))?$/.test(tag ?? '') || tag.length > 128) {
  throw new Error('Release tag must be a numeric version such as 0.1 or 0.0.1, without v or SNAPSHOT.');
}
if (!/^[0-9a-f]{40}$/.test(eventSha ?? '')) throw new Error('Expected the release event commit SHA.');
const sha = git('rev-parse', `refs/tags/${tag}^{commit}`);
if (sha !== eventSha) throw new Error('Release tag no longer points to the event commit.');
try {
  git('merge-base', '--is-ancestor', sha, 'origin/main');
} catch {
  throw new Error('The release commit must belong to main history. Merge its PR before publishing.');
}

const version = tag.split('.').length === 2 ? `${tag}.0` : tag;
const composeTag = version.endsWith('.0') ? version.slice(0, -2) : version;
const read = path => git('show', `${sha}:${path}`);
const pomVersions = [...read('backend/pom.xml').matchAll(/<artifactId>betsphere<\/artifactId>\s*<version>([^<]+)<\/version>/g)];
const frontend = JSON.parse(read('frontend/package.json'));
const lock = JSON.parse(read('frontend/package-lock.json'));
const composeImages = [...read('docker/docker-compose.yml').matchAll(/^    image: huugoocm\/betsphere:([^\s]+)\r?$/gm)];
if (pomVersions.length !== 1 || pomVersions[0][1] !== version ||
    frontend.version !== version || lock.version !== version || lock.packages?.['']?.version !== version ||
    composeImages.length !== 1 || composeImages[0][1] !== composeTag) {
  throw new Error(`Release metadata mismatch at ${sha}: backend, frontend and lockfile must be ${version}; Compose must use huugoocm/betsphere:${composeTag}. Merge the release preparation PR before creating its tag.`);
}

// Patch releases advance the patch; x.y / x.y.0 releases start the next minor.
const [major, minor, patch] = version.split('.').map(BigInt);
const next = patch === 0n ? [major, minor + 1n, 0n] : [major, minor, patch + 1n];
const nextVersion = next.join('.');
const current = JSON.parse(git('show', 'origin/main:frontend/package.json')).version;
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(current)) {
  throw new Error('The frontend version on main must have three numeric components.');
}
const currentParts = current.split('.').map(BigInt);
let mainAlreadyAdvanced = true;
for (let index = 0; index < 3; index++) {
  if (currentParts[index] !== next[index]) {
    mainAlreadyAdvanced = currentParts[index] > next[index];
    break;
  }
}
const outputs = {
  'source-sha': sha,
  'artifact-tag': composeTag,
  'additional-tags': [...new Set([version, 'latest'])].filter(value => value !== composeTag).join('\n'),
  'next-version': nextVersion,
  'prepare-development': String(!mainAlreadyAdvanced),
};
for (const [name, value] of Object.entries(outputs)) {
  console.log(`${name}=${value}`);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}<<release_output\n${value}\nrelease_output\n`);
  }
}
