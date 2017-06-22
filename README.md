# OE build tool Docs

Following docs states the knowledge about porting OE script to work on OE env without having to use *#include* mechanism. (*Reader's  prior knowledge on __ObjectStudio__ and __Object Engine__ is expected*). 

### Setting up devlopment environment
    We need Node.js, Git and grunt mainly to start with.
*   Installing Node.js

    >Download it from the official website [here](https://nodejs.org/en/ "Node.js").Or follow this [link](https://howtonode.org/how-to-install-nodejs) if using other OS.
    After the download finishes double click(/Right click and run) to start the installation and follow the instruction to complete the setup.
    To check for the successful installation, open command line and run following command:
    `node -v`
    and can see something like this:
    `v6.10.*`. To see if [NPM](https://docs.npmjs.com/) is installed, type `npm -v` in Terminal. And can see something similar.


*   Installing Git

    >Download it from [here](https://git-scm.com/download/win). If you are using other than windows please follow this 
    [link](https://git-scm.com/download/linux) or [this](https://www.atlassian.com/git/tutorials/install-git). Can install [Atlassian source tree](https://www.sourcetreeapp.com/) (A git client).

*   Setting up grunt
    `Going through the oficial documentation of` [Grunt.js](https://gruntjs.com/getting-started) `is advisable.`

    >Run following command on command line to install grunt __globally__
    `npm install -g grunt-cli` (non-windows user may need to add *sudo* prefix)
    npm here refers to _node package manager_ and its available with _node_ itself.

*   Organise working directory
    
    >Open terminal/command line and cd to home directory you want to work on. Create a directory for all developement works.
    **Naming convention:** (dev/devel/development)
    Inside that make sub directories organised for different works (like all client work goes inside _/dev/clients_).
    And label all stuffs accordingly (eg. _/dev/clients/test_ for all test scripts).

*   Cloning a git repo

    >Run this command in the command line once you get the git repository link/location:
    `git clone -b stable <git_repo>`
    Now cd to that directory and run `npm install` (provided it should have one _package.json_ file in root folder)

*   Repository layout

    >It should have one _node_modules_ folder (result of _npm install_ from above step) containing all required modules listed in __package.json__ file.
    One Grunt file named __Gruntfile.js__ in the root folder with all grunt configurations.
    A folder having all grunt refering tasks named _tasks_.
    An source folder that nesting the source scripts. 
    _OE scripts goes inside **/src/oe** and agent scripts goes inside **/src/f3**._
    oe dir again nests few more sub dirs like *lib* etc.
    __lib__ contains all libraries to be tested. Source script can be found in ObjectStudio (under !SYS label with a # sign as prefix)   



### Replacement of #include

*   Create an empty script on ObjectStudio under TEST group and get the scriptID.
  > **Naming convention:** [user name] Script description


*  Create a directory in src/oe/
  >**Naming convention:** scriptID-*
  >Create a **Main.js** file inside it containing a function named _Main_ and should be exported as the default function. And the test script goes inside that, requiring _shim.js_ and _json.js_ files. Here is a sample **Main.js**:
  ```
  require('../lib/shims/oe-shims');
  require('../lib/shims/json');
  <!-- require the script (inside /lib dir. refer to next step) to test
  var someVar = require('../lib/testScript'); 
  -->

  function Main() {
   <!-- Test code goes here 
   see the usage of source code (usage of someVar, declared above)
   -->

  }

  module.exports = Main;
  ```

* Get the source script (to be tested) and put inside root of /lib directory.
  > **Naming convention:** lowerCamelCase.
  Use this script in Main.js file.

* cd to the new dir, and run:
> ``` grunt ```

* A new dir will get created (if not exist) named **.tmp** having _grunt_ resulted file in it (oe-scriptID.js). Copy the code and paste into the OE scipt (the empty script created initially). 



