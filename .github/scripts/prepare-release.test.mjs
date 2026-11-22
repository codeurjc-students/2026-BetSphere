import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const validator = fileURLToPath(new URL('./prepare-release.mjs', import.meta.url));
const versionScript = fileURLToPath(new URL('./set-versions.mjs', import.meta.url));
const paths = ['backend/pom.xml', 'frontend/package.json', 'frontend/package-lock.json', 'docker/docker-compose.yml'];

function repository(t, tag = '0.1', annotated = false) {
  const root = mkdtempSync(join(tmpdir(), 'betsphere-release-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const env = { ...process.env, GITHUB_OUTPUT: '' };
  const versions = (operation, version) => execFileSync(process.execPath, [versionScript, operation, version], { cwd: root, env });
  for (const path of paths) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), readFileSync(new URL(`../../${path}`, import.meta.url)));
  }
  git('init', '-b', 'main');
  git('config', 'user.name', 'Release Test');
  git('config', 'user.email', 'release-test@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  git('config', 'tag.gpgsign', 'false');
  versions('release', tag);
  const commit = () => {
    git('add', '.');
    git('commit', '-m', 'Fixture version');
    git('update-ref', 'refs/remotes/origin/main', 'HEAD');
    return git('rev-parse', 'HEAD');
  };
  const sha = commit();
  if (annotated) git('tag', '-a', tag, '-m', 'Fixture release');
  else git('tag', tag);
  const run = (releaseTag = tag, eventSha = sha) => spawnSync(process.execPath, [validator, releaseTag, eventSha], {
    cwd: root, env, encoding: 'utf8',
  });
  return { root, git, versions, commit, sha, run };
}

for (const [tag, annotated, next, aliases] of [
  ['0.1', false, '0.2.0', '0.1.0\nlatest'],
  ['0.1.0', true, '0.2.0', '0.1.0\nlatest'],
  ['0.0.1', false, '0.0.2', 'latest'],
]) {
  test(`validates ${annotated ? 'annotated' : 'lightweight'} tag ${tag} and records exact source`, t => {
    const { run, sha } = repository(t, tag, annotated);
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes(`source-sha=${sha}\n`));
    assert.ok(result.stdout.includes(`additional-tags=${aliases}\n`));
    assert.ok(result.stdout.includes(`next-version=${next}\n`));
    assert.ok(result.stdout.includes('prepare-development=true\n'));
  });
}

test('reads release files from the tag when main has advanced', t => {
  const { root, run, sha, commit } = repository(t);
  writeFileSync(join(root, 'later-change.txt'), 'New work after the tag');
  assert.notEqual(commit(), sha);
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(`source-sha=${sha}\n`));
});

test('does not open an older development version PR when main already advanced', t => {
  const { run, versions, commit } = repository(t);
  versions('development', '0.3');
  commit();
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes('prepare-development=false\n'));
});

for (const [path, replace] of [
  [paths[0], source => source.replace('<version>0.1.0</version>', '<version>0.1.0-SNAPSHOT</version>')],
  [paths[1], source => source.replace('"version": "0.1.0"', '"version": "0.2.0"')],
  [paths[2], source => source.replaceAll('"version": "0.1.0"', '"version": "0.2.0"')],
  [paths[3], source => source.replace('huugoocm/betsphere:0.1', 'huugoocm/betsphere:dev')],
]) {
  test(`rejects mismatched release metadata in ${path}`, t => {
    const { root, run, git, commit } = repository(t);
    writeFileSync(join(root, path), replace(readFileSync(join(root, path), 'utf8')));
    const sha = commit();
    git('tag', '-f', '0.1');
    const result = run('0.1', sha);
    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes('Release metadata mismatch'));
  });
}

test('rejects malformed tags and moved tags', t => {
  const { run, root, git, commit } = repository(t);
  for (const tag of ['v0.1', '0.1-SNAPSHOT', '01.1', '0.1\nextra=value']) {
    assert.notEqual(run(tag).status, 0);
  }
  writeFileSync(join(root, 'later.txt'), 'Changed tag target');
  commit();
  git('tag', '-f', '0.1');
  const result = run();
  assert.notEqual(result.status, 0);
  assert.ok(result.stderr.includes('no longer points to the event commit'));
});

test('rejects a tag whose commit is outside main history', t => {
  const { run, git } = repository(t);
  git('checkout', '--orphan', 'unmerged');
  git('commit', '-m', 'Unmerged release');
  git('tag', '-f', '0.1');
  assert.notEqual(run('0.1', git('rev-parse', 'HEAD')).status, 0);
});
