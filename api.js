'use strict';

const semver = require('semver');
const git = require('./git-helper');
const defaultOptions = require('./options');
const releaseTypes = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'];


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


// version - returns the current version number, if there is one.
const version = options => checkOptions(options)
.then(options => git.latestVersionTag(options));


// bump - bumps up the version number.
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

  // major, minor, patch, preminor, patch, prepatch, or prerelease
  else if (validBumper(nextVersion)) {
    if (!currentVersion && !semver.valid(options.base)) {
      return Promise.reject('No version can be found and therefore it cannot be bumped!');
    }
    return semver.inc(currentVersion || options.base, nextVersion, options.preid);
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

/** DEPRECATED */
module.exports = { version, bump };

/**
 * API
 * @param {String} [nextVersion] If defined bumps up the version number, otherwise return the current version
 * @param {Object} [options] Options to pass to check/bump the version
 * @returns {Promise} promise
 */
module.exports = function (nextVersion, options) {
  return typeof nextVersion === 'string' ? bump(nextVersion, options) : version(options);
};
