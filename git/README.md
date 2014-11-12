# Git

A cheat sheet for the commands I use a lot.

## Branches

### Create Local Branch

From the branch to be branched:
```
git branch *branch_name*
git checkout *branch_name*
```
Concise:
```
git checkout -b *branch_name*
```
Example, creating a branch called *refactor* from the *master* branch:
```
git checkout master
git checkout -b refactor
```

### Create Remote Branch

I always keep the name of the local and remote branches identical.

First create your local branch and move to it, then:
```
git push -u *remote* *branch_name*
```
Example, creating a remote branch associated with my local *refactor* branch:
```
git checkout refactor
git push -u origin refactor
```


## Resources

* [Atlassian git tutorial](https://www.atlassian.com/git/)
* [A successful Git branching model](http://nvie.com/posts/a-successful-git-branching-model/)
