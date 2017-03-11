mjr
===

### Getting Started

Go to [Firebase](https://firebase.google.com/) Sign Up and create an account.

**Client Side**

1. Checkout the [Web Setup](https://firebase.google.com/docs/web/setup)
1. Open `src/app.js` and edit `lines:15-19`

**Server Side**

1. Checkout the [Admin Setup](https://firebase.google.com/docs/admin/setup)
1. Open up `svr/app.firebase.json`
1. Copy+Paste your credentials.

#### Running the App

```bash
# Install App Dependencies and Build it
$ npm install && bower install && gulp

# then finally run the app
# https://127.0.0.1:5000/
$ npm start # or npm run dev to run the app on development mode
```

**Empty models?**

Yep. You may populate `/api/products` endpoint with the data from `svr/init.js`
which is processed by a middleware that calculates the variables given for this
problem set.

```bash
# Initialize models
node svr/init.js
```

#### Gulp Tasks

```bash
# Builds the angular app to ./app, performs tasks:
# - bower : bundles all vendor libraries
# - app   : bundles app
# - styles: bundles stylesheets
$ gulp    # use --minify=false flag to skip minification

# Watches the project directory for changes
# and triggers default task.
$ gulp dev # use --minify=false flag to skip minification
```

#### Deploy to Heroku

```bash
## Config Vars

# Flag that will trigger a gulp task, the value can be any sting as long
# as the task exist in the gulpfile.js
NODE_ENV = production

# Flag to include `node_modules` and `bower_components`, if set to `false`
# these directories will be included in the build and will successfully
# trigger gulp build. Setting it to `true` will do the opposite.
NPM_CONFIG_PRODUCTION = false

## Build Packs
buildpack:set https://github.com/heroku/heroku-buildpack-nodejs#v83 -a YOUR_APP
buildpack:set https://github.com/timdp/heroku-buildpack-nodejs-gulp.git -a YOUR_APP
```
