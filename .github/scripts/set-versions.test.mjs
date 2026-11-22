import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('./set-versions.mjs', import.meta.url));
const files = ['backend/pom.xml', 'frontend/package.json', 'frontend/package-lock.json', 'docker/docker-compose.yml'];

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'betsphere-versions-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of files) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), readFileSync(new URL(`../../${path}`, import.meta.url)));
  }
  const read = path => readFileSync(join(root, path), 'utf8');
  const run = (operation, version) => spawnSync(process.execPath, [script, operation, version], {
    cwd: root, encoding: 'utf8', env: { ...process.env, GITHUB_OUTPUT: '' },
  });
  return { root, read, run };
}

for (const [operation, version, backend, frontend, tag] of [
  ['release', '0.1', '0.1.0', '0.1.0', '0.1'],
  ['release', '0.0.1', '0.0.1', '0.0.1', '0.0.1'],
  ['development', '0.2', '0.2.0-SNAPSHOT', '0.2.0', '0.2'],
]) {
  test(`${operation} ${version} updates all versions and preserves dependencies`, t => {
    const { read, run } = fixture(t);
    const originalPom = read(files[0]);
    const originalLock = JSON.parse(read(files[2]));
    const originalCompose = read(files[3]);
    const result = run(operation, version);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(read(files[0]), originalPom.replace(
      /(<artifactId>betsphere<\/artifactId>\s*<version>)[^<]+/, `$1${backend}`));
    assert.equal(JSON.parse(read(files[1])).version, frontend);
    const lock = JSON.parse(read(files[2]));
    assert.equal(lock.version, frontend);
    assert.equal(lock.packages[''].version, frontend);
    lock.version = originalLock.version;
    lock.packages[''].version = originalLock.packages[''].version;
    assert.deepEqual(lock, originalLock);
    assert.equal(read(files[3]), originalCompose.replace(/huugoocm\/betsphere:[^\s]+/, `huugoocm/betsphere:${tag}`));
    const after = files.map(read);
    assert.equal(run(operation, version).status, 0);
    assert.deepEqual(files.map(read), after, 'Repeating the operation must be idempotent');
  });
}

test('equivalent version inputs use the same branch and file contents', t => {
  const { read, run } = fixture(t);
  const short = run('release', '0.1');
  const after = files.map(read);
  const full = run('release', '0.1.0');
  assert.equal(short.status, 0, short.stderr);
  assert.equal(full.status, 0, full.stderr);
  assert.equal(short.stdout, full.stdout);
  assert.deepEqual(files.map(read), after);
});

test('invalid operations and versions leave every file unchanged', t => {
  const { read, run } = fixture(t);
  const before = files.map(read);
  for (const [operation, version] of [
    ['unknown', '0.1'], ['release', 'v0.1'], ['release', '01.2'],
    ['release', '0.2-SNAPSHOT'], ['release', '0.1\nbranch=injected'],
    ['development', ''], ['release', '1.2.3.4'],
  ]) {
    assert.notEqual(run(operation, version).status, 0);
    assert.deepEqual(files.map(read), before);
  }
});

test('a missing Compose app image prevents partial version updates', t => {
  const { root, read, run } = fixture(t);
  writeFileSync(join(root, files[3]), read(files[3]).replace('huugoocm/betsphere:', 'another/image:'));
  const before = files.map(read);
  assert.notEqual(run('release', '0.1').status, 0);
  assert.deepEqual(files.map(read), before);
});
