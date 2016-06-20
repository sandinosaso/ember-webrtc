/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-webrtc',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    sassOptions: {
      includePaths: ['bower_components/material-design-lite/src']
    },

    // firebase: {
    //   apiKey: "AIzaSyAFTGdSfDEqT-G7ahs2k-zdRezoCrWEoKA",
    //   authDomain: "ember-chat-app-a11f7.firebaseapp.com",
    //   databaseURL: "https://ember-chat-app-a11f7.firebaseio.com",
    //   storageBucket: "ember-chat-app-a11f7.appspot.com"
    // },
    //
    firebase: 'https://ember-chat-app-a11f7.firebaseio.com/',

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      PUSHER: {
        key: '376656a8edb3f7821b1a',
      },


    }
  };

  if (environment === 'development') {
    ENV.APP.SERVER_URL = 'http://localhost:3000';

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.APP.SERVER_URL = 'https://pusher-chat-sinatra.herokuapp.com';

  }

  ENV['contentSecurityPolicy'] = {
    'default-src': "'none'",
    'script-src': "'self' https://stats.pusher.com/",
    'connect-src': "'self' wss://ws.pusherapp.com/ http://localhost:3000/",
    'img-src': "'self'",
    'style-src': "'self' fonts.googleapis.com http://d3dhju7igb20wy.cloudfront.net/ 'unsafe-inline'",
    'font-src': "'self' fonts.gstatic.com http://d3dhju7igb20wy.cloudfront.net/",
    'media-src': "'self'"
  };

  return ENV;
};
