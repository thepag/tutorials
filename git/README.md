# Git

A cheat sheet for the commands I use a lot.

## Resources

* [Atlassian git tutorial](https://www.atlassian.com/git/)
* [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)

## Branches

### Branch Info

* `git branch` lists local branches
* `git branch -r` lists remote branches
* `git branch -a` lists all branches

### Create a Local Branch

From the source branch:
```
git branch branch_name
git checkout branch_name
```
Concise:
```
git checkout -b branch_name
```
Example, creating a branch called *dev* from the *master* branch:
```
git checkout master
git checkout -b dev
```

### Create Remote Branch from a Local Branch

I always keep the name of the local and remote branches identical.

First create your local branch and move to it, then:
```
git push -u remote_name branch_name
```
Example, creating a remote *dev* branch from a local *dev* branch:
```
git checkout dev
git push -u origin dev
```

### Create Local Branch from a Remote Branch

This is useful after cloning a repository, when you want to checkout a different remote branch locally.

```
git checkout -b local_branch_name remote_name/remote_branch_name
```
Example, creating a local *dev* branch from a remote *dev* branch:
```
git checkout -b dev origin/dev
```

### Merging Local Branches

From the target branch, execute:
```
git merge source_branch_name
```
Example, merging the local *refactor* branch into the *master* branch:
```
git checkout master
git merge refactor
```

### Deleting Local Branches

Deleting a branch safely, will warn you (and exit) if you have not already merged the branch into one of your other branches.
```
git branch -d branch_name
```
For when your local branch turned out a dead-end and you want to force its removal.
```
git branch -D branch_name
```

## Forks

### Forking

- on gitub, navigate to the repository youwant to fork and click **fork** in the top-right.
- clone your fork `git clone https://github.com/YOUR_USERNAME/YOUR_FORK.git`
- Change to your fork folder `cd YOUR_FORK`
- Review your remotes `git remote -v`
```
origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
```
- Add the original repository
```
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git
```
- Review your remotes `git remote -v`
```
origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_FORK.git (push)
upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (fetch)
upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY.git (push)
```

For example:

On gitub, navigate to the happyworm/jPlayer repository and click **fork** in the top-right.
```
$ cd ~/Projects/
$ git clone https://github.com/YOUR_USERNAME/jPlayer.git
$ cd jPlayer
$ git remote add upstream https://github.com/happyworm/jPlayer.git
$ git remote -v
origin  https://github.com/YOUR_USERNAME/jPlayer.git (fetch)
origin  https://github.com/YOUR_USERNAME/jPlayer.git (push)
upstream  https://github.com/happyworm/jPlayer.git (fetch)
upstream  https://github.com/happyworm/jPlayer.git (push)
```


### Syncing a Fork

You can `fetch` and `merge` the `upstream` branch.

```
git fetch upstream
git checkout master
git merge upstream/master
```

### Rebasing a Fork

Before issuing a pull request, `rebase` your fork to the `upstream` branch.

```
git fetch upstream
git checkout master
git rebase upstream/master
```

Example with a new branch of your fork.

```
git checkout -b fix-issue-123 master
git push -u origin fix-issue-123
```
Develop the fix for issue 123 over the next month.
```
git commit -am "Fix #123 Followed by a brief description"
git fetch upstream
git checkout fix-issue-123
git rebase upstream/master
```

### OS X Mac Character Case Fork Issue

In rare cases, an OS X user may have problems after forking a repository due to the character capitalization of the filename.
This means that there are two or more filenames that look that same to the file system.
For example, `Hello.md` and `hello.md` get confused in git on OS X.

```
git update-index --assume-unchanged path/to/local/file.ext
git update-index --assume-unchanged path/to/local/File.ext
```
Additionally, it may not be the file with the problem, it can be the path.
```
git update-index --assume-unchanged path/to/Local/file.ext
```

*For reference:** This was encountered while forking the [cdnjs](https://github.com/cdnjs/cdnjs.git) repository.
[Issue 3792](https://github.com/cdnjs/cdnjs/issues/3792) has more details.
```
git update-index --assume-unchanged ajax/libs/Sortable/package.json
git update-index --assume-unchanged ajax/libs/sortable/package.json
```

## Tags

### Creating Tags

To tag all the files in the current branch. The tag itself is associated with the current commit in the branch.
```
git tag -a tag_name -m "tag_message"
```
Example:
```
git tag -a 2.8.0 -m "jPlayer 2.8.0"
```

### Pushing Tags to Remote Branch

```
git push --tags
```

### Deleting tags

Generally, you want to try and avoid deleting tags, but if you need to you can.

Local tags:
```
git tag -d tag_name
```
Remote tags:
```
git push origin :refs/tags/tag_name
```
