# ember-webrtc

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `cd server/signalmaster && npm install`
* `cd server/node-pusher-server && npm install`
* `cd client && npm install && bower install`

## Running / Development

* `cd server/signalmaster`
* `node server.js`
* `cd server/node-pusher-server`
* `node app.js`
* `cd client`
* `ember s`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Environment configuration

In order to make it work you must create a config.js file on server/node-pusher-server
with the following content

```javascript
var config = {};

config.web = {};
config.pusher = {
  appId : 'YOUR-PUSHER-APP-ID',
  key: 'YOUR-PUSHER-KEY',
  secret: 'YOUR-PUSHER-SECRET',
  encrypted: true
};

config.web.port = process.env.WEB_PORT || 3000;

module.exports = config;
```

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
  
  Example demo is for using as a chat support center (you can turn on/off video camera, mic. Chat with some agent and send/recieve files using the chat box.
  
  http://imgur.com/0XAXIUi
