'use strict';

const semver = require('semver');
const cpexec = require('child_process').exec;


// Promisified child process handler
const exec = (command, options) => new Promise((resolve, reject) => {
  cpexec(command, { cwd: options.cwd }, (err, result) => {
    if (err) {
      reject(err);
    }
    else {
      resolve(result ? result.trim() : '');
    }
  });
});


// Fetches updates from remote
const fetch = options => exec('git fetch', options).then(() => undefined);


// Gets the latest/highest semver version tag
const latestVersionTag = options =>
exec('git tag --sort -version:refname -l {v,}[0-9]*\\.[0-9]*\\.[0-9]*', options)
.then(stdout => {
  stdout = stdout.split(/\n/)[0];
  return semver.clean(stdout ? stdout.trim() : '') || '';
});


// Tags the repository at the current state
const tag = (tag, message, push, options) =>
exec(`git tag -a ${tag} -m "${message}"`, options)
.then(() => {
  if (push) {
    return exec('git push --tags', options);
  }
}).then(() => tag);


// Gets the current branch
const branch = options => exec('git rev-parse --abbrev-ref HEAD', options);


// Checks to see if the current local repository is clean
const checkStatus = options =>
fetch(options).then(() => branch(options)).then(branch =>
exec(`git status --porcelain && git log ${branch}..origin/${branch} --oneline`, options))
.then(stdout => !stdout);


module.exports = { tag, branch, fetch, checkStatus, latestVersionTag };
