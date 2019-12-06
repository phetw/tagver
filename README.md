# tagver

[![Package Quality](http://npm.packagequality.com/shield/tagver.svg)](http://packagequality.com/#?package=tagver)
[![Dependencies](https://img.shields.io/david/TremayneChrist/tagver.svg)](https://david-dm.org/tremaynechrist/tagver)
<!--![Dependencies](https://img.shields.io/librariesio/github/TremayneChrist/tagver.svg)-->
<!--![Package Quality](https://img.shields.io/versioneye/d/nodejs/tagver.svg)-->

semver tagging control for git

tagver gets/sets git version tags, using semantic versioning (semver).

By default, tagver will bump, tag and push updated version tags to the git repository.


## Node API

### tagver([options])

Gets the current highest semver version tag from git

returns: `Promise`

``` javascript
tagver().then(version => console.log(version));
```

#### options

``` javascript
{
  cwd: './',  // Directory which tagver should use for git commands
  filter: '*', // Semver filter to use. This will return the highest version based on the filter.
  includePrerelease: false // Include prerelease versions, when getting tags. This automatically gets set to true when bumping pre versions.
}
```

### tagver(version[, options])

Bumps the version based on the input.

Version can be a valid semver version number, or, release type.

returns: `Promise`

``` javascript
tagver('1.2.3').then(version => console.log(version));
tagver('major').then(version => console.log(version));
tagver('minor').then(version => console.log(version));
tagver('patch').then(version => console.log(version));
tagver('prerelease', { preid: 'beta' }).then(version => console.log(version));
```

#### options

``` javascript
{
  cwd: './',              // Directory which tagver should use for git commands
  tag: true,              // Should tagver store a git tag?
  publish: true,          // Should tagver publish new tags to the remote?
  message: 'Release v%s', // Custom tag message. %s will be replaced with the version number
  base: '0.0.0',          // Initial version to increment when no version is found
  filter: '*',            // Semver filter to use. This will return the highest version based on the filter.
  preid: undefined,       // Preid to use when prerelease versions
  branch: undefined,       // Remote branch used to compare local changes against
  includePrerelease: false // Include prerelease versions, when getting tags. This automatically gets set to true when bumping pre versions.
}
```

## Cli Usage

``` shell
$ npm i -g tagver
```

### tagver

Returns the current highest semver version tag from git

``` shell
$ git tag
test-tag
v0.1.0
v0.1.1
v0.1.10
v0.1.11

$ tagver
0.1.11
```

### tagver x.x.x

Bumps the version to the one specified

``` shell
$ tagver 1.2.3
1.2.3
```

### tagver major

Bumps the major version

``` shell
$ tagver
1.2.3

$ tagver major
2.0.0
```

### tagver minor

Bumps the minor version

``` shell
$ tagver
1.2.3

$ tagver minor
1.3.0
```

### tagver patch

Bumps the patch version

``` shell
$ tagver
1.2.3

$ tagver patch
1.2.4
```

### tagver premajor

Bumps the pre-release major version

``` shell
$ tagver
1.2.3

$ tagver premajor
2.0.0-0
```

### tagver preminor

Bumps the pre-release minor version

``` shell
$ tagver
1.2.3

$ tagver preminor
1.3.0-0
```

### tagver prepatch

Bumps the pre-release patch version

``` shell
$ tagver
1.2.3

$ tagver prepatch
1.2.4-0
```

### tagver prerelease

Bumps the pre-release version

``` shell
$ tagver
1.2.3-0

$ tagver prerelease
1.2.3-1
```

### --message, -m option

Optional message to use for git tags.

`%s` will be replaced with the version number.

default: `Release v%s`

``` shell
$ tagver patch -m "Auto release package [v%s]"
```

### --base, -b option

Optional version to increment when no version is found.

default: `0.0.0`

``` shell
$ tagver patch -b "1.0.0"
```

### --preid option

Optional identifier to be used to prefix premajor, preminor, prepatch or prerelease version increments.

``` shell
$ tagver
1.2.3

$ tagver prepatch --preid next
1.2.4-next.0
```

### --filter, -f option

Optional semver filter to use.
This will return the highest version based on the filter.

default: `*`

``` shell
$ tagver
1.2.3
```

``` shell
$ tagver -f "<1.2.x"
1.1.18
```

### --branch option

Remote branch used to compare local changes against. Cannot tag unless remote and local repositories are in sync. Defaults to the default remote branch, usually master.

### --include-prerelease option

Include prerelease versions, when getting tags. This automatically gets set to true when bumping pre versions.

### --no-git-tag option

Prevents tagver from creating a git tag. This will also prevent any publishing of tags.

``` shell
$ git tag
v1.2.0
v1.2.1
v1.2.2
v1.2.3

$ tagver
1.2.3

$ tagver minor --no-git-tag
1.2.4

$ git tag
v1.2.0
v1.2.1
v1.2.2
v1.2.3
```

### --no-git-publish option

Prevents tagver from publishing created tags.
