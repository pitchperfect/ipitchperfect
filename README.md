pitchperfect
============

Practice responding to interview questions by making short videos of yourself and sharing them with colleagues for feedback.

## Team

  - __Product Owner__: Chris Gray
  - __Scrum Master__: Celine Otter
  - __Tech Lead__: David Deriso

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> To use ipitchPerfect, just head over to ipitchPerfect.azurewebsites.net, sign up for a free account, and get started!

## Requirements

> - Yeoman
> - Grunt Command Line Tools
> - MongoDB

## Development

### Installing Dependencies
ipitchPerfect is built using the AngularJS [Full-Stack Generator v2.0.7](https://github.com/DaftMonk/generator-angular-fullstack)

These are the generator parameters selected for FitStats:

These are the generator parameters selected for FitStats:
####Client
- vanilla JS
- HTML markup
- Less stylesheets
- Bootstrap enabled
- angular ui-router

####Server
- MongoDB database (w/mongoose DRM)
- Authentication Boilerplate: Yes
- oAuth integrations: Google
- Socket.io integration: Yes


From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Environment Variables
Keeping your app secrets and other sensitive information in source control isn't a good idea. To have grunt launch your app with specific environment variables, add them to the git ignored environment config file: `server/config/local.env.js`.

##### [Injection](https://github.com/DaftMonk/generator-angular-fullstack#injection)

##### [Generators](https://github.com/DaftMonk/generator-angular-fullstack#generators)

##### [Project Structure](https://github.com/DaftMonk/generator-angular-fullstack#project-structure)

##### [Testing](https://github.com/DaftMonk/generator-angular-fullstack/blob/master/readme.md#testing)

To run your local version of the app, do the following:
```sh
mongod #Mongo must be running
grunt serve
```

`grunt serve` will monitor your files for changes, but will not inject any new
dependencies (css files, js files, etc) into index.html for you. In order for them
to be added, you'll have to quit the process (Ctrl+C) and run `grunt serve` again.



### Tasks

> See the projects backlog in trello on [here](https://trello.com/b/EE28WG9O/sprint-3-mvp-fe-click-through)
> or in asana [here](https://app.asana.com/0/15138358036001/15242329767109)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
