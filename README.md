mjr
===

#### Initialize Models

Initialize Products Model:

```bash
# Initialize models
node svr/init.js
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
