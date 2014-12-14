# npm

A cheat sheet for the commands I use a lot.

#### Resources

[nodejs.org](http://nodejs.org/)


## Installing

### npm? National Poetry Month? - Nah!

**npm** is the package manager for **node.js** and is now generally considered the package manager for all JavaScript code.
For example, my [jPlayer](http://jplayer.org/) project has its own [Node Packaged Module](https://www.npmjs.org/package/jplayer).

To install `npm` go to [nodejs.org](http://nodejs.org/) and **install node.js**

### Installing NPM Packages

#### Globally

Some packages you will want to install globally.
These packages will enable useful commands that are handy to have around on the command line interface (cli) wherever you are on your system.

You will notice this difference while following install instructions given in package's readme.
For example, you want to install [gulp](https://www.npmjs.com/package/gulp) globally, so that you can execute it without first installing it locally every time.
Whereas you would **not** want to install jPlayer globally, since it does not enable any commands on the cli.

#### Locally

Most packages you will want to install locally.
These files will go in the `node_modules` folder in the path where you executed the command.

### Lising Globally Installed NPM Packages

```
npm list -g --depth=0
```

Lists the NPM packages you installed using `npm install -g` global option.

```
/usr/local/lib
├── bower@1.3.12
├── gulp@3.8.10
└── npm@1.4.28
```