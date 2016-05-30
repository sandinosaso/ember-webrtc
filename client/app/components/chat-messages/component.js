import Ember from 'ember';
import $ from 'jquery';
import ENV from 'ember-webrtc/config/environment';

const {
  Component,
  inject: { service },
  get,
  observer,
  set,
  run
} = Ember;

export default Component.extend({
  currentUserService: service('current-user'),
  pusher: service(),
  messages: ['Hola como te podemos ayudar?'].map((message) => {
    return {
      username: 'pusher',
      time: new Date(),
      text: message,
    };
  }),
  messageObserver: observer('messages.length', function() {
    run.scheduleOnce('afterRender', function() {
      $("#message-list").scrollTop($("#message-list")[0].scrollHeight);
    });
  }),
  init() {
    this._super(...arguments);

    get(this, 'pusher').onMessage((data) => {
      get(this, 'messages').pushObject(data);
    });
  },
  actions: {
    newMessage() {
      const text = get(this, 'newMessage');

      if (!text) {
        return;
      }

      const username = get(this, 'currentUserService').get('user');
      const time = new Date();

      const urlBase = ENV.APP.SERVER_URL;

      $.post(`${urlBase}/messages`, { text, username, time });

      set(this, 'newMessage', '');

    }
  }
});
