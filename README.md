# tagver
semver tagging control for git

tagver gets/sets git version tags, using semantic versioning (semver).

By default, tagver will bump, tag and push updated version tags to the git repository.


## Node API

### tagver.version([options])

Gets the current highest semver version tag from git

returns: `Promise`

``` javascript
tagver.version().then(version => console.log(version));
```

### tagver.bump(input[, options])

Bumps the version based on the input.

Input can be a valid semver version number, or, release type.

``` javascript
tagver.bump('1.2.3').then(version => console.log(version));
tagver.bump('major').then(version => console.log(version));
tagver.bump('minor').then(version => console.log(version));
tagver.bump('patch').then(version => console.log(version));
```

### options

``` javascript
{
  cwd: './',             // Directory which tagver should use for git commands
  tag: true,             // Should tagver store a git tag?
  publish: true,         // Should tagver publish new tags to the remote?
  message: 'Release v%s' // Custom tag message. %s will be replaced with the version number
}
```

returns: `Promise`


## Cli Usage

```
$ npm i -g tagver
```

### tagver

Returns the current highest semver version tag from git

```
$ git tag
test
v0.1.0
v0.1.1
v0.1.10
v0.1.11

$ tagver
0.1.11
```

### tagver x.x.x

Bumps the version to the one specified

```
$ tagver 1.2.3
1.2.3
```

### tagver major

Bumps the major version

```
$ tagver
1.2.3

$ tagver major
2.0.0
```

### tagver minor

Bumps the minor version

```
$ tagver
1.2.3

$ tagver minor
1.3.0
```

### tagver patch

Bumps the patch version

```
$ tagver
1.2.3

$ tagver patch
1.2.4
```

### --message, -m option

Optional message to use for git tags.

`%s` will be replaced with the version number.

```
$ tagver patch -m "Auto release package [v%s]"
```

### --no-git-tag option

Prevents tagver from creating a git tag. This will also prevent any publishing of tags.

```
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
