# Git

A cheat sheet for the commands I use a lot.

## Branches

### Branch Info

* `git branch` lists local branches
* `git branch -r` lists remote branches
* `git branch -a` lists all branches


### Create a Local Branch

From the branch to be branched:
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
Example, creating a remote branch associated with my local *dev* branch:
```
git checkout dev
git push -u origin dev
```

### Create Local Branch from a Remote Branch

This is useful after cloning a remote repository, when you want to checkout a different branch.

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


## Resources

* [Atlassian git tutorial](https://www.atlassian.com/git/)
* [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)
