import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

const [operation, inputVersion] = process.argv.slice(2);
if (!['release', 'development'].includes(operation)) {
  throw new Error('Operation must be release or development.');
}
if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)(\.(0|[1-9]\d*))?$/.test(inputVersion ?? '')) {
  throw new Error('Version must have two or three numeric components, for example 0.1 or 0.0.1.');
}
const projectVersion = inputVersion.split('.').length === 2 ? `${inputVersion}.0` : inputVersion;
const backendVersion = `${projectVersion}${operation === 'development' ? '-SNAPSHOT' : ''}`;
// Use the same branch for equivalent inputs such as 0.1 and 0.1.0.
const composeTag = projectVersion.endsWith('.0') ? projectVersion.slice(0, -2) : projectVersion;
const branch = `chore/prepare-${operation}-${projectVersion}`;

function replaceOnce(text, expression, replacement, description) {
  if ([...text.matchAll(expression)].length !== 1) {
    throw new Error(`Expected exactly one ${description}; no version files were written.`);
  }
  return text.replace(expression, replacement);
}

function updateJson(source, update) {
  const data = JSON.parse(source);
  update(data);
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  return `${JSON.stringify(data, null, 2)}\n`.replaceAll('\n', newline);
}

// Prepare every change before writing, so invalid input/files cannot leave a partial update.
const changes = new Map();
const pomPath = 'backend/pom.xml';
changes.set(pomPath, replaceOnce(readFileSync(pomPath, 'utf8'),
  /(<artifactId>betsphere<\/artifactId>\s*<version>)[^<]+(<\/version>)/g,
  `$1${backendVersion}$2`, 'BetSphere project version in pom.xml'));
for (const path of ['frontend/package.json', 'frontend/package-lock.json']) {
  changes.set(path, updateJson(readFileSync(path, 'utf8'), data => {
    if (typeof data.version !== 'string') throw new Error(`Missing root version in ${path}.`);
    data.version = projectVersion;
    if (path.endsWith('package-lock.json')) {
      if (typeof data.packages?.['']?.version !== 'string') {
        throw new Error('Missing root package version in package-lock.json.');
      }
      data.packages[''].version = projectVersion;
    }
  }));
}
const composePath = 'docker/docker-compose.yml';
changes.set(composePath, replaceOnce(readFileSync(composePath, 'utf8'),
  /^(    image: huugoocm\/betsphere:)[^\s]+(\r?)$/gm,
  `$1${composeTag}$2`, 'BetSphere app image in Compose'));
for (const [path, content] of changes) writeFileSync(path, content);

const outputs = {
  'project-version': projectVersion,
  'backend-version': backendVersion,
  'compose-tag': composeTag,
  branch,
};
for (const [name, value] of Object.entries(outputs)) {
  console.log(`${name}=${value}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}
