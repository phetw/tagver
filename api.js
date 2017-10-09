'use strict';

const semver = require('semver');
const git = require('./git');
const releaseTypes = ['major', 'minor', 'patch'];

const defaultOptions = {
  cwd: process.cwd(),
  tag: true,
  publish: true,
  message: 'Release v%s'
};

// Checks to see if a valid release type is passed
const validBumper = releaseType => {
  return !!releaseType && releaseTypes.indexOf(releaseType) !== -1;
};


// Cleans up the options object
const checkOptions = options => new Promise((resolve, reject) => {
  options = Object.assign({}, defaultOptions, options);
  options.tag = options.tag || options.publish;
  resolve(options);
});


// API: version - returns the current version number, if there is one.
const version = options => checkOptions(options)
.then(options => git.latestVersionTag(options));


// API: bump - bumps up the version number.
const bump = (nextVersion, options) => checkOptions(options)
.then(options => version(options).then(currentVersion => {

  // x.x.x
  if (semver.valid(nextVersion)) {
    if (!currentVersion || semver.gt(nextVersion, currentVersion)) {
      return nextVersion;
    }
    else {
      return Promise.reject('Version number must be greater than the current version!');
    }
  }

  // major, minor, patch
  else if (validBumper(nextVersion)) {
    if (!currentVersion) {
      return Promise.reject('No version can be found and therefore it cannot be bumped!');
    }
    return semver.inc(currentVersion, nextVersion);
  }

  // error
  else {
    return Promise.reject('Invalid version or release type');
  }

})

// Handle any git commands
.then(version => new Promise((resolve, reject) => {
  if (options.tag) {
    const promise = git.checkStatus(options).then(ok => {
      if (ok) {
        return git.tag(`v${version}`, `${options.message.replace(/\%s/g, version) || version}`, options.publish, options);
      }
      else {
        return Promise.reject('Cannot tag as your local repository is not in sync with its remote');
      }
    })
    .then(() => {
      return version;
    });
    resolve(promise);
  }
  else {
    return resolve(version);
  }
})));

module.exports = { version, bump };
