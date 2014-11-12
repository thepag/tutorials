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
